"use client";

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowUpRight } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import type { Locale } from "@/lib/i18n-context";
import { KRAKOUNT_PAGE } from "@/content/krakount-data";
import { ASSETS } from "@/content/assets";
import { EASE_OUT, revealProps } from "@/lib/motion";

const SWATCHES: { hex: string; name: string; role: Record<Locale, string> }[] = [
  { hex: "#0E0F13", name: "Night canvas", role: { en: "Page", es: "Página" } },
  { hex: "#17181E", name: "Continuous sheet", role: { en: "Containers", es: "Contenedores" } },
  { hex: "#1F2027", name: "Segment", role: { en: "Inputs and chips", es: "Campos y chips" } },
  { hex: "#F5A524", name: "Streetlamp amber", role: { en: "Thumb actions only", es: "Solo acciones" } },
  { hex: "#3DD68C", name: "Mint", role: { en: "Owed to you", es: "Te deben" } },
  { hex: "#FF6B5B", name: "Coral", role: { en: "You owe", es: "Debes" } },
];

export function KrakountEngineeringFooter() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const es = locale === "es";

  return (
    <footer className="border-t border-[#26272F]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Design language + stack, side by side on one hairline grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <motion.div {...revealProps(reduce)} className="py-20 lg:col-span-7 lg:py-24 lg:pr-14">
            <h2 className="text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#EDEDEF]">
              {KRAKOUNT_PAGE.designSystemNote.title[locale]}
            </h2>
            <p className="mt-4 max-w-[64ch] text-pretty text-[15px] leading-relaxed text-[#8B8D98]">
              {KRAKOUNT_PAGE.designSystemNote.body[locale]}
            </p>

            <ul className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-[#26272F] bg-[#26272F] sm:grid-cols-6">
              {SWATCHES.map((swatch, i) => (
                <li key={swatch.hex} className="bg-[#0E0F13] p-3">
                  <motion.span
                    aria-hidden="true"
                    className="block h-10 origin-bottom rounded-lg border border-[#26272F]"
                    style={{ backgroundColor: swatch.hex }}
                    initial={{ transform: reduce ? "scaleY(1)" : "scaleY(0.2)", opacity: reduce ? 0 : 1 }}
                    whileInView={{ transform: "scaleY(1)", opacity: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.05 * i }}
                  />
                  <span className="mt-2.5 block font-mono text-[11px] font-semibold tabular-nums text-[#EDEDEF]">
                    {swatch.hex}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-tight text-[#8B8D98]">{swatch.name}</span>
                  <span className="block text-[10.5px] leading-tight text-[#8B8D98]/70">{swatch.role[locale]}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            {...revealProps(reduce, 0.08)}
            className="border-t border-[#26272F] py-20 lg:col-span-5 lg:border-l lg:border-t-0 lg:py-24 lg:pl-14"
          >
            <h2 className="text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#EDEDEF]">
              {es ? "Pila de producción" : "Production stack"}
            </h2>
            <p className="mt-4 max-w-[52ch] text-[15px] leading-relaxed text-[#8B8D98]">
              {es
                ? "Una PWA estática conectada a Supabase Realtime, una app nativa en Kotlin y un servidor MCP. Sin servidores intermedios propios."
                : "A static PWA wired to Supabase Realtime, a native Kotlin companion, and an MCP server. No middleman servers."}
            </p>
            <ul className="mt-8 border-t border-[#26272F]">
              {KRAKOUNT_PAGE.techStack.map((tech) => (
                <li
                  key={tech}
                  className="flex items-center justify-between gap-3 border-b border-[#26272F] py-2.5 text-[13.5px] text-[#EDEDEF]"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Closing sheet */}
        <div className="border-t border-[#26272F] py-24 text-center">
          <motion.div {...revealProps(reduce)} className="mx-auto flex max-w-2xl flex-col items-center">
            <img
              src={ASSETS.krakount.logo660.src}
              alt={ASSETS.krakount.logo660.alt[locale]}
              width={72}
              height={72}
              loading="lazy"
              className="rounded-2xl border border-[#26272F]"
            />
            <p
              className="mt-6 text-[clamp(2.25rem,5vw,3.5rem)] font-black leading-none tracking-[-0.03em] text-[#EDEDEF]"
              style={{ fontFamily: "var(--font-krakount-brand)" }}
            >
              Krakount
            </p>
            <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-[#8B8D98]">
              {es
                ? "En vivo y en uso para repartir gastos, viajar en grupo y liquidar deudas entre divisas."
                : "Live and in daily use for shared expenses, group trips, and multi-currency debts."}
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <a
                href={KRAKOUNT_PAGE.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-[#F5A524] px-6 py-3 text-[15px] font-bold text-[#16130A] transition-colors duration-150 hover:bg-[#E0951A] press-scale"
              >
                {KRAKOUNT_PAGE.nav.ctaLive[locale]}
                <ArrowUpRight size={16} weight="bold" className="cta-arrow cta-arrow-diag" aria-hidden="true" />
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-[#26272F] px-6 py-3 text-[15px] font-semibold text-[#EDEDEF] transition-colors duration-150 hover:border-[#3A3B45] hover:bg-[#17181E] press-scale"
              >
                <ArrowLeft size={15} weight="bold" aria-hidden="true" />
                {es ? "Volver al portfolio" : "Back to the portfolio"}
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-[#26272F] py-6 text-[12px] text-[#8B8D98] sm:flex-row">
          <span>© 2026 Alberto Vizcaíno Ponte · Krakount</span>
          <span className="font-mono tabular-nums">PLN · EUR · NBP</span>
        </div>
      </div>
    </footer>
  );
}
