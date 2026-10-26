"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { useLocale } from "@/lib/i18n-context";
import { KRAKOUNT_PAGE } from "@/content/krakount-data";
import { EASE_OUT } from "@/lib/motion";

export function KrakountMetricsStrip() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();

  return (
    <div className="border-y border-[#26272F]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-2 lg:grid-cols-4">
          {KRAKOUNT_PAGE.stats.map((stat, idx) => (
            <div
              key={idx}
              className={`flex flex-col gap-4 py-10 pr-6 lg:py-12 ${
                idx % 2 === 1 ? "border-l border-[#26272F] pl-6" : ""
              } ${idx >= 2 ? "border-t border-[#26272F] lg:border-t-0" : ""} ${
                idx === 2 ? "lg:border-l lg:pl-6" : ""
              }`}
            >
              <dt className="order-2 max-w-[30ch] text-[13px] leading-relaxed text-[#8B8D98]">{stat.label[locale]}</dt>
              <dd className="order-1 overflow-hidden">
                <motion.span
                  className="block text-[clamp(2.25rem,4vw,3.25rem)] font-extrabold leading-none tracking-[-0.04em] text-[#EDEDEF] tabular-nums"
                  initial={{ opacity: reduce ? 0 : 1, transform: reduce ? "none" : "translateY(100%)" }}
                  whileInView={{ opacity: 1, transform: "translateY(0%)" }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.07 * idx }}
                >
                  {stat.value}
                </motion.span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
