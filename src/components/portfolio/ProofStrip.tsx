"use client";

import React from "react";
import { GithubLogo, LinkedinLogo, MapPin } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { PROFILE } from "@/content/portfolio-data";

export function ProofStrip() {
  const { locale } = useLocale();

  return (
    <div
      data-scene="proof"
      className="border-y border-[#232732] bg-[#111318]/60 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4-Column Proof Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#232732]">
          {PROFILE.proofMetrics.map((item, idx) => (
            <div
              key={idx}
              className="py-5 px-4 sm:px-6 flex flex-col justify-center hover:bg-[#171A21]/40 transition-colors"
            >
              <span className="font-display text-2xl lg:text-3xl font-semibold tabular-nums text-[#ECEEF2]">
                {item.value}
              </span>
              <span className="text-xs sm:text-sm text-[#8E95A5] mt-1.5 leading-relaxed">
                {item.label[locale]}
              </span>
            </div>
          ))}
        </div>

        {/* Verification Sub-bar: Location & Social Links */}
        <div className="border-t border-[#232732]/70 py-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#8E95A5]">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-[#10B981]" weight="fill" />
            <span>{PROFILE.currentLocation[locale]}</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={PROFILE.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#ECEEF2] transition-colors"
            >
              <GithubLogo size={14} weight="bold" />
              <span>@Alberviz</span>
            </a>
            <span className="text-[#232732]">/</span>
            <a
              href={PROFILE.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[#ECEEF2] transition-colors"
            >
              <LinkedinLogo size={14} weight="bold" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
