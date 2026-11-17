"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowDown } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { HERO } from "@/content/site-copy";
import { SPRING_POINTER, useFinePointer } from "@/lib/motion";
import { HERO_BG, HERO_PALETTE, HERO_VARIANTS, WIDE_QUERY } from "./hero/hero-layout";
import type { HeroVariant } from "./hero/hero-layout";

/**
 * Hero state, exposed as `data-state` for tests:
 *  poster   -> static poster only (reduced motion, no WebGL2, weak device)
 *  loading  -> renderer is being fetched/baked
 *  live     -> WebGL canvas is drawing
 *  frozen   -> canvas stopped by the frame-time guard (keeps the last frame)
 */
type HeroState = "poster" | "loading" | "live" | "frozen";

const FRAME_MS = 1000 / 30;
const GUARD_FRAMES = 36;
const GUARD_MAX_AVG_MS = 62;

function weakDevice() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (nav.hardwareConcurrency ?? 8) <= 2 || (nav.deviceMemory ?? 8) <= 2;
}

export function HeroSection() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<HeroState>("loading");

  // Pointer parallax on the whole stage (the shader is baked once; only the layer moves).
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, SPRING_POINTER);
  const sy = useSpring(py, SPRING_POINTER);
  const tx = useTransform(sx, (n) => n * 14);
  const ty = useTransform(sy, (n) => n * 10);

  useEffect(() => {
    const stage = stageRef.current;
    const section = sectionRef.current;
    if (!stage || !section) return;

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
        if (last && now - last < FRAME_MS - 2) return;
        if (last) {
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
        renderer.render((now - started) / 1000);
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

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!fine || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };

  const live = state === "live";

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-scene="hero"
      data-state={state}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden bg-bg"
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

      {/* Stage: poster is the LCP and the fallback; the canvas fades in over it */}
      <motion.div
        ref={stageRef}
        aria-hidden="true"
        className="hero-stage absolute inset-0 -z-10"
        style={{ x: tx, y: ty, scale: 1.03 }}
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
      <div aria-hidden="true" className="hero-veil pointer-events-none absolute inset-0 -z-10" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-5 pb-16 pt-24 sm:px-8 wide:justify-center wide:pb-20 wide:pt-24">
        <div className="max-w-[40rem] wide:max-w-[36rem] xl:wide:max-w-[40rem]">
          <h1
            className="hero-rise font-display text-balance text-[clamp(2.4rem,5.2vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink"
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
      </div>
    </section>
  );
}
