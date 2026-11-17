"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Command, DotsThree, MagnifyingGlass, X } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import type { Locale } from "@/lib/i18n-context";
import { NAV } from "@/content/site-copy";
import { EASE_DRAWER, SPRING_LAYOUT } from "@/lib/motion";

type NavItem = { id: string; label: Record<Locale, string> };

const NAV_ITEMS: NavItem[] = [
  { id: "wari", label: NAV.wari },
  { id: "olimpo", label: NAV.olimpo },
  { id: "sistemas", label: NAV.systems },
  { id: "proyectos", label: NAV.projects },
  { id: "trayectoria", label: NAV.background },
];

/** Thumb bar on phones: the two cases, the rest of the work and contact. */
const THUMB_ITEMS: NavItem[] = [
  { id: "wari", label: NAV.wari },
  { id: "olimpo", label: NAV.olimpo },
  { id: "proyectos", label: NAV.projects },
  { id: "contacto", label: NAV.contact },
];

/** Everything, in page order, for the bottom sheet. */
const SHEET_ITEMS: NavItem[] = [
  { id: "hero", label: NAV.home },
  { id: "wari", label: NAV.wari },
  { id: "olimpo", label: NAV.olimpo },
  { id: "sistemas", label: NAV.systems },
  { id: "escritorio", label: NAV.desktop },
  { id: "proyectos", label: NAV.projects },
  { id: "trayectoria", label: NAV.background },
  { id: "contacto", label: NAV.contact },
];

const SECTION_IDS = ["wari", "olimpo", "sistemas", "escritorio", "proyectos", "trayectoria", "contacto"];

/** True while most of the hero is on screen (the thumb bar stays out of its way). */
function useHeroVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = document.getElementById("hero");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.intersectionRatio > 0.55), { threshold: [0, 0.55, 1] });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return visible;
}

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
  const [sheetOpen, setSheetOpen] = useState(false);
  const heroVisible = useHeroVisible();
  const [hovered, setHovered] = useState<string | null>(null);
  const active = useActiveSection(SECTION_IDS);
  const sentinelRef = useRef<HTMLSpanElement>(null);
  const scrolled = useScrolled(sentinelRef);

  return (
    <>
    <span ref={sentinelRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-6 w-px" />
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-[background-color,border-color] duration-200 ${
        scrolled
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

          <LanguageSwitch locale={locale} setLocale={setLocale} reduce={reduce} id="top" />

          <a
            href="#contacto"
            className="press-scale hidden h-8 items-center whitespace-nowrap rounded-full bg-ink px-4 text-[13px] font-semibold text-bg transition-colors duration-150 hover:bg-ink/85 sm:inline-flex"
          >
            {NAV.contact[locale]}
          </a>

        </div>
      </div>

    </header>

    {/* Thumb bar (phones): out of the way while the hero fills the screen */}
    <nav
      aria-label={locale === "es" ? "Navegación rápida" : "Quick navigation"}
      data-hidden={heroVisible && !sheetOpen ? "1" : "0"}
      className="thumb-bar fixed inset-x-0 z-40 flex justify-center px-3 md:hidden"
    >
      <ul className="flex w-full min-w-0 max-w-[26rem] items-center gap-0.5 rounded-full border border-ink/12 bg-[#0E1015]/85 p-1.5 shadow-[0_20px_40px_-12px_rgb(0_0_0/0.8)] backdrop-blur-xl">
        {THUMB_ITEMS.map((item) => {
          const on = active === item.id;
          return (
            <li key={item.id} className="min-w-0 flex-1">
              <a
                href={`#${item.id}`}
                aria-current={on ? "true" : undefined}
                className={`thumb-link relative flex h-11 items-center justify-center rounded-full px-0.5 text-[12.5px] font-medium min-[380px]:text-[13px] ${
                  on ? "bg-ink/[0.1] text-ink" : "text-muted"
                }`}
              >
                {item.label[locale]}
                {on && <span aria-hidden="true" className="absolute bottom-1.5 h-1 w-1 rounded-full bg-accent" />}
              </a>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-label={NAV.menu[locale]}
            aria-expanded={sheetOpen}
            aria-controls="nav-sheet"
            className="thumb-link grid h-11 w-12 place-items-center rounded-full bg-accent text-on-accent"
          >
            <DotsThree size={22} weight="bold" aria-hidden="true" />
          </button>
        </li>
      </ul>
    </nav>

    <NavSheet open={sheetOpen} onClose={() => setSheetOpen(false)} active={active} locale={locale} setLocale={setLocale} reduce={reduce} />
    </>
  );
}

function LanguageSwitch({
  locale,
  setLocale,
  reduce,
  id,
  large,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  reduce: boolean | null;
  id: string;
  large?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Language / Idioma"
      className={`relative flex items-center rounded-full border border-ink/15 p-0.5 font-mono ${large ? "h-11 text-[13px]" : "h-8 text-[11px]"}`}
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
            className={`relative isolate h-full rounded-full uppercase transition-colors duration-150 after:absolute after:-inset-y-1.5 after:inset-x-0 after:content-[''] ${large ? "px-4" : "px-2.5"} ${
              selected ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {selected && (
              <motion.span
                layoutId={`portfolio-locale-pill-${id}`}
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

/**
 * Bottom sheet with every section, the language and search. Slides up on the
 * drawer curve, closes faster than it opens, locks the page scroll, closes on
 * Escape or a tap on the backdrop, and gives focus back to the opener.
 */
function NavSheet({
  open,
  onClose,
  active,
  locale,
  setLocale,
  reduce,
}: {
  open: boolean;
  onClose: () => void;
  active: string | null;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  reduce: boolean | null;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>("a, button"));
        const i = items.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          items[items.length - 1]?.focus();
        } else if (!e.shiftKey && i === items.length - 1) {
          e.preventDefault();
          items[0]?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      opener?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="sheet" className="fixed inset-0 z-50 md:hidden" initial="hide" animate="show" exit="hide">
          <motion.button
            type="button"
            aria-label={NAV.close[locale]}
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
            variants={{ hide: { opacity: 0 }, show: { opacity: 1 } }}
            transition={{ duration: 0.2, ease: EASE_DRAWER }}
          />
          <motion.div
            ref={panelRef}
            id="nav-sheet"
            role="dialog"
            aria-modal="true"
            aria-label={NAV.menuTitle[locale]}
            className="nav-sheet absolute inset-x-0 bottom-0 rounded-t-[28px] border-t border-ink/12 bg-surface px-5 pt-3"
            variants={{
              hide: reduce ? { opacity: 0 } : { transform: "translateY(100%)" },
              show: reduce ? { opacity: 1 } : { transform: "translateY(0%)" },
            }}
            transition={{ duration: 0.32, ease: EASE_DRAWER }}
          >
            <div aria-hidden="true" className="mx-auto h-1 w-10 rounded-full bg-ink/20" />
            <div className="mt-4 flex items-center justify-between">
              <p className="font-display text-[1.15rem] font-semibold tracking-[-0.02em] text-ink">{NAV.menuTitle[locale]}</p>
              <button
                type="button"
                onClick={onClose}
                aria-label={NAV.close[locale]}
                className="press-scale grid h-11 w-11 place-items-center rounded-full border border-ink/15 text-muted"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {SHEET_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={onClose}
                    aria-current={active === item.id ? "true" : undefined}
                    className={`press-scale flex h-14 items-center rounded-2xl border px-4 text-[15px] font-medium ${
                      active === item.id ? "border-accent/60 bg-accent/10 text-ink" : "border-line bg-bg/40 text-ink/90"
                    }`}
                  >
                    {item.label[locale]}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center gap-2 border-t border-line pt-4">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  window.setTimeout(openPalette, 0);
                }}
                className="press-scale inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-ink/15 text-[14px] text-ink"
              >
                <MagnifyingGlass size={16} aria-hidden="true" />
                {NAV.search[locale]}
              </button>
              <LanguageSwitch locale={locale} setLocale={setLocale} reduce={reduce} id="sheet" large />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
