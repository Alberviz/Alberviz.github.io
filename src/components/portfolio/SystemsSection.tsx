"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { SYSTEMS_UI, SYSTEM_PLANETS } from "@/content/systems";
import type { SystemPlanet } from "@/content/systems";
import { EASE_OUT, revealProps } from "@/lib/motion";

/**
 * Orbital map of the home setup. The Raspberry Pi 5 is the star; each system is
 * a real <button> on its own ring. Positions are written straight to the DOM
 * from one rAF loop (no React state per frame) and use container query units,
 * so the server-rendered layout already matches the first client frame.
 *
 * The loop stops under reduced motion, off screen, while the mouse is over the
 * map, while anything inside has focus, and for a few seconds after a touch, so
 * a target never drifts away from the cursor or the focus ring.
 */

const TAU = Math.PI * 2;
const TOUCH_HOLD_MS = 6000;

/** Fixed decimals so server and client render the same style string. */
const pos = (planet: SystemPlanet, angle: number) => {
  const x = (Math.cos(angle) * planet.orbit.r).toFixed(3);
  const y = (Math.sin(angle) * planet.orbit.r).toFixed(3);
  return `translate(calc(${x}cqw - 50%), calc(${y}cqw - 50%))`;
};

/** Planet sizes in px (visual dot, the hit area is always 44px). */
const DOT: Record<string, number> = { olimpo: 13, networth: 15, aurora: 12, health: 11, laura: 14 };

/** Deterministic star dust (no Math.random: same on server and client). */
const DUST = Array.from({ length: 34 }, (_, i) => {
  const f = (n: number) => n - Math.floor(n);
  const a = f(Math.sin(i * 12.9898) * 43758.5453);
  const b = f(Math.sin(i * 78.233) * 12543.113);
  const c = f(Math.sin(i * 39.425) * 9871.37);
  return { x: +(a * 100).toFixed(2), y: +(b * 100).toFixed(2), r: +(0.12 + c * 0.2).toFixed(2), o: +(0.25 + c * 0.45).toFixed(2) };
});

function Fact({ fact, locale }: { fact: SystemPlanet["facts"][number]; locale: "en" | "es" }) {
  return (
    <div className="min-w-0">
      <dt className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink">
        {locale === "es" && fact.valueEs ? fact.valueEs : fact.value}
      </dt>
      <dd className="mt-2 max-w-[30ch] text-[13.5px] leading-snug text-muted">{fact.label[locale]}</dd>
    </div>
  );
}

export function SystemsSection() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState(SYSTEM_PLANETS[0].id);
  const active = SYSTEM_PLANETS.find((p) => p.id === activeId) ?? SYSTEM_PLANETS[0];

  const stageRef = useRef<HTMLDivElement>(null);
  const planetRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const inView = useInView(stageRef, { margin: "80px" });

  /* Loop gates, kept in refs so flipping them never re-renders. */
  const flags = useRef({ hover: false, focus: false, holdUntil: 0, inView: false });
  useEffect(() => {
    flags.current.inView = inView;
  }, [inView]);

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let last = performance.now();
    const angles: Record<string, number> = Object.fromEntries(SYSTEM_PLANETS.map((p) => [p.id, p.orbit.phase]));

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const f = flags.current;
      const paused = f.hover || f.focus || now < f.holdUntil || !f.inView;
      if (!paused) {
        for (const p of SYSTEM_PLANETS) {
          angles[p.id] = (angles[p.id] + (TAU / p.orbit.period) * dt) % TAU;
          const el = planetRefs.current[p.id];
          if (el) el.style.transform = pos(p, angles[p.id]);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  return (
    <section id="sistemas" data-scene="systems" className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-[var(--spacing-section)] sm:px-8">
        <motion.div {...revealProps(reduce)} className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2
            className="font-display text-balance text-[clamp(2.2rem,4.4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink lg:col-span-7"
            style={{ fontVariationSettings: '"opsz" 80' }}
          >
            {SYSTEMS_UI.heading[locale]}
          </h2>
          <p className="max-w-[46ch] text-pretty text-[15.5px] leading-relaxed text-muted lg:col-span-5">
            {SYSTEMS_UI.lead[locale]}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          {/* Orbital map */}
          <motion.div
            {...revealProps(reduce, 0.06)}
            className="relative mx-auto w-full max-w-[40rem]"
          >
            <div
              ref={stageRef}
              role="group"
              aria-label={SYSTEMS_UI.stageLabel[locale]}
              className="relative aspect-square w-full [container-type:inline-size]"
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") flags.current.hover = true;
              }}
              onPointerLeave={(e) => {
                if (e.pointerType === "mouse") flags.current.hover = false;
              }}
              onPointerDown={(e) => {
                if (e.pointerType !== "mouse") flags.current.holdUntil = performance.now() + TOUCH_HOLD_MS;
              }}
              onFocus={() => {
                flags.current.focus = true;
              }}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) flags.current.focus = false;
              }}
            >
              <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                <defs>
                  <radialGradient id="sys-star" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F2B36F" stopOpacity="0.55" />
                    <stop offset="40%" stopColor="#F2B36F" stopOpacity="0.14" />
                    <stop offset="100%" stopColor="#F2B36F" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {DUST.map((d, i) => (
                  <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#ECEDF0" opacity={d.o} />
                ))}
                {SYSTEM_PLANETS.map((p) => (
                  <g key={p.id}>
                    <circle
                      cx="50"
                      cy="50"
                      r={p.orbit.r}
                      fill="none"
                      stroke="#2A2F3B"
                      strokeWidth="0.22"
                      strokeDasharray={p.id === "laura" ? "0.8 1.6" : undefined}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={p.orbit.r}
                      fill="none"
                      stroke="#F2B36F"
                      strokeWidth="0.26"
                      strokeDasharray={p.id === "laura" ? "0.8 1.6" : undefined}
                      style={{ opacity: p.id === activeId ? 0.6 : 0, transition: "opacity 240ms cubic-bezier(0.23, 1, 0.32, 1)" }}
                    />
                  </g>
                ))}
                <circle cx="50" cy="50" r="13" fill="url(#sys-star)" />
                <ellipse cx="50" cy="50" rx="7.4" ry="2.1" fill="none" stroke="#F2B36F" strokeOpacity="0.8" strokeWidth="0.35" transform="rotate(-16 50 50)" />
                <circle cx="50" cy="50" r="2.9" fill="#F2B36F" />
                <circle cx="50" cy="50" r="1.5" fill="#FFE2BC" />
              </svg>

              <p className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 whitespace-nowrap font-mono text-[10.5px] tracking-[0.02em] text-muted [text-shadow:0_0_10px_var(--bg)] sm:text-[11px]">
                {SYSTEMS_UI.star[locale]}
              </p>

              {SYSTEM_PLANETS.map((p) => {
                const isActive = p.id === activeId;
                const size = DOT[p.id] ?? 12;
                return (
                  <button
                    key={p.id}
                    ref={(el) => {
                      planetRefs.current[p.id] = el;
                    }}
                    type="button"
                    aria-pressed={isActive}
                    aria-controls="systems-panel"
                    aria-label={`${p.name[locale]}. ${p.line[locale]}`}
                    onClick={() => setActiveId(p.id)}
                    onFocus={() => setActiveId(p.id)}
                    onPointerEnter={(e) => {
                      if (e.pointerType === "mouse") setActiveId(p.id);
                    }}
                    className="group absolute left-1/2 top-1/2 z-10 flex h-11 w-11 flex-col items-center justify-center rounded-full outline-none will-change-transform"
                    style={{ transform: pos(p, p.orbit.phase) }}
                  >
                    <span aria-hidden="true" className="relative block rounded-full bg-[#C9CDD6] outline outline-0 outline-offset-[7px] outline-accent group-focus-visible:outline-2" style={{ width: size, height: size }}>
                      <span
                        className="absolute inset-0 rounded-full bg-accent transition-opacity duration-200 ease-[var(--ease-out)]"
                        style={{
                          opacity: isActive ? 1 : 0,
                          boxShadow: "0 0 0 5px rgb(242 179 111 / 0.18), 0 0 26px 2px rgb(242 179 111 / 0.45)",
                        }}
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute top-full -mt-0.5 whitespace-nowrap font-mono text-[10.5px] leading-none transition-colors duration-200 [text-shadow:0_0_8px_var(--bg),0_0_3px_var(--bg)] sm:text-[11.5px] ${
                        isActive ? "text-accent" : "text-ink/80"
                      }`}
                    >
                      {p.name[locale]}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 flex items-center gap-2 font-mono text-[11px] text-muted">
              <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              {SYSTEMS_UI.hint[locale]}
            </p>
          </motion.div>

          {/* Ficha */}
          <div id="systems-panel" aria-live="polite" className="min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={{ opacity: 0, transform: reduce ? "none" : "translateY(10px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                exit={{ opacity: 0, transform: reduce ? "none" : "translateY(-4px)" }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
              >
                <h3
                  className="font-display text-[clamp(2.2rem,4vw,3.4rem)] font-semibold leading-none tracking-[-0.035em] text-ink"
                  style={{ fontVariationSettings: '"opsz" 80' }}
                >
                  {active.name[locale]}
                </h3>
                <p className="mt-4 max-w-[30ch] text-balance text-[1.2rem] font-medium leading-snug text-ink">
                  {active.line[locale]}
                </p>
                <p className="mt-4 max-w-[52ch] text-pretty text-[15px] leading-relaxed text-muted">
                  {active.body[locale]}
                </p>

                <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 border-t border-line pt-7 sm:grid-cols-2">
                  {active.facts.map((fact) => (
                    <Fact key={fact.value} fact={fact} locale={locale} />
                  ))}
                </dl>

                <div className="mt-7 grid gap-3 border-t border-line pt-6 text-[13.5px] sm:grid-cols-[6.5rem_1fr]">
                  <p className="font-mono text-[11.5px] text-muted">{SYSTEMS_UI.runsOn[locale]}</p>
                  <p className="text-ink/90">{active.host[locale]}</p>
                  <p className="font-mono text-[11.5px] text-muted">{SYSTEMS_UI.stack[locale]}</p>
                  <ul className="flex flex-wrap gap-1.5">
                    {active.stack.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-line px-2.5 py-1 font-mono text-[11.5px] leading-none text-ink/85"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {active.links && active.links.length > 0 && (
                  <div className="mt-7 flex flex-wrap gap-2">
                    {active.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group press-scale inline-flex h-10 items-center gap-2 rounded-full border border-ink/25 px-4 text-[13.5px] font-medium text-ink transition-colors duration-150 hover:border-ink/50"
                      >
                        {link.kind === "github" && <GithubLogo size={15} aria-hidden="true" />}
                        {link.label[locale]}
                        <ArrowUpRight size={13} className="cta-arrow cta-arrow-diag text-muted" aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
