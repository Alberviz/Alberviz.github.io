"use client";

import React from "react";
import { useLocale } from "@/lib/i18n-context";
import { KRAKOUNT_PAGE } from "@/content/krakount-data";

export function KrakountMetricsStrip() {
  const { locale } = useLocale();

  return (
    <section className="w-full bg-[#17181E] border-y border-[#26272F] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x divide-[#26272F]">
          {KRAKOUNT_PAGE.stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between lg:px-8 first:lg:pl-0 last:lg:pr-0"
            >
              <div>
                <span className="tabular-nums text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-[#F5A524] tracking-tight leading-none block">
                  {stat.value}
                </span>
                <p className="mt-3 text-xs sm:text-sm text-[#8B8D98] leading-relaxed max-w-[28ch]">
                  {stat.label[locale]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
