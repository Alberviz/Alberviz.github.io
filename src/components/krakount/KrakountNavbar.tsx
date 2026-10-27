"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { KRAKOUNT_PAGE } from "@/content/krakount-data";
import { ASSETS } from "@/content/assets";
import { SPRING_LAYOUT } from "@/lib/motion";

export function KrakountNavbar() {
  const { locale, setLocale } = useLocale();
  const reduce = useReducedMotion();

  const anchors = [
    { href: "#features", label: { en: "Features", es: "Funciones" } },
    { href: "#gallery", label: { en: "Screens", es: "Pantallas" } },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#26272F] bg-[#0E0F13]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[13px] font-medium text-[#8B8D98] transition-colors duration-150 hover:text-[#EDEDEF] press-scale"
            aria-label={locale === "es" ? "Volver al portfolio" : "Back to portfolio"}
          >
            <ArrowLeft size={14} weight="bold" aria-hidden="true" />
            <span className="hidden sm:inline">{KRAKOUNT_PAGE.nav.backToPortfolio[locale]}</span>
          </Link>

          <span aria-hidden="true" className="h-4 w-px bg-[#26272F]" />

          <Link href="/krakount/" className="flex items-center gap-2" aria-label="Krakount">
            <img
              src={ASSETS.krakount.icon.src}
              alt=""
              width={24}
              height={24}
              className="rounded-md"
              draggable={false}
            />
            <span
              className="text-[17px] font-extrabold tracking-[-0.02em] text-[#EDEDEF]"
              style={{ fontFamily: "var(--font-krakount-brand)" }}
            >
              Krakount
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <nav className="hidden items-center md:flex" aria-label={locale === "es" ? "Secciones" : "Sections"}>
            {anchors.map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="rounded-full px-3 py-1.5 text-[13px] font-medium text-[#8B8D98] transition-colors duration-150 hover:text-[#EDEDEF]"
              >
                {a.label[locale]}
              </a>
            ))}
          </nav>

          <div
            role="radiogroup"
            aria-label="Language / Idioma"
            className="flex items-center rounded-full border border-[#26272F] p-0.5 text-[11px] font-semibold"
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
                    selected ? "text-[#16130A]" : "text-[#8B8D98] hover:text-[#EDEDEF]"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="krakount-locale-pill"
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 rounded-full bg-[#F5A524]"
                      transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                    />
                  )}
                  {code}
                </button>
              );
            })}
          </div>

          <a
            href={KRAKOUNT_PAGE.liveDemoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#F5A524] px-3.5 py-1.5 text-[13px] font-bold text-[#16130A] transition-colors duration-150 hover:bg-[#E0951A] press-scale"
          >
            {KRAKOUNT_PAGE.nav.ctaLive[locale]}
            <ArrowUpRight size={13} weight="bold" className="cta-arrow cta-arrow-diag" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
