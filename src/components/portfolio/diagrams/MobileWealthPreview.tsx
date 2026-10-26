"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Fingerprint } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { EASE_OUT } from "@/lib/motion";

// Illustrative curve only: the real app never publishes figures.
const LINE =
  "M0 44 C 18 42, 26 36, 40 37 S 62 30, 76 31 S 98 22, 112 25 S 136 16, 150 17 S 176 9, 200 6";
const AREA = `${LINE} L 200 56 L 0 56 Z`;

const ALLOCATION = [
  { key: "invest", width: "58%", className: "bg-[#10B981]", label: { en: "Investments", es: "Inversión" } },
  { key: "business", width: "24%", className: "bg-[#10B981]/45", label: { en: "Business", es: "Negocio" } },
  { key: "cash", width: "18%", className: "bg-[#8E95A5]/45", label: { en: "Cash", es: "Liquidez" } },
] as const;

export function MobileWealthPreview() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();

  return (
    <span
      aria-hidden
      className="mt-3.5 block rounded-xl border border-[#232732] bg-[#090A0D] p-3"
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-[#8E95A5]">
          {locale === "en" ? "Net worth" : "Patrimonio neto"}
        </span>
        <span className="flex items-center gap-1.5">
          <Fingerprint size={13} className="text-[#8E95A5]" />
          <span className="rounded-full border border-[#232732] px-1.5 py-px font-mono text-[9.5px] tabular-nums text-[#8E95A5]">
            HTTP 403 {locale === "en" ? "read-only" : "solo lectura"}
          </span>
        </span>
      </span>

      <motion.span
        className="mt-2 block"
        initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.15 }}
      >
        <svg viewBox="0 0 200 56" className="block h-12 w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wealth-preview-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={AREA} fill="url(#wealth-preview-fill)" />
          <path
            d={LINE}
            fill="none"
            stroke="#10B981"
            strokeWidth={1.5}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </motion.span>

      <span className="mt-2.5 flex h-1.5 gap-px overflow-hidden rounded-full">
        {ALLOCATION.map((slice) => (
          <span key={slice.key} className={slice.className} style={{ width: slice.width }} />
        ))}
      </span>
      <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
        {ALLOCATION.map((slice) => (
          <span key={slice.key} className="flex items-center gap-1.5 text-[10.5px] text-[#8E95A5]">
            <span className={`size-1.5 rounded-[2px] ${slice.className}`} />
            {slice.label[locale]}
          </span>
        ))}
        <span className="ml-auto font-mono text-[9.5px] text-[#8E95A5]">
          {locale === "en" ? "schematic" : "esquema"}
        </span>
      </span>
    </span>
  );
}
