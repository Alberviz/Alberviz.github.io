"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, DownloadSimple } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { PROFILE } from "@/content/portfolio-data";
import { ASSETS } from "@/content/assets";
import { EASE_OUT } from "@/lib/motion";

export function HeroSection() {
  const { locale } = useLocale();
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: EASE_OUT,
      },
    },
  };

  return (
    <section
      id="hero"
      data-scene="hero"
      className="relative min-h-[calc(100dvh-4rem)] pt-12 md:pt-16 pb-16 flex flex-col justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column: Stack (Strictly 4 Elements) */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* 1. Eyebrow */}
            <p className="font-mono text-xs font-semibold tracking-wider text-[#10B981] uppercase mb-4">
              {PROFILE.hero.eyebrow[locale]}
            </p>

            {/* 2. Display H1 */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold tracking-[-0.03em] leading-[1.05] text-[#ECEEF2] mb-5">
              {PROFILE.hero.headline[locale]}
            </h1>

            {/* 3. Subtext */}
            <p className="max-w-[54ch] text-base sm:text-lg text-[#8E95A5] leading-relaxed mb-8">
              {PROFILE.hero.subtext[locale]}
            </p>

            {/* 4. Two CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/krakount"
                className="inline-flex items-center gap-2 rounded-full bg-[#10B981] hover:bg-[#059669] text-[#04130D] font-semibold text-sm sm:text-base px-5 py-3 press-scale transition-colors shadow-lg shadow-emerald-950/20"
              >
                <span>{PROFILE.hero.primaryCta[locale]}</span>
                <ArrowRight size={18} weight="bold" />
              </Link>
              <a
                href={PROFILE.cvPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#232732] bg-[#111318] hover:bg-[#171A21] text-[#ECEEF2] font-medium text-sm sm:text-base px-5 py-3 press-scale transition-colors"
              >
                <span>{PROFILE.hero.secondaryCta[locale]}</span>
                <DownloadSimple size={18} weight="bold" />
              </a>
            </div>
          </div>

          {/* Right Column: Real Layered Artifact Stage */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end mt-4 lg:mt-0">
            {/* Backdrop Layer: Real GLSL Gargantua Render Frame */}
            <div className="relative w-full max-w-[420px] aspect-[16/10] rounded-2xl border border-[#232732] bg-[#111318] overflow-hidden shadow-2xl">
              <Image
                src={ASSETS.systems.gargantua.src}
                alt={ASSETS.systems.gargantua.alt[locale]}
                width={ASSETS.systems.gargantua.width}
                height={ASSETS.systems.gargantua.height}
                className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity duration-300"
                priority
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#090A0D]/80 backdrop-blur-md border border-[#232732] text-[11px] font-mono text-[#8E95A5] flex items-center gap-1.5 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span>GLSL Raymarching · Hyprland</span>
              </div>
            </div>

            {/* Foreground Overlapping Mobile Frame: Real Krakount Autoplay Loop */}
            <div className="absolute -bottom-8 -right-2 sm:-right-4 w-[190px] sm:w-[210px] rounded-[28px] p-2 bg-[#171A21] border border-[#232732] shadow-2xl z-10 transition-transform duration-300 hover:scale-[1.02]">
              <div className="rounded-[22px] overflow-hidden border border-[#232732] bg-[#0E0F13] relative aspect-[608/1080]">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={ASSETS.krakount.tripMobileLoop.poster}
                  className="w-full h-full object-cover"
                >
                  <source
                    src={ASSETS.krakount.tripMobileLoop.src}
                    type="video/mp4"
                  />
                </video>
                <Link
                  href="/krakount"
                  className="absolute bottom-2 left-2 right-2 px-2 py-1.5 rounded-xl bg-[#0E0F13]/90 backdrop-blur-md border border-[#26272F] text-[10px] font-mono text-[#F5A524] flex items-center justify-between press-scale"
                >
                  <span>Krakount PWA</span>
                  <ArrowRight size={12} weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
