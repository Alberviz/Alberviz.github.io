"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import type { Locale } from "@/lib/i18n-context";
import { PIPE_DETAILS, PIPE_STAGES, PIPE_UI, VRAM } from "@/content/laura";
import { Detail as Fold } from "../Detail";
import { EASE_OUT, revealProps } from "@/lib/motion";

/**
 * How she works inside, in two layers. Up front: four stages joined by a line that
 * the scroll fills, and what I measured (the proof). Behind one tap, open on a wide
 * screen: the small decisions that make it feel instant, each with a tiny diagram
 * (the prefill bars, the model loading while I speak, sentences streaming, shortcuts
 * that skip the model, barge-in), the latency and the VRAM budget.
 */

const clamp = (x: number) => Math.min(1, Math.max(0, x));

function Stage({
  stage,
  i,
  progress,
  locale,
  reduce,
}: {
  stage: (typeof PIPE_STAGES)[number];
  i: number;
  progress: MotionValue<number>;
  locale: Locale;
  reduce: boolean | null;
}) {
  const at = i * 0.24;
  const t = useTransform(progress, (v) => clamp((v - at) / 0.2));
  const opacity = useTransform(t, (x) => 0.35 + 0.65 * x);
  const lift = useTransform(t, (x) => `translateY(${((1 - x) * 12).toFixed(2)}px)`);
  const on = useTransform(t, (x) => (x > 0.6 ? 1 : 0));
  return (
    <motion.li style={reduce ? undefined : { opacity, transform: lift }} className="relative pl-16 lg:pl-0 lg:pr-8">
      <span className="absolute left-0 top-0 grid size-11 place-items-center rounded-full border border-line bg-bg font-mono text-[12px] text-muted lg:relative" aria-hidden="true">
        <motion.span style={reduce ? { opacity: 1 } : { opacity: on }} className="absolute inset-0 rounded-full border border-accent bg-accent/10" />
        <span className="relative">{stage.n}</span>
      </span>
      <h4 className="mt-0 font-display text-[1.7rem] font-semibold leading-none tracking-[-0.03em] text-ink lg:mt-6" style={{ fontVariationSettings: '"opsz" 60' }}>
        {stage.name[locale]}
      </h4>
      <p className="mt-2.5 font-mono text-[11.5px] leading-snug text-accent">{stage.tech}</p>
      <p className="mt-3 max-w-[38ch] text-pretty text-[14.5px] leading-relaxed text-muted">{stage.body[locale]}</p>
    </motion.li>
  );
}

function Bar({ w, delay, tone, reduce, label }: { w: string; delay: number; tone: "hot" | "dim" | "mute"; reduce: boolean | null; label: string }) {
  return (
    <motion.div
      className={`h-full rounded-full ${tone === "hot" ? "bg-accent" : tone === "dim" ? "bg-accent/45" : "bg-white/20"}`}
      style={{ width: w, transformOrigin: "left" }}
      initial={{ transform: reduce ? "scaleX(1)" : "scaleX(0)" }}
      whileInView={{ transform: "scaleX(1)" }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
      role="img"
      aria-label={label}
    />
  );
}

function Trick({ title, body, className, children, reduce, delay = 0 }: { title: string; body: string; className: string; children: React.ReactNode; reduce: boolean | null; delay?: number }) {
  return (
    <motion.div {...revealProps(reduce, delay)} className={`laura-group pt-6 ${className}`}>
      <h4 className="font-display text-[1.3rem] font-semibold leading-tight tracking-[-0.02em] text-ink">{title}</h4>
      <p className="mt-2.5 max-w-[52ch] text-pretty text-[14.5px] leading-relaxed text-muted">{body}</p>
      <div className="mt-6">{children}</div>
    </motion.div>
  );
}

export function Pipeline({ locale, reduce }: { locale: Locale; reduce: boolean | null }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 80%", "end 55%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const D = PIPE_DETAILS;

  const sentences = [
    { w: "20%", l: "0%" },
    { w: "24%", l: "20%" },
    { w: "22%", l: "44%" },
  ];

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <motion.h3
          {...revealProps(reduce)}
          className="font-display text-balance text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink lg:col-span-7"
          style={{ fontVariationSettings: '"opsz" 80' }}
        >
          {PIPE_UI.heading[locale]}
        </motion.h3>
        <motion.p {...revealProps(reduce, 0.05)} className="max-w-[46ch] text-pretty text-[15.5px] leading-relaxed text-muted lg:col-span-5">
          {PIPE_UI.lead[locale]}
        </motion.p>
      </div>

      {/* The four stages */}
      <div ref={trackRef} className="relative mt-14 lg:mt-20">
        <div aria-hidden="true" className="absolute bottom-3 left-[21px] top-3 w-px bg-line lg:hidden">
          <motion.div className="h-full w-full origin-top bg-accent" style={reduce ? undefined : { scaleY: fill }} />
        </div>
        <div aria-hidden="true" className="absolute left-0 right-0 top-[21px] hidden h-px bg-line lg:block">
          <motion.div className="h-full w-full origin-left bg-accent" style={reduce ? undefined : { scaleX: fill }} />
        </div>
        <ol className="relative grid gap-12 lg:grid-cols-4 lg:gap-0">
          {PIPE_STAGES.map((s, i) => (
            <Stage key={s.n} stage={s} i={i} progress={scrollYProgress} locale={locale} reduce={reduce} />
          ))}
        </ol>
      </div>

      {/* What I measured: the proof, up front */}
      <motion.div {...revealProps(reduce)} className="mt-12 grid gap-8 border-t border-line pt-8 lg:mt-16 lg:grid-cols-12 lg:gap-12 lg:pt-10">
        <div className="lg:col-span-7">
          <h4 className="font-display text-[1.3rem] font-semibold leading-tight tracking-[-0.02em] text-ink">{D.eval.title[locale]}</h4>
          <p className="mt-2.5 max-w-[56ch] text-pretty text-[14.5px] leading-relaxed text-muted">{D.eval.body[locale]}</p>
        </div>
        <dl className="grid grid-cols-3 gap-4 lg:col-span-5">
          {[
            { v: "81%", l: locale === "es" ? "herramienta" : "tool" },
            { v: "93%", l: locale === "es" ? "argumentos" : "arguments" },
            { v: "0 / 18", l: locale === "es" ? "falsos disparos" : "false triggers" },
          ].map((x) => (
            <div key={x.v}>
              <dt className="font-display text-[1.9rem] font-semibold leading-none tracking-[-0.035em] tabular-nums text-ink">{x.v}</dt>
              <dd className="mt-2 text-[12.5px] text-muted">{x.l}</dd>
            </div>
          ))}
        </dl>
      </motion.div>

      {/* The details that make it fast: behind one tap */}
      <Fold className="mt-10 lg:mt-14" label={PIPE_UI.detailOpen[locale]} closeLabel={PIPE_UI.detailClose[locale]}>
        <p className="font-mono text-[12px] tabular-nums text-muted">{PIPE_UI.latency[locale]}</p>
        <h4 className="mt-8 font-display text-[1.6rem] font-semibold tracking-[-0.025em] text-ink">{PIPE_UI.details[locale]}</h4>
        <div className="mt-8 grid gap-x-12 gap-y-12 lg:grid-cols-12 lg:gap-y-14">
        {/* Stable prefix */}
        <Trick className="lg:col-span-7" reduce={reduce} title={D.cache.title[locale]} body={D.cache.body[locale]}>
          <div className="space-y-5">
            <div>
              <div className="flex items-baseline justify-between font-mono text-[11.5px] text-muted">
                <span>{D.cache.withCache[locale]}</span>
                <span className="tabular-nums text-ink">{locale === "es" ? "0,05 s" : "0.05 s"} <span className="text-muted">{D.cache.prefill[locale]}</span></span>
              </div>
              <div className="mt-2 h-2.5 rounded-full bg-white/[0.05]">
                <Bar w="3%" delay={0.1} tone="hot" reduce={reduce} label={locale === "es" ? "0,05 s" : "0.05 s"} />
              </div>
            </div>
            <div>
              <div className="flex items-baseline justify-between font-mono text-[11.5px] text-muted">
                <span>{D.cache.without[locale]}</span>
                <span className="tabular-nums text-ink">{locale === "es" ? "2,98 s" : "2.98 s"} <span className="text-muted">{D.cache.prefill[locale]}</span></span>
              </div>
              <div className="mt-2 h-2.5 rounded-full bg-white/[0.05]">
                <Bar w="100%" delay={0.25} tone="mute" reduce={reduce} label={locale === "es" ? "2,98 s" : "2.98 s"} />
              </div>
            </div>
          </div>
        </Trick>

        {/* Sentence by sentence */}
        <Trick className="lg:col-span-5" reduce={reduce} delay={0.05} title={D.streaming.title[locale]} body={D.streaming.body[locale]}>
          <div className="space-y-3 font-mono text-[10.5px] text-muted" aria-hidden="true">
            {[
              { name: locale === "es" ? "el modelo escribe" : "model writes", shift: 0, tone: "dim" as const },
              { name: locale === "es" ? "Kokoro habla" : "Kokoro speaks", shift: 22, tone: "hot" as const },
            ].map((row, ri) => (
              <div key={row.name}>
                <span>{row.name}</span>
                <div className="relative mt-1.5 h-3">
                  {sentences.map((s, si) => (
                    <motion.span
                      key={si}
                      className={`absolute top-0 h-full rounded-full ${row.tone === "hot" ? "bg-accent" : "bg-accent/40"}`}
                      style={{ left: `${parseFloat(s.l) + row.shift}%`, width: `calc(${s.w} - 4px)`, transformOrigin: "left" }}
                      initial={{ transform: reduce ? "scaleX(1)" : "scaleX(0)" }}
                      whileInView={{ transform: "scaleX(1)" }}
                      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                      transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.15 + si * 0.22 + ri * 0.3 }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Trick>

        {/* Warm up while I talk */}
        <Trick className="lg:col-span-5" reduce={reduce} title={D.warm.title[locale]} body={D.warm.body[locale]}>
          <div className="space-y-3 font-mono text-[10.5px] text-muted" aria-hidden="true">
            {[
              { name: D.warm.me[locale], l: "0%", w: "46%", tone: "mute" as const, d: 0.1 },
              { name: D.warm.model[locale], l: "6%", w: "34%", tone: "dim" as const, d: 0.3 },
              { name: D.warm.answer[locale], l: "48%", w: "30%", tone: "hot" as const, d: 0.6 },
            ].map((r) => (
              <div key={r.name}>
                <span>{r.name}</span>
                <div className="relative mt-1.5 h-3">
                  <motion.span
                    className={`absolute top-0 h-full rounded-full ${r.tone === "hot" ? "bg-accent" : r.tone === "dim" ? "bg-accent/40" : "bg-white/20"}`}
                    style={{ left: r.l, width: r.w, transformOrigin: "left" }}
                    initial={{ transform: reduce ? "scaleX(1)" : "scaleX(0)" }}
                    whileInView={{ transform: "scaleX(1)" }}
                    viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                    transition={{ duration: 0.6, ease: EASE_OUT, delay: r.d }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Trick>

        {/* Shortcuts */}
        <Trick className="lg:col-span-7" reduce={reduce} delay={0.05} title={D.shortcuts.title[locale]} body={D.shortcuts.body[locale]}>
          <ul className="flex flex-wrap gap-2" aria-label={D.shortcuts.note[locale]}>
            {D.shortcuts.samples.map((s) => (
              <li key={s.en} className="inline-flex items-center gap-2 rounded-full border border-line py-1.5 pl-3.5 pr-1.5 text-[13px] text-ink">
                {locale === "es" ? `«${s.es}»` : `“${s.en}”`}
                <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-[10.5px] text-accent">{D.shortcuts.note[locale]}</span>
              </li>
            ))}
          </ul>
        </Trick>

        {/* Barge-in */}
        <Trick className="lg:col-span-6" reduce={reduce} title={D.bargein.title[locale]} body={D.bargein.body[locale]}>
          <div aria-hidden="true">
            <div className="relative flex h-[56px] items-center gap-[3px]">
              {Array.from({ length: 36 }, (_, i) => {
                const h = 0.3 + 0.7 * Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.37));
                const cut = i >= 22;
                return (
                  <motion.span
                    key={i}
                    className={`flex-1 rounded-full ${cut ? "bg-white/15" : "bg-accent/80"}`}
                    style={{ height: `${(cut ? Math.max(0.14, h * 0.25) : h) * 100}%`, transformOrigin: "center" }}
                    initial={{ transform: reduce ? "scaleY(1)" : "scaleY(0.1)" }}
                    whileInView={{ transform: "scaleY(1)" }}
                    viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                    transition={{ duration: 0.45, ease: EASE_OUT, delay: i * 0.018 }}
                  />
                );
              })}
              <span className="absolute inset-y-[-6px] w-px bg-accent" style={{ left: `${(22 / 36) * 100}%` }} />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[10.5px] text-muted">
              <span>{D.bargein.her[locale]}</span>
              <span className="text-accent">{D.bargein.me[locale]}</span>
            </div>
          </div>
        </Trick>


        </div>
        <div className="mt-12 lg:mt-14">
          <div>
            <p className="font-mono text-[11px] text-muted">{PIPE_UI.vram[locale]}</p>
            <div className="mt-2.5 flex h-3 overflow-hidden rounded-full bg-white/[0.05]" role="img" aria-label={VRAM.map((s) => `${s.label[locale]} ${s.gb} GB`).join(", ")}>
              {VRAM.map((s, i) => (
                <motion.span
                  key={s.id}
                  className={`h-full ${i === 0 ? "bg-accent" : i === 1 ? "bg-accent/55" : "bg-white/15"}`}
                  style={{ width: `${(s.gb / 6) * 100}%`, transformOrigin: "left" }}
                  initial={{ transform: reduce ? "scaleX(1)" : "scaleX(0)" }}
                  whileInView={{ transform: "scaleX(1)" }}
                  viewport={{ once: true, margin: "0px 0px -60px 0px" }}
                  transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.1 + i * 0.12 }}
                />
              ))}
            </div>
            <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-[10.5px] text-muted">
              {VRAM.map((s, i) => (
                <li key={s.id} className="flex items-center gap-1.5">
                  <span aria-hidden="true" className={`size-1.5 rounded-full ${i === 0 ? "bg-accent" : i === 1 ? "bg-accent/55" : "bg-white/25"}`} />
                  {s.label[locale]} <span className="tabular-nums text-ink/80">{locale === "es" ? String(s.gb).replace(".", ",") : s.gb} GB</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Fold>
    </div>
  );
}
