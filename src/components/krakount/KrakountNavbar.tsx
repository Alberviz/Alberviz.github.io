"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { KRAKOUNT_PAGE } from "@/content/krakount-data";
import { ASSETS } from "@/content/assets";

export function KrakountNavbar() {
  const { locale, toggleLocale } = useLocale();

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-[#0E0F13]/90 backdrop-blur-md border-b border-[#26272F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Left: Back to Portfolio + Brand Wordmark */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#8B8D98] hover:text-[#EDEDEF] transition-colors press-scale px-3 py-1.5 rounded-full border border-[#26272F] bg-[#17181E]/60 hover:bg-[#17181E]"
            aria-label={locale === "es" ? "Volver al portfolio principal" : "Back to main portfolio"}
          >
            <ArrowLeft size={14} weight="bold" />
            <span className="hidden xs:inline">{KRAKOUNT_PAGE.nav.backToPortfolio[locale]}</span>
          </Link>

          <span className="w-px h-5 bg-[#26272F] hidden sm:inline-block" aria-hidden="true" />

          <Link
            href="/krakount"
            className="inline-flex items-center gap-2.5 group focus:outline-none"
            aria-label="Krakount Product Home"
          >
            <Image
              src={ASSETS.krakount.icon.src}
              alt={ASSETS.krakount.icon.alt[locale]}
              width={28}
              height={28}
              className="rounded-lg shadow-sm"
              priority
            />
            <span
              className="text-xl font-extrabold text-[#EDEDEF] tracking-tight group-hover:text-[#F5A524] transition-colors"
              style={{ fontFamily: "var(--font-krakount-brand)" }}
            >
              Krakount
            </span>
          </Link>
        </div>

        {/* Right: Anchor + Language Toggle + Live App CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <a
            href="#simulator"
            className="hidden md:inline-flex items-center text-xs sm:text-sm font-medium text-[#8B8D98] hover:text-[#EDEDEF] px-3 py-1.5 rounded-full hover:bg-[#17181E] transition-colors"
          >
            {locale === "es" ? "Simulador" : "Simulator"}
          </a>

          <button
            type="button"
            onClick={toggleLocale}
            className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-full border border-[#26272F] bg-[#17181E] hover:border-[#F5A524]/50 press-scale transition-colors"
            aria-label={locale === "es" ? "Cambiar a inglés" : "Switch to Spanish"}
          >
            <span className={locale === "en" ? "text-[#F5A524] font-bold" : "text-[#8B8D98]"}>EN</span>
            <span className="text-[#26272F]">/</span>
            <span className={locale === "es" ? "text-[#F5A524] font-bold" : "text-[#8B8D98]"}>ES</span>
          </button>

          <a
            href={KRAKOUNT_PAGE.liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#F5A524] text-[#16130A] hover:bg-[#E0951A] font-bold text-xs sm:text-sm rounded-full px-3.5 sm:px-4 py-2 press-scale whitespace-nowrap shadow-sm shadow-[#F5A524]/20 transition-colors"
          >
            <span>{KRAKOUNT_PAGE.nav.ctaLive[locale]}</span>
            <ArrowUpRight size={14} weight="bold" />
          </a>
        </div>
      </div>
    </header>
  );
}
