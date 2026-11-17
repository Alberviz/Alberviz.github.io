import React from "react";
import { OLIMPO_DEMO } from "@/content/olimpo";

/**
 * Olimpo's desktop home ("Firmamento") recreated at 1200x740 with invented data.
 * Projects are constellations, today's tasks are the lit stars joined by the
 * dashed line of "today's constellation", and the arc on top is the sun's path
 * with "now" on it. Pure markup: it is scaled by ScaledStage.
 */

const f = (n: number) => n - Math.floor(n);
const DUST = Array.from({ length: 140 }, (_, i) => ({
  x: +(f(Math.sin(i * 12.9898) * 43758.5453) * 1200).toFixed(1),
  y: +(f(Math.sin(i * 78.233) * 12543.113) * 740).toFixed(1),
  r: +(0.4 + f(Math.sin(i * 39.425) * 9871.37) * 0.9).toFixed(2),
  o: +(0.15 + f(Math.sin(i * 7.13) * 3141.59) * 0.5).toFixed(2),
}));

type Star = [number, number];
const CONSTELLATIONS: { name: string; meta: { en: string; es: string }; label: Star; stars: Star[]; links: [number, number][] }[] = [
  {
    name: "WARI",
    meta: { en: "v2.1 · 3 in progress", es: "v2.1 · 3 en curso" },
    label: [585, 292],
    stars: [
      [515, 392],
      [598, 338],
      [690, 404],
      [652, 492],
      [556, 474],
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 0],
    ],
  },
  {
    name: "OLIMPO",
    meta: { en: "v2.19.1", es: "v2.19.1" },
    label: [1018, 196],
    stars: [
      [952, 262],
      [1046, 300],
      [1112, 246],
      [1014, 384],
    ],
    links: [
      [0, 1],
      [1, 2],
      [1, 3],
    ],
  },
  {
    name: "UNI",
    meta: { en: "Semester · 2 this week", es: "Semestre · 2 esta semana" },
    label: [800, 508],
    stars: [
      [706, 566],
      [786, 614],
      [866, 566],
      [944, 624],
    ],
    links: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
  },
];

/** Today's stars: [constellation, star index]. The second one is "in progress" (it twinkles). */
const TODAY: [number, number][] = [
  [0, 1],
  [0, 3],
  [2, 1],
  [1, 3],
];

export function Firmamento({ locale }: { locale: "en" | "es" }) {
  const D = OLIMPO_DEMO;
  const today = TODAY.map(([c, s]) => CONSTELLATIONS[c].stars[s]);

  return (
    <div
      className="relative h-full w-full overflow-hidden font-sans text-[#ECEEFA]"
      style={{
        background:
          "radial-gradient(60% 70% at 72% 46%, #1B2152 0%, #10143A 38%, #0A0D27 70%, #070917 100%)",
      }}
    >
      <svg className="absolute inset-0" width="1200" height="740" viewBox="0 0 1200 740">
        <defs>
          <radialGradient id="fm-now" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE9C4" />
            <stop offset="55%" stopColor="#F2B36F" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#F2B36F" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="fm-neb" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#6C76D9" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#6C76D9" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="820" cy="430" rx="360" ry="180" fill="url(#fm-neb)" transform="rotate(-18 820 430)" />
        {DUST.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#DCE0FF" opacity={d.o} />
        ))}

        {/* The sun's path: solid until now, dotted after */}
        <path d="M420 112 Q 800 22 891 60" fill="none" stroke="#F2B36F" strokeOpacity="0.75" strokeWidth="1.4" />
        <path d="M891 60 Q 1010 58 1180 92" fill="none" stroke="#8C92B4" strokeOpacity="0.6" strokeWidth="1.2" strokeDasharray="1.5 6" strokeLinecap="round" />
        <circle cx="891" cy="60" r="16" fill="url(#fm-now)" className="olimpo-now" />
        <circle cx="891" cy="60" r="5" fill="#FFE2BC" />

        {/* Constellations */}
        {CONSTELLATIONS.map((c) => (
          <g key={c.name}>
            {c.links.map(([a, b], i) => (
              <line
                key={i}
                x1={c.stars[a][0]}
                y1={c.stars[a][1]}
                x2={c.stars[b][0]}
                y2={c.stars[b][1]}
                stroke="#8C92B4"
                strokeOpacity="0.55"
                strokeWidth="1"
              />
            ))}
            {c.stars.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="2.6" fill="#DCE0FF" />
            ))}
          </g>
        ))}

        {/* Today's constellation */}
        <polyline
          points={today.map(([x, y]) => `${x},${y}`).join(" ")}
          fill="none"
          stroke="#F2B36F"
          strokeOpacity="0.7"
          strokeWidth="1.2"
          strokeDasharray="3 5"
        />
        {today.map(([x, y], i) => (
          <g key={i} className={i === 1 ? "olimpo-twinkle" : undefined}>
            <circle cx={x} cy={y} r="8" fill="none" stroke="#F2B36F" strokeOpacity="0.85" strokeWidth="1.3" />
            <circle cx={x} cy={y} r="3.2" fill="#FFE2BC" />
          </g>
        ))}
      </svg>

      {/* Sky labels */}
      <p className="absolute font-mono text-[12px] text-[#8C92B4]" style={{ left: 420, top: 124 }}>
        07:12
      </p>
      <p className="absolute font-mono text-[12px] text-[#8C92B4]" style={{ left: 1132, top: 104 }}>
        16:05
      </p>
      <p className="absolute -translate-x-1/2 text-[13px] text-[#ECEEFA]" style={{ left: 891, top: 80 }}>
        {D.now[locale]}
      </p>
      {CONSTELLATIONS.map((c) => (
        <div key={c.name} className="absolute -translate-x-1/2 text-center" style={{ left: c.label[0], top: c.label[1] }}>
          <p className="font-olimpo text-[17px] tracking-[0.32em] text-[#C9CEF0]">{c.name}</p>
          <p className="mt-0.5 text-[12px] text-[#8C92B4]">{c.meta[locale]}</p>
        </div>
      ))}
      <p className="absolute font-sans text-[13px] italic text-[#F2B36F]" style={{ left: 452, top: 566 }}>
        {locale === "es" ? "la constelación de hoy" : "today's constellation"}
      </p>

      {/* Left column */}
      <div className="absolute left-10 top-9 flex items-center gap-7">
        <div className="flex items-center gap-2.5">
          <svg width="18" height="16" viewBox="0 0 18 16" aria-hidden="true">
            <path d="M9 1.5 L16.5 14.5 H1.5 Z" fill="none" stroke="#F2B36F" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M5.6 9.6 L9 6.4 L12.4 9.6" fill="none" stroke="#F2B36F" strokeWidth="1.2" />
          </svg>
          <span className="font-olimpo text-[15px] tracking-[0.3em]">OLIMPO</span>
        </div>
        <span className="relative text-[13px] font-semibold">
          Firmamento
          <span className="absolute -bottom-2.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#F2B36F]" />
        </span>
        <span className="text-[13px] text-[#B3B8D4]">{locale === "es" ? "Vida" : "Life"}</span>
        <span className="text-[13px] text-[#B3B8D4]">{locale === "es" ? "Agentes" : "Agents"}</span>
      </div>

      <div className="absolute left-10 top-[104px] w-[340px]">
        <p className="font-olimpo text-[44px] leading-[1.05]">{D.greeting[locale]}</p>
        <p className="mt-3 text-[15px] text-[#B3B8D4]">
          {D.date[locale]} · {D.city[locale]} · {D.weather[locale]}
        </p>
      </div>

      <div className="absolute left-10 top-[228px] w-[340px] border border-[#2A2F5A] bg-[#0B0F2C]/70 px-6 py-5">
        {/* corner brackets */}
        <span className="absolute -left-px -top-px h-3 w-3 border-l-2 border-t-2 border-[#F2B36F]" />
        <span className="absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-[#F2B36F]" />
        <div className="flex items-center justify-between">
          <p className="font-olimpo text-[13px] tracking-[0.28em] text-[#F2B36F]">{D.focus[locale].toUpperCase()}</p>
          <span className="text-[12px] text-[#8C92B4]">✦</span>
        </div>
        <p className="mt-2 text-[14px] italic leading-snug text-[#B3B8D4]">{D.focusVoice[locale]}</p>
        <ul className="mt-3">
          {D.tasks.map((t, i) => (
            <li key={t.en} className="flex items-start gap-3.5 border-b border-[#232850] py-3 last:border-b-0">
              <span
                className={`mt-0.5 grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full border ${
                  t.done ? "border-[#F2B36F] bg-[#F2B36F]" : i === 1 ? "border-[#F2B36F]" : "border-[#8C92B4]"
                }`}
              >
                {t.done && (
                  <svg width="10" height="8" viewBox="0 0 10 8" aria-hidden="true">
                    <path d="M1 4.2 L3.8 7 L9 1" fill="none" stroke="#1A1208" strokeWidth="1.8" />
                  </svg>
                )}
              </span>
              <span className="min-w-0">
                <span className={`block text-[15px] leading-snug ${t.done ? "text-[#8C92B4] line-through" : ""}`}>
                  {locale === "es" ? t.es : t.en}
                </span>
                <span className="mt-0.5 block text-[12px] text-[#8C92B4]">● {t.project}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="absolute bottom-9 left-10 w-[340px] border-t border-[#232850] pt-3.5">
        <p className="text-[12px] text-[#8C92B4]">{D.next[locale]}</p>
        <p className="mt-1 text-[15px] font-semibold">{D.nextItem[locale]}</p>
      </div>

      {/* Latest */}
      <div className="absolute right-10 top-[592px] w-[230px]">
        <p className="text-[12px] font-semibold tracking-[0.16em] text-[#8C92B4]">{D.latest[locale].toUpperCase()}</p>
        <p className="mt-2.5 text-[13px] leading-snug text-[#B3B8D4]">
          <span className="text-[#F2B36F]">✦ </span>
          {D.latestItem[locale]}
        </p>
        <p className="mt-1 text-[12px] text-[#8C92B4]">Aurora · {locale === "es" ? "hace 12 min" : "12 min ago"}</p>
      </div>

      {/* Command bar */}
      <div className="absolute bottom-9 left-[452px] flex h-[46px] w-[400px] items-center gap-3 rounded-full border border-[#2A2F5A] bg-[#0B0F2C]/85 px-5">
        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
          <circle cx="6" cy="6" r="4.6" fill="none" stroke="#8C92B4" strokeWidth="1.4" />
          <path d="M9.5 9.5 L13 13" stroke="#8C92B4" strokeWidth="1.4" />
        </svg>
        <span className="flex-1 text-[14px] text-[#8C92B4]">{D.search[locale]}</span>
        <span className="rounded-md border border-[#2A2F5A] px-1.5 py-0.5 font-mono text-[11px] text-[#B3B8D4]">Ctrl K</span>
      </div>
    </div>
  );
}
