"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react";
import type { Locale } from "@/lib/i18n-context";
import { LAURA_HEAD, LAURA_URL, SAFE_FLOW, SAFE_LANES, SAFE_RULES, SAFE_UI } from "@/content/laura";
import { revealProps } from "@/lib/motion";

/**
 * The safety net. A plan walks through five steps (the scroll fills the line),
 * then the rules that make it boring on purpose and the three lanes a shell
 * command can take.
 */

const clamp = (x: number) => Math.min(1, Math.max(0, x));

function Step({ i, progress, step, locale, reduce }: { i: number; progress: MotionValue<number>; step: (typeof SAFE_FLOW)[number]; locale: Locale; reduce: boolean | null }) {
  const at = i * 0.19;
  const t = useTransform(progress, (v) => clamp((v - at) / 0.16));
  const opacity = useTransform(t, (x) => 0.35 + 0.65 * x);
  const on = useTransform(t, (x) => (x > 0.6 ? 1 : 0));
  return (
    <motion.li style={reduce ? undefined : { opacity }} className="relative pl-12 lg:pl-0 lg:pr-6">
      <span className="absolute left-0 top-0 grid size-9 place-items-center rounded-full border border-line bg-bg font-mono text-[11px] text-muted lg:relative" aria-hidden="true">
        <motion.span style={reduce ? { opacity: 1 } : { opacity: on }} className="absolute inset-0 rounded-full border border-accent bg-accent/10" />
        <span className="relative">{i + 1}</span>
      </span>
      <p className="font-display text-[1.25rem] font-semibold leading-none tracking-[-0.02em] text-ink lg:mt-5">{step.name[locale]}</p>
      <p className="mt-2 max-w-[26ch] text-pretty text-[13.5px] leading-snug text-muted">{step.body[locale]}</p>
    </motion.li>
  );
}

export function SafetyNet({ locale, reduce }: { locale: Locale; reduce: boolean | null }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 80%", "end 60%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <motion.h3
          {...revealProps(reduce)}
          className="font-display text-balance text-[clamp(2.4rem,5.6vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-ink lg:col-span-7"
          style={{ fontVariationSettings: '"opsz" 96' }}
        >
          {SAFE_UI.heading[locale]}
        </motion.h3>
        <motion.p {...revealProps(reduce, 0.05)} className="max-w-[48ch] text-pretty text-[15.5px] leading-relaxed text-muted lg:col-span-5">
          {SAFE_UI.lead[locale]}
        </motion.p>
      </div>

      {/* The life of a plan */}
      <div className="mt-14 lg:mt-20">
        <p className="mb-8 font-display text-[1.3rem] font-semibold tracking-[-0.02em] text-ink">{SAFE_UI.flow[locale]}</p>
        <div ref={trackRef} className="relative">
          <div aria-hidden="true" className="absolute bottom-3 left-[17px] top-3 w-px bg-line lg:hidden">
            <motion.div className="h-full w-full origin-top bg-accent" style={reduce ? undefined : { scaleY: fill }} />
          </div>
          <div aria-hidden="true" className="absolute left-0 right-0 top-[17px] hidden h-px bg-line lg:block">
            <motion.div className="h-full w-full origin-left bg-accent" style={reduce ? undefined : { scaleX: fill }} />
          </div>
          <ol className="relative grid gap-9 lg:grid-cols-5 lg:gap-0">
            {SAFE_FLOW.map((s, i) => (
              <Step key={s.id} i={i} step={s} progress={scrollYProgress} locale={locale} reduce={reduce} />
            ))}
          </ol>
        </div>
      </div>

      {/* Rules + lanes */}
      <div className="mt-20 grid gap-14 lg:grid-cols-12 lg:gap-16">
        <ul className="lg:col-span-7">
          {SAFE_RULES.map((r, i) => (
            <motion.li key={r.title.en} {...revealProps(reduce, i * 0.04)} className="grid gap-x-6 gap-y-1.5 border-t border-line py-6 first:border-t-0 first:pt-0 sm:grid-cols-[2.5rem_1fr]">
              <span className="font-mono text-[12px] tabular-nums text-accent" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h4 className="font-display text-[1.25rem] font-semibold leading-tight tracking-[-0.02em] text-ink">{r.title[locale]}</h4>
                <p className="mt-2 max-w-[56ch] text-pretty text-[14.5px] leading-relaxed text-muted">{r.body[locale]}</p>
              </div>
            </motion.li>
          ))}
        </ul>

        <motion.div {...revealProps(reduce, 0.05)} className="lg:col-span-5 lg:border-l lg:border-line lg:pl-14">
          <h4 className="font-display text-[1.25rem] font-semibold leading-tight tracking-[-0.02em] text-ink">{SAFE_UI.lanes[locale]}</h4>
          <ul className="mt-6 space-y-3">
            {SAFE_LANES.map((l) => (
              <li key={l.id} className="rounded-[14px] border border-line p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <p className={`font-display text-[1.1rem] font-semibold tracking-[-0.02em] ${l.id === "blocked" ? "text-ink/60 line-through decoration-accent/70" : "text-ink"}`}>{l.name[locale]}</p>
                  <code className="rounded-full bg-white/[0.05] px-2.5 py-1 font-mono text-[11px] text-ink/80">{l.sample}</code>
                </div>
                <p className="mt-2 text-pretty text-[13.5px] leading-snug text-muted">{l.body[locale]}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 border-l border-accent/60 pl-4 text-pretty text-[14px] leading-relaxed text-ink/85">{SAFE_UI.local[locale]}</p>
          <a
            href={LAURA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="press-scale mt-8 inline-flex items-center gap-2 rounded-full border border-line px-3.5 py-2 text-[13px] text-ink transition-colors duration-150 hover:border-ink/30 hover:bg-surface"
          >
            <GithubLogo size={14} aria-hidden="true" />
            {LAURA_HEAD.repo[locale]}
            <ArrowUpRight size={12} className="text-muted" aria-hidden="true" />
          </a>
        </motion.div>
      </div>
    </div>
  );
}
