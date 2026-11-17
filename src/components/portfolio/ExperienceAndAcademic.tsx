"use client";

import React from "react";
import { useLocale } from "@/lib/i18n-context";
import { EXPERIENCE, EDUCATION_AND_HONORS } from "@/content/portfolio-data";

export function ExperienceAndAcademic() {
  const { locale } = useLocale();
  const stel = EXPERIENCE[0];
  const edu = EDUCATION_AND_HONORS;

  const columnLabel = "text-sm text-[#8A8F9C]";

  return (
    <section
      id="trayectoria"
      data-scene="background"
      className="py-16 sm:py-24 border-b border-[#1F232D]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12 sm:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] leading-[1.05] text-[#ECEDF0]">
            {locale === "en" ? "Background" : "Trayectoria"}
          </h2>
          <p className="text-base sm:text-lg text-[#8A8F9C] mt-4 leading-relaxed max-w-[60ch]">
            {locale === "en"
              ? "Commercial ERP engineering, backed by formal mathematics and competitive algorithms."
              : "Ingeniería en un ERP comercial, respaldada por matemáticas formales y algoritmia competitiva."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 border-t border-[#1F232D] lg:divide-x lg:divide-[#1F232D]">
          {/* Experience */}
          <article className="pt-8 pb-12 lg:pb-0 lg:pr-12 xl:pr-16">
            <h3 className={columnLabel}>{locale === "en" ? "Experience" : "Experiencia"}</h3>

            <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <p className="font-display text-xl sm:text-2xl font-semibold tracking-[-0.02em] text-[#ECEDF0]">
                {stel.company}
              </p>
              <p className="font-mono text-xs tabular-nums text-[#8A8F9C]">
                {stel.period[locale]} · {stel.location[locale]}
              </p>
            </div>
            <p className="mt-1 text-[15px] text-[#C5CAD3]">{stel.role[locale]}</p>

            <p className="mt-5 max-w-[60ch] text-[15px] leading-relaxed text-[#8A8F9C]">
              {stel.summary[locale]}
            </p>

            <ul className="mt-5 space-y-3">
              {stel.bullets.map((bullet) => (
                <li
                  key={bullet.en}
                  className="relative max-w-[62ch] pl-5 text-sm leading-relaxed text-[#C5CAD3]"
                >
                  <span
                    aria-hidden
                    className="absolute left-0 top-[0.6em] size-1.5 rounded-[2px] bg-[#F2B36F]"
                  />
                  {bullet[locale]}
                </li>
              ))}
            </ul>

            <p className="mt-7 font-mono text-xs text-[#8A8F9C]">{stel.stack.join(" · ")}</p>
          </article>

          {/* Education & honors */}
          <article className="border-t border-[#1F232D] pt-8 lg:border-t-0 lg:pl-12 xl:pl-16">
            <h3 className={columnLabel}>
              {locale === "en" ? "Education & Honors" : "Formación y Reconocimientos"}
            </h3>

            <p className="mt-6 font-display text-xl sm:text-2xl font-semibold tracking-[-0.02em] text-[#ECEDF0]">
              {edu.degree[locale]}
            </p>
            <p className="mt-1 text-[15px] text-[#C5CAD3]">{edu.university[locale]}</p>
            <p className="mt-1 text-sm text-[#8A8F9C]">{edu.exchange[locale]}</p>

            <p className="mt-5 max-w-[60ch] text-[15px] leading-relaxed text-[#8A8F9C]">
              {edu.communityNote[locale]}
            </p>

            <dl className="mt-7 border-t border-[#1F232D]">
              {edu.awards.map((award) => (
                <div
                  key={award.title.en}
                  className="grid gap-1 border-b border-[#1F232D] py-3.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] sm:gap-6"
                >
                  <dt className="font-display text-[15px] font-medium text-[#ECEDF0]">
                    {award.title[locale]}
                  </dt>
                  <dd className="text-sm leading-relaxed text-[#8A8F9C]">{award.detail[locale]}</dd>
                </div>
              ))}
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}
