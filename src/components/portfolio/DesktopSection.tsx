"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, GithubLogo, Keyboard, Mouse } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { DESKTOP_UI, HARDWARE } from "@/content/desktop";
import { revealProps } from "@/lib/motion";
import { DesktopExplorer } from "./desktop/DesktopExplorer";

const ICONS: Record<string, typeof Mouse> = { mchose: Mouse, akko: Keyboard };
const GTS2_URL = "https://github.com/Alberviz/gts2-mando";

/**
 * #escritorio: the real Linux desktop. An interactive explorer over a live
 * WebGL recreation, then a row of hardware pieces with one technical fact each.
 */
export function DesktopSection() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();

  return (
    <section id="escritorio" data-scene="desktop" className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-[var(--spacing-section)] sm:px-8">
        <motion.div {...revealProps(reduce)} className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2
            className="font-display text-balance text-[clamp(2.2rem,4.4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink lg:col-span-7"
            style={{ fontVariationSettings: '"opsz" 80' }}
          >
            {DESKTOP_UI.heading[locale]}
          </h2>
          <p className="max-w-[46ch] text-pretty text-[15.5px] leading-relaxed text-muted lg:col-span-5">
            {DESKTOP_UI.lead[locale]}
          </p>
        </motion.div>

        <div className="mt-14 lg:mt-20">
          <DesktopExplorer />
        </div>

        {/* Hardware row */}
        <div className="mt-24 lg:mt-32">
          <motion.h3
            {...revealProps(reduce)}
            className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-semibold leading-tight tracking-[-0.03em] text-ink"
          >
            {DESKTOP_UI.hardwareHeading[locale]}
          </motion.h3>

          <ul className="no-scrollbar -mx-5 mt-8 flex scroll-px-5 snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:scroll-px-8 sm:px-8 md:mx-0 md:grid md:grid-cols-2 md:gap-0 md:overflow-visible md:px-0 md:pb-0">
            {HARDWARE.map((piece, i) => {
              const Icon = ICONS[piece.id] ?? Mouse;
              return (
                <motion.li
                  key={piece.id}
                  {...revealProps(reduce, i * 0.06)}
                  className="flex w-[82%] shrink-0 snap-start flex-col border-t border-line pt-6 sm:w-[56%] md:w-auto md:shrink md:pr-10 md:[&:not(:first-child)]:pl-10 md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-line"
                >
                  <div className="flex items-center gap-3 text-muted">
                    <Icon size={20} weight="regular" aria-hidden="true" />
                    <p className="font-mono text-[11.5px]">{piece.kind[locale]}</p>
                  </div>
                  <p className="mt-4 font-display text-[1.35rem] font-semibold leading-tight tracking-[-0.02em] text-ink">
                    {piece.name}
                  </p>
                  <p className="mt-6 font-display text-[clamp(2.2rem,3.4vw,2.9rem)] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink">
                    {piece.value}
                  </p>
                  <p className="mt-3 max-w-[34ch] text-[13.5px] leading-relaxed text-muted">{piece.label[locale]}</p>
                  {piece.link && (
                    <a
                      href={piece.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group press-scale mt-5 inline-flex items-center gap-2 self-start text-[13.5px] font-medium text-accent"
                    >
                      <GithubLogo size={15} aria-hidden="true" />
                      <span className="link-rule">{piece.link.label[locale]}</span>
                      <ArrowUpRight size={12} className="cta-arrow cta-arrow-diag" aria-hidden="true" />
                    </a>
                  )}
                </motion.li>
              );
            })}
          </ul>
          <p className="mt-8 max-w-[70ch] text-[14px] leading-relaxed text-muted">
            <a href={GTS2_URL} target="_blank" rel="noopener noreferrer" className="link-rule text-ink/90">
              gts2-mando
            </a>
            {locale === "es" ? " también está ahí: " : " is in there too: "}
            {DESKTOP_UI.hardwareNote[locale]}
          </p>
        </div>
      </div>
    </section>
  );
}
