"use client";

import React, { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight, Play } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import type { Locale } from "@/lib/i18n-context";
import { KRAKOUNT_PAGE } from "@/content/krakount-data";
import { ASSETS } from "@/content/assets";
import type { MediaAsset } from "@/content/assets";
import { DURATION, EASE_OUT, SPRING_LAYOUT, usePointerDepth } from "@/lib/motion";

type ScreenId = "reel" | "receipt" | "balances" | "pass";

const SCREENS: { id: ScreenId; label: Record<Locale, string>; shot?: MediaAsset; pop?: MediaAsset }[] = [
  {
    id: "receipt",
    label: { en: "Receipt", es: "Ticket" },
    shot: ASSETS.krakount.shots.receipt,
    pop: ASSETS.krakount.pops.share,
  },
  {
    id: "balances",
    label: { en: "Balances", es: "Saldos" },
    shot: ASSETS.krakount.shots.balances,
    pop: ASSETS.krakount.pops.transfer,
  },
  {
    id: "pass",
    label: { en: "Boarding pass", es: "Pase QR" },
    shot: ASSETS.krakount.shots.pass,
    pop: ASSETS.krakount.pops.flight,
  },
  { id: "reel", label: { en: "30s reel", es: "Reel 30s" } },
];

const TRUST: { k: Record<Locale, string>; v: Record<Locale, string> }[] = [
  { k: { en: "32 currencies", es: "32 divisas" }, v: { en: "Market and Revolut rates", es: "Tipos de mercado y Revolut" } },
  { k: { en: "Offline PWA", es: "PWA offline" }, v: { en: "Passes work without signal", es: "Pases sin cobertura" } },
  { k: { en: "Private OCR", es: "OCR privado" }, v: { en: "Receipt photos never stored", es: "Fotos nunca guardadas" } },
];

export function KrakountHero() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const [screen, setScreen] = useState<ScreenId>("receipt");
  const depth = usePointerDepth(2);
  const words = KRAKOUNT_PAGE.hero.headline[locale].split(" ");
  const current = SCREENS.find((s) => s.id === screen) ?? SCREENS[0];

  const rise = (delay: number) => ({
    initial: { opacity: 0, transform: reduce ? "none" : "translateY(10px)" },
    animate: { opacity: 1, transform: "translateY(0px)" },
    transition: { duration: DURATION.reveal, ease: EASE_OUT, delay },
  });

  return (
    <div className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-[calc(100dvh-3.5rem)] grid-cols-1 items-center gap-14 py-14 lg:grid-cols-12 lg:gap-8 lg:py-16">
          {/* Copy */}
          <div className="lg:col-span-6">
            <motion.p {...rise(0)} className="mb-6 text-[11px] font-bold uppercase tracking-[0.14em] text-[#F5A524]">
              {KRAKOUNT_PAGE.hero.eyebrow[locale]}
            </motion.p>

            <h1 className="text-balance text-[clamp(2.5rem,5.2vw,4.1rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-[#EDEDEF]">
              {words.map((word, i) => (
                <React.Fragment key={i}>
                  <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
                    <motion.span
                      className="inline-block"
                      initial={{ transform: reduce ? "translateY(0%)" : "translateY(105%)", opacity: reduce ? 0 : 1 }}
                      animate={{ transform: "translateY(0%)", opacity: 1 }}
                      transition={{ duration: 0.85, ease: EASE_OUT, delay: 0.05 + i * 0.04 }}
                    >
                      {word}
                    </motion.span>
                  </span>
                  {i < words.length - 1 ? " " : null}
                </React.Fragment>
              ))}
            </h1>

            <motion.p {...rise(0.3)} className="mt-6 max-w-[52ch] text-pretty text-[16.5px] leading-relaxed text-[#8B8D98]">
              {KRAKOUNT_PAGE.hero.subtext[locale]}
            </motion.p>

            <motion.div {...rise(0.4)} className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href={KRAKOUNT_PAGE.liveDemoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-[#F5A524] px-5 py-2.5 text-[15px] font-bold text-[#16130A] transition-colors duration-150 hover:bg-[#E0951A] press-scale"
              >
                {KRAKOUNT_PAGE.hero.primaryCta[locale]}
                <ArrowUpRight size={16} weight="bold" className="cta-arrow cta-arrow-diag" aria-hidden="true" />
              </a>
              <a
                href="#simulator"
                className="group inline-flex items-center gap-2 rounded-full border border-[#26272F] px-5 py-2.5 text-[15px] font-semibold text-[#EDEDEF] transition-colors duration-150 hover:border-[#3A3B45] hover:bg-[#17181E] press-scale"
              >
                {KRAKOUNT_PAGE.hero.secondaryCta[locale]}
                <ArrowDown size={15} weight="bold" className="cta-arrow cta-arrow-down" aria-hidden="true" />
              </a>
              <a
                href={KRAKOUNT_PAGE.youtubeShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-2 py-2.5 text-[13.5px] text-[#8B8D98] transition-colors duration-150 hover:text-[#EDEDEF]"
              >
                <Play size={12} weight="fill" className="text-[#F5A524]" aria-hidden="true" />
                <span className="link-rule">YouTube Shorts</span>
              </a>
            </motion.div>

            <motion.dl
              {...rise(0.5)}
              className="mt-12 grid max-w-[560px] grid-cols-3 divide-x divide-[#26272F] border-t border-[#26272F] pt-5"
            >
              {TRUST.map((t) => (
                <div key={t.k.en} className="px-4 first:pl-0">
                  <dt className="text-[13px] font-semibold text-[#EDEDEF]">{t.k[locale]}</dt>
                  <dd className="mt-1 text-[12px] leading-snug text-[#8B8D98]">{t.v[locale]}</dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Device stage */}
          <div className="relative flex flex-col items-center lg:col-span-6">
            {/* Streetlamp pool: a single warm light under the device */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[45%] h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(245,165,36,0.09),transparent)]"
            />

            <motion.div
              initial={{ opacity: 0, transform: reduce ? "none" : "translateY(48px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.15 }}
              className="relative"
              style={{ perspective: 1400 }}
            >
              <motion.div
                {...depth.handlers}
                style={{ transform: depth.transform }}
                className="relative w-[272px] rounded-[42px] border border-[#26272F] bg-[#17181E] p-[7px] shadow-[0_60px_100px_-40px_rgba(0,0,0,0.95)] sm:w-[292px]"
              >
                <div className="relative aspect-[780/1688] overflow-hidden rounded-[35px] bg-[#0E0F13]">
                  <AnimatePresence initial={false}>
                    {current.shot ? (
                      <motion.img
                        key={current.id}
                        src={current.shot.src}
                        alt={current.shot.alt[locale]}
                        width={current.shot.width}
                        height={current.shot.height}
                        draggable={false}
                        className="absolute inset-0 h-full w-full object-cover object-top"
                        initial={{ opacity: 0, transform: reduce ? "none" : "scale(1.03)" }}
                        animate={{ opacity: 1, transform: "scale(1)" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE_OUT }}
                      />
                    ) : (
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
                        transition={{ duration: 0.35, ease: EASE_OUT }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Context card for the current screen, floating on a nearer plane */}
              <AnimatePresence initial={false}>
                {current.pop && (
                  <motion.div
                    key={current.id}
                    className="absolute -right-10 bottom-24 hidden w-[210px] sm:block lg:-right-24"
                    initial={{ opacity: 0, transform: reduce ? "none" : "translateY(14px) scale(0.96)" }}
                    animate={{ opacity: 1, transform: "translateY(0px) scale(1)", transition: { duration: 0.5, ease: EASE_OUT, delay: 0.08 } }}
                    exit={{ opacity: 0, transition: { duration: 0.15, ease: EASE_OUT } }}
                  >
                    <motion.img
                      src={current.pop.src}
                      alt={current.pop.alt[locale]}
                      width={current.pop.width}
                      height={current.pop.height}
                      draggable={false}
                      style={{ transform: depth.parallaxTransform }}
                      className="h-auto w-full rounded-2xl border border-[#26272F] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.95)]"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Screen switcher */}
            <motion.div {...rise(0.55)} className="relative mt-8">
              <LayoutGroup id="krakount-hero-screens">
                <div
                  role="tablist"
                  aria-label={locale === "es" ? "Pantallas" : "Screens"}
                  className="flex items-center gap-0.5 rounded-full border border-[#26272F] bg-[#17181E]/80 p-1"
                >
                  {SCREENS.map((s) => {
                    const selected = s.id === screen;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setScreen(s.id)}
                        className={`relative isolate rounded-full px-3 py-1.5 text-[12.5px] font-semibold transition-colors duration-150 press-scale ${
                          selected ? "text-[#16130A]" : "text-[#8B8D98] hover:text-[#EDEDEF]"
                        }`}
                      >
                        {selected && (
                          <motion.span
                            layoutId="krakount-hero-screen-pill"
                            aria-hidden="true"
                            className="absolute inset-0 -z-10 rounded-full bg-[#F5A524]"
                            transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                          />
                        )}
                        {s.label[locale]}
                      </button>
                    );
                  })}
                </div>
              </LayoutGroup>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
