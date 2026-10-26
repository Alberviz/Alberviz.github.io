"use client";

import React from "react";
import { useLocale } from "@/lib/i18n-context";
import { HOMELAB_WEALTH_SYSTEM } from "@/content/portfolio-data";
import { WealthTopology } from "./diagrams/WealthTopology";
import { AuroraPipeline } from "./diagrams/AuroraPipeline";

export function HomeLabWealthSection() {
  const { locale } = useLocale();

  return (
    <section
      id="systems"
      data-scene="systems"
      className="py-16 sm:py-24 border-b border-[#232732]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] leading-[1.05] text-[#ECEEF2]">
            {HOMELAB_WEALTH_SYSTEM.heading[locale]}
          </h2>
          <p className="text-base sm:text-lg text-[#8E95A5] mt-4 leading-relaxed max-w-[60ch]">
            {HOMELAB_WEALTH_SYSTEM.subheading[locale]}
          </p>
        </div>

        {/* Ghostfolio wealth topology */}
        <div className="mt-14">
          <div className="mb-8 max-w-[68ch]">
            <h3 className="font-display text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-[#ECEEF2]">
              {HOMELAB_WEALTH_SYSTEM.wealthTitle[locale]}
            </h3>
            <p className="text-sm sm:text-base text-[#8E95A5] mt-2 leading-relaxed">
              {HOMELAB_WEALTH_SYSTEM.wealthSummary[locale]}
            </p>
          </div>
          <WealthTopology />
        </div>

        <div className="my-16 sm:my-20 border-t border-[#232732]" />

        <AuroraPipeline />
      </div>
    </section>
  );
}
