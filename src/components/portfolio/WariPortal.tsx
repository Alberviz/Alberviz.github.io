"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { WARI } from "@/content/site-copy";
import { WARI_URL } from "@/content/links";
import { WARI_SHOTS } from "@/content/wari-shots";

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
  const reduce = useReducedMotion();
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

      <div className="mx-auto grid w-full max-w-7xl gap-14 px-5 pb-24 pt-32 sm:px-8 sm:pt-40 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-10 lg:pb-32 lg:pt-44">
        {/* Copy */}
        <div className="relative">
          <WariMark className="size-14 rounded-[14px] shadow-[0_10px_30px_-12px_rgb(19_33_59/0.45)]" />

          <h2 className="mt-8 font-wari-display text-balance text-[clamp(2.25rem,4.6vw,3.9rem)] font-semibold leading-[1.02] tracking-[-0.035em]">
            {WARI.title[locale]}
          </h2>

          <p className="mt-6 max-w-[44ch] text-pretty text-[1.0625rem] leading-relaxed text-[color:var(--wari-ink-2)]">
            {WARI.lead[locale]}
          </p>

          <dl className="mt-9 grid max-w-md grid-cols-3 gap-x-4 border-t border-[color:var(--wari-ink)]/15 pt-6">
            {WARI.stats.map((stat) => (
              <div key={stat.value}>
                <dt className="font-wari-display text-[1.9rem] font-semibold leading-none tracking-[-0.03em] tabular-nums sm:text-[2.2rem]">
                  <span className="mb-1.5 block h-[13px] font-wari text-[12.5px] font-normal leading-none tracking-normal text-[color:var(--wari-ink-2)]">
                    {locale === "es" ? stat.preEs : ""}
                  </span>
                  {locale === "es" ? stat.valueEs : stat.value}
                </dt>
                <dd className="mt-2 text-[12.5px] leading-snug text-[color:var(--wari-ink-2)]">
                  {stat.label[locale]}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 max-w-[44ch] text-[13.5px] leading-relaxed text-[color:var(--wari-ink-2)]">
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
    </section>
  );
}
