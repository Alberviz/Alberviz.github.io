"use client";

import React from "react";
import { useLocale } from "@/lib/i18n-context";
import { PROFILE } from "@/content/portfolio-data";

export function ProofStrip() {
  const { locale } = useLocale();

  return (
    <div data-scene="proof" className="border-y border-[#232732] bg-[#090A0D]">
      <dl className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-[#232732]/70">
        {PROFILE.proofMetrics.map((item, idx) => (
          <div
            key={item.value}
            className={[
              "flex flex-col-reverse justify-end gap-1.5 py-6 lg:py-7",
              idx % 2 === 1 ? "border-l border-[#232732]/70 pl-4 sm:pl-6" : "pr-4 sm:pr-6",
              idx >= 2 ? "border-t border-[#232732]/70 lg:border-t-0" : "",
              idx === 0 ? "lg:pr-6" : "lg:px-6",
            ].join(" ")}
          >
            <dt className="text-xs sm:text-[13px] leading-snug text-[#8E95A5]">
              {item.label[locale]}
            </dt>
            <dd className="font-display text-xl sm:text-2xl lg:text-[1.75rem] font-semibold tracking-[-0.02em] tabular-nums text-[#ECEEF2]">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
