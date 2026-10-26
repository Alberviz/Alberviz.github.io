"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowRight, Pause, Play } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import type { Locale } from "@/lib/i18n-context";
import { KRAKOUNT_SPOTLIGHT } from "@/content/portfolio-data";
import { ASSETS } from "@/content/assets";
import type { MediaAsset } from "@/content/assets";
import { EASE_OUT, SPRING_LAYOUT, revealProps, useFinePointer } from "@/lib/motion";

type PillarScene = {
  screen: MediaAsset;
  pop?: { asset: MediaAsset; placement: "top" | "bottom" };
  caption: Record<Locale, string>;
};

const PILLAR_SCENES: PillarScene[] = [
  {
    screen: ASSETS.krakount.shots.settled,
    pop: { asset: ASSETS.krakount.pops.balance, placement: "top" },
    caption: { en: "Settled to the grosz", es: "Liquidado al grosz" },
  },
  {
    screen: ASSETS.krakount.shots.receipt,
    pop: { asset: ASSETS.krakount.pops.share, placement: "bottom" },
    caption: { en: "Receipt lines claimed live", es: "Líneas del ticket reclamadas en vivo" },
  },
  {
    screen: ASSETS.krakount.shots.captura,
    caption: { en: "Captura: payments to review", es: "Captura: pagos por revisar" },
  },
];

export function KrakountSpotlight() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stageRef, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [36, -36]);
  const phoneTransform = useMotionTemplate`translate3d(0, ${drift}px, 0)`;

  const pillars = KRAKOUNT_SPOTLIGHT.pillars;
  const scene = PILLAR_SCENES[active] ?? PILLAR_SCENES[0];

  const selectPillar = (index: number) => {
    setActive(index);
    setPlaying(false);
  };

  return (
    <section id="work" data-scene="krakount" className="border-t border-[#232732]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Narrative + pillar triggers */}
          <div className="py-20 lg:col-span-7 lg:py-28 lg:pr-14">
            <motion.div {...revealProps(reduce)}>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <h2 className="font-display text-[clamp(2.25rem,4vw,3.25rem)] font-semibold leading-none tracking-[-0.035em] text-[#ECEEF2]">
                  {KRAKOUNT_SPOTLIGHT.title}
                </h2>
                <span className="inline-flex items-center gap-2 font-mono text-[11px] text-[#8E95A5]">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#F5A524] status-breath" />
                  {KRAKOUNT_SPOTLIGHT.badge[locale]}
                </span>
              </div>

              <p className="mt-6 max-w-[30ch] text-balance font-display text-[clamp(1.35rem,2.2vw,1.75rem)] font-medium leading-[1.2] tracking-[-0.02em] text-[#ECEEF2]">
                {KRAKOUNT_SPOTLIGHT.headline[locale]}
              </p>

              <p className="mt-5 max-w-[62ch] text-pretty text-[15px] leading-relaxed text-[#8E95A5]">
                {KRAKOUNT_SPOTLIGHT.description[locale]}
              </p>
            </motion.div>

            <LayoutGroup id="spotlight-pillars">
              <ol className="mt-12 border-t border-[#232732]">
                {pillars.map((pillar, idx) => {
                  const isActive = idx === active && !playing;
                  return (
                    <motion.li key={idx} {...revealProps(reduce, 0.06 * idx)} className="border-b border-[#232732]">
                      <button
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => selectPillar(idx)}
                        onPointerEnter={fine ? () => selectPillar(idx) : undefined}
                        onFocus={() => selectPillar(idx)}
                        className="relative isolate grid w-full grid-cols-[2.25rem_1fr] gap-x-3 px-3 py-5 text-left sm:grid-cols-[2.75rem_1fr]"
                      >
                        {isActive && (
                          <motion.span
                            layoutId="spotlight-pillar-bg"
                            aria-hidden="true"
                            className="absolute inset-0 -z-10 bg-[#111318]"
                            transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                          >
                            <span className="absolute inset-y-0 left-0 w-px bg-[#10B981]" />
                          </motion.span>
                        )}
                        <span
                          className={`pt-0.5 font-mono text-[11px] transition-colors duration-200 ${
                            isActive ? "text-[#10B981]" : "text-[#5D6474]"
                          }`}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <span
                            className={`block text-[15.5px] font-semibold tracking-[-0.01em] transition-colors duration-200 ${
                              isActive ? "text-[#ECEEF2]" : "text-[#B4BAC6]"
                            }`}
                          >
                            {pillar.title[locale]}
                          </span>
                          <span
                            className={`mt-1.5 block max-w-[58ch] text-[13.5px] leading-relaxed transition-opacity duration-200 ${
                              isActive ? "text-[#8E95A5] opacity-100" : "text-[#8E95A5] opacity-60"
                            }`}
                          >
                            {pillar.detail[locale]}
                          </span>
                        </span>
                      </button>
                    </motion.li>
                  );
                })}
              </ol>
            </LayoutGroup>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/krakount/"
                className="group inline-flex items-center gap-2 rounded-full bg-[#10B981] px-5 py-2.5 text-[14px] font-semibold text-[#04130D] transition-colors duration-150 hover:bg-[#0FA875] press-scale"
              >
                {KRAKOUNT_SPOTLIGHT.ctaPrimary[locale]}
                <ArrowRight size={15} weight="bold" className="cta-arrow" aria-hidden="true" />
              </Link>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-pressed={playing}
                className="inline-flex items-center gap-2 rounded-full border border-[#232732] px-4 py-2.5 text-[14px] font-medium text-[#ECEEF2] transition-colors duration-150 hover:border-[#343a48] hover:bg-[#111318] press-scale"
              >
                {playing ? (
                  <Pause size={13} weight="fill" aria-hidden="true" />
                ) : (
                  <Play size={13} weight="fill" className="text-[#F5A524]" aria-hidden="true" />
                )}
                {playing ? (locale === "es" ? "Volver a pantallas" : "Back to screens") : KRAKOUNT_SPOTLIGHT.ctaVideo[locale]}
              </button>
            </div>
          </div>

          {/* Device stage */}
          <div
            ref={stageRef}
            className="relative flex min-h-[620px] items-center justify-center overflow-hidden border-t border-[#232732] py-16 lg:col-span-5 lg:border-l lg:border-t-0"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(245,165,36,0.07),transparent)]"
            />

            <motion.div style={{ transform: phoneTransform }} className="relative">
              <div className="relative w-[248px] rounded-[38px] border border-[#26272F] bg-[#17181E] p-[6px] shadow-[0_50px_90px_-40px_rgba(0,0,0,0.95)] sm:w-[264px]">
                <div className="relative aspect-[780/1688] overflow-hidden rounded-[32px] bg-[#0E0F13]">
                  <AnimatePresence initial={false}>
                    {playing ? (
                      <motion.video
                        key="reel"
                        src={ASSETS.krakount.reel30s.src}
                        poster={ASSETS.krakount.reel30s.poster}
                        width={ASSETS.krakount.reel30s.width}
                        height={ASSETS.krakount.reel30s.height}
                        autoPlay
                        muted
                        loop
                        playsInline
                        aria-label={ASSETS.krakount.reel30s.alt[locale]}
                        className="absolute inset-0 h-full w-full object-cover"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, ease: EASE_OUT }}
                      />
                    ) : (
                      <motion.img
                        key={scene.screen.src}
                        src={scene.screen.src}
                        alt={scene.screen.alt[locale]}
                        width={scene.screen.width}
                        height={scene.screen.height}
                        draggable={false}
                        className="absolute inset-0 h-full w-full object-cover object-top"
                        initial={{ opacity: 0, transform: reduce ? "none" : "scale(1.03)" }}
                        animate={{ opacity: 1, transform: "scale(1)" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE_OUT }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {!playing && scene.pop && (
                  <motion.div
                    key={scene.pop.asset.src}
                    className={`absolute w-[200px] sm:w-[220px] ${
                      scene.pop.placement === "top" ? "-left-16 top-14 sm:-left-24" : "-left-14 bottom-20 sm:-left-24"
                    }`}
                    initial={{ opacity: 0, transform: reduce ? "none" : "translateY(14px) scale(0.96)" }}
                    animate={{ opacity: 1, transform: "translateY(0px) scale(1)", transition: { duration: 0.5, ease: EASE_OUT, delay: 0.08 } }}
                    exit={{ opacity: 0, transform: reduce ? "none" : "translateY(6px) scale(0.98)", transition: { duration: 0.16, ease: EASE_OUT } }}
                  >
                    <img
                      src={scene.pop.asset.src}
                      alt={scene.pop.asset.alt[locale]}
                      width={scene.pop.asset.width}
                      height={scene.pop.asset.height}
                      draggable={false}
                      className="h-auto w-full rounded-2xl border border-[#26272F] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.95)]"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-6 flex h-5 items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={playing ? "reel" : active}
                    className="font-mono text-[11px] text-[#8E95A5]"
                    initial={{ opacity: 0, transform: reduce ? "none" : "translateY(6px)" }}
                    animate={{ opacity: 1, transform: "translateY(0px)" }}
                    exit={{ opacity: 0, transform: reduce ? "none" : "translateY(-6px)" }}
                    transition={{ duration: 0.18, ease: EASE_OUT }}
                  >
                    {playing ? (locale === "es" ? "Reel de 30 s" : "30 s reel") : scene.caption[locale]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
