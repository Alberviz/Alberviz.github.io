"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, ArrowsLeftRight, Play } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { KRAKOUNT_PAGE } from "@/content/krakount-data";
import { ASSETS } from "@/content/assets";

export function KrakountHero() {
  const { locale } = useLocale();

  return (
    <section className="relative min-h-[calc(100dvh-4rem)] pt-12 md:pt-16 pb-16 flex items-center overflow-hidden">
      {/* Kazimierz Amber atmospheric backdrop radial glow */}
      <div
        className="pointer-events-none absolute -top-24 right-1/4 w-[540px] h-[540px] rounded-full bg-[#F5A524]/6 blur-[120px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Asymmetric 6-col copy stack */}
          <div className="lg:col-span-6 flex flex-col items-start">
            {/* Eyebrow 1 of 2 across /krakount */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F2027] border border-[#26272F] text-[11px] font-bold uppercase tracking-widest text-[#F5A524] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5A524] animate-pulse" aria-hidden="true" />
              <span>{KRAKOUNT_PAGE.hero.eyebrow[locale]}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-[-0.03em] leading-[1.06] text-[#EDEDEF]">
              {KRAKOUNT_PAGE.hero.headline[locale]}
            </h1>

            <p className="mt-5 text-[#8B8D98] text-base sm:text-lg max-w-[50ch] leading-relaxed">
              {KRAKOUNT_PAGE.hero.subtext[locale]}
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a
                href={KRAKOUNT_PAGE.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#F5A524] hover:bg-[#E0951A] text-[#16130A] font-bold rounded-full px-5 py-3 press-scale text-sm sm:text-base shadow-lg shadow-[#F5A524]/20 transition-colors"
              >
                <span>{KRAKOUNT_PAGE.hero.primaryCta[locale]}</span>
                <ArrowUpRight size={18} weight="bold" />
              </a>

              <a
                href="#simulator"
                className="inline-flex items-center gap-2 bg-[#17181E] hover:bg-[#1F2027] text-[#EDEDEF] border border-[#26272F] hover:border-[#F5A524]/40 font-semibold rounded-full px-5 py-3 press-scale text-sm sm:text-base transition-colors"
              >
                <span>{KRAKOUNT_PAGE.hero.secondaryCta[locale]}</span>
                <ArrowsLeftRight size={18} weight="bold" />
              </a>
            </div>

            {/* Subtle YouTube Short link */}
            <div className="mt-5">
              <a
                href={KRAKOUNT_PAGE.youtubeShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-xs sm:text-sm text-[#8B8D98] hover:text-[#EDEDEF] transition-colors py-1 group"
              >
                <span className="w-6 h-6 rounded-full bg-[#1F2027] border border-[#26272F] flex items-center justify-center text-[#F5A524] group-hover:bg-[#F5A524] group-hover:text-[#16130A] transition-colors shadow-sm">
                  <Play size={11} weight="fill" />
                </span>
                <span>
                  {locale === "es"
                    ? "Ver reel de 30s en YouTube Shorts"
                    : "Watch 30s reel on YouTube Shorts"}
                </span>
              </a>
            </div>

            {/* Architectural trust markers */}
            <div className="mt-8 pt-6 border-t border-[#26272F] w-full max-w-[50ch] grid grid-cols-3 gap-4 text-xs text-[#8B8D98]">
              <div>
                <span className="text-[#EDEDEF] font-semibold block">Serwist PWA</span>
                <span>{locale === "es" ? "Funciona 100% offline" : "100% offline ready"}</span>
              </div>
              <div>
                <span className="text-[#EDEDEF] font-semibold block">NBP Table A</span>
                <span>{locale === "es" ? "32 divisas al día" : "32 live currencies"}</span>
              </div>
              <div>
                <span className="text-[#EDEDEF] font-semibold block">0% Cloud OCR</span>
                <span>{locale === "es" ? "Sin fotos en servidor" : "Zero server photo storage"}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Real Kazimierz Night Mobile Stage */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Phone hardware frame */}
            <div className="relative bg-[#17181E] border border-[#26272F] rounded-[2.5rem] p-2.5 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.85)] max-w-[290px] sm:max-w-[310px] w-full mx-auto z-10 hover-elevate">
              {/* Top speaker slit */}
              <div className="w-24 h-4 bg-[#0E0F13] rounded-full mx-auto mb-2 flex items-center justify-center gap-1.5" aria-hidden="true">
                <span className="w-2 h-2 rounded-full bg-[#26272F]" />
                <span className="w-8 h-1 bg-[#26272F] rounded-full" />
              </div>

              {/* Real 30-second mobile reel */}
              <div className="rounded-[2rem] overflow-hidden bg-[#0E0F13] border border-[#26272F]">
                <video
                  src={ASSETS.krakount.reel30s.src}
                  poster={ASSETS.krakount.reel30s.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-auto aspect-[608/1080] object-cover"
                  aria-label={ASSETS.krakount.reel30s.alt[locale]}
                />
              </div>
            </div>

            {/* Floating Pop Card 1: Balance breakdown popup */}
            <div
              className="hidden sm:block absolute -left-4 lg:-left-10 top-16 z-20 w-48 lg:w-56 rounded-2xl border border-[#26272F] bg-[#17181E]/95 p-1.5 shadow-[0_16px_36px_rgba(0,0,0,0.7)] backdrop-blur-md hover-elevate press-scale"
              style={{ animation: "floatSlow 6s ease-in-out infinite" }}
            >
              <div className="text-[10px] font-semibold text-[#8B8D98] px-2 py-1 flex items-center justify-between">
                <span>{locale === "es" ? "Saldos Minimizados" : "Minimized Debts"}</span>
                <span className="text-[#3DD68C] font-mono tabular-nums">+42.50 zł</span>
              </div>
              <Image
                src={ASSETS.krakount.pops.balance.src}
                alt={ASSETS.krakount.pops.balance.alt[locale]}
                width={ASSETS.krakount.pops.balance.width}
                height={ASSETS.krakount.pops.balance.height}
                className="rounded-xl w-full h-auto object-contain border border-[#26272F]/50"
              />
            </div>

            {/* Floating Pop Card 2: Flight card popup */}
            <div
              className="hidden sm:block absolute -right-4 lg:-right-8 bottom-12 z-20 w-44 lg:w-52 rounded-2xl border border-[#26272F] bg-[#17181E]/95 p-1.5 shadow-[0_16px_36px_rgba(0,0,0,0.7)] backdrop-blur-md hover-elevate press-scale"
              style={{ animation: "floatSlow 7s ease-in-out 1s infinite" }}
            >
              <div className="text-[10px] font-semibold text-[#8B8D98] px-2 py-1 flex items-center justify-between">
                <span>{locale === "es" ? "Vuelo KRK - MAD" : "Flight KRK - MAD"}</span>
                <span className="text-[#F5A524] font-mono">KRK · T1</span>
              </div>
              <Image
                src={ASSETS.krakount.pops.flight.src}
                alt={ASSETS.krakount.pops.flight.alt[locale]}
                width={ASSETS.krakount.pops.flight.width}
                height={ASSETS.krakount.pops.flight.height}
                className="rounded-xl w-full h-auto object-contain border border-[#26272F]/50"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
