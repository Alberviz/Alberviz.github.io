"use client";

import React from "react";
import {
  Briefcase,
  GraduationCap,
  Trophy,
  GitBranch,
  CheckCircle,
} from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { EXPERIENCE, EDUCATION_AND_HONORS } from "@/content/portfolio-data";

export function ExperienceAndAcademic() {
  const { locale } = useLocale();
  const stelExperience = EXPERIENCE[0];

  return (
    <section
      id="background"
      data-scene="background"
      className="py-16 sm:py-24 border-b border-[#232732]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mb-12">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] text-[#ECEEF2]">
            {locale === "en" ? "Background & Rigor" : "Trayectoria y Rigor"}
          </h2>
          <p className="text-base sm:text-lg text-[#8E95A5] mt-3 leading-relaxed">
            {locale === "en"
              ? "Bridging commercial cloud ERP software engineering with mathematical proofs and competitive algorithmic performance."
              : "Uniendo el desarrollo de software ERP comercial en la nube con la demostración matemática formal y la algoritmia competitiva."}
          </p>
        </div>

        {/* Two-Column Asymmetric Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Left Column: Industry Experience at STEL Order */}
          <div className="lg:col-span-6 bg-[#111318] border border-[#232732] rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-[#232732] pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#171A21] border border-[#232732] flex items-center justify-center text-[#10B981]">
                    <Briefcase size={20} weight="bold" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-semibold text-[#ECEEF2]">
                      {stelExperience.company}
                    </h3>
                    <p className="text-xs font-mono text-[#8E95A5]">
                      {stelExperience.location[locale]} · {stelExperience.period[locale]}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-xs text-[#10B981] bg-[#171A21] px-2.5 py-1 rounded-full border border-[#232732] shrink-0">
                  Shipped POS
                </span>
              </div>

              <div className="mb-4">
                <p className="font-display font-medium text-base text-[#ECEEF2]">
                  {stelExperience.role[locale]}
                </p>
                <p className="text-sm text-[#8E95A5] mt-2 leading-relaxed">
                  {stelExperience.summary[locale]}
                </p>
              </div>

              {/* Verified Bullets */}
              <div className="space-y-3 mt-6">
                {stelExperience.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#ECEEF2]/90 leading-relaxed">
                    <CheckCircle
                      size={16}
                      weight="bold"
                      className="text-[#10B981] mt-0.5 shrink-0"
                    />
                    <span>{bullet[locale]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stack Tags */}
            <div className="mt-8 pt-6 border-t border-[#232732] flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-[#8E95A5] mr-2">Tech:</span>
              {stelExperience.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-0.5 rounded-full bg-[#171A21] border border-[#232732] text-xs font-mono text-[#8E95A5]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Education, UmuCollab & Olympiad Honors */}
          <div className="lg:col-span-6 bg-[#111318] border border-[#232732] rounded-2xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-[#232732] pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#171A21] border border-[#232732] flex items-center justify-center text-[#10B981]">
                    <GraduationCap size={20} weight="bold" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg sm:text-xl font-semibold text-[#ECEEF2]">
                      {EDUCATION_AND_HONORS.degree[locale]}
                    </h3>
                    <p className="text-xs font-mono text-[#8E95A5]">
                      {EDUCATION_AND_HONORS.university[locale]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Erasmus & Community Pipeline */}
              <div className="space-y-3 mb-6">
                <p className="text-xs sm:text-sm font-mono text-[#10B981]">
                  &gt; {EDUCATION_AND_HONORS.exchange[locale]}
                </p>
                <div className="p-3.5 rounded-xl bg-[#171A21]/60 border border-[#232732] flex items-start gap-2.5">
                  <GitBranch size={16} weight="bold" className="text-[#10B981] mt-0.5 shrink-0" />
                  <p className="text-xs text-[#8E95A5] leading-relaxed">
                    {EDUCATION_AND_HONORS.communityNote[locale]}
                  </p>
                </div>
              </div>

              {/* 3 Academic Awards */}
              <div className="space-y-3">
                {EDUCATION_AND_HONORS.awards.map((award, aIdx) => (
                  <div
                    key={aIdx}
                    className="p-3.5 rounded-xl bg-[#171A21]/40 border border-[#232732] flex items-start justify-between gap-3 hover:border-[#10B981]/40 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <Trophy size={16} weight="bold" className="text-[#F5A524] mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-display font-semibold text-xs sm:text-sm text-[#ECEEF2]">
                          {award.title[locale]}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-[#8E95A5] mt-0.5 leading-relaxed">
                          {award.detail[locale]}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-[#8E95A5] bg-[#090A0D] px-2 py-0.5 rounded border border-[#232732] shrink-0">
                      {award.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#232732] flex items-center justify-between text-xs font-mono text-[#8E95A5]">
              <span>Algorithms & Formal Proofs</span>
              <span className="text-[#10B981]">C++ · LaTeX · Math</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
