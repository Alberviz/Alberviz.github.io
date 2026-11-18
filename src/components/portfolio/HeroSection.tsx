"use client";

import { useReducedMotionSafe } from "@/lib/motion";

import React, { useEffect, useRef, useState } from "react";
import {motion, useScroll, useTransform} from "motion/react";
import type { MotionValue } from "motion/react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { HERO } from "@/content/site-copy";
import { HERO_BG, HERO_PALETTE, HERO_VARIANTS, WIDE_QUERY } from "./hero/hero-layout";
import type { HeroVariant } from "./hero/hero-layout";
import type { Camera } from "./desktop/live/gargantua-renderer";
import { singularity } from "./hero/singularity";

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
 * Timeline of the hero track (0 = top, 1 = the hero has scrolled away):
 *   0.04 - 0.58  the hole feeds: every piece of text spirals into it, one after
 *                another, like a file dropped into a Warp portal, while the disk
 *                spins up and the hole swells a little;
 *   0.52 - 0.74  the hole collapses into a point, burning brighter as it shrinks;
 *   0.70 - 0.90  the point lets go a shockwave and the stars dim;
 *   0.62 - 1     #casos already rises over the pinned starfield (negative margin in
 *                globals.css) and its heading comes out of the collapse point
 *                (`hero/singularity.ts`), so there is never an empty screen.
 */
const FEED_END = 0.56;
const COLLAPSE = [0.52, 0.74] as const;
const WAVE = [0.7, 0.9] as const;

function cameraAt(p: number, wide: boolean): Camera {
  const feed = smooth(0, FEED_END, p);
  const collapse = smooth(COLLAPSE[0], COLLAPSE[1], p);
  const zoom = (1 + (wide ? 0.55 : 0.4) * feed) * Math.pow(1 - collapse, 2.4) + 0.0005;
  return {
    zoom,
    pan: 0,
    roll: -0.14 * feed,
    lens: smooth(0.04, 0.5, p) * Math.min(1, zoom),
    streak: 0.45 * smooth(0.3, COLLAPSE[0], p) * (1 - collapse),
    fall: 0.55 * smooth(0.74, 0.95, p),
    spin: 1 + 6 * feed + 8 * collapse,
    flare: smooth(0.46, 0.7, p) * (1 - smooth(0.74, 0.84, p)),
  };
}

/** Where each piece of text falls in, in order: the footnote first, the headline last. */
const SWALLOW_STEP = 0.045;
const SWALLOW_LEN = 0.28;

/** Rotate v by a radians. */
const rot = (x: number, y: number, a: number) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];

/**
 * One piece of text being swallowed: it spirals toward the hole's centre,
 * shrinks and fades as it crosses the photon ring. Pure function of the track.
 */
function swallowStyle(p: number, order: number, from: { x: number; y: number }, hole: { x: number; y: number }) {
  const a = 0.04 + order * SWALLOW_STEP;
  const t = clamp01((p - a) / SWALLOW_LEN);
  // Gravity: slow at first, faster as it gets close.
  const k = t * t * (2.2 - 1.2 * t);
  const vx = from.x - hole.x;
  const vy = from.y - hole.y;
  const turn = -1.5 * k;
  const r = Math.pow(1 - k, 1.4);
  const [rx, ry] = rot(vx, vy, turn);
  const dx = rx * r - vx;
  const dy = ry * r - vy;
  const scale = Math.max(0.04, 1 - 0.96 * k);
  return {
    transform: k === 0 ? "none" : `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) rotate(${(turn * 40).toFixed(1)}deg) scale(${scale.toFixed(3)})`,
    opacity: 1 - smooth(0.62, 0.96, k),
  };
}

/** Offset of an element's centre inside an ancestor, ignoring transforms. */
function centreWithin(el: HTMLElement, root: HTMLElement) {
  let x = el.offsetWidth / 2;
  let y = el.offsetHeight / 2;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/** Screen position of the hole inside the pinned stage (object-fit: cover, like the poster). */
function holeOnStage(stageW: number, stageH: number, variant: HeroVariant) {
  const cfg = HERO_VARIANTS[variant];
  const w = 1000;
  const h = w / cfg.aspect;
  const at = cfg.place(w, h);
  const s = Math.max(stageW / w, stageH / h);
  const ox = (stageW - w * s) / 2;
  const oy = variant === "tall" ? 0 : (stageH - h * s) / 2;
  return { x: ox + at.cx * s, y: oy + at.cy * s };
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
  const textEvents = useTransform(scrollYProgress, (v) => (v > 0.06 ? "none" : "auto"));
  const veilOpacity = useTransform(scrollYProgress, (v) => 1 - 0.75 * clamp01(v / 0.4));
  // Frozen canvas: no collapse in CSS (the frame's edges would show); it swells and fades instead.
  const frozenZoom = useTransform(scrollYProgress, (v) => 1 + (wide ? 0.55 : 0.4) * smooth(0, FEED_END, v));
  const frozenOpacity = useTransform(scrollYProgress, (v) => 1 - smooth(COLLAPSE[0], COLLAPSE[1], v));
  const waveScale = useTransform(scrollYProgress, (v) => 0.02 + 0.98 * smooth(WAVE[0], WAVE[1], v));
  const waveOpacity = useTransform(scrollYProgress, (v) => smooth(WAVE[0], WAVE[0] + 0.03, v) * (1 - smooth(0.78, WAVE[1], v)));
  const flashOpacity = useTransform(scrollYProgress, (v) => smooth(0.64, 0.73, v) * (1 - smooth(0.74, 0.86, v)));

  // Geometry of the swallow: where the hole sits on screen and where each piece of text starts.
  const pinRef = useRef<HTMLDivElement>(null);
  const geoRef = useRef<FallGeometry>({ hole: null, items: {} });
  const [holePt, setHolePt] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;
    const measure = () => {
      const variant: HeroVariant = window.matchMedia(WIDE_QUERY).matches ? "wide" : "tall";
      const hole = holeOnStage(pin.clientWidth, pin.clientHeight, variant);
      const items: Record<string, { x: number; y: number }> = {};
      pin.querySelectorAll<HTMLElement>("[data-fall]").forEach((el) => {
        items[el.dataset.fall as string] = centreWithin(el, pin);
      });
      geoRef.current = { hole, items };
      const track = pin.parentElement;
      singularity.x = hole.x;
      singularity.y = hole.y;
      singularity.travel = track ? Math.max(0, track.offsetHeight - pin.clientHeight) : 0;
      setHolePt(hole);
      // Re-apply the current frame with the new geometry.
      scrollYProgress.set(scrollYProgress.get());
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(pin);
    pin.querySelectorAll<HTMLElement>("[data-fall]").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [scrollYProgress]);

  const fall = { progress: scrollYProgress, geo: geoRef, off: !!reduce || state === "poster" };
  const h1Fall = useFall(fall, "h1", 6);
  const subFall = useFall(fall, "sub", 5);
  const legendFall = useFall(fall, "legend", 0);

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
        // Past the end the frame barely changes: nothing to draw.
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

  useEffect(() => {
    singularity.on = !still;
    return () => {
      singularity.on = false;
    };
  }, [still]);

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

      <div ref={pinRef} className="hero-pin flex min-h-[100dvh] flex-col overflow-hidden">
        {/* Stage: poster is the LCP and the fallback; the canvas fades in over it */}
        <motion.div
          ref={stageRef}
          aria-hidden="true"
          className="hero-stage absolute inset-0 -z-10"
          style={
            frozen && !still
              ? { scale: frozenZoom, opacity: frozenOpacity, transformOrigin: holePt ? `${holePt.x}px ${holePt.y}px` : wide ? "75% 46%" : "55% 30%" }
              : undefined
          }
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

        {/* The collapse: a flash where the hole was, then a shockwave that sweeps the screen */}
        {!still && holePt && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <motion.div
              className="hero-flash absolute"
              style={{ left: holePt.x, top: holePt.y, x: "-50%", y: "-50%", opacity: flashOpacity }}
            />
            <motion.div
              className="hero-wave absolute"
              style={{ left: holePt.x, top: holePt.y, x: "-50%", y: "-50%", scale: waveScale, opacity: waveOpacity }}
            />
          </div>
        )}

        <motion.div
          className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-16 pt-24 sm:px-8 wide:justify-center wide:pb-20 wide:pt-24"
          style={still ? undefined : { pointerEvents: textEvents }}
        >
          <div className="max-w-[40rem] wide:max-w-[36rem] xl:wide:max-w-[40rem]">
            <motion.div data-fall="h1" style={h1Fall}>
              <h1
                className="hero-rise font-display text-balance text-[clamp(1.95rem,5.2vw+0.6rem,4.5rem)] [text-shadow:0_2px_28px_rgb(7_8_11/0.85)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink"
                style={{ ["--d" as string]: "60ms", fontVariationSettings: '"opsz" 96' }}
              >
                {HERO.headline[locale]}
              </h1>
            </motion.div>

            <motion.div data-fall="sub" style={subFall}>
              <p
                className="hero-rise mt-5 max-w-[38ch] text-pretty text-[1rem] leading-relaxed text-muted sm:mt-6 sm:text-lg"
                style={{ ["--d" as string]: "160ms" }}
              >
                {HERO.sub[locale]}
              </p>
            </motion.div>

            <nav
              aria-label={HERO.casesLabel[locale]}
              className="hero-rise mt-7 max-w-[34rem] sm:mt-9"
              style={{ ["--d" as string]: "260ms" }}
            >
              <ul className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-1.5">
                {HERO.cases.map((c, i) => (
                  <HeroCase key={c.id} c={c} order={HERO.cases.length - i} fall={fall} locale={locale} />
                ))}
              </ul>
            </nav>
          </div>

          <motion.div
            data-fall="legend"
            style={legendFall}
            className="absolute bottom-5 left-5 right-5 sm:left-8 sm:right-8 wide:left-auto wide:max-w-[36ch]"
          >
            <p
              className="hero-rise flex items-center gap-2 font-mono text-[11px] leading-snug text-muted wide:justify-end wide:text-right"
              style={{ ["--d" as string]: "420ms" }}
            >
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${live ? "bg-accent status-breath" : "bg-muted/50"}`}
              />
              <span>{live ? HERO.legendLive[locale] : HERO.legendStill[locale]}</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

interface FallGeometry {
  hole: { x: number; y: number } | null;
  items: Record<string, { x: number; y: number }>;
}

interface FallSource {
  progress: MotionValue<number>;
  geo: React.RefObject<FallGeometry>;
  off: boolean;
}

/** Motion style for one piece of text that the hole swallows (none when the hero is still). */
function useFall({ progress, geo, off }: FallSource, key: string, order: number) {
  const transform = useTransform(progress, (v) => {
    const g = geo.current;
    const from = g?.items[key];
    return off || !g?.hole || !from ? "none" : swallowStyle(v, order, from, g.hole).transform;
  });
  const opacity = useTransform(progress, (v) => {
    const g = geo.current;
    const from = g?.items[key];
    return off || !g?.hole || !from ? 1 : swallowStyle(v, order, from, g.hole).opacity;
  });
  return { transform, opacity };
}

type HeroCaseCopy = (typeof HERO.cases)[number];

function HeroCase({ c, order, fall, locale }: { c: HeroCaseCopy; order: number; fall: FallSource; locale: "en" | "es" }) {
  const style = useFall(fall, c.id, order);
  return (
    <motion.li data-fall={c.id} style={style} className="min-w-0">
      <Link
        href={`/${c.id}/`}
        className="hero-case group flex h-full min-h-[4.25rem] items-center gap-3 rounded-[16px] border border-ink/12 bg-bg/55 px-3.5 py-3 backdrop-blur-md sm:grid sm:grid-cols-[2.25rem_minmax(0,1fr)_1.25rem] sm:gap-x-3 sm:rounded-[18px] sm:px-5 sm:py-3.5"
      >
        <span className="font-mono text-[11.5px] tabular-nums text-accent">{c.n}</span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[1.05rem] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[1.15rem]">
            {c.name}
          </span>
          <span className="mt-0.5 hidden text-pretty text-[13.5px] leading-snug text-muted sm:block">{c.line[locale]}</span>
        </span>
        <ArrowRight size={16} weight="bold" className="cta-arrow hidden text-ink/70 sm:block" aria-hidden="true" />
      </Link>
    </motion.li>
  );
}
