"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { Folder } from "@phosphor-icons/react";
import type { Locale } from "@/lib/i18n-context";
import { WARI_SHOTS } from "@/content/wari-shots";
import { OLIMPO } from "@/content/olimpo";
import { DEMO_COMMANDS, DEMO_FILES, DEMO_PANELS } from "@/content/laura";
import { ASSETS } from "@/content/assets";
import { HERO } from "@/content/site-copy";
import { useReducedMotionSafe } from "@/lib/motion";
import { ScaledStage } from "./olimpo/ScaledStage";
import { Firmamento } from "./olimpo/Firmamento";
import { HoloList } from "./laura/panels";
import { LauraPill } from "./laura/LauraPill";
import { Decode } from "./desktop/HardwareStory";
import type { WarpEngine } from "./olimpo/warp-engine";

/**
 * The visual of each case, as a preview: a real fragment of the case, not a
 * picture of it. Used by the home (live) and by the "next case" band at the end
 * of each case (`live={false}`: nothing runs, no WebGL).
 */

/* ---------- Wari: real screens from the beta, in the fog ---------- */

export function WariVisual({ locale, split }: { locale: Locale; split?: MotionValue<number> }) {
  const front = WARI_SHOTS[0];
  const back = WARI_SHOTS[1];
  // Warikan: on the home the two screens arrive as one and split apart as you scroll in,
  // like a bill being divided. `split` is 0 (one phone) to 1 (two, at rest).
  const fallback = useMotionValue(1);
  const s = split ?? fallback;
  const backX = useTransform(s, (v) => `${(79 * (1 - v)).toFixed(2)}%`);
  const backRot = useTransform(s, (v) => -6 * v + 4 * (1 - v));
  const backY = useTransform(s, (v) => `${(-14 * (1 - v)).toFixed(2)}%`);
  const frontRot = useTransform(s, (v) => 4 + 3 * (1 - v) * v * 4);
  return (
    <div className="case-wari-visual relative h-full w-full" aria-hidden="false">
      <motion.div className="absolute left-[14%] top-[13%] w-[38%] sm:left-[18%]" style={{ x: backX, y: backY, rotate: backRot }}>
        <div className="wari-phone">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={back.src} width={back.width} height={back.height} alt={back.alt[locale]} loading="lazy" decoding="async" draggable={false} className="block h-auto w-full rounded-[1.6rem]" />
        </div>
      </motion.div>
      <motion.div className="absolute left-[44%] top-[5%] w-[42%] sm:left-[46%]" style={{ rotate: frontRot }}>
        <div className="wari-phone">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={front.src} width={front.width} height={front.height} alt={front.alt[locale]} loading="lazy" decoding="async" draggable={false} className="block h-auto w-full rounded-[1.6rem]" />
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- Olimpo: a slice of the Firmamento with a Warp portal over it ---------- */

/**
 * One real Warp portal (the same engine and shader as the demo, overlay mode),
 * created only once the preview is near the screen and fetched in its own chunk.
 * Pointer over the preview wakes it up. Without WebGL, a CSS hole.
 */
function PortalOverlay({ live, hot }: { live: boolean; hot: boolean }) {
  const reduce = useReducedMotionSafe();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<WarpEngine | null>(null);
  const near = useInView(wrapRef, { once: true, margin: "200px" });
  const [state, setState] = useState<"css" | "gl">("css");

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!live || !near || !canvas || !wrap || reduce === null) return;
    let cancelled = false;
    let engine: WarpEngine | null = null;
    let ro: ResizeObserver | null = null;
    void import("./olimpo/warp-engine").then(({ WarpEngine }) => {
      if (cancelled) return;
      const still = !!reduce || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      engine = WarpEngine.create(canvas, still);
      if (!engine) return;
      engine.setBare(true);
      engineRef.current = engine;
      const blank = document.createElement("canvas");
      blank.width = 2;
      blank.height = 2;
      const layout = () => {
        const w = wrap.clientWidth;
        const h = wrap.clientHeight;
        if (!engine || w < 10) return;
        const R = Math.max(14, Math.min(30, w * 0.042));
        engine.setLayout({
          width: w,
          height: h,
          screen: { x: 0, y: -40, w, h: h + 40 },
          portals: [{ id: "movil", x: w * 0.89, y: h * 0.6 }],
          R,
          devices: {},
        });
        engine.setDesktop(blank);
        // The portal exists only once there is a layout: open it here (idempotent), not before.
        engine.open(true);
      };
      layout();
      ro = new ResizeObserver(layout);
      ro.observe(wrap);
      setState("gl");
    });
    return () => {
      cancelled = true;
      ro?.disconnect();
      engine?.dispose();
      engineRef.current = null;
    };
  }, [live, near, reduce]);

  useEffect(() => {
    engineRef.current?.hover(hot ? "movil" : null);
  }, [hot]);

  return (
    <div ref={wrapRef} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {state === "css" && <span className="warp-fallback absolute left-[89%] top-[60%] !h-[clamp(4rem,10vw,7rem)] !w-[clamp(4rem,10vw,7rem)]" />}
      {live && <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />}
    </div>
  );
}

export function OlimpoVisual({ locale, live = true, hot = false }: { locale: Locale; live?: boolean; hot?: boolean }) {
  return (
    <div className="relative h-full w-full">
      <div className="olimpo-window absolute inset-0 overflow-hidden rounded-[20px]">
        <div className="flex h-7 items-center gap-1.5 border-b border-white/[0.06] bg-[#0B0D1E] px-3" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
        </div>
        <ScaledStage width={1200} height={740} label={OLIMPO.views.desktop[locale]}>
          <Firmamento locale={locale} />
        </ScaledStage>
      </div>
      <PortalOverlay live={live} hot={hot} />
    </div>
  );
}

/* ---------- Laura: one hologram born from the pill ---------- */

export function LauraVisual({ locale, live = true }: { locale: Locale; live?: boolean }) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.4 });
  const on = !live || !!reduce || seen;
  const cmd = DEMO_COMMANDS[0];
  return (
    <div ref={ref} className="relative flex h-full w-full flex-col items-center justify-center px-[6%] py-[5%]">
      <div className="case-holo relative w-full max-w-[22rem]" data-on={on ? "1" : "0"}>
        <section aria-label={DEMO_PANELS.downloads[locale]} className="holo-glass relative flex flex-col overflow-hidden pb-2">
          <header className="relative z-[1] flex h-[42px] shrink-0 items-center gap-2.5 border-b border-accent/15 px-3.5">
            <Folder size={15} className="text-accent" aria-hidden="true" />
            <p className="min-w-0 flex-1 truncate text-[13px] font-semibold text-ink">{DEMO_PANELS.downloads[locale]}</p>
            <span className="font-mono text-[11px] tabular-nums text-muted">
              {DEMO_FILES.length} {DEMO_PANELS.filesCount[locale]}
            </span>
          </header>
          <div className="relative z-[1]">
            {on && <HoloList files={DEMO_FILES.slice(0, 5)} locale={locale} arriveMs={live && !reduce ? 260 : 0} compact />}
          </div>
          <div aria-hidden="true" className="holo-dots" />
          <div aria-hidden="true" className="holo-scanlines" />
        </section>
        <span aria-hidden="true" className="holo-corner holo-corner-a" />
        <span aria-hidden="true" className="holo-corner holo-corner-b" />
      </div>
      <span aria-hidden="true" className="case-beam h-10 w-px shrink-0" data-on={on ? "1" : "0"} />
      <LauraPill
        state={on ? "speaking" : "listening"}
        text={cmd.say[locale]}
        caret={false}
        locale={locale}
        reduce={reduce}
        running={live && on}
        className="w-full max-w-[22rem]"
      />
    </div>
  );
}

/* ---------- Desktop: the setup, with the bytes decoding over it ---------- */

export function DesktopVisual({ locale, live = true }: { locale: Locale; live?: boolean }) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.45 });
  const shot = ASSETS.systems.celestial;
  return (
    <div ref={ref} className="relative h-full w-full">
      <div className="absolute inset-x-0 top-0 h-[52%] overflow-hidden rounded-[18px] border border-line sm:inset-y-[3%] sm:left-0 sm:right-[14%] sm:h-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shot.src} width={shot.width} height={shot.height} alt={shot.alt[locale]} loading="lazy" decoding="async" className="h-full w-full object-cover object-left" />
      </div>
      <div className="case-decode absolute bottom-0 right-0 w-full origin-bottom-right sm:w-[min(100%,26rem)]">
        <Decode active={live ? inView : true} locale={locale} still={!live || !!reduce} />
      </div>
    </div>
  );
}

/* ---------- Home: the hero poster, for the last "next case" ---------- */

export function HomeVisual({ locale }: { locale: Locale }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[20px] border border-line">
      <picture>
        <source media="(min-aspect-ratio: 1250/1000)" srcSet="/media/hero/gargantua-wide.webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/hero/gargantua-tall.webp" width={900} height={1200} alt={HERO.posterAlt[locale]} loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </picture>
    </div>
  );
}
