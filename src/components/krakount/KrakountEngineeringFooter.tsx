"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Cpu, Palette, GitBranch } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { KRAKOUNT_PAGE } from "@/content/krakount-data";
import { ASSETS } from "@/content/assets";

export function KrakountEngineeringFooter() {
  const { locale } = useLocale();

  const colorSwatches = [
    { hex: "#0E0F13", name: "Night Canvas", role: "Page Background" },
    { hex: "#17181E", name: "Continuous Sheet", role: "Primary Container" },
    { hex: "#1F2027", name: "Segment Control", role: "Input & Chips" },
    { hex: "#F5A524", name: "Streetlamp Amber", role: "Thumb Action Only" },
    { hex: "#3DD68C", name: "Semantic Mint", role: "Owed to You (+)" },
    { hex: "#FF6B5B", name: "Semantic Coral", role: "You Owe (-)" },
  ];

  return (
    <footer className="py-20 bg-[#0E0F13] border-t border-[#26272F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section 1: Kazimierz de noche design philosophy */}
        <div className="bg-[#17181E] border border-[#26272F] rounded-2xl p-6 sm:p-10 shadow-xl">
          <div className="flex items-center gap-2.5 text-[#F5A524] mb-3">
            <Palette size={20} weight="bold" />
            <h3 className="text-xl sm:text-2xl font-bold text-[#EDEDEF]">
              {KRAKOUNT_PAGE.designSystemNote.title[locale]}
            </h3>
          </div>

          <p className="text-sm sm:text-base text-[#8B8D98] leading-relaxed max-w-4xl">
            {KRAKOUNT_PAGE.designSystemNote.body[locale]}
          </p>

          {/* Color token swatches strip */}
          <div className="mt-8 pt-6 border-t border-[#26272F] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {colorSwatches.map((swatch) => (
              <div
                key={swatch.hex}
                className="p-3 rounded-xl bg-[#1F2027]/70 border border-[#26272F] flex flex-col justify-between"
              >
                <div
                  className="w-full h-8 rounded-lg mb-2.5 border border-[#26272F]/50 shadow-inner"
                  style={{ backgroundColor: swatch.hex }}
                />
                <div>
                  <div className="text-xs font-mono font-bold text-[#EDEDEF] tabular-nums">
                    {swatch.hex}
                  </div>
                  <div className="text-[11px] text-[#8B8D98] leading-tight mt-0.5 font-medium">
                    {swatch.name}
                  </div>
                  <div className="text-[10px] text-[#8B8D98]/70 leading-tight mt-0.5">
                    {swatch.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Production Engineering Stack */}
        <div className="bg-[#17181E] border border-[#26272F] rounded-2xl p-6 sm:p-10 shadow-xl">
          <div className="flex items-center gap-2.5 text-[#F5A524] mb-3">
            <Cpu size={20} weight="bold" />
            <h3 className="text-xl sm:text-2xl font-bold text-[#EDEDEF]">
              {locale === "es"
                ? "Pila Tecnológica y Arquitectura de Producción"
                : "Production Stack & Architecture"}
            </h3>
          </div>

          <p className="text-sm sm:text-base text-[#8B8D98] leading-relaxed max-w-3xl mb-8">
            {locale === "es"
              ? "Cero servicios de fondo propietarios. Una PWA estática conectada a Supabase Realtime, un companion nativo en Kotlin y un servidor MCP para razonamiento de modelos."
              : "Zero proprietary middleman servers. A static PWA connected directly to Supabase Realtime, a native Kotlin companion app, and a native Model Context Protocol server."}
          </p>

          <div className="flex flex-wrap gap-2.5">
            {KRAKOUNT_PAGE.techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-[#1F2027] border border-[#26272F] text-[#EDEDEF] hover:border-[#F5A524]/40 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5A524]" aria-hidden="true" />
                <span>{tech}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Section 3: Final Launchpad Sheet */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#17181E] to-[#1F2027] border border-[#26272F] rounded-2xl p-8 sm:p-12 text-center shadow-2xl">
          <div
            className="pointer-events-none absolute inset-x-0 -top-24 mx-auto w-96 h-96 rounded-full bg-[#F5A524]/10 blur-[100px]"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <Image
              src={ASSETS.krakount.logo660.src}
              alt={ASSETS.krakount.logo660.alt[locale]}
              width={72}
              height={72}
              className="rounded-2xl shadow-xl border border-[#26272F] mb-6"
            />

            <span
              className="text-3xl sm:text-4xl font-black text-[#EDEDEF] tracking-tight"
              style={{ fontFamily: "var(--font-krakount-brand)" }}
            >
              Krakount
            </span>

            <p className="mt-3 text-sm sm:text-base text-[#8B8D98] leading-relaxed">
              {locale === "es"
                ? "Aplicación en vivo abierta y operativa para repartir gastos, viajar en grupo y liquidar deudas entre divisas."
                : "Live application deployed and operational for group trips, supermarket receipts, and multi-currency debts."}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href={KRAKOUNT_PAGE.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#F5A524] hover:bg-[#E0951A] text-[#16130A] font-bold rounded-full px-6 py-3.5 press-scale text-sm sm:text-base shadow-xl shadow-[#F5A524]/20 transition-colors"
              >
                <span>{KRAKOUNT_PAGE.nav.ctaLive[locale]}</span>
                <ArrowUpRight size={18} weight="bold" />
              </a>

              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#17181E] hover:bg-[#1F2027] text-[#EDEDEF] border border-[#26272F] hover:border-[#EDEDEF]/40 font-semibold rounded-full px-6 py-3.5 press-scale text-sm sm:text-base transition-colors"
              >
                <ArrowLeft size={16} weight="bold" />
                <span>
                  {locale === "es"
                    ? "Volver al Portfolio de Alberto"
                    : "Back to Alberto Vizcaíno Portfolio"}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Micro copyright row */}
        <div className="pt-6 border-t border-[#26272F]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8B8D98]">
          <div className="flex items-center gap-2">
            <span>© 2026 Alberto Vizcaíno Ponte</span>
            <span>·</span>
            <span>Krakount · Kazimierz de noche</span>
          </div>
          <div>
            <span className="font-mono tabular-nums">PLN · EUR · NBP Table A</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
