"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, FilePdf, GithubLogo } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { LAB, LAB_NAMES_ES, MENTIONS, MYCROHNIE, WORK_UI } from "@/content/projects";
import type { ExternalLink } from "@/content/types";
import { revealProps } from "@/lib/motion";

function LinkIcon({ kind }: { kind: ExternalLink["kind"] }) {
  if (kind === "github") return <GithubLogo size={15} aria-hidden="true" />;
  if (kind === "pdf") return <FilePdf size={15} aria-hidden="true" />;
  return null;
}

function Pill({ link, locale, primary }: { link: ExternalLink; locale: "en" | "es"; primary?: boolean }) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group press-scale inline-flex h-11 items-center gap-2 rounded-full px-4 text-[14px] font-medium transition-colors duration-150 ${
        primary
          ? "bg-accent font-semibold text-on-accent hover:bg-accent-pressed"
          : "border border-ink/25 text-ink hover:border-ink/50"
      }`}
    >
      <LinkIcon kind={link.kind} />
      {link.label[locale]}
      {link.kind === "live" && <ArrowUpRight size={13} className="cta-arrow cta-arrow-diag" aria-hidden="true" />}
    </a>
  );
}

/**
 * #proyectos: notable work told as a story (MyCrohnie, through its hackathon),
 * then a compact lab of small real projects, then one line for prototypes.
 */
export function ProjectsSection() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const M = MYCROHNIE;

  return (
    <section id="proyectos" data-scene="work" className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-[var(--spacing-section)] sm:px-8">
        <motion.div {...revealProps(reduce)} className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2
            className="font-display text-balance text-[clamp(2.2rem,4.4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink lg:col-span-7"
            style={{ fontVariationSettings: '"opsz" 80' }}
          >
            {WORK_UI.heading[locale]}
          </h2>
          <p className="max-w-[46ch] text-pretty text-[15.5px] leading-relaxed text-muted lg:col-span-5">{WORK_UI.lead[locale]}</p>
        </motion.div>

        {/* Featured: the hackathon */}
        <motion.article
          {...revealProps(reduce, 0.04)}
          className="hack-card relative mt-14 overflow-hidden rounded-[28px] border border-line lg:mt-20"
        >
          <div aria-hidden="true" className="hack-glow pointer-events-none absolute inset-0" />
          <div className="relative grid gap-8 p-5 sm:p-8 lg:grid-cols-2 lg:items-center lg:gap-12 lg:p-12">
            <div>
              <div className="overflow-hidden rounded-[18px] border border-line bg-surface shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={M.media.src}
                  width={M.media.width}
                  height={M.media.height}
                  alt={M.media.alt[locale]}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full"
                />
              </div>
              <p className="mt-4 font-display text-[1.6rem] font-semibold tracking-[-0.03em] text-ink">{M.name}</p>
            </div>
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-accent">{M.eyebrow[locale]}</p>
              <h3
                className="mt-4 font-display text-[clamp(2.3rem,4.6vw,3.8rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-ink"
                style={{ fontVariationSettings: '"opsz" 96' }}
              >
                {M.title[locale]}
              </h3>
              <p className="mt-5 max-w-[46ch] text-pretty text-[15.5px] leading-relaxed text-muted">{M.lead[locale]}</p>

              {/* 24 hours, three marks */}
              <ol className="relative mt-8 grid grid-cols-3 gap-3">
                <span aria-hidden="true" className="absolute left-[6px] right-[calc(33%-6px)] top-[5px] h-px bg-gradient-to-r from-accent via-accent/60 to-accent" />
                {M.timeline.map((step) => (
                  <li key={step.t.en} className="relative pt-6">
                    <span aria-hidden="true" className="absolute left-0 top-0 h-[11px] w-[11px] rounded-full border-2 border-accent bg-bg" />
                    <p className="font-mono text-[12px] tabular-nums text-ink">{step.t[locale]}</p>
                    <p className="mt-1 text-[12.5px] leading-snug text-muted">{step.label[locale]}</p>
                  </li>
                ))}
              </ol>

              <dl className="mt-8 grid gap-4 sm:grid-cols-3">
                {M.points.map((pt) => (
                  <div key={pt.value.en} className="border-t border-line pt-3">
                    <dt className="font-display text-[1.15rem] font-semibold tracking-[-0.02em] text-ink">{pt.value[locale]}</dt>
                    <dd className="mt-1 text-[13px] leading-snug text-muted">{pt.label[locale]}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-7 flex flex-wrap items-center gap-2">
                {M.links.map((link, i) => (
                  <Pill key={link.href} link={link} locale={locale} primary={i === 0} />
                ))}
              </div>
              <p className="mt-4 font-mono text-[11.5px] text-muted">{M.stack.join(" · ")}</p>
            </div>
          </div>
        </motion.article>

        {/* Lab */}
        <div className="mt-20 lg:mt-28">
          <motion.div {...revealProps(reduce)} className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="font-display text-[clamp(1.6rem,2.8vw,2.3rem)] font-semibold tracking-[-0.03em] text-ink">
              {WORK_UI.labHeading[locale]}
            </h3>
            <p className="text-[14px] text-muted">{WORK_UI.labLead[locale]}</p>
          </motion.div>
          <ul className="mt-6 grid border-t border-line md:grid-cols-3 md:divide-x md:divide-line">
            {LAB.map((p, i) => (
              <motion.li
                key={p.id}
                {...revealProps(reduce, i * 0.05)}
                className="flex flex-col border-b border-line py-7 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <p className="font-display text-[1.45rem] font-semibold tracking-[-0.025em] text-ink">
                    {locale === "es" && LAB_NAMES_ES[p.id] ? LAB_NAMES_ES[p.id] : p.name}
                  </p>
                  <p className="font-mono text-[11.5px] tabular-nums text-muted">{p.year}</p>
                </div>
                <p className="mt-3 text-pretty text-[14.5px] leading-relaxed text-muted md:min-h-[4.8rem]">{p.line[locale]}</p>
                <p className="mt-5 flex items-baseline gap-2.5">
                  <span className="font-display text-[1.6rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink">
                    {locale === "es" && p.plate.valueEs ? p.plate.valueEs : p.plate.value}
                  </span>
                  <span className="text-[12.5px] leading-snug text-muted">{p.plate.label[locale]}</span>
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                  {p.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex min-h-10 items-center gap-1.5 text-[14px] font-medium text-accent"
                    >
                      <span className="link-rule">{link.label[locale]}</span>
                      <ArrowUpRight size={13} className="cta-arrow cta-arrow-diag" aria-hidden="true" />
                    </a>
                  ))}
                  {p.note && <p className="font-mono text-[11.5px] text-muted">{p.note[locale]}</p>}
                </div>
              </motion.li>
            ))}
          </ul>
          <p className="mt-8 text-[14px] text-muted">{MENTIONS[locale]}</p>
        </div>
      </div>
    </section>
  );
}
