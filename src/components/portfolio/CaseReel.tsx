"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import type { Locale } from "@/lib/i18n-context";
import { CASES, CASES_UI } from "@/content/pages";
import type { CasePage } from "@/content/pages";
import { EASE_OUT, revealProps, useReducedMotionSafe } from "@/lib/motion";
import { DesktopVisual, LauraVisual, OlimpoVisual, WariVisual } from "./CaseVisuals";

/**
 * #casos on the home: one rich preview per case, each with its own composition
 * (Wari in its fog, Olimpo as a wide window with a live portal, Laura centred on
 * a hologram, the desktop with its bytes decoding), a headline, two lines and a
 * clear way into the case page. The visual opens with a clip-path as it enters
 * and drifts against the copy while it crosses the screen.
 */

type Tone = "fog" | "sky" | "holo" | "plain";

const LAYOUT: Record<CasePage["id"], { tone: Tone; flip: boolean; visual: string }> = {
  wari: { tone: "fog", flip: false, visual: "aspect-[5/4] sm:aspect-[4/3]" },
  olimpo: { tone: "sky", flip: true, visual: "aspect-[16/11]" },
  laura: { tone: "holo", flip: false, visual: "aspect-[4/5] sm:aspect-[5/4]" },
  escritorio: { tone: "plain", flip: true, visual: "aspect-[3/4] sm:aspect-[16/11]" },
};

function Visual({ c, locale, hot }: { c: CasePage; locale: Locale; hot: boolean }) {
  if (c.id === "wari") return <WariVisual locale={locale} />;
  if (c.id === "olimpo") return <OlimpoVisual locale={locale} hot={hot} />;
  if (c.id === "laura") return <LauraVisual locale={locale} />;
  return <DesktopVisual locale={locale} />;
}

function Preview({ c, locale, reduce }: { c: CasePage; locale: Locale; reduce: boolean | null }) {
  const ref = useRef<HTMLElement>(null);
  const [hot, setHot] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Function transforms (not ranges): see DESIGN.md, Motion would hand ranges to a page-wide ScrollTimeline.
  const drift = useTransform(scrollYProgress, (v) => (0.5 - v) * 48);
  const L = LAYOUT[c.id];
  const fog = L.tone === "fog";
  const titleId = `case-${c.id}-title`;

  return (
    <article
      ref={ref}
      id={`caso-${c.id}`}
      aria-labelledby={titleId}
      data-tone={L.tone}
      data-surface={fog ? "wari" : undefined}
      className={`case-preview relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12 ${fog ? "case-fog font-wari" : ""}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHot(true)}
      onPointerLeave={() => setHot(false)}
    >
      {/* Copy */}
      <motion.div {...revealProps(reduce)} className={`relative z-[1] lg:col-span-5 ${L.flip ? "lg:order-2 lg:col-start-8" : ""}`}>
        <p className={`flex items-baseline gap-3 ${fog ? "text-[color:var(--wari-ink)]" : "text-ink"}`}>
          <span className={`font-mono text-[12px] tabular-nums ${fog ? "text-[color:var(--wari-action)]" : "text-accent"}`}>{c.n}</span>
          <span className={`text-[1.05rem] font-semibold tracking-[-0.01em] ${fog ? "font-wari-display" : "font-display"}`}>{c.name}</span>
        </p>
        <h3
          id={titleId}
          className={`mt-4 max-w-[18ch] text-balance text-[clamp(1.9rem,3.6vw,3.1rem)] font-semibold leading-[1.02] tracking-[-0.035em] ${
            fog ? "font-wari-display text-[color:var(--wari-ink)]" : "font-display text-ink"
          }`}
          style={fog ? undefined : { fontVariationSettings: '"opsz" 80' }}
        >
          {c.headline[locale]}
        </h3>
        <p className={`mt-5 max-w-[46ch] text-pretty text-[15.5px] leading-relaxed ${fog ? "text-[color:var(--wari-ink-2)]" : "text-muted"}`}>
          {c.lines[locale]}
        </p>
        <Link
          href={c.path}
          className={`group press-scale mt-8 inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-colors duration-150 ${
            fog
              ? "bg-[color:var(--wari-action)] text-[color:var(--wari-on-action)] hover:bg-[#1F3A69]"
              : "bg-accent text-on-accent hover:bg-accent-pressed"
          }`}
          aria-label={`${CASES_UI.cta[locale]}: ${c.name}`}
        >
          {CASES_UI.cta[locale]}
          <ArrowRight size={16} weight="bold" className="cta-arrow" aria-hidden="true" />
        </Link>
      </motion.div>

      {/* Visual: a real fragment of the case; the whole of it is also a way in (mouse only, the CTA is the keyboard stop) */}
      <motion.div className={`relative lg:col-span-7 ${L.flip ? "lg:order-1 lg:col-start-1" : ""}`} style={reduce ? undefined : { y: drift }}>
        <motion.div
          className={`case-visual relative w-full ${L.visual}`}
          initial={reduce ? false : { clipPath: "inset(7% 7% 7% 7% round 28px)", opacity: 0.4 }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 28px)", opacity: 1 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        >
          <Visual c={c} locale={locale} hot={hot} />
          <Link href={c.path} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-[2]" />
        </motion.div>
      </motion.div>
    </article>
  );
}

export function CaseReel() {
  const { locale } = useLocale();
  const reduce = useReducedMotionSafe();

  return (
    <section id="casos" data-scene="cases" className="case-reel relative isolate">
      <div className="mx-auto max-w-7xl px-5 pb-[var(--spacing-section)] pt-[calc(var(--spacing-section)*0.8)] sm:px-8">
        <motion.div {...revealProps(reduce)} className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2
            className="font-display text-balance text-[clamp(2.2rem,4.4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink lg:col-span-7"
            style={{ fontVariationSettings: '"opsz" 80' }}
          >
            {CASES_UI.heading[locale]}
          </h2>
          <p className="max-w-[46ch] text-pretty text-[15.5px] leading-relaxed text-muted lg:col-span-5">{CASES_UI.lead[locale]}</p>
        </motion.div>

        <div className="mt-16 space-y-24 lg:mt-24 lg:space-y-36">
          {CASES.map((c) => (
            <Preview key={c.id} c={c} locale={locale} reduce={reduce} />
          ))}
        </div>
      </div>
    </section>
  );
}
