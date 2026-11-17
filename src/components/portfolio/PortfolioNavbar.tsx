"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Command, List, X } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import type { Locale } from "@/lib/i18n-context";
import { NAV } from "@/content/site-copy";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/motion";

type NavItem = { id: string; label: Record<Locale, string> };

const NAV_ITEMS: NavItem[] = [
  { id: "wari", label: NAV.wari },
  { id: "sistemas", label: NAV.systems },
  { id: "proyectos", label: NAV.projects },
  { id: "trayectoria", label: NAV.background },
];

const SECTION_IDS = NAV_ITEMS.map((item) => item.id);

function openPalette() {
  window.dispatchEvent(new CustomEvent("open-command-palette"));
}

/** Tracks which page section sits under the reading line (IntersectionObserver, no scroll listeners). */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        const current = ids.find((id) => visible.get(id));
        setActive(current ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/** True once the page has left the very top, so the bar can gain its glass. */
function useScrolled(ref: React.RefObject<HTMLElement | null>) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return scrolled;
}

export function PortfolioNavbar() {
  const { locale, setLocale } = useLocale();
  const reduce = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const active = useActiveSection(SECTION_IDS);
  const sentinelRef = useRef<HTMLSpanElement>(null);
  const scrolled = useScrolled(sentinelRef);

  return (
    <>
    <span ref={sentinelRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-6 w-px" />
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color] duration-200 ${
        scrolled || mobileMenuOpen
          ? "border-line bg-bg/80 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        {/* Identity */}
        <a
          href="#hero"
          className="group press-scale flex items-center gap-2.5"
          aria-label={locale === "es" ? "Alberto Vizcaíno Ponte, inicio" : "Alberto Vizcaíno Ponte, home"}
        >
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-full border border-ink/20 bg-bg/50 font-mono text-[10px] font-medium tracking-tight text-ink backdrop-blur-sm"
          >
            AV
          </span>
          <span className="font-display text-[15px] font-semibold tracking-[-0.02em] text-ink">
            Alberto Vizcaíno
          </span>
        </a>

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
                      className={`relative isolate block rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors duration-150 ${
                        isActive || hovered === item.id ? "text-ink" : "text-muted"
                      }`}
                    >
                      {hovered === item.id && (
                        <motion.span
                          layoutId="nav-hover-pill"
                          aria-hidden="true"
                          className="absolute inset-0 -z-10 rounded-full bg-ink/[0.07]"
                          transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                        />
                      )}
                      {item.label[locale]}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-mark"
                          aria-hidden="true"
                          className="absolute -bottom-[13px] left-3.5 right-3.5 h-px bg-accent"
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
            className="hidden h-8 items-center gap-1.5 rounded-full border border-ink/15 px-3 font-mono text-[11px] text-muted transition-colors duration-150 hover:border-ink/35 hover:text-ink press-scale sm:inline-flex"
            aria-label={NAV.palette[locale]}
          >
            <Command size={12} weight="bold" aria-hidden="true" />
            <span>K</span>
          </button>

          <LanguageSwitch locale={locale} setLocale={setLocale} reduce={reduce} />

          <a
            href="#contacto"
            className="press-scale hidden h-8 items-center whitespace-nowrap rounded-full bg-ink px-4 text-[13px] font-semibold text-bg transition-colors duration-150 hover:bg-ink/85 sm:inline-flex"
          >
            {NAV.contact[locale]}
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="press-scale grid h-9 w-9 place-items-center rounded-full border border-ink/15 text-muted md:hidden"
            aria-label={NAV.menu[locale]}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={16} /> : <List size={16} />}
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
            className="border-t border-line bg-bg md:hidden"
          >
            <nav className="mx-auto flex max-w-7xl flex-col px-5 py-2" aria-label="Mobile">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between border-b border-line/70 py-4 text-[16px] text-ink"
                >
                  {item.label[locale]}
                  <span className="font-mono text-[11px] text-muted">#{item.id}</span>
                </a>
              ))}
              <div className="flex items-center gap-2 py-3">
                <a
                  href="#contacto"
                  onClick={() => setMobileMenuOpen(false)}
                  className="press-scale flex-1 rounded-full bg-ink py-3 text-center text-sm font-semibold text-bg"
                >
                  {NAV.contact[locale]}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openPalette();
                  }}
                  className="press-scale inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-4 py-3 font-mono text-xs text-muted"
                  aria-label={NAV.palette[locale]}
                >
                  <Command size={12} aria-hidden="true" />K
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </>
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
      className="relative flex h-8 items-center rounded-full border border-ink/15 p-0.5 font-mono text-[11px]"
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
            className={`relative isolate rounded-full px-2.5 py-1 uppercase transition-colors duration-150 ${
              selected ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {selected && (
              <motion.span
                layoutId="portfolio-locale-pill"
                aria-hidden="true"
                className="absolute inset-0 -z-10 rounded-full bg-ink/[0.12]"
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
