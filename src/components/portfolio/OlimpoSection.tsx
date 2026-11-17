"use client";

import React, { useRef, useState } from "react";
import {motion, useScroll, useTransform} from "motion/react";
import { useLocale } from "@/lib/i18n-context";
import { OLIMPO, WARP } from "@/content/olimpo";
import { revealProps, usePointerDepth, useReducedMotionSafe } from "@/lib/motion";
import { ScaledStage } from "./olimpo/ScaledStage";
import { Firmamento } from "./olimpo/Firmamento";
import { SkyPhone } from "./olimpo/SkyPhone";
import { WarpDemo } from "./olimpo/WarpDemo";
import { WarpRoute } from "./olimpo/WarpRoute";

/**
 * #olimpo, case 02. A recreated Olimpo (desktop star map and phone sky, invented
 * data) layered in depth, the three ideas that hold it up, hard numbers, and
 * Warp as a playable chapter with the real portal shader.
 */

const f = (n: number) => n - Math.floor(n);
const SKY = Array.from({ length: 70 }, (_, i) => ({
  x: +(f(Math.sin(i * 12.9898) * 43758.5453) * 100).toFixed(2),
  y: +(f(Math.sin(i * 78.233) * 12543.113) * 100).toFixed(2),
  r: +(0.05 + f(Math.sin(i * 39.425) * 9871.37) * 0.11).toFixed(3),
  o: +(0.2 + f(Math.sin(i * 7.13) * 3141.59) * 0.5).toFixed(2),
}));

function Summit({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 32" className={className} aria-hidden="true">
      <path d="M18 2.5 L33.5 29.5 H2.5 Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M11 19.5 L18 13 L25 19.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function Phone({ locale, className }: { locale: "en" | "es"; className?: string }) {
  return (
    <div className={`olimpo-phone ${className ?? ""}`}>
      <ScaledStage width={390} height={844} className="rounded-[1.6rem]" label={OLIMPO.views.phone[locale]}>
        <SkyPhone locale={locale} />
      </ScaledStage>
    </div>
  );
}

function Window({ locale }: { locale: "en" | "es" }) {
  return (
    <div className="olimpo-window overflow-hidden rounded-[20px]">
      <div className="flex h-8 items-center gap-1.5 border-b border-white/[0.06] bg-[#0B0D1E] px-3.5" aria-hidden="true">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      </div>
      <ScaledStage width={1200} height={740} label={OLIMPO.views.desktop[locale]}>
        <Firmamento locale={locale} />
      </ScaledStage>
    </div>
  );
}

export function OlimpoSection() {
  const { locale } = useLocale();
  const reduce = useReducedMotionSafe();
  const [view, setView] = useState<"phone" | "desktop">("phone");
  const showcaseRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: showcaseRef, offset: ["start end", "end start"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [70, -50]);
  const windowY = useTransform(scrollYProgress, [0, 1], [24, -16]);
  /* Desktop only: the layered composition leans toward a fine pointer. */
  const depth = usePointerDepth(1.6);

  return (
    <section id="olimpo" data-scene="olimpo" className="olimpo-section relative isolate overflow-clip">
      {/* Deep sky backdrop: nebula, stars and grain (static layers, nothing fixed) */}
      <div aria-hidden="true" className="olimpo-nebula pointer-events-none absolute inset-0 -z-10" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {SKY.map((st, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-[#ECEDF0]"
            style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.r * 16, height: st.r * 16, opacity: st.o }}
          />
        ))}
      </div>
      <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto max-w-7xl px-5 pb-[var(--spacing-section)] pt-[calc(var(--spacing-section)*0.9)] sm:px-8">
        {/* Header */}
        <motion.div {...revealProps(reduce)} className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent">{OLIMPO.eyebrow[locale]}</p>
            <h2 className="mt-5 flex items-center gap-4 font-display text-[clamp(3.6rem,10vw,8.5rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-ink" style={{ fontVariationSettings: '"opsz" 96' }}>
              <Summit className="size-[0.62em] shrink-0 text-accent" />
              {OLIMPO.title[locale]}
            </h2>
            <p className="mt-5 font-display text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold leading-tight tracking-[-0.03em] text-ink/90">
              {OLIMPO.tagline[locale]}
            </p>
          </div>
          <p className="max-w-[48ch] text-pretty text-[16px] leading-relaxed text-muted lg:col-span-5">{OLIMPO.lead[locale]}</p>
        </motion.div>

        {/* Showcase */}
        <div ref={showcaseRef} className="mt-14 lg:mt-20">
          {/* Narrow: a segmented control picks the view */}
          <div role="radiogroup" aria-label={OLIMPO.views.label[locale]} className="mx-auto mb-6 flex w-full max-w-sm rounded-full border border-line bg-surface/70 p-1 lg:hidden">
            {(["phone", "desktop"] as const).map((v) => {
              const on = view === v;
              return (
                <button
                  key={v}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setView(v)}
                  className={`press-scale h-10 flex-1 rounded-full px-3 text-[13px] font-medium transition-colors duration-150 ${
                    on ? "bg-ink text-bg" : "text-muted"
                  }`}
                >
                  {v === "phone" ? (locale === "es" ? "Móvil" : "Phone") : locale === "es" ? "Escritorio" : "Desktop"}
                </button>
              );
            })}
          </div>

          <div className="lg:hidden">
            {view === "phone" ? (
              <div className="mx-auto w-[min(78%,20rem)]">
                <Phone locale={locale} />
                <p className="mt-4 text-center font-mono text-[11.5px] text-muted">{OLIMPO.views.phone[locale]}</p>
              </div>
            ) : (
              <div>
                <Window locale={locale} />
                <p className="mt-4 text-center font-mono text-[11.5px] text-muted">{OLIMPO.views.desktop[locale]}</p>
              </div>
            )}
          </div>

          {/* Wide: both, layered in depth */}
          <div className="relative hidden pb-16 lg:block" {...depth.handlers}>
            <motion.div style={depth.enabled ? { transform: depth.transform } : undefined} className="relative">
              <motion.div style={reduce ? undefined : { y: windowY }} className="w-[86%]">
                <Window locale={locale} />
              </motion.div>
              <motion.div
                style={reduce ? undefined : { y: phoneY }}
                className="absolute -bottom-16 right-0 w-[23%]"
              >
                <motion.div style={depth.enabled ? { transform: depth.parallaxTransform } : undefined}>
                  <Phone locale={locale} className="rotate-[3deg]" />
                </motion.div>
              </motion.div>
            </motion.div>
            <p className="absolute bottom-0 left-0 font-mono text-[11.5px] text-muted">
              {OLIMPO.views.desktop[locale]} <span className="text-ink/30">/</span> {OLIMPO.views.phone[locale]}
            </p>
          </div>
          <p className="mt-3 text-center font-mono text-[11.5px] text-muted/80 lg:mt-4 lg:text-left">{OLIMPO.recreation[locale]}</p>
        </div>

        {/* Metaphor + pillars */}
        <motion.p
          {...revealProps(reduce)}
          className="mt-20 max-w-[36ch] text-balance font-display text-[clamp(1.45rem,2.6vw,2.2rem)] font-semibold leading-[1.2] tracking-[-0.025em] text-ink lg:mt-28"
        >
          {OLIMPO.metaphor[locale]}
        </motion.p>

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-line">
          {OLIMPO.pillars.map((p, i) => (
            <motion.li key={p.n} {...revealProps(reduce, i * 0.06)} className="border-t border-line pt-6 md:px-8 md:first:pl-0 md:last:pr-0">
              <p className="font-olimpo text-[2.4rem] leading-none text-accent">{p.n}</p>
              <h3 className="mt-5 font-display text-[1.35rem] font-semibold leading-tight tracking-[-0.02em] text-ink">{p.title[locale]}</h3>
              <p className="mt-3 text-pretty text-[15px] leading-relaxed text-muted">{p.body[locale]}</p>
            </motion.li>
          ))}
        </ol>

        {/* Hard numbers */}
        <dl className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-line bg-line lg:grid-cols-4">
          {OLIMPO.facts.map((fact) => (
            <div key={fact.value} className="bg-bg/90 px-5 py-6 sm:px-7 sm:py-8">
              <dt className="font-display text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-none tracking-[-0.035em] tabular-nums text-ink">
                {locale === "es" && fact.preEs && (
                  <span className="mb-1.5 block font-sans text-[12.5px] font-normal tracking-normal text-muted">{fact.preEs}</span>
                )}
                {locale === "es" && fact.valueEs ? fact.valueEs : fact.value}
              </dt>
              <dd className="mt-3 text-[13.5px] leading-snug text-muted">{fact.label[locale]}</dd>
            </div>
          ))}
        </dl>

        {/* Warp: the flagship inside Olimpo */}
        <div id="warp" className="mt-28 scroll-mt-20 border-t border-line pt-20 lg:mt-36 lg:pt-28">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
            <motion.div {...revealProps(reduce)} className="lg:col-span-7">
              <h3 className="font-display text-[clamp(3.2rem,8vw,6.5rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-ink" style={{ fontVariationSettings: '"opsz" 96' }}>
                {WARP.title[locale]}
              </h3>
              <p className="mt-5 max-w-[30ch] text-balance font-display text-[clamp(1.35rem,2.4vw,1.9rem)] font-semibold leading-snug tracking-[-0.025em] text-ink/90">
                {WARP.tagline[locale]}
              </p>
            </motion.div>
            <motion.p {...revealProps(reduce, 0.05)} className="max-w-[50ch] text-pretty text-[15.5px] leading-relaxed text-muted lg:col-span-5">
              {WARP.body[locale]}
            </motion.p>
          </div>

          <div className="mt-14 pb-10 lg:mt-20">
            <WarpRoute locale={locale} />
          </div>

          <motion.div {...revealProps(reduce)} className="mt-6">
            <WarpDemo locale={locale} />
          </motion.div>

          <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-2 lg:gap-16">
            <motion.div {...revealProps(reduce)}>
              <ul className="space-y-4">
                {WARP.keys.map((s) => (
                  <li key={s.k.join("+")} className="grid gap-2 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-center sm:gap-4">
                    <span className="flex items-center gap-1">
                      {s.k.map((k, i) => (
                        <React.Fragment key={k}>
                          {i > 0 && <span className="text-muted/70">+</span>}
                          <kbd className="keycap">{locale === "es" && k === "Space" ? "Espacio" : k}</kbd>
                        </React.Fragment>
                      ))}
                    </span>
                    <span className="text-pretty text-[14.5px] leading-snug text-muted">{s.label[locale]}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 max-w-[56ch] text-[13.5px] leading-relaxed text-muted/90">{WARP.keysNote[locale]}</p>
            </motion.div>
            <motion.div {...revealProps(reduce, 0.06)} className="lg:border-l lg:border-line lg:pl-16">
              <p className="font-display text-[1.45rem] font-semibold leading-tight tracking-[-0.02em] text-ink">{WARP.cast.title[locale]}</p>
              <p className="mt-3 max-w-[52ch] text-pretty text-[15px] leading-relaxed text-muted">{WARP.cast.body[locale]}</p>
              <p className="mt-6 max-w-[52ch] border-l border-accent/50 pl-4 text-[13.5px] leading-relaxed text-muted">{WARP.shaderNote[locale]}</p>
            </motion.div>
          </div>
        </div>

        <ul className="mt-16 flex flex-wrap gap-1.5" aria-label="Stack">
          {OLIMPO.stack.map((item) => (
            <li key={item} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11.5px] leading-none text-ink/80">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
