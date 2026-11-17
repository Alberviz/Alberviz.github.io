"use client";

import React, { useEffect, useRef, useState } from "react";
import {AnimatePresence, motion, useScroll, useTransform} from "motion/react";
import { ArrowUpRight, Lightning } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { WARI } from "@/content/site-copy";
import { WARI_URL } from "@/content/links";
import { WARI_SHOTS, WARI_STORY_SHOTS } from "@/content/wari-shots";
import { EASE_OUT, useReducedMotionSafe } from "@/lib/motion";

/**
 * Wari portal: the one color block of the page. The deep-space page dissolves
 * into Wari's own fog (light blue gradient, peach and periwinkle halos), with
 * the real app screens in phone frames tilted in depth.
 */

/** Deterministic star field (no Math.random: identical on server and client). */
const STARS = Array.from({ length: 46 }, (_, i) => {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.sin(i * 78.233) * 12543.113;
  const c = Math.sin(i * 39.425) * 9871.37;
  const f = (n: number) => n - Math.floor(n);
  return { x: f(a) * 1600, y: f(b) * 440, r: 0.5 + f(c) * 0.9, o: 0.3 + f(a + b) * 0.55 };
});

function WariMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <rect width="100" height="100" rx="22" fill="#F3F5FA" />
      <g transform="translate(50 50) scale(1.1) translate(-50 -50)" fill="#1B4FA0">
        <path d="M37.72 84.98L36.2 84.74L34.74 84.05L33.59 83.03L32.73 81.67L17.43 39.46L17.19 38.29L17.19 37.1L17.42 35.93L17.87 34.83L18.53 33.84L19.37 32.99L20.36 32.33L21.46 31.87L22.48 31.65L23.53 31.61L24.56 31.74L25.56 32.06L26.48 32.54L27.32 33.17L28.03 33.93L28.6 34.8L29.02 35.77L37.86 61.95L41.49 51.35L42.33 49.99L42.92 49.37L43.57 48.86L44.74 48.25L46.1 47.91L47.42 47.9L48.78 48.2L49.97 48.78L51.05 49.67L51.85 50.72L52.41 52L52.6 52.83L52.67 53.72L52.59 54.69L52.38 55.52L42.95 81.67L42.56 82.4L42.07 83.06L41.48 83.64L40.82 84.13L40.09 84.51L39.32 84.79Z" />
        <path d="M55.82 84.99L55.13 84.94L54.46 84.82L53.3 84.39L52.27 83.72L51.77 83.25L51.33 82.72L50.95 82.15L50.65 81.53L50.31 80.35L50.23 79.12L50.31 78.43L50.46 77.77L64.64 35.77L64.92 35.08L65.53 34.06L66.22 33.28L67.04 32.62L67.95 32.12L68.94 31.78L69.97 31.62L71.16 31.65L72.18 31.86L73.28 32.32L74.28 32.98L75.12 33.82L75.78 34.82L76.24 35.92L76.47 37.09L76.47 38.28L76.24 39.45L60.94 81.66L60.55 82.38L60.06 83.05L59.58 83.54L58.93 84.04L58.21 84.45L57.44 84.75L56.64 84.93Z" />
        <circle cx="75.93" cy="21.94" r="6.94" />
      </g>
    </svg>
  );
}

/** Phone slots: x/y in % of the stage, rotation in degrees, depth for scroll parallax. */
const SLOTS = [
  { left: "0%", top: "14%", rot: -7, depth: -26, z: 1, w: 0.82 },
  { left: "30%", top: "0%", rot: 0, depth: -52, z: 3, w: 1 },
  { left: "61%", top: "17%", rot: 7, depth: -14, z: 2, w: 0.82 },
] as const;

function Phone({
  shot,
  slot,
  index,
  progress,
  reduce,
  locale,
}: {
  shot: (typeof WARI_SHOTS)[number];
  slot: (typeof SLOTS)[number];
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduce: boolean | null;
  locale: "en" | "es";
}) {
  const y = useTransform(progress, [0, 1], [-slot.depth * 0.8, slot.depth * 0.8]);
  return (
    <motion.div
      className="wari-phone-slot absolute"
      style={{
        left: slot.left,
        top: slot.top,
        zIndex: slot.z,
        width: `calc(var(--wari-phone) * ${slot.w})`,
        y: reduce ? 0 : y,
      }}
    >
      <div
        className="wari-phone"
        style={{ transform: `rotate(${slot.rot}deg)` }}
        data-index={index}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={shot.src}
          width={shot.width}
          height={shot.height}
          alt={shot.alt[locale]}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="block h-auto w-full rounded-[1.75rem]"
        />
      </div>
    </motion.div>
  );
}

export function WariPortal() {
  const { locale } = useLocale();
  const reduce = useReducedMotionSafe();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const tiltY = useTransform(scrollYProgress, [0, 0.5, 1], [-22, -14, -8]);
  const tiltX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 6, 3]);
  const sheetY = useTransform(scrollYProgress, [0, 1], [30, -50]);

  return (
    <section
      ref={sectionRef}
      id="wari"
      data-scene="wari"
      data-surface="wari"
      className="wari-portal relative isolate overflow-clip font-wari text-[color:var(--wari-ink)]"
    >
      {/* Dawn: space melts into fog. Stars fade out as the light rises. */}
      <div aria-hidden="true" className="wari-dawn pointer-events-none absolute inset-x-0 top-0 -z-10 h-[28rem]" />
      <svg
        aria-hidden="true"
        className="wari-stars pointer-events-none absolute inset-x-0 top-0 -z-10 h-[27.5rem] w-full"
        preserveAspectRatio="xMidYMin slice"
        viewBox="0 0 1600 440"
      >
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ECEDF0" opacity={s.o} />
        ))}
      </svg>
      <div aria-hidden="true" className="wari-halo wari-halo-peach pointer-events-none absolute -z-10" />
      <div aria-hidden="true" className="wari-halo wari-halo-blue pointer-events-none absolute -z-10" />

      <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 pb-24 pt-32 sm:px-8 sm:pt-40 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-10 lg:pb-28 lg:pt-44">
        {/* Copy */}
        <div className="relative">
          <div className="flex items-center gap-4">
            <WariMark className="size-14 rounded-[14px] shadow-[0_10px_30px_-12px_rgb(19_33_59/0.45)]" />
            <p className="rounded-full border border-white/90 bg-white/75 px-3 py-1.5 font-wari text-[11.5px] font-semibold uppercase tracking-[0.12em] text-[color:var(--wari-action)] shadow-[0_8px_20px_-14px_rgb(19_33_59/0.5)] backdrop-blur-sm">
              {WARI.eyebrow[locale]}
            </p>
          </div>

          <h2 className="mt-8 font-wari-display text-balance text-[clamp(2.25rem,4.6vw,3.9rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
            {WARI.title[locale]}
          </h2>

          <p className="mt-6 max-w-[44ch] text-pretty text-[1.0625rem] leading-relaxed text-[color:var(--wari-ink-2)]">
            {WARI.lead[locale]}
          </p>

          <p className="mt-6 inline-flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-full border border-white/90 bg-white/55 py-1.5 pl-2.5 pr-4 text-[13px] text-[color:var(--wari-ink-2)] shadow-[0_8px_20px_-14px_rgb(19_33_59/0.5)] backdrop-blur-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--wari-action)] px-2.5 py-0.5 text-[12px] font-semibold text-[color:var(--wari-on-action)]">
              <span aria-hidden="true" className="status-breath h-1.5 w-1.5 rounded-full bg-[#9FE3B8]" />
              {WARI.status[locale]}
            </span>
            {WARI.statusNext[locale]}
          </p>

          <div className="mt-9 max-w-md border-t border-[color:var(--wari-ink)]/15 pt-6">
            <p className="font-wari-display text-[15px] font-semibold tracking-[-0.01em]">{WARI.autoLabel[locale]}</p>
            <ul className="mt-3 space-y-2">
              {WARI.auto.map((item) => (
                <li key={item.en} className="flex items-center gap-2.5 text-[14.5px] text-[color:var(--wari-ink-2)]">
                  <span aria-hidden="true" className="grid size-5 shrink-0 place-items-center rounded-full bg-[color:var(--wari-action)]">
                    <Lightning size={11} weight="fill" className="text-[color:var(--wari-on-action)]" />
                  </span>
                  {item[locale]}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 max-w-[44ch] text-[13.5px] leading-relaxed text-[color:var(--wari-ink-2)]">
            {WARI.name[locale]}
          </p>

          <a
            href={WARI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group press-scale mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-[color:var(--wari-action)] px-6 text-[15px] font-semibold text-[color:var(--wari-on-action)] shadow-[0_12px_28px_-14px_rgb(39_70_122/0.7)] transition-colors duration-150 hover:bg-[#1F3A69]"
          >
            {WARI.cta[locale]}
            <ArrowUpRight size={16} weight="bold" className="cta-arrow-diag" aria-hidden="true" />
          </a>
        </div>

        {/* Depth stage: glass sheets + three real screens */}
        <div className="wari-stage relative mx-auto w-full max-w-[44rem] lg:max-w-none">
          <motion.div
            className="wari-tilt relative"
            style={reduce ? { transform: "rotateY(-14deg) rotateX(6deg)" } : { rotateY: tiltY, rotateX: tiltX }}
          >
            <motion.div
              aria-hidden="true"
              className="wari-sheet absolute inset-x-[2%] top-[8%] h-[84%]"
              style={reduce ? undefined : { y: sheetY }}
            />
            <div className="relative h-[calc(var(--wari-phone)*2.7)]" style={{ ["--wari-phone" as string]: "clamp(9.5rem, 26vw, 15.5rem)" }}>
              {WARI_SHOTS.map((shot, i) => (
                <Phone
                  key={shot.src}
                  shot={shot}
                  slot={SLOTS[i]}
                  index={i}
                  progress={scrollYProgress}
                  reduce={reduce}
                  locale={locale}
                />
              ))}
            </div>
          </motion.div>
          <p className="mt-6 text-center font-mono text-[11px] tracking-[0.04em] text-[color:var(--wari-ink-2)] lg:text-right">
            {WARI.caption[locale]}
          </p>
        </div>
      </div>
      <WariStory locale={locale} reduce={reduce} />
    </section>
  );
}

/**
 * The scroll story. Wide screens: a sticky phone on the left swaps its screen as
 * each chapter crosses the middle of the viewport. Narrow screens: a native
 * horizontal snap carousel, one chapter per card, with dots that follow it.
 */
function WariStory({ locale, reduce }: { locale: "en" | "es"; reduce: boolean | null }) {
  const [active, setActive] = useState(0);
  const [slide, setSlide] = useState(0);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);
  const slideRefs = useRef<(HTMLLIElement | null)[]>([]);
  const scrollerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    chapterRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setSlide(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { root, threshold: 0.6 }
    );
    slideRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const goTo = (i: number) => {
    const el = slideRefs.current[i];
    const root = scrollerRef.current;
    if (!el || !root) return;
    root.scrollTo({ left: el.offsetLeft - root.offsetLeft - 20, behavior: reduce ? "auto" : "smooth" });
  };

  const chapters = WARI.chapters;

  return (
    <div className="relative mx-auto w-full max-w-7xl pb-24 lg:px-8 lg:pb-36">
      <h3 className="px-5 font-wari-display text-[clamp(1.6rem,3vw,2.3rem)] font-semibold tracking-[-0.03em] sm:px-8 lg:px-0">
        {WARI.storyLabel[locale]}
      </h3>

      {/* Wide: sticky phone + chapters */}
      <div className="mt-10 hidden grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-16 lg:grid">
        <div className="relative">
          <div className="sticky top-[calc(50vh-17rem)] mx-auto w-[16rem]">
            <div className="wari-phone relative">
              <div className="relative aspect-[390/844] overflow-hidden rounded-[1.75rem] bg-[#EEF2F8]">
                <AnimatePresence initial={false}>
                  {chapters.map((c, i) =>
                    i === active ? (
                      <motion.img
                        key={c.id}
                        src={WARI_STORY_SHOTS[c.id].src}
                        width={780}
                        height={1688}
                        alt={WARI_STORY_SHOTS[c.id].alt[locale]}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="absolute inset-0 h-full w-full"
                        initial={{ opacity: 0, transform: reduce ? "none" : "translateY(10px)" }}
                        animate={{ opacity: 1, transform: "translateY(0px)" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.32, ease: EASE_OUT }}
                      />
                    ) : null
                  )}
                </AnimatePresence>
              </div>
            </div>
            <ol aria-hidden="true" className="mt-6 flex justify-center gap-2">
              {chapters.map((c, i) => (
                <li
                  key={c.id}
                  className="wari-dot h-1.5 w-6 rounded-full bg-[color:var(--wari-action)]"
                  data-on={i === active ? "1" : "0"}
                />
              ))}
            </ol>
          </div>
        </div>
        <ol>
          {chapters.map((c, i) => (
            <li
              key={c.id}
              ref={(el) => {
                chapterRefs.current[i] = el;
              }}
              data-i={i}
              className="flex min-h-[72vh] flex-col justify-center"
            >
              <p className="font-mono text-[12px] tabular-nums text-[color:var(--wari-ink-2)]">0{i + 1} / 0{chapters.length}</p>
              <p
                className="wari-chapter-title mt-4 max-w-[18ch] font-wari-display text-[clamp(2rem,3.4vw,3rem)] font-semibold leading-[1.04] tracking-[-0.035em]"
                data-on={i === active ? "1" : "0"}
              >
                {c.title[locale]}
              </p>
              <p className="mt-5 max-w-[44ch] text-pretty text-[1.0625rem] leading-relaxed text-[color:var(--wari-ink-2)]">
                {c.body[locale]}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Narrow: snap carousel */}
      <div className="lg:hidden">
        <ul
          ref={scrollerRef}
          className="wari-snap no-scrollbar mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-4 sm:scroll-px-8 sm:px-8"
          aria-label={WARI.storyLabel[locale]}
        >
          {chapters.map((c, i) => (
            <li
              key={c.id}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              data-i={i}
              className="wari-sheet flex w-[84%] max-w-[22rem] shrink-0 snap-start flex-col p-5 sm:w-[46%]"
            >
              <div className="wari-phone mx-auto w-[62%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={WARI_STORY_SHOTS[c.id].src}
                  width={780}
                  height={1688}
                  alt={WARI_STORY_SHOTS[c.id].alt[locale]}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="block h-auto w-full rounded-[1.4rem]"
                />
              </div>
              <p className="mt-5 font-mono text-[11.5px] tabular-nums text-[color:var(--wari-ink-2)]">
                0{i + 1} / 0{chapters.length}
              </p>
              <p className="mt-2 font-wari-display text-[1.45rem] font-semibold leading-[1.1] tracking-[-0.03em]">
                {c.title[locale]}
              </p>
              <p className="mt-2.5 text-pretty text-[15px] leading-relaxed text-[color:var(--wari-ink-2)]">{c.body[locale]}</p>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-center gap-1">
          {chapters.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`${i + 1}: ${c.title[locale]}`}
              aria-current={i === slide ? "true" : undefined}
              className="grid h-10 w-8 place-items-center"
            >
              <span
                aria-hidden="true"
                className="wari-dot block h-1.5 w-6 rounded-full bg-[color:var(--wari-action)]"
                data-on={i === slide ? "1" : "0"}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
