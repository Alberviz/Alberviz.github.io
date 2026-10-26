"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CurrencyCircleDollar,
  Receipt,
  DeviceMobile,
  Play,
} from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { KRAKOUNT_SPOTLIGHT } from "@/content/portfolio-data";
import { ASSETS } from "@/content/assets";

export function KrakountSpotlight() {
  const { locale } = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);

  const pillarIcons = [
    <CurrencyCircleDollar
      key="money"
      size={20}
      className="text-[#F5A524]"
      weight="bold"
    />,
    <Receipt key="receipt" size={20} className="text-[#F5A524]" weight="bold" />,
    <DeviceMobile
      key="mobile"
      size={20}
      className="text-[#F5A524]"
      weight="bold"
    />,
  ];

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <section
      id="work"
      data-scene="krakount"
      className="py-16 sm:py-24 border-b border-[#232732]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Showcase Container */}
        <div className="bg-[#111318] border border-[#232732] rounded-2xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Narrative, Pillars & CTAs */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div>
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171A21] border border-[#232732] text-xs font-mono text-[#F5A524] mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5A524] animate-pulse" />
                <span>{KRAKOUNT_SPOTLIGHT.badge[locale]}</span>
              </div>

              {/* Title & Tagline */}
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] text-[#ECEEF2]">
                {KRAKOUNT_SPOTLIGHT.title}
              </h2>
              <p className="text-lg sm:text-xl text-[#ECEEF2]/90 mt-2 font-medium leading-snug">
                {KRAKOUNT_SPOTLIGHT.headline[locale]}
              </p>

              {/* Narrative */}
              <p className="text-[#8E95A5] text-sm sm:text-base leading-relaxed mt-4 max-w-[56ch]">
                {KRAKOUNT_SPOTLIGHT.description[locale]}
              </p>

              {/* 3 Engineering Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8">
                {KRAKOUNT_SPOTLIGHT.pillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#171A21]/70 border border-[#232732] flex flex-col justify-between hover:border-[#F5A524]/40 transition-colors"
                  >
                    <div>
                      <div className="mb-2">{pillarIcons[idx]}</div>
                      <h3 className="font-display font-semibold text-xs sm:text-sm text-[#ECEEF2]">
                        {pillar.title[locale]}
                      </h3>
                    </div>
                    <p className="text-[11px] sm:text-xs text-[#8E95A5] mt-2 leading-relaxed">
                      {pillar.detail[locale]}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-8 pt-6 border-t border-[#232732] flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/krakount"
                className="inline-flex items-center gap-2 rounded-full bg-[#10B981] hover:bg-[#059669] text-[#04130D] font-semibold text-xs sm:text-sm px-5 py-2.5 press-scale transition-colors shadow-md shadow-emerald-950/20"
              >
                <span>{KRAKOUNT_SPOTLIGHT.ctaPrimary[locale]}</span>
                <ArrowRight size={16} weight="bold" />
              </Link>
              <button
                type="button"
                onClick={handlePlayVideo}
                className="inline-flex items-center gap-2 rounded-full border border-[#232732] bg-[#171A21] hover:bg-[#232732] text-[#ECEEF2] text-xs sm:text-sm px-4 py-2.5 press-scale transition-colors"
              >
                <Play size={14} weight="fill" className="text-[#F5A524]" />
                <span>{KRAKOUNT_SPOTLIGHT.ctaVideo[locale]}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Real 30s Reel Video + Floating UI Popouts */}
          <div className="lg:col-span-5 bg-[#0E0F13] border-t lg:border-t-0 lg:border-l border-[#232732] p-6 sm:p-8 flex items-center justify-center relative min-h-[460px] overflow-hidden">
            {/* Background Subtle Glow Grid */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, #F5A524 0%, transparent 70%)",
              }}
            />

            {/* Central Phone Mockup with Reel */}
            <div className="relative z-10 w-[220px] sm:w-[240px] rounded-[32px] p-2 bg-[#17181E] border border-[#26272F] shadow-2xl">
              <div className="rounded-[24px] overflow-hidden border border-[#26272F] bg-[#0E0F13] aspect-[608/1080]">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={ASSETS.krakount.reelPoster.src}
                  className="w-full h-full object-cover"
                >
                  <source src={ASSETS.krakount.reel30s.src} type="video/mp4" />
                </video>
              </div>
            </div>

            {/* Floating Popout: Balance Card (Top-Right / Offside) */}
            <div className="absolute top-6 -right-6 sm:right-2 w-[160px] sm:w-[180px] z-20 rounded-xl border border-[#26272F] shadow-2xl hidden sm:block pointer-events-none transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <Image
                src={ASSETS.krakount.pops.balance.src}
                alt={ASSETS.krakount.pops.balance.alt[locale]}
                width={ASSETS.krakount.pops.balance.width}
                height={ASSETS.krakount.pops.balance.height}
                className="w-full h-auto rounded-xl"
              />
            </div>

            {/* Floating Popout: Share Card (Bottom-Left / Offside) */}
            <div className="absolute bottom-6 -left-6 sm:left-2 w-[170px] sm:w-[190px] z-20 rounded-xl border border-[#26272F] shadow-2xl hidden sm:block pointer-events-none transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              <Image
                src={ASSETS.krakount.pops.share.src}
                alt={ASSETS.krakount.pops.share.alt[locale]}
                width={ASSETS.krakount.pops.share.width}
                height={ASSETS.krakount.pops.share.height}
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
