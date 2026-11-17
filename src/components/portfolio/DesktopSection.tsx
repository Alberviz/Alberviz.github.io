"use client";

import React from "react";
import {motion} from "motion/react";
import { useLocale } from "@/lib/i18n-context";
import { DESKTOP_UI } from "@/content/desktop";
import { revealProps, useReducedMotionSafe } from "@/lib/motion";
import { DesktopExplorer } from "./desktop/DesktopExplorer";
import { HardwareStory } from "./desktop/HardwareStory";


/**
 * #escritorio: the real Linux desktop. An interactive explorer over a live
 * WebGL recreation, then the reverse-engineering story of the peripherals.
 */
export function DesktopSection() {
  const { locale } = useLocale();
  const reduce = useReducedMotionSafe();

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

        <HardwareStory />
      </div>
    </section>
  );
}
