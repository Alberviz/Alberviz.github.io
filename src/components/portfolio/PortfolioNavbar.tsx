"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Command, List, X } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { PROFILE } from "@/content/portfolio-data";

export function PortfolioNavbar() {
  const { locale, toggleLocale } = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openPalette = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-command-palette"));
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-[#090A0D]/85 backdrop-blur-md border-b border-[#232732]">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Geometric Monogram + Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group press-scale"
          aria-label="Alberto Vizcaino Ponte - Home"
        >
          <div className="w-8 h-8 rounded-lg bg-[#171A21] border border-[#232732] flex items-center justify-center font-mono font-bold text-xs text-[#10B981] shadow-inner group-hover:border-[#10B981]/50 transition-colors">
            AV
          </div>
          <span className="font-display font-semibold tracking-tight text-[#ECEEF2] text-sm sm:text-base group-hover:text-emerald-400 transition-colors">
            Alberto Vizcaíno
          </span>
        </Link>

        {/* Center: Navigation Links (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-6 text-sm text-[#8E95A5]"
          aria-label="Main Navigation"
        >
          <a
            href="#work"
            className="hover:text-[#ECEEF2] transition-colors"
          >
            {PROFILE.nav.work[locale]}
          </a>
          <a
            href="#systems"
            className="hover:text-[#ECEEF2] transition-colors"
          >
            {PROFILE.nav.systems[locale]}
          </a>
          <Link
            href="/krakount"
            className="inline-flex items-center gap-1.5 hover:text-[#ECEEF2] transition-colors group"
          >
            <span>{PROFILE.nav.krakount[locale]}</span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-[#F5A524]/10 text-[#F5A524] border border-[#F5A524]/25">
              FLAGSHIP
            </span>
          </Link>
          <a
            href="#background"
            className="hover:text-[#ECEEF2] transition-colors"
          >
            {PROFILE.nav.experience[locale]}
          </a>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Instant Command Palette Trigger */}
          <button
            type="button"
            onClick={openPalette}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#171A21] hover:bg-[#232732] border border-[#232732] text-xs font-mono text-[#8E95A5] hover:text-[#ECEEF2] press-scale transition-colors"
            title="Open Command Palette (0ms)"
            aria-label="Open Command Palette"
          >
            <Command size={13} weight="bold" />
            <span>K</span>
          </button>

          {/* Instant EN / ES Toggle */}
          <button
            type="button"
            onClick={toggleLocale}
            className="flex items-center rounded-full bg-[#111318] border border-[#232732] p-0.5 text-[11px] font-mono press-scale"
            aria-label={`Switch language. Current: ${locale.toUpperCase()}`}
          >
            <span
              className={`px-2 py-0.5 rounded-full transition-colors ${
                locale === "en"
                  ? "bg-[#232732] text-[#ECEEF2] font-semibold"
                  : "text-[#8E95A5]"
              }`}
            >
              EN
            </span>
            <span
              className={`px-2 py-0.5 rounded-full transition-colors ${
                locale === "es"
                  ? "bg-[#232732] text-[#ECEEF2] font-semibold"
                  : "text-[#8E95A5]"
              }`}
            >
              ES
            </span>
          </button>

          {/* Primary Emerald Pill CTA */}
          <a
            href="mailto:albvizpon@gmail.com"
            className="rounded-full bg-[#10B981] hover:bg-[#059669] text-[#04130D] font-semibold text-xs sm:text-sm px-3.5 sm:px-4 py-2 press-scale whitespace-nowrap transition-colors"
          >
            {PROFILE.nav.cta[locale]}
          </a>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#171A21] border border-[#232732] text-[#8E95A5] hover:text-[#ECEEF2] press-scale"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <List size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090A0D]/95 border-b border-[#232732] px-4 py-4 flex flex-col gap-3 text-sm text-[#8E95A5]">
          <a
            href="#work"
            onClick={() => setMobileMenuOpen(false)}
            className="px-2 py-1.5 hover:text-[#ECEEF2] transition-colors"
          >
            {PROFILE.nav.work[locale]}
          </a>
          <a
            href="#systems"
            onClick={() => setMobileMenuOpen(false)}
            className="px-2 py-1.5 hover:text-[#ECEEF2] transition-colors"
          >
            {PROFILE.nav.systems[locale]}
          </a>
          <Link
            href="/krakount"
            onClick={() => setMobileMenuOpen(false)}
            className="px-2 py-1.5 flex items-center justify-between hover:text-[#ECEEF2] transition-colors"
          >
            <span>{PROFILE.nav.krakount[locale]}</span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-[#F5A524]/10 text-[#F5A524] border border-[#F5A524]/25">
              FLAGSHIP
            </span>
          </Link>
          <a
            href="#background"
            onClick={() => setMobileMenuOpen(false)}
            className="px-2 py-1.5 hover:text-[#ECEEF2] transition-colors"
          >
            {PROFILE.nav.experience[locale]}
          </a>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              openPalette();
            }}
            className="flex items-center justify-between px-2 py-2 mt-1 rounded-lg bg-[#171A21] border border-[#232732] text-xs font-mono text-[#8E95A5]"
          >
            <span>{PROFILE.nav.commandHint[locale]}</span>
            <span className="flex items-center gap-1">
              <Command size={12} />
              <span>K</span>
            </span>
          </button>
        </div>
      )}
    </header>
  );
}
