"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useLocale } from "@/lib/i18n-context";
import { ASSETS } from "@/content/assets";
import { GargantuaRenderer, TRACK } from "./gargantua-renderer";

/*
 * Live recreation of the desktop. The black hole is the real shader chain
 * running in WebGL2; the orbital layer mirrors the Quickshell scene in SVG with
 * a curated, collision-free layout and sample data. Coordinates are desktop
 * pixels (1920 x 1080), so pins and camera focus can share them.
 */

export const LAURA = { x: 560, y: 790, r: 48 };
export const CONFIG = { x: 820, y: 520, r: 42 };
export const BODY = { x: 1550, y: 627, r: 24 };

/** Agents share one angular speed and sit 120 degrees apart: they can never overlap. */
const AGENTS = [
  { label: "CLAUDE CODE", rx: 170, phase: 0.4, tone: "planet" },
  { label: "ANTIGRAVITY", rx: 225, phase: 0.4 + (2 * Math.PI) / 3, tone: "violet" },
  { label: "CLAUDE CODE", rx: 280, phase: 0.4 + (4 * Math.PI) / 3, tone: "planet" },
] as const;
const AGENT_RY = 0.45;
const AGENT_PERIOD = 96;

const DEVICES = [
  { label: "MCHOSE K7 ULTRA", rx: 105, phase: 5.2, battery: 0.78, icon: "mouse" },
  { label: "MCHOSE V9 PRO", rx: 150, phase: 5.2 + Math.PI, battery: 0.64, icon: "headset" },
] as const;
const DEVICE_PERIOD = 140;

const COMET = { cx: 700, cy: 640, rx: 640, ry: 250, period: 170, phase: 1.9 };

/** Sample health data (shape of the gym-hub summary API). */
const HEALTH = {
  steps: 6919,
  goal: 10000,
  sleepH: 6.2,
  sleepGoal: 7.5,
  sessions: 1,
  sessionsGoal: 4,
  week: [1, 0.42, 0.81, null, 1, 0.63, 0.69] as (number | null)[],
  habits: [true, false, true, false, true, true, false],
};

const RENDER_W = 1600;
const FRAME_MS = 1000 / 30;

const MONTHS = {
  en: ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"],
  es: ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"],
};
const DAYS = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  es: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
};

const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const thousands = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

function ellipse(cx: number, cy: number, rx: number, ry: number, a: number) {
  return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
}

export function LiveDesktop({ paused = false }: { paused?: boolean }) {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pausedRef = useRef(paused);
  const [state, setState] = useState<"loading" | "ready" | "fallback">("loading");

  const localeRef = useRef(locale);
  const minuteRef = useRef(-1);

  pausedRef.current = paused;
  if (localeRef.current !== locale) {
    localeRef.current = locale;
    minuteRef.current = -1;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const svg = svgRef.current;
    const root = rootRef.current;
    if (!canvas || !svg || !root) return;

    const width = root.clientWidth < 720 ? 960 : RENDER_W;
    const renderer = GargantuaRenderer.create(canvas, width, Math.round((width * 9) / 16));
    if (!renderer) {
      setState("fallback");
      return;
    }

    const q = <T extends Element>(sel: string) => Array.from(svg.querySelectorAll<T>(sel));
    const agents = q<SVGGElement>("[data-agent]");
    const devices = q<SVGGElement>("[data-device]");
    const spinners = q<SVGGElement>("[data-spin]");
    const moons = q<SVGCircleElement>("[data-moon]");
    const comet = svg.querySelector<SVGGElement>("[data-comet]");
    const tail = svg.querySelector<SVGLineElement>("[data-tail]");
    const tailGrad = svg.querySelector<SVGLinearGradientElement>("#comet-tail");
    const trackTime = svg.querySelector<SVGTextElement>("[data-track-time]");
    const clock = svg.querySelector<SVGTextElement>("[data-clock]");
    const day = svg.querySelector<SVGTextElement>("[data-day]");
    const month = svg.querySelector<SVGTextElement>("[data-month]");
    const weekday = svg.querySelector<SVGTextElement>("[data-weekday]");

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { rootMargin: "120px" });
    io.observe(root);

    let raf = 0;
    let last = 0;
    let started = -1;
    let ready = false;

    const place = (t: number) => {
      const wA = (2 * Math.PI) / AGENT_PERIOD;
      // Labels always sit on the side away from their star, so they never cross it.
      const side = (g: SVGGElement, right: boolean) => {
        const label = g.querySelector("text");
        if (!label) return;
        label.setAttribute("x", right ? "30" : "-30");
        label.setAttribute("text-anchor", right ? "start" : "end");
      };
      agents.forEach((g, i) => {
        const a = AGENTS[i];
        const p = ellipse(LAURA.x, LAURA.y, a.rx, a.rx * AGENT_RY, a.phase + wA * t);
        g.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
        side(g, p.x >= LAURA.x);
      });
      const wD = (2 * Math.PI) / DEVICE_PERIOD;
      devices.forEach((g, i) => {
        const d = DEVICES[i];
        const p = ellipse(CONFIG.x, CONFIG.y, d.rx, d.rx * AGENT_RY, d.phase + wD * t);
        g.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
        side(g, p.x >= CONFIG.x);
      });
      spinners.forEach((g) => {
        const speed = Number(g.dataset.spin);
        g.setAttribute("transform", `rotate(${((t * speed) % 360).toFixed(2)})`);
      });
      moons.forEach((m, i) => {
        const p = ellipse(0, 0, BODY.r * 1.75, BODY.r * 1.75 * 0.42, (2 * Math.PI * t) / 240 + (i * Math.PI) / 2);
        m.setAttribute("cx", p.x.toFixed(1));
        m.setAttribute("cy", p.y.toFixed(1));
      });
      if (comet && tail && tailGrad) {
        const c = ellipse(COMET.cx, COMET.cy, COMET.rx, COMET.ry, COMET.phase + (2 * Math.PI * t) / COMET.period);
        const dx = c.x - LAURA.x;
        const dy = c.y - LAURA.y;
        const len = Math.hypot(dx, dy) || 1;
        const tx = c.x + (dx / len) * 230;
        const ty = c.y + (dy / len) * 230;
        comet.setAttribute("transform", `translate(${c.x.toFixed(1)} ${c.y.toFixed(1)})`);
        for (const el of [tail, tailGrad]) {
          el.setAttribute("x1", c.x.toFixed(1));
          el.setAttribute("y1", c.y.toFixed(1));
          el.setAttribute("x2", tx.toFixed(1));
          el.setAttribute("y2", ty.toFixed(1));
        }
      }
      if (trackTime) {
        trackTime.textContent = `▸ ${mmss(renderer.trackPosition(t))}  /  ${mmss(TRACK.duration)}`;
      }
      const now = new Date();
      if (now.getMinutes() !== minuteRef.current && clock && day && month && weekday) {
        minuteRef.current = now.getMinutes();
        const locale = localeRef.current;
        clock.textContent = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        day.textContent = String(now.getDate()).padStart(2, "0");
        month.textContent = MONTHS[locale][now.getMonth()];
        weekday.textContent = DAYS[locale][now.getDay()];
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!ready) {
        ready = renderer.bakeStep();
        if (ready) {
          setState("ready");
          started = now;
        }
        return;
      }
      if (!visible || pausedRef.current || document.hidden) return;
      if (now - last < FRAME_MS) return;
      last = now;
      const t = reduce ? 0 : (now - started) / 1000;
      renderer.render(t);
      place(t);
      if (reduce) cancelAnimationFrame(raf);
    };

    place(0);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      renderer.dispose();
    };
  }, [reduce]);

  const poster = ASSETS.systems.celestial;
  const live = state === "ready";
  const stepsFrac = Math.min(1, HEALTH.steps / HEALTH.goal);
  const lit = Math.min(1, HEALTH.sleepH / HEALTH.sleepGoal);
  // Terminator: shadow on the right covering (1 - lit) of the disc.
  const termX = BODY.r * (2 * lit - 1);
  const stepsLabel = locale === "es" ? "pasos" : "steps";
  const sleepLabel = locale === "es" ? "sueño" : "sleep";
  const sessionsLabel = locale === "es" ? "entrenos" : "workouts";

  return (
    <div ref={rootRef} className="absolute inset-0 bg-[#030304]">
      {/* Poster: shown while the geometry bakes, and as the no-WebGL2 fallback */}
      <img
        src={poster.src}
        alt={poster.alt[locale]}
        width={poster.width}
        height={poster.height}
        draggable={false}
        className={`absolute inset-0 h-full w-full select-none object-cover transition-opacity duration-700 ${live ? "opacity-0" : "opacity-100"}`}
      />

      <div
        aria-hidden="true"
        className={`absolute inset-0 transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`}
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        <svg ref={svgRef} viewBox="0 0 1920 1080" className="absolute inset-0 h-full w-full select-none">
          <defs>
            <radialGradient id="ld-planet" cx="38%" cy="32%" r="75%">
              <stop offset="0%" stopColor="#F3F5F8" />
              <stop offset="45%" stopColor="#A3ACB7" />
              <stop offset="100%" stopColor="#262A30" />
            </radialGradient>
            <radialGradient id="ld-violet" cx="38%" cy="32%" r="75%">
              <stop offset="0%" stopColor="#EEE6F4" />
              <stop offset="45%" stopColor="#A497B2" />
              <stop offset="100%" stopColor="#2A2530" />
            </radialGradient>
            <radialGradient id="ld-laura" cx="40%" cy="36%" r="70%">
              <stop offset="0%" stopColor="#FBF9FF" />
              <stop offset="55%" stopColor="#CFC7DB" />
              <stop offset="100%" stopColor="#857C95" />
            </radialGradient>
            <radialGradient id="ld-config" cx="40%" cy="36%" r="70%">
              <stop offset="0%" stopColor="#EDF3F8" />
              <stop offset="55%" stopColor="#A9B8C6" />
              <stop offset="100%" stopColor="#4A5663" />
            </radialGradient>
            <radialGradient id="ld-body" cx="36%" cy="34%" r="72%">
              <stop offset="0%" stopColor="#F4F6F8" />
              <stop offset="50%" stopColor="#B9C4CD" />
              <stop offset="100%" stopColor="#3C454D" />
            </radialGradient>
            <radialGradient id="ld-glow">
              <stop offset="0%" stopColor="#E9E3F2" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#E9E3F2" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="comet-tail" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E4E2E2" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#E4E2E2" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Caelestia bar */}
          <rect x="10" y="10" width="40" height="1060" rx="20" fill="#0B0C0E" />
          {[66, 92, 118, 176, 202, 262, 288, 348].map((y) => (
            <rect key={y} x="24" y={y - 6} width="12" height="12" rx="3" fill="#9AA0A6" opacity={y < 130 ? 0.9 : 0.45} />
          ))}
          <circle cx="30" cy="435" r="13" fill="none" stroke="#C9D2DA" strokeWidth="3" opacity="0.85" />
          <circle cx="30" cy="1051" r="7" fill="none" stroke="#F97758" strokeWidth="2" />

          {/* Clock and tasks */}
          <text data-clock x="116" y="152" className="font-display" fontSize="104" fontWeight="700" fill="#C9D2DA" letterSpacing="-2">
            23:49
          </text>
          <line x1="471" y1="66" x2="471" y2="164" stroke="#C9D2DA" strokeWidth="3" opacity="0.8" />
          <text data-month x="490" y="88" className="font-display" fontSize="23" fontWeight="700" fill="#C9D2DA" letterSpacing="2.5">
            OCTOBER
          </text>
          <text data-day x="490" y="128" className="font-display" fontSize="36" fontWeight="700" fill="#C9D2DA">
            26
          </text>
          <text data-weekday x="490" y="158" className="font-display" fontSize="21" fill="#AEB6BE" letterSpacing="1">
            Monday
          </text>
          <text x="120" y="212" className="font-mono" fontSize="12.5" fill="#B4BAC2" letterSpacing="3">
            TAREAS <tspan fill="#6B7178">50 · 5 EN CURSO</tspan>
          </text>

          {/* Track readout inside the event horizon */}
          <g className="font-mono" textAnchor="middle">
            <text data-track-time x="1622" y="54" fontSize="10.5" fill="#9AA0A6" letterSpacing="1">
              {`▸ 01:34  /  02:57`}
            </text>
            <text x="1622" y="74" fontSize="15" fontWeight="700" fill="#E4E2E2" letterSpacing="0.5">
              {TRACK.title}
            </text>
            <text x="1622" y="92" fontSize="11" fill="#9AA0A6">
              {TRACK.artist}
            </text>
          </g>

          {/* Orbits */}
          <g fill="none" stroke="#E4E2E2" strokeWidth="1">
            <ellipse cx={COMET.cx} cy={COMET.cy} rx={COMET.rx} ry={COMET.ry} opacity="0.035" />
            {AGENTS.map((a) => (
              <ellipse key={a.rx} cx={LAURA.x} cy={LAURA.y} rx={a.rx} ry={a.rx * AGENT_RY} opacity="0.07" />
            ))}
            {DEVICES.map((d) => (
              <ellipse key={d.rx} cx={CONFIG.x} cy={CONFIG.y} rx={d.rx} ry={d.rx * AGENT_RY} opacity="0.07" />
            ))}
          </g>

          {/* Comet: the tasks backlog, tail always pointing away from Laura */}
          <line data-tail x1="0" y1="0" x2="0" y2="0" stroke="url(#comet-tail)" strokeWidth="2" strokeLinecap="round" />
          <g data-comet>
            <circle r="5" fill="#E4E2E2" />
            <circle r="9" fill="none" stroke="#E4E2E2" strokeOpacity="0.25" />
          </g>

          {/* Configuración: the anchor of every device */}
          <g transform={`translate(${CONFIG.x} ${CONFIG.y})`}>
            <line x1="0" y1={-CONFIG.r - 26} x2="0" y2={CONFIG.r + 26} stroke="#DCE5EC" strokeOpacity="0.35" />
            <line x1={-CONFIG.r - 26} y1="0" x2={CONFIG.r + 26} y2="0" stroke="#DCE5EC" strokeOpacity="0.2" />
            <g data-spin="6">
              <circle r={CONFIG.r + 8} fill="none" stroke="#C9D2DA" strokeOpacity="0.55" strokeDasharray="3 5" />
            </g>
            <circle r={CONFIG.r} fill="url(#ld-config)" />
            <path
              d="M0 -21 L18.2 -10.5 L18.2 10.5 L0 21 L-18.2 10.5 L-18.2 -10.5 Z"
              fill="none"
              stroke="#F4F8FB"
              strokeOpacity="0.55"
              strokeWidth="1.5"
            />
            {/* Below the outer satellite orbit: no satellite can ever pass over it */}
            <text y={DEVICES[1].rx * AGENT_RY + 36} textAnchor="middle" className="font-mono" fontSize="13" fill="#AEB6BE" letterSpacing="3">
              CONFIGURACIÓN
            </text>
          </g>

          {/* Device satellites with live battery rings */}
          {DEVICES.map((d) => (
            <g key={d.label} data-device>
              <circle r="17" fill="#15171A" stroke="#C9D2DA" strokeOpacity="0.25" />
              <circle
                r="17"
                fill="none"
                stroke="#E4E2E2"
                strokeWidth="2.5"
                pathLength={1}
                strokeDasharray={`${d.battery} 1`}
                transform="rotate(-90)"
              />
              {d.icon === "mouse" ? (
                <rect x="-4.5" y="-7" width="9" height="14" rx="4.5" fill="none" stroke="#E4E2E2" strokeWidth="1.6" />
              ) : (
                <path d="M-6 3 V0 a6 6 0 0 1 12 0 V3 M-7 2 h3 v5 h-3z M4 2 h3 v5 h-3z" fill="none" stroke="#E4E2E2" strokeWidth="1.5" />
              )}
              <text x="30" y="5" className="font-mono" fontSize="12" fill="#8E959D" letterSpacing="2.5">
                {d.label}
              </text>
            </g>
          ))}

          {/* Laura, the star: agents orbit her */}
          <g transform={`translate(${LAURA.x} ${LAURA.y})`}>
            <circle r={LAURA.r * 2.6} fill="url(#ld-glow)" />
            <g data-spin="-4">
              <circle r={LAURA.r + 11} fill="none" stroke="#DDD6E6" strokeOpacity="0.5" strokeWidth="3" strokeDasharray="1 4" />
            </g>
            <circle r={LAURA.r + 20} fill="none" stroke="#DDD6E6" strokeOpacity="0.12" />
            <circle r={LAURA.r} fill="url(#ld-laura)" />
            <text x={LAURA.r + 26} y="5" className="font-mono" fontSize="13.5" fill="#C9C2D3" letterSpacing="3">
              LAURA
            </text>
          </g>

          {AGENTS.map((a) => (
            <g key={a.rx} data-agent>
              <circle r="15" fill={a.tone === "violet" ? "url(#ld-violet)" : "url(#ld-planet)"} />
              <ellipse rx="24" ry="6" fill="none" stroke="#E4E2E2" strokeOpacity="0.35" transform="rotate(-14)" />
              <text x="30" y="5" className="font-mono" fontSize="12.5" fill="#9AA0A6" letterSpacing="2.5">
                {a.label}
              </text>
            </g>
          ))}

          {/* Planeta Cuerpo: steps arc, sleep terminator, workout moons, 7 day streak */}
          <g transform={`translate(${BODY.x} ${BODY.y})`}>
            <ellipse rx={BODY.r * 3} ry={BODY.r * 3 * 0.42} fill="none" stroke="#E4E2E2" strokeOpacity="0.13" />
            <path
              d={`M0 ${-BODY.r * 3 * 0.42} A ${BODY.r * 3} ${BODY.r * 3 * 0.42} 0 1 1 0 ${BODY.r * 3 * 0.42} A ${BODY.r * 3} ${BODY.r * 3 * 0.42} 0 1 1 0 ${-BODY.r * 3 * 0.42}`}
              fill="none"
              stroke="#DCE5EC"
              strokeOpacity="0.85"
              strokeWidth="1.6"
              pathLength={1}
              strokeDasharray={`${stepsFrac} 1`}
            />
            {(() => {
              const a = -Math.PI / 2 + stepsFrac * 2 * Math.PI;
              const p = ellipse(0, 0, BODY.r * 3, BODY.r * 3 * 0.42, a);
              return <circle cx={p.x} cy={p.y} r="3.2" fill="#F4F8FB" />;
            })()}
            <circle r={BODY.r} fill="url(#ld-body)" />
            <path
              d={`M0 ${-BODY.r} A ${BODY.r} ${BODY.r} 0 0 1 0 ${BODY.r} A ${Math.abs(termX)} ${BODY.r} 0 0 ${termX > 0 ? 0 : 1} 0 ${-BODY.r} Z`}
              fill="#050607"
              fillOpacity="0.78"
            />
            {Array.from({ length: HEALTH.sessionsGoal }, (_, i) => (
              <circle
                key={i}
                data-moon
                r="3.4"
                fill={i < HEALTH.sessions ? "#E4E2E2" : "none"}
                stroke="#8D9194"
                strokeOpacity={i < HEALTH.sessions ? 0 : 0.6}
              />
            ))}
            <g transform={`translate(${-3 * 22} ${BODY.r * 2.85})`}>
              {HEALTH.week.map((v, i) => {
                const today = i === HEALTH.week.length - 1;
                return (
                  <g key={i} transform={`translate(${i * 22} 0)`}>
                    {v === null ? (
                      <circle r="3" fill="none" stroke="#8D9194" strokeOpacity="0.6" />
                    ) : (
                      <circle r={v >= 1 ? 3.6 : 3} fill="#E4E2E2" fillOpacity={v >= 1 ? 1 : 0.15 + 0.45 * v} />
                    )}
                    {today && <circle r="7" fill="none" stroke="#E4E2E2" strokeOpacity="0.55" />}
                    {HEALTH.habits[i] && <rect x="-0.8" y="-10" width="1.6" height="3.5" fill="#E4E2E2" opacity="0.7" />}
                  </g>
                );
              })}
            </g>
            <line x1={BODY.r * 3 + 4} y1="0" x2={BODY.r * 3 + 22} y2="0" stroke="#E4E2E2" strokeOpacity="0.25" />
            <g className="font-mono" fill="#AEB6BE">
              <text x={BODY.r * 3 + 30} y="-4" fontSize="13" letterSpacing="3" fill="#C9D2DA">
                CUERPO
              </text>
              <text x={BODY.r * 3 + 30} y="14" fontSize="11" fill="#7D848B" letterSpacing="1">
                {`${thousands(HEALTH.steps)} / ${thousands(HEALTH.goal)} ${stepsLabel}`}
              </text>
              <text x={BODY.r * 3 + 30} y="30" fontSize="11" fill="#7D848B" letterSpacing="1">
                {`${sleepLabel} ${HEALTH.sleepH.toLocaleString(locale)} h · ${HEALTH.sessions}/${HEALTH.sessionsGoal} ${sessionsLabel}`}
              </text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
