"use client";

import React from "react";
import { motion } from "motion/react";
import { useLocale } from "@/lib/i18n-context";
import { DEMO_UI, LAURA_HEAD } from "@/content/laura";
import { revealProps, useReducedMotionSafe } from "@/lib/motion";
import { HoloDemo } from "./laura/HoloDemo";
import { Capabilities } from "./laura/Capabilities";
import { Pipeline } from "./laura/Pipeline";
import { SafetyNet } from "./laura/SafetyNet";

/**
 * #laura: the voice assistant on my laptop. A header with the verified numbers,
 * the holograms as a playable recreation, everything she can do, how she works
 * inside and the safety net around her. Invented data throughout.
 */

const BARS = [0.35, 0.7, 1, 0.55, 0.85, 0.4, 0.75, 0.5, 0.9, 0.3];

function Voice({ className, reduce }: { className?: string; reduce: boolean | null }) {
  return (
    <span className={`inline-flex items-center gap-[0.07em] rounded-full border border-accent/60 px-[0.28em] ${className ?? ""}`} aria-hidden="true">
      {BARS.map((h, i) => (
        <span
          key={i}
          className="holo-bar w-[0.045em] rounded-full bg-accent"
          style={{
            height: "0.42em",
            transform: `scaleY(${h})`,
            animationDelay: `${(i * 137) % 700}ms`,
            animationPlayState: reduce ? "paused" : "running",
            ["--hi" as string]: h.toFixed(2),
            ["--lo" as string]: (h * 0.25).toFixed(2),
          }}
        />
      ))}
    </span>
  );
}

export function LauraSection() {
  const { locale } = useLocale();
  const reduce = useReducedMotionSafe();

  return (
    <section id="laura" data-scene="laura" className="laura-section relative isolate overflow-clip">
      <div aria-hidden="true" className="laura-glow pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-5 pt-[var(--spacing-section)] sm:px-8">
        {/* Header */}
        <motion.div {...revealProps(reduce)} className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h1
              className="flex items-center gap-[0.18em] font-display text-[clamp(3.6rem,10vw,8.5rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-ink"
              style={{ fontVariationSettings: '"opsz" 96' }}
            >
              {LAURA_HEAD.title[locale]}
              <Voice className="h-[0.52em] text-[clamp(3.6rem,10vw,8.5rem)]" reduce={reduce} />
            </h1>
            <p className="mt-5 max-w-[22ch] text-balance font-display text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold leading-tight tracking-[-0.03em] text-ink/90">
              {LAURA_HEAD.tagline[locale]}
            </p>
          </div>
          <div className="space-y-4 lg:col-span-5">
            <p className="max-w-[48ch] text-pretty text-[16px] leading-relaxed text-muted">{LAURA_HEAD.lead[locale]}</p>
            <p className="max-w-[48ch] border-l border-accent/60 pl-4 text-pretty text-[14.5px] leading-relaxed text-ink/85">{LAURA_HEAD.note[locale]}</p>
          </div>
        </motion.div>

        {/* The verified numbers */}
        <dl className="mt-16 grid grid-cols-2 border-y border-line lg:mt-20 lg:grid-cols-4">
          {LAURA_HEAD.facts.map((f, i) => (
            <motion.div
              key={f.value}
              {...revealProps(reduce, i * 0.05)}
              className={`px-1 py-7 sm:px-6 lg:py-9 ${i % 2 === 1 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""} lg:first:pl-0`}
            >
              <dt className="font-display text-[clamp(2.2rem,4.6vw,3.8rem)] font-semibold leading-none tracking-[-0.04em] tabular-nums text-ink">
                {locale === "es" ? f.valueEs : f.value}
              </dt>
              <dd className="mt-3 max-w-[22ch] text-[13.5px] leading-snug text-muted">{f.label[locale]}</dd>
            </motion.div>
          ))}
        </dl>

        {/* The holograms */}
        <div id="laura-demo" className="mt-24 scroll-mt-20 lg:mt-32">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <motion.h3
              {...revealProps(reduce)}
              className="font-display text-balance text-[clamp(2.4rem,5.6vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-ink lg:col-span-7"
              style={{ fontVariationSettings: '"opsz" 96' }}
            >
              {DEMO_UI.heading[locale]}
            </motion.h3>
            <motion.p {...revealProps(reduce, 0.05)} className="max-w-[48ch] text-pretty text-[15.5px] leading-relaxed text-muted lg:col-span-5">
              {DEMO_UI.lead[locale]}
            </motion.p>
          </div>
          <motion.div {...revealProps(reduce)} className="mt-10 lg:mt-14">
            <HoloDemo locale={locale} />
          </motion.div>
        </div>

        <div className="mt-24 lg:mt-36">
          <Capabilities locale={locale} reduce={reduce} />
        </div>

        <div className="mt-24 border-t border-line pt-20 lg:mt-32 lg:pt-24">
          <Pipeline locale={locale} reduce={reduce} />
        </div>
      </div>

      <div className="mt-24 border-t border-line bg-[#080a0e] lg:mt-32">
        <div className="mx-auto max-w-7xl px-5 py-[var(--spacing-section)] sm:px-8">
          <SafetyNet locale={locale} reduce={reduce} />
        </div>
      </div>
    </section>
  );
}
