"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Copy,
  Check,
  GithubLogo,
  LinkedinLogo,
  FilePdf,
} from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { PROFILE } from "@/content/portfolio-data";

export function PortfolioFooter() {
  const { locale } = useLocale();
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer
      id="contact"
      data-scene="contact"
      className="bg-[#090A0D] border-t border-[#232732] pt-16 sm:pt-20 pb-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Closing Call to Action */}
        <div className="max-w-3xl">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] text-[#ECEEF2]">
            {locale === "en"
              ? "Let's build something extraordinary."
              : "Construyamos algo extraordinario."}
          </h2>
          <p className="text-[#8E95A5] text-base sm:text-lg mt-4 max-w-[58ch] leading-relaxed">
            {locale === "en"
              ? "Open to founding teams, high-agency fellowship programs, and engineering challenges that require rigorous math, low-level systems, and full-stack ownership."
              : "Abierto a equipos fundadores, programas fellowship de alta exigencia y retos de ingeniería que demanden rigor matemático, sistemas y propiedad técnica completa."}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8">
            {/* Primary Emerald Button (Identical label to Navbar) */}
            <a
              href={`mailto:${PROFILE.email}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#10B981] hover:bg-[#059669] text-[#04130D] font-semibold text-sm sm:text-base px-6 py-3 press-scale transition-colors shadow-lg shadow-emerald-950/20"
            >
              <span>{PROFILE.nav.cta[locale]}</span>
              <ArrowRight size={18} weight="bold" />
            </a>

            {/* Copy Email Button */}
            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex items-center gap-2 rounded-full border border-[#232732] bg-[#111318] hover:bg-[#171A21] text-[#ECEEF2] text-sm sm:text-base px-5 py-3 press-scale transition-colors"
            >
              {copied ? (
                <>
                  <Check size={18} className="text-[#10B981]" weight="bold" />
                  <span className="text-[#10B981] font-medium">
                    {locale === "en" ? "Copied!" : "¡Copiado!"}
                  </span>
                </>
              ) : (
                <>
                  <Copy size={18} />
                  <span className="font-mono text-xs sm:text-sm">
                    {PROFILE.email}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hairline Divider */}
        <div className="border-t border-[#232732] my-12" />

        {/* Bottom Bar: Links & Identity */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-xs text-[#8E95A5]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <span className="font-display font-medium text-[#ECEEF2]">
              {PROFILE.fullName}
            </span>
            <span className="hidden sm:inline text-[#232732]">·</span>
            <span>{PROFILE.currentLocation[locale]}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-xs">
            <Link
              href="/krakount"
              className="text-[#F5A524] hover:underline transition-colors"
            >
              Krakount
            </Link>
            <a
              href={PROFILE.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ECEEF2] transition-colors flex items-center gap-1.5"
            >
              <GithubLogo size={14} weight="bold" />
              <span>GitHub</span>
            </a>
            <a
              href={PROFILE.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ECEEF2] transition-colors flex items-center gap-1.5"
            >
              <LinkedinLogo size={14} weight="bold" />
              <span>LinkedIn</span>
            </a>
            <a
              href={PROFILE.cvPath}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ECEEF2] transition-colors flex items-center gap-1.5"
            >
              <FilePdf size={14} weight="bold" />
              <span>CV</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
