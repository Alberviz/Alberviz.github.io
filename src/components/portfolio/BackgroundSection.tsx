"use client";

import React from "react";
import {motion} from "motion/react";
import { useLocale } from "@/lib/i18n-context";
import { BACKGROUND_UI, EXPERIENCE, HONORS, STUDY } from "@/content/portfolio-data";
import { revealProps, useReducedMotionSafe } from "@/lib/motion";

/** #trayectoria: work and study side by side, honors underneath. No skill bars. */
export function BackgroundSection() {
  const { locale } = useLocale();
  const reduce = useReducedMotionSafe();

  return (
    <section id="trayectoria" data-scene="background" className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-[var(--spacing-section)] sm:px-8">
        <motion.div {...revealProps(reduce)} className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2
            className="font-display text-balance text-[clamp(2.2rem,4.4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink lg:col-span-7"
            style={{ fontVariationSettings: '"opsz" 80' }}
          >
            {BACKGROUND_UI.heading[locale]}
          </h2>
          <p className="max-w-[46ch] text-pretty text-[15.5px] leading-relaxed text-muted lg:col-span-5">
            {BACKGROUND_UI.lead[locale]}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-2 lg:gap-0 lg:divide-x lg:divide-line">
          <motion.div {...revealProps(reduce)} className="lg:pr-14">
            <h3 className="font-display text-[1.2rem] font-semibold tracking-[-0.02em] text-ink">{BACKGROUND_UI.work[locale]}</h3>
            <div className="mt-5 border-t border-line pt-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <p className="font-display text-[clamp(1.6rem,2.6vw,2.2rem)] font-semibold leading-tight tracking-[-0.03em] text-ink">
                  {EXPERIENCE.company}
                </p>
                <p className="font-mono text-[12px] tabular-nums text-muted">{EXPERIENCE.period[locale]}</p>
              </div>
              <p className="mt-1 text-[15px] text-ink/90">
                {EXPERIENCE.role[locale]} <span className="text-muted">· {EXPERIENCE.place[locale]}</span>
              </p>
              <p className="mt-5 max-w-[50ch] text-[15.5px] leading-relaxed text-ink/85">{EXPERIENCE.summary[locale]}</p>
              <ul className="mt-4 space-y-2.5">
                {EXPERIENCE.bullets.map((b) => (
                  <li key={b.en} className="grid grid-cols-[1.25rem_1fr] text-[14.5px] leading-relaxed text-muted">
                    <span aria-hidden="true" className="mt-[0.75em] h-px w-3 bg-accent" />
                    <span className="max-w-[52ch]">{b[locale]}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 font-mono text-[12px] text-muted">{EXPERIENCE.stack.join(" · ")}</p>
            </div>
          </motion.div>

          <motion.div {...revealProps(reduce, 0.06)} className="lg:pl-14">
            <h3 className="font-display text-[1.2rem] font-semibold tracking-[-0.02em] text-ink">{BACKGROUND_UI.study[locale]}</h3>
            <ul className="mt-5 border-t border-line">
              {STUDY.map((s) => (
                <li key={s.when} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-b border-line py-6">
                  <p className="font-display text-[clamp(1.25rem,2vw,1.6rem)] font-semibold leading-tight tracking-[-0.02em] text-ink">
                    {s.title[locale]}
                  </p>
                  <p className="font-mono text-[12px] tabular-nums text-muted">{s.when}</p>
                  <p className="col-span-2 text-[14.5px] text-muted">{s.detail[locale]}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="mt-16 lg:mt-20">
          <h3 className="font-display text-[1.2rem] font-semibold tracking-[-0.02em] text-ink">{BACKGROUND_UI.honors[locale]}</h3>
          <ul className="mt-5 grid border-t border-line md:grid-cols-3 md:divide-x md:divide-line">
            {HONORS.map((h, i) => (
              <motion.li
                key={h.title.en}
                {...revealProps(reduce, i * 0.06)}
                className="border-b border-line py-6 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0"
              >
                <p className="font-display text-[1.15rem] font-semibold leading-snug tracking-[-0.02em] text-ink">
                  {h.title[locale]}
                </p>
                <p className="mt-2 max-w-[34ch] text-[14px] leading-relaxed text-muted">{h.detail[locale]}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
