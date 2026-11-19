"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { CASES, CASES_UI, CASE_CTA } from "@/content/pages";
import type { CaseId, CasePage } from "@/content/pages";
import { EASE_OUT, revealProps, useReducedMotionSafe } from "@/lib/motion";
import { DesktopVisual, HomeVisual, LauraVisual, OlimpoVisual, WariVisual } from "./CaseVisuals";

/**
 * The end of a case: the next one (Wari, Olimpo, Laura, Desktop, then back to
 * the start), with a still preview of it. Nothing runs here: no WebGL, no
 * loops, so a case never pays for the next one.
 */
export function NextCase({ from }: { from: CaseId }) {
  const { locale } = useLocale();
  const reduce = useReducedMotionSafe();
  const i = CASES.findIndex((c) => c.id === from);
  const next: CasePage | undefined = CASES[i + 1];
  const to = (next?.id ?? "home") as CaseId | "home";
  const aspect = to === "laura" ? "aspect-[5/4]" : to === "home" ? "aspect-[16/9]" : to === "escritorio" ? "aspect-[16/10] sm:aspect-[16/11]" : "aspect-[16/11]";
  const href = next?.path ?? "/";
  const kicker = next ? `${CASES_UI.next[locale]} · ${next.n}` : CASES_UI.backHome[locale];
  const name = next?.name ?? "Alberto Vizcaíno";
  const headline = next ? next.headline[locale] : CASES_UI.homeHeadline[locale];
  const lines = next ? next.lines[locale] : CASES_UI.homeLines[locale];

  const visual =
    to === "wari" ? (
      <WariVisual locale={locale} />
    ) : to === "olimpo" ? (
      <OlimpoVisual locale={locale} live={false} />
    ) : to === "laura" ? (
      <LauraVisual locale={locale} live={false} />
    ) : to === "escritorio" ? (
      <DesktopVisual locale={locale} live={false} />
    ) : (
      <HomeVisual locale={locale} />
    );

  return (
    <nav aria-label={CASES_UI.next[locale]} className="next-case relative border-t border-line" data-to={to}>
      <Link href={href} className="group block focus-visible:outline-none">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-[calc(var(--spacing-section)*0.8)] sm:px-8 lg:grid-cols-12 lg:gap-14">
          <motion.div {...revealProps(reduce)} className="lg:col-span-5">
            <p className="flex items-center gap-2 font-mono text-[12px] text-muted">
              <span aria-hidden="true" className="h-px w-6 bg-accent" />
              {kicker}
            </p>
            <p className="mt-5 font-display text-[clamp(2.6rem,6vw,4.75rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-ink" style={{ fontVariationSettings: '"opsz" 96' }}>
              {name}
            </p>
            <p className="mt-4 max-w-[24ch] text-balance font-display text-[clamp(1.25rem,2vw,1.6rem)] font-semibold leading-snug tracking-[-0.02em] text-ink/90">
              {headline}
            </p>
            <p className="mt-4 max-w-[44ch] text-pretty text-[15px] leading-relaxed text-muted">{lines}</p>
            <span className="mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-ink/25 px-6 text-[15px] font-semibold text-ink transition-colors duration-150 group-hover:border-accent group-focus-visible:border-accent group-focus-visible:ring-2 group-focus-visible:ring-accent/60">
              {next ? (CASE_CTA.byPath[next.path] ?? CASE_CTA.fallback)[locale] : CASES_UI.backHome[locale]}
              <ArrowRight size={16} weight="bold" className="cta-arrow" aria-hidden="true" />
            </span>
          </motion.div>
          <motion.div
            className={`next-visual relative lg:col-span-7 ${to === "wari" ? "case-fog" : ""}`}
            data-surface={to === "wari" ? "wari" : undefined}
            initial={reduce ? false : { clipPath: "inset(6% 6% 6% 6% round 28px)", opacity: 0.5 }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0% round 28px)", opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          >
            <div className={`next-visual-inner relative w-full ${aspect}`} aria-hidden="true">
              {visual}
            </div>
          </motion.div>
        </div>
      </Link>
    </nav>
  );
}
