"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Command, List, X } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import type { Locale } from "@/lib/i18n-context";
import { PROFILE } from "@/content/portfolio-data";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/motion";

type NavItem = { id: string; label: Record<Locale, string> };

const NAV_ITEMS: NavItem[] = [
  { id: "work", label: PROFILE.nav.krakount },
  { id: "systems", label: PROFILE.nav.systems },
  { id: "case-studies", label: PROFILE.nav.work },
  { id: "background", label: PROFILE.nav.experience },
];

function openPalette() {
  window.dispatchEvent(new CustomEvent("open-command-palette"));
}

/** Tracks which page section sits under the reading line (IntersectionObserver, no scroll listeners). */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    const hero = document.getElementById("hero");
    const heroObserver = hero
      ? new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setActive(null);
          },
          { rootMargin: "-45% 0px -50% 0px" }
        )
      : null;
    if (hero && heroObserver) heroObserver.observe(hero);

    return () => {
      observer.disconnect();
      heroObserver?.disconnect();
    };
  }, [ids]);

  return active;
}

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

export function PortfolioNavbar() {
  const { locale, setLocale } = useLocale();
  const reduce = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const active = useActiveSection(SECTION_IDS);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#232732] bg-[#090A0D]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Identity */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 press-scale"
          aria-label="Alberto Vizcaíno Ponte, home"
        >
          <span
            aria-hidden="true"
            className="grid h-7 w-7 place-items-center rounded-lg border border-[#232732] bg-[#111318] font-mono text-[10px] font-semibold tracking-tight text-[#ECEEF2]"
          >
            AV
          </span>
          <span className="font-display text-[15px] font-semibold tracking-[-0.02em] text-[#ECEEF2]">
            Alberto Vizcaíno
          </span>
        </Link>

        {/* Section navigation with shared hover pill + active section mark */}
        <LayoutGroup id="portfolio-nav">
          <nav
            aria-label={locale === "es" ? "Navegación principal" : "Main navigation"}
            className="hidden md:block"
            onPointerLeave={() => setHovered(null)}
          >
            <ul className="flex items-center gap-0.5">
              {NAV_ITEMS.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id} className="relative">
                    <a
                      href={`#${item.id}`}
                      onPointerEnter={() => setHovered(item.id)}
                      onFocus={() => setHovered(item.id)}
                      onBlur={() => setHovered(null)}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative isolate block rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150 ${
                        isActive || hovered === item.id ? "text-[#ECEEF2]" : "text-[#8E95A5]"
                      }`}
                    >
                      {hovered === item.id && (
                        <motion.span
                          layoutId="nav-hover-pill"
                          aria-hidden="true"
                          className="absolute inset-0 -z-10 rounded-full bg-[#171A21]"
                          transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                        />
                      )}
                      {item.label[locale]}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-mark"
                          aria-hidden="true"
                          className="absolute -bottom-[11px] left-3.5 right-3.5 h-px bg-[#10B981]"
                          transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </LayoutGroup>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openPalette}
            className="hidden items-center gap-1.5 rounded-full border border-[#232732] px-2.5 py-1 font-mono text-[11px] text-[#8E95A5] transition-colors duration-150 hover:border-[#2E3340] hover:text-[#ECEEF2] press-scale sm:inline-flex"
            aria-label={locale === "es" ? "Abrir paleta de comandos" : "Open command palette"}
          >
            <Command size={12} weight="bold" aria-hidden="true" />
            <span>K</span>
          </button>

          <LanguageSwitch locale={locale} setLocale={setLocale} reduce={reduce} />

          <a
            href={`mailto:${PROFILE.email}`}
            className="hidden whitespace-nowrap rounded-full bg-[#ECEEF2] px-3.5 py-1.5 text-[13px] font-semibold text-[#090A0D] transition-colors duration-150 hover:bg-[#D9DCE3] press-scale sm:inline-flex"
          >
            {PROFILE.nav.cta[locale]}
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="grid h-8 w-8 place-items-center rounded-full border border-[#232732] text-[#8E95A5] press-scale md:hidden"
            aria-label={locale === "es" ? "Abrir menú" : "Toggle menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={15} /> : <List size={15} />}
          </button>
        </div>
      </div>

      {/* Mobile sheet: opacity + 6px drop, exits faster than it enters */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, transform: reduce ? "none" : "translateY(-6px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)", transition: { duration: 0.22, ease: EASE_OUT } }}
            exit={{ opacity: 0, transition: { duration: 0.12, ease: EASE_OUT } }}
            className="border-t border-[#232732] bg-[#090A0D] md:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col px-4 py-2" aria-label="Mobile">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between border-b border-[#232732]/70 py-3.5 text-[15px] text-[#ECEEF2] last:border-b-0"
                >
                  {item.label[locale]}
                  <span className="font-mono text-[11px] text-[#8E95A5]">#{item.id}</span>
                </a>
              ))}
              <div className="flex items-center gap-2 py-3">
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="flex-1 rounded-full bg-[#ECEEF2] py-2.5 text-center text-sm font-semibold text-[#090A0D] press-scale"
                >
                  {PROFILE.nav.cta[locale]}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openPalette();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#232732] px-4 py-2.5 font-mono text-xs text-[#8E95A5] press-scale"
                >
                  <Command size={12} aria-hidden="true" />
                  {PROFILE.nav.commandHint[locale]}
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function LanguageSwitch({
  locale,
  setLocale,
  reduce,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  reduce: boolean | null;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Language / Idioma"
      className="relative flex items-center rounded-full border border-[#232732] p-0.5 font-mono text-[11px]"
    >
      {(["en", "es"] as const).map((code) => {
        const selected = locale === code;
        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setLocale(code)}
            className={`relative isolate rounded-full px-2 py-0.5 uppercase transition-colors duration-150 ${
              selected ? "text-[#ECEEF2]" : "text-[#8E95A5] hover:text-[#ECEEF2]"
            }`}
          >
            {selected && (
              <motion.span
                layoutId="portfolio-locale-pill"
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-full bg-[#232732]"
                transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
              />
            )}
            {code}
          </button>
        );
      })}
    </div>
  );
}
