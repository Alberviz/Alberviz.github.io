"use client";

import { useReducedMotionSafe } from "@/lib/motion";

import React, { useEffect, useRef, useState } from "react";
import {motion, useScroll, useTransform} from "motion/react";
import type { MotionValue } from "motion/react";
import { ArrowDown } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { HERO } from "@/content/site-copy";
import { HERO_BG, HERO_PALETTE, HERO_VARIANTS, WIDE_QUERY } from "./hero/hero-layout";
import type { HeroVariant } from "./hero/hero-layout";
import type { Camera } from "./desktop/live/gargantua-renderer";

/**
 * Hero state, exposed as `data-state` for tests:
 *  poster   -> static poster only (reduced motion, no WebGL2, weak device): normal scroll, no pinned fall
 *  loading  -> renderer is being fetched/baked
 *  live     -> WebGL canvas is drawing; scrolling through the hero falls into the hole
 *  frozen   -> canvas stopped by the frame-time guard (keeps the last frame; the fall becomes a CSS zoom)
 */
type HeroState = "poster" | "loading" | "live" | "frozen";

const FRAME_MS = 1000 / 30;
const GUARD_FRAMES = 36;
const GUARD_MAX_AVG_MS = 62;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/**
 * The fall, as a pure function of the scroll progress through the pinned hero
 * (0 = top, 1 = past the horizon). The camera zooms in exponentially, drifts the
 * hole to the centre, rolls, lets the hole bend the stars, spins the disk up and
 * finally fades to black, which is where Wari's dawn begins.
 */
function cameraAt(p: number, wide: boolean): Camera {
  const zMax = wide ? 9 : 7.5;
  return {
    zoom: Math.exp(Math.log(zMax) * Math.pow(clamp01(p), 1.7)),
    pan: smooth(0.04, 0.72, p),
    roll: -0.24 * smooth(0.1, 1, p),
    lens: smooth(0.04, 0.45, p),
    streak: smooth(0.12, 0.7, p),
    fall: smooth(0.86, 0.995, p),
    spin: 1 + 6 * p * p,
  };
}

function weakDevice() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2;
}

export function HeroSection() {
  const { locale } = useLocale();
  const reduce = useReducedMotionSafe();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<HeroState>("loading");
  const [wide, setWide] = useState(true);

  // Scroll through the pinned hero. Read inside the render loop (no React state per frame).
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progressRef = useRef<MotionValue<number>>(scrollYProgress);
  progressRef.current = scrollYProgress;

  // Function transforms on purpose: Motion would hand range-mapped opacity to a native
  // ScrollTimeline, which measures the whole page instead of this track.
  const textOpacity = useTransform(scrollYProgress, (v) => 1 - clamp01(v / 0.28));
  const textY = useTransform(scrollYProgress, (v) => -64 * clamp01(v / 0.28));
  const textEvents = useTransform(scrollYProgress, (v) => (v > 0.22 ? "none" : "auto"));
  const veilOpacity = useTransform(scrollYProgress, (v) => 1 - 0.75 * clamp01(v / 0.4));
  const horizon = useTransform(scrollYProgress, (v) => smooth(0.8, 0.97, v));
  const cssZoom = useTransform(scrollYProgress, (v) => Math.exp(Math.log(wide ? 9 : 7.5) * Math.pow(v, 1.7)));

  useEffect(() => {
    const stage = stageRef.current;
    const section = sectionRef.current;
    if (!stage || !section) return;
    setWide(window.matchMedia(WIDE_QUERY).matches);

    if (reduce || window.matchMedia("(prefers-reduced-motion: reduce)").matches || weakDevice()) {
      setState("poster");
      return;
    }

    let cancelled = false;
    let raf = 0;
    let idle = 0;
    let canvas: HTMLCanvasElement | null = null;
    let dispose: (() => void) | null = null;
    let io: IntersectionObserver | null = null;

    const start = async () => {
      const variant: HeroVariant = window.matchMedia(WIDE_QUERY).matches ? "wide" : "tall";
      const cfg = HERO_VARIANTS[variant];
      const cssW = stage.clientWidth || window.innerWidth;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const base = variant === "wide" ? cssW : Math.min(cssW, window.innerHeight * cfg.aspect + 120);
      const w = Math.round(Math.min(cfg.maxWidth, Math.max(cfg.minWidth, base * dpr)));
      const h = Math.round(w / cfg.aspect);

      const { GargantuaRenderer } = await import("./desktop/live/gargantua-renderer");
      if (cancelled) return;

      // Fresh canvas per run: a lost context cannot be reused (StrictMode, reduced-motion flips).
      canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      canvas.className = "hero-canvas";
      const renderer = GargantuaRenderer.create(canvas, w, h, {
        layout: cfg.place(w, h),
        bgColor: HERO_BG,
        vignette: 0,
        palette: HERO_PALETTE,
        progressRing: false,
      });
      if (!renderer) {
        canvas = null;
        setState("poster");
        return;
      }
      stage.appendChild(canvas);

      let visible = true;
      io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { rootMargin: "80px" });
      io.observe(section);

      let ready = false;
      let started = -1;
      let last = 0;
      let slow = 0;
      let counted = 0;
      let frozen = false;
      let lastP = -1;

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        if (!ready) {
          ready = renderer.bakeStep();
          if (!ready) return;
          started = now;
          last = 0;
          return;
        }
        if (frozen || !visible || document.hidden) {
          last = 0;
          return;
        }
        const p = progressRef.current.get();
        // Past the horizon the frame is black: nothing to draw.
        if (p >= 0.995 && lastP >= 0.995) return;
        // 30 fps while still; full rate while the scroll is moving the camera.
        const moving = Math.abs(p - lastP) > 0.0005;
        if (last && !moving && now - last < FRAME_MS - 2) return;
        if (last && counted < 8 + GUARD_FRAMES) {
          const dt = now - last;
          counted += 1;
          if (counted > 8 && dt > 0) slow += Math.min(dt, 500);
          if (counted === 8 + GUARD_FRAMES && slow / GUARD_FRAMES > GUARD_MAX_AVG_MS) {
            frozen = true;
            setState("frozen");
            cancelAnimationFrame(raf);
            return;
          }
        }
        last = now;
        lastP = p;
        renderer.render((now - started) / 1000, cameraAt(p, variant === "wide"));
        if (canvas && canvas.dataset.on !== "1") {
          canvas.dataset.on = "1";
          setState("live");
        }
      };
      raf = requestAnimationFrame(frame);

      dispose = () => {
        cancelAnimationFrame(raf);
        io?.disconnect();
        renderer.dispose();
        canvas?.remove();
      };
    };

    // Let the poster paint and the page settle before spending GPU on the shader.
    const kick = () => {
      if (!cancelled) void start().catch(() => setState("poster"));
    };
    const hasIdle = "requestIdleCallback" in window;
    if (hasIdle) idle = window.requestIdleCallback(kick, { timeout: 1800 });
    else idle = window.setTimeout(kick, 600);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cancelAnimationFrame(raf);
      dispose?.();
    };
  }, [reduce]);

  const live = state === "live";
  const plunge = state !== "poster";
  const frozen = state === "frozen";
  const still = !!reduce || !plunge;

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-scene="hero"
      data-state={state}
      data-plunge={plunge ? "1" : "0"}
      className="hero-track relative isolate bg-bg"
    >
      {/* Preload only the poster that matches the viewport (React hoists these links to <head>) */}
      <link rel="preload" as="image" href={HERO_VARIANTS.wide.poster} media={WIDE_QUERY} fetchPriority="high" />
      <link
        rel="preload"
        as="image"
        href={HERO_VARIANTS.tall.poster}
        media="(max-aspect-ratio: 1249/1000)"
        fetchPriority="high"
      />

      <div className="hero-pin flex min-h-[100dvh] flex-col overflow-hidden">
        {/* Stage: poster is the LCP and the fallback; the canvas fades in over it */}
        <motion.div
          ref={stageRef}
          aria-hidden="true"
          className="hero-stage absolute inset-0 -z-10"
          style={frozen && !still ? { scale: cssZoom, transformOrigin: wide ? "75% 46%" : "55% 30%" } : undefined}
        >
          <picture>
            <source media={WIDE_QUERY} srcSet={HERO_VARIANTS.wide.poster} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO_VARIANTS.tall.poster}
              alt=""
              width={900}
              height={1200}
              fetchPriority="high"
              decoding="async"
              className="hero-poster"
            />
          </picture>
        </motion.div>

        {/* Veil: guarantees text contrast on the left and melts the stage into the page below */}
        <motion.div
          aria-hidden="true"
          className="hero-veil pointer-events-none absolute inset-0 -z-10"
          style={still ? undefined : { opacity: veilOpacity }}
        />

        {/* The horizon: past it everything is black, and Wari's dawn starts right below */}
        {!still && (
          <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-bg" style={{ opacity: horizon }} />
        )}

        <motion.div
          className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-16 pt-24 sm:px-8 wide:justify-center wide:pb-20 wide:pt-24"
          style={still ? undefined : { opacity: textOpacity, y: textY, pointerEvents: textEvents }}
        >
          <div className="max-w-[40rem] wide:max-w-[36rem] xl:wide:max-w-[40rem]">
            <h1
              className="hero-rise font-display text-balance text-[clamp(1.95rem,5.2vw+0.6rem,4.5rem)] [text-shadow:0_2px_28px_rgb(7_8_11/0.85)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink"
              style={{ ["--d" as string]: "60ms", fontVariationSettings: '"opsz" 96' }}
            >
              {HERO.headline[locale]}
            </h1>

            <p
              className="hero-rise mt-6 max-w-[38ch] text-pretty text-[1.0625rem] leading-relaxed text-muted sm:text-lg"
              style={{ ["--d" as string]: "160ms" }}
            >
              {HERO.sub[locale]}
            </p>

            <nav
              aria-label={HERO.casesLabel[locale]}
              className="hero-rise mt-9 max-w-[34rem]"
              style={{ ["--d" as string]: "260ms" }}
            >
              <ul className="hero-cases overflow-hidden rounded-[20px] border border-ink/12 bg-bg/45 backdrop-blur-md">
                {HERO.cases.map((c) => (
                  <li key={c.id} className="border-b border-ink/10 last:border-b-0">
                    <a
                      href={`#${c.id}`}
                      className="hero-case group grid min-h-[4.25rem] grid-cols-[2.25rem_minmax(0,1fr)_1.25rem] items-center gap-x-3 px-4 py-3.5 sm:px-5"
                    >
                      <span className="font-mono text-[11.5px] tabular-nums text-accent">{c.n}</span>
                      <span className="min-w-0">
                        <span className="block font-display text-[1.15rem] font-semibold leading-tight tracking-[-0.02em] text-ink">
                          {c.name}
                        </span>
                        <span className="mt-0.5 block text-pretty text-[13.5px] leading-snug text-muted">{c.line[locale]}</span>
                      </span>
                      <ArrowDown size={16} weight="bold" className="cta-arrow cta-arrow-down text-ink/70" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <p
            className="hero-rise absolute bottom-5 left-5 right-5 flex items-center gap-2 font-mono text-[11px] leading-snug text-muted sm:left-8 sm:right-8 wide:left-auto wide:max-w-[36ch] wide:justify-end wide:text-right"
            style={{ ["--d" as string]: "420ms" }}
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${live ? "bg-accent status-breath" : "bg-muted/50"}`}
            />
            <span>{live ? HERO.legendLive[locale] : HERO.legendStill[locale]}</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
