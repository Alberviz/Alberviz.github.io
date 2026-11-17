"use client";

import React, { useEffect, useRef } from "react";
import { Microphone } from "@phosphor-icons/react";
import { DEMO_UI } from "@/content/laura";
import type { Locale } from "@/lib/i18n-context";

/**
 * Laura's pill. Its rim glows with her voice: a conic sweep whose brightness
 * follows an amplitude envelope (syllables inside words, like speech), and a soft
 * halo that breathes with it. Opacity and transform only, written straight to
 * the DOM from one rAF that runs only while she listens or speaks.
 */

export type PillState = "idle" | "listening" | "thinking" | "speaking";

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const sstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

function voiceAmp(t: number, speaking: boolean) {
  const f = speaking ? 1.25 : 1;
  const syl = Math.abs(Math.sin(t * 5.2 * f + Math.sin(t * 1.3) * 2));
  const word = 0.5 + 0.5 * Math.sin(t * (speaking ? 1.4 : 1.9) + 0.6);
  const gate = sstep(0.12, 0.5, word);
  return clamp((0.22 + 0.78 * syl) * (0.3 + 0.7 * gate) * (0.82 + 0.18 * Math.sin(t * 13.7)));
}

const REST: Record<PillState, number> = { idle: 0.12, listening: 0.6, thinking: 0.4, speaking: 0.7 };

export const LauraPill = React.forwardRef<
  HTMLDivElement,
  {
    state: PillState;
    text: string;
    caret: boolean;
    locale: Locale;
    reduce: boolean | null;
    running: boolean;
    className?: string;
  }
>(function LauraPill({ state, text, caret, locale, reduce, running, className }, ref) {
  const ringRef = useRef<HTMLSpanElement>(null);
  const haloRef = useRef<HTMLSpanElement>(null);
  const orbRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ring = ringRef.current;
    const halo = haloRef.current;
    const orb = orbRef.current;
    if (!ring || !halo || !orb) return;
    const rest = REST[state];
    const paint = (a: number) => {
      ring.style.opacity = (0.25 + 0.75 * a).toFixed(3);
      halo.style.opacity = (0.15 + 0.85 * a * 0.6).toFixed(3);
      halo.style.transform = `scale(${(1 + 0.1 * a).toFixed(3)})`;
      orb.style.transform = `scale(${(1 + 0.35 * a).toFixed(3)})`;
    };
    if (reduce || !running || state === "idle") {
      paint(rest);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const t = (now - t0) / 1000;
      const a =
        state === "thinking"
          ? 0.3 + 0.2 * Math.sin(t * 3.1)
          : state === "listening"
            ? 0.15 + 0.85 * voiceAmp(t, false) * 0.8
            : voiceAmp(t, true);
      paint(a);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [state, reduce, running]);

  const label = DEMO_UI.states[state][locale];
  const spin = !reduce && state !== "idle";

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <span
        ref={haloRef}
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 rounded-full opacity-20"
        style={{ background: "radial-gradient(60% 90% at 50% 50%, rgb(242 179 111 / 0.35), transparent 72%)" }}
      />
      <div className="relative overflow-hidden rounded-full p-[1.5px]" style={{ background: "rgb(242 179 111 / 0.18)" }}>
        <span
          ref={ringRef}
          aria-hidden="true"
          className={`absolute left-1/2 top-1/2 aspect-square w-[240%] -translate-x-1/2 -translate-y-1/2 opacity-30 ${spin ? "laura-ring-spin" : ""}`}
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgb(242 179 111 / 0.15) 90deg, #f2b36f 150deg, #ffe6c7 175deg, transparent 215deg, transparent 360deg)",
          }}
        />
        <div className="relative flex min-h-[48px] items-center gap-3 rounded-full bg-[#0a0a0d] py-1.5 pl-3.5 pr-4">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent/15 text-accent" aria-hidden="true">
            <span ref={orbRef} className="grid place-items-center">
              <Microphone size={15} weight="fill" />
            </span>
          </span>
          <p className={`min-w-0 flex-1 text-pretty text-[14px] leading-[1.3] ${text ? "text-ink" : "text-muted"}`}>
            {text || DEMO_UI.idle[locale]}
            {caret && text && <span aria-hidden="true" className="laura-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-accent" />}
          </p>
          <span className="hidden shrink-0 font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted sm:inline">{label}</span>
        </div>
      </div>
    </div>
  );
});
