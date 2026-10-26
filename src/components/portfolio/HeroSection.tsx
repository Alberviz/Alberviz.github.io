"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  DownloadSimple,
  GithubLogo,
  LinkedinLogo,
} from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import type { Locale } from "@/lib/i18n-context";
import { PROFILE } from "@/content/portfolio-data";
import { ASSETS } from "@/content/assets";
import { DURATION, EASE_OUT, SPRING_LAYOUT, usePointerDepth } from "@/lib/motion";

type PreviewTab = "krakount" | "desktop";

const TABS: { id: PreviewTab; index: string; label: Record<Locale, string> }[] = [
  { id: "krakount", index: "01", label: { en: "Krakount PWA", es: "Krakount PWA" } },
  { id: "desktop", index: "02", label: { en: "AI Linux Desktop", es: "Escritorio Linux IA" } },
];

export function HeroSection() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const words = PROFILE.hero.headline[locale].split(" ");

  const rise = (delay: number) => ({
    initial: { opacity: 0, transform: reduce ? "none" : "translateY(10px)" },
    animate: { opacity: 1, transform: "translateY(0px)" },
    transition: { duration: DURATION.reveal, ease: EASE_OUT, delay },
  });

  return (
    <section
      id="hero"
      data-scene="hero"
      className="relative flex min-h-[calc(100dvh-3.5rem)] flex-col justify-center overflow-hidden pb-16 pt-14 md:pt-20"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Copy column */}
          <div className="lg:col-span-6">
            <motion.p
              {...rise(0)}
              className="mb-6 flex items-center gap-2.5 font-mono text-[11px] tracking-[0.08em] text-[#8E95A5]"
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#10B981] status-breath" />
              <span>{PROFILE.hero.eyebrow[locale]}</span>
            </motion.p>

            <h1 className="font-display text-balance text-[clamp(2.5rem,5vw,4.15rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-[#ECEEF2]">
              {words.map((word, i) => (
                // Keyed by index so a locale swap re-renders text without replaying the entrance.
                <React.Fragment key={i}>
                  <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
                    <motion.span
                      className="inline-block"
                      initial={{ transform: reduce ? "translateY(0%)" : "translateY(105%)", opacity: reduce ? 0 : 1 }}
                      animate={{ transform: "translateY(0%)", opacity: 1 }}
                      transition={{ duration: 0.85, ease: EASE_OUT, delay: 0.06 + i * 0.035 }}
                    >
                      {word}
                    </motion.span>
                  </span>
                  {i < words.length - 1 ? " " : null}
                </React.Fragment>
              ))}
            </h1>

            <motion.p
              {...rise(0.32)}
              className="mt-6 max-w-[46ch] text-pretty text-[17px] leading-relaxed text-[#8E95A5]"
            >
              {PROFILE.hero.subtext[locale]}
            </motion.p>

            <motion.div {...rise(0.42)} className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/krakount/"
                className="group inline-flex items-center gap-2 rounded-full bg-[#10B981] px-5 py-2.5 text-[15px] font-semibold text-[#04130D] transition-colors duration-150 hover:bg-[#0FA875] press-scale"
              >
                {PROFILE.hero.primaryCta[locale]}
                <ArrowRight size={16} weight="bold" className="cta-arrow" aria-hidden="true" />
              </Link>
              <a
                href={PROFILE.cvPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#232732] px-5 py-2.5 text-[15px] font-medium text-[#ECEEF2] transition-colors duration-150 hover:border-[#343a48] hover:bg-[#111318] press-scale"
              >
                {PROFILE.hero.secondaryCta[locale]}
                <DownloadSimple size={16} aria-hidden="true" />
              </a>
            </motion.div>

            <motion.div
              {...rise(0.5)}
              className="mt-8 flex items-center gap-5 text-[13px] text-[#8E95A5]"
            >
              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-[#ECEEF2]"
              >
                <GithubLogo size={15} aria-hidden="true" />
                <span className="link-rule">GitHub</span>
              </a>
              <a
                href={PROFILE.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-[#ECEEF2]"
              >
                <LinkedinLogo size={15} aria-hidden="true" />
                <span className="link-rule">LinkedIn</span>
              </a>
              <span aria-hidden="true" className="h-3 w-px bg-[#232732]" />
              <span className="font-mono text-[11px]">{PROFILE.currentLocation[locale]}</span>
            </motion.div>
          </div>

          {/* System preview window */}
          <motion.div
            className="lg:col-span-6"
            initial={{
              opacity: 0,
              transform: reduce ? "none" : "translateY(24px)",
              clipPath: reduce ? "inset(0% 0% 0% 0% round 16px)" : "inset(6% 4% 6% 4% round 16px)",
            }}
            animate={{ opacity: 1, transform: "translateY(0px)", clipPath: "inset(0% 0% 0% 0% round 16px)" }}
            transition={{ duration: 1, ease: EASE_OUT, delay: 0.2 }}
          >
            <SystemPreviewWindow locale={locale} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function SystemPreviewWindow({ locale }: { locale: Locale }) {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<PreviewTab>("krakount");
  const depth = usePointerDepth(2.5);

  return (
    <div style={{ perspective: 1400 }}>
      <motion.div
        {...depth.handlers}
        style={{ transform: depth.transform }}
        className="relative overflow-hidden rounded-2xl border border-[#232732] bg-[#0C0E12] shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)]"
      >
        {/* Pointer illumination: a soft light that follows the cursor (transform only) */}
        {depth.enabled && (
          <motion.div
            aria-hidden="true"
            style={{ transform: depth.glowTransform }}
            className="pointer-events-none absolute -left-[220px] -top-[220px] z-20 h-[440px] w-[440px] rounded-full bg-[radial-gradient(closest-side,rgba(236,238,242,0.06),transparent)]"
          />
        )}

        {/* Window bar: tab switcher */}
        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-[#232732] px-3 py-2.5">
          <LayoutGroup id="hero-preview-tabs">
            <div role="tablist" aria-label={locale === "es" ? "Vista previa" : "Preview"} className="flex items-center gap-1">
              {TABS.map((t) => {
                const selected = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="hero-preview-stage"
                    onClick={() => setTab(t.id)}
                    className={`relative isolate flex items-center gap-2 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors duration-150 press-scale ${
                      selected ? "text-[#ECEEF2]" : "text-[#8E95A5] hover:text-[#ECEEF2]"
                    }`}
                  >
                    {selected && (
                      <motion.span
                        layoutId="hero-preview-pill"
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-full border border-[#2A2F3B] bg-[#171A21]"
                        transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                      />
                    )}
                    <span className={`font-mono text-[10.5px] ${selected ? "text-[#10B981]" : "text-[#5D6474]"}`}>
                      {t.index}
                    </span>
                    {t.label[locale]}
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
          <span className="hidden font-mono text-[10.5px] text-[#5D6474] sm:block">
            {tab === "krakount" ? "krakount.vercel.app" : "hyprland · caelestia 2.5"}
          </span>
        </div>

        {/* Stage */}
        <div id="hero-preview-stage" role="tabpanel" className="relative aspect-[4/3] w-full">
          <AnimatePresence initial={false}>
            {tab === "krakount" ? (
              <motion.div
                key="krakount"
                className="absolute inset-0"
                initial={{ opacity: 0, transform: reduce ? "none" : "translateX(-2%)" }}
                animate={{ opacity: 1, transform: "translateX(0%)" }}
                exit={{ opacity: 0, transform: reduce ? "none" : "translateX(-2%)" }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
              >
                <KrakountScene locale={locale} parallax={depth.parallaxTransform} />
              </motion.div>
            ) : (
              <motion.div
                key="desktop"
                className="absolute inset-0"
                initial={{ opacity: 0, transform: reduce ? "none" : "translateX(2%)" }}
                animate={{ opacity: 1, transform: "translateX(0%)" }}
                exit={{ opacity: 0, transform: reduce ? "none" : "translateX(2%)" }}
                transition={{ duration: 0.45, ease: EASE_OUT }}
              >
                <DesktopScene locale={locale} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

function KrakountScene({
  locale,
  parallax,
}: {
  locale: Locale;
  parallax: ReturnType<typeof usePointerDepth>["parallaxTransform"];
}) {
  const shot = ASSETS.krakount.shots.receipt;
  const pop = ASSETS.krakount.pops.share;
  const balance = ASSETS.krakount.pops.balance;

  return (
    <div className="relative h-full w-full bg-[#0E0F13]">
      {/* Phone */}
      <div className="absolute left-1/2 top-[6%] h-[100%] -translate-x-[62%]">
        <div className="h-full rounded-[30px] border border-[#26272F] bg-[#17181E] p-[5px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
          <img
            src={shot.src}
            alt={shot.alt[locale]}
            width={shot.width}
            height={shot.height}
            className="h-full w-auto rounded-[25px] object-cover object-top"
            draggable={false}
          />
        </div>
      </div>

      {/* Floating proof cards, nudged by the pointer for depth */}
      <motion.div style={{ transform: parallax }} className="absolute right-[5%] top-[12%] w-[34%]">
        <img
          src={balance.src}
          alt={balance.alt[locale]}
          width={balance.width}
          height={balance.height}
          className="h-auto w-full rounded-xl border border-[#26272F] shadow-[0_24px_48px_-20px_rgba(0,0,0,0.9)]"
          draggable={false}
        />
      </motion.div>
      <motion.div style={{ transform: parallax }} className="absolute bottom-[10%] right-[9%] w-[38%]">
        <img
          src={pop.src}
          alt={pop.alt[locale]}
          width={pop.width}
          height={pop.height}
          className="h-auto w-full rounded-xl border border-[#26272F] shadow-[0_24px_48px_-20px_rgba(0,0,0,0.9)]"
          draggable={false}
        />
      </motion.div>

      {/* Bottom fade so the phone settles into the frame */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-[#0C0E12] to-transparent" />
    </div>
  );
}

function DesktopScene({ locale }: { locale: Locale }) {
  const reduce = useReducedMotion();
  const desktop = ASSETS.systems.celestial;
  const facts: { k: string; v: Record<Locale, string> }[] = [
    { k: "Gargantua", v: { en: "GLSL shader reacting to PipeWire", es: "Shader GLSL reactivo a PipeWire" } },
    { k: "Laura", v: { en: "Local voice AI on RTX 4050", es: "IA de voz local en RTX 4050" } },
    { k: "Cuerpo", v: { en: "My watch data as a planet", es: "Los datos de mi reloj como planeta" } },
  ];

  return (
    <div className="flex h-full w-full flex-col bg-[#090A0D]">
      <div className="relative aspect-video w-full overflow-hidden">
        <motion.img
          src={desktop.src}
          alt={desktop.alt[locale]}
          width={desktop.width}
          height={desktop.height}
          className="h-full w-full object-cover"
          initial={{ transform: reduce ? "scale(1)" : "scale(1.06)" }}
          animate={{ transform: "scale(1)" }}
          transition={{ duration: 1.2, ease: EASE_OUT }}
          draggable={false}
        />
      </div>
      <div className="flex flex-1 items-stretch border-t border-[#232732]">
        <dl className="grid flex-1 grid-cols-3 divide-x divide-[#232732]">
          {facts.map((fact) => (
            <div key={fact.k} className="flex flex-col justify-center gap-1 px-3 sm:px-4">
              <dt className="font-mono text-[10.5px] text-[#10B981]">{fact.k}</dt>
              <dd className="text-[11.5px] leading-snug text-[#8E95A5] sm:text-[12.5px]">{fact.v[locale]}</dd>
            </div>
          ))}
        </dl>
        <a
          href="#desktop"
          className="group hidden items-center gap-1.5 border-l border-[#232732] px-4 text-[12.5px] font-medium text-[#ECEEF2] transition-colors duration-150 hover:bg-[#111318] sm:flex"
        >
          {locale === "es" ? "Explorar" : "Explore"}
          <ArrowDown size={13} className="cta-arrow cta-arrow-down" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
