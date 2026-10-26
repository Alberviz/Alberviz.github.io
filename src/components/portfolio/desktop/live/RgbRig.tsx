"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { useLocale } from "@/lib/i18n-context";

/*
 * Wallpaper -> Matugen palette -> every peripheral in the room. Each device
 * redraws its LEDs per palette and crossfades with a per-device delay, so the
 * colour visibly travels down the chain. The packet log shows the real bytes
 * that sync-rgb.py writes for the active colour.
 */

type Rgb = readonly [number, number, number];
interface Palette {
  name: string;
  wallpaper: readonly [string, string];
  primary: Rgb;
  secondary: Rgb;
  tertiary: Rgb;
}

const PALETTES: Palette[] = [
  { name: "Gargantua", wallpaper: ["#1B1F26", "#C9D2DA"], primary: [0xbc, 0xc8, 0xd1], secondary: [0x8d, 0x9c, 0xab], tertiary: [0xd0, 0xc2, 0xd2] },
  { name: "Icy", wallpaper: ["#0B1730", "#7FB4FF"], primary: [0x7f, 0xb4, 0xff], secondary: [0x4f, 0x7c, 0xff], tertiary: [0xb8, 0xe0, 0xff] },
  { name: "Ember", wallpaper: ["#2A120C", "#F7B999"], primary: [0xf7, 0xb9, 0x99], secondary: [0xf2, 0x6d, 0x4f], tertiary: [0xef, 0xd9, 0x94] },
  { name: "Aurora", wallpaper: ["#06201A", "#5CE1A6"], primary: [0x5c, 0xe1, 0xa6], secondary: [0x10, 0xb9, 0x81], tertiary: [0xa7, 0xf3, 0xd0] },
];

/** Propagation order down the chain, in seconds after the palette changes. */
const DELAY = { keyboard: 0.15, mouse: 0.32, ram: 0.48, fans: 0.64, strip: 0.8 } as const;
const CYCLE_MS = 3800;

const hex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
const css = (c: Rgb) => `rgb(${c[0]} ${c[1]} ${c[2]})`;
const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
  Math.round(a[0] + (b[0] - a[0]) * t),
  Math.round(a[1] + (b[1] - a[1]) * t),
  Math.round(a[2] + (b[2] - a[2]) * t),
];
/** Three stop gradient through the palette, t in 0..1. */
const ramp = (p: Palette, t: number) => (t < 0.5 ? mix(p.primary, p.secondary, t * 2) : mix(p.secondary, p.tertiary, (t - 0.5) * 2));

function mchosePacket(c: Rgb) {
  const payload = [0x2b, 0x01, 0x06, 0x00, 100, 0x00, 3, 1, 0x00, ...c, ...c, 0, 0, 0, 0, 0];
  return ["11", ...payload.slice(0, 15).map((b) => hex(b ^ 0xff))].join(" ");
}
function akkoPacket(c: Rgb) {
  const head = [0x07, 0x01, 0x04, 0x04, 0x08, ...c];
  const sum = 0xff - (head.reduce((a, b) => a + b, 0) & 0xff);
  return [...head, sum].map(hex).join(" ");
}

const FAN_LEDS = 30;
const STRIP_LEDS = 44;
const fans = [
  { x: 1590, y: 395 },
  { x: 1590, y: 700 },
];

export function RgbRig() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10%" });
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto || !inView || reduce) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % PALETTES.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [auto, inView, reduce]);

  const pal = PALETTES[active];
  const fade = (delay: number, on: boolean) =>
    ({
      opacity: on ? 1 : 0,
      transition: `opacity 520ms cubic-bezier(0.23, 1, 0.32, 1) ${on ? delay : delay + 0.1}s`,
    }) as const;

  const log = [
    { dev: "Akko 5075B Plus", via: "hidraw · Feature 0x07", bytes: akkoPacket(pal.primary), delay: DELAY.keyboard },
    { dev: "MCHOSE K7 base", via: "SET_REPORT 0x11 · XOR FF", bytes: mchosePacket(pal.primary), delay: DELAY.mouse },
    { dev: "RAM x2", via: "OpenRGB SDK · Direct", bytes: `5 LEDs · #${pal.primary.map(hex).join("")} -> #${pal.tertiary.map(hex).join("")}`, delay: DELAY.ram },
    { dev: "ARGB fans", via: "OpenRGB SDK · Aura", bytes: "2 x 60 LEDs · palette gradient", delay: DELAY.fans },
    { dev: "Magic Home", via: "flux_led · TCP :5577", bytes: `#${pal.secondary.map(hex).join("")}`, delay: DELAY.strip },
  ];

  return (
    <div ref={ref} className="absolute inset-0 bg-[#060708]">
      <svg viewBox="0 0 1920 1080" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          {PALETTES.map((p, i) => (
            <React.Fragment key={p.name}>
              <radialGradient id={`rig-wall-${i}`} cx="70%" cy="30%" r="90%">
                <stop offset="0%" stopColor={p.wallpaper[1]} stopOpacity="0.9" />
                <stop offset="45%" stopColor={p.wallpaper[1]} stopOpacity="0.18" />
                <stop offset="100%" stopColor={p.wallpaper[0]} />
              </radialGradient>
              <radialGradient id={`rig-glow-${i}`}>
                <stop offset="0%" stopColor={css(p.primary)} stopOpacity="0.55" />
                <stop offset="100%" stopColor={css(p.primary)} stopOpacity="0" />
              </radialGradient>
            </React.Fragment>
          ))}
        </defs>

        {/* LED strip along the top of the desk */}
        <rect x="150" y="62" width="1620" height="16" rx="8" fill="#101114" stroke="#1E2026" />
        {PALETTES.map((p, pi) => (
          <g key={p.name} style={fade(DELAY.strip, pi === active)}>
            <rect x="150" y="40" width="1620" height="60" rx="30" fill={css(p.secondary)} opacity="0.07" />
            {Array.from({ length: STRIP_LEDS }, (_, i) => (
              <circle key={i} cx={170 + i * 36.3} cy="70" r="4.2" fill={css(p.secondary)} />
            ))}
          </g>
        ))}
        <text x="150" y="122" className="font-mono" fontSize="17" fill="#5D6474" letterSpacing="2">
          MAGIC HOME STRIP
        </text>

        {/* Wallpaper monitor and Matugen */}
        <rect x="150" y="190" width="560" height="320" rx="18" fill="#0B0C0E" stroke="#232732" strokeWidth="2" />
        {PALETTES.map((p, pi) => (
          <g key={p.name} style={fade(0, pi === active)}>
            <rect x="166" y="206" width="528" height="288" rx="10" fill={`url(#rig-wall-${pi})`} />
            {[p.primary, p.secondary, p.tertiary].map((c, ci) => (
              <rect key={ci} x={190 + ci * 46} y="446" width="34" height="26" rx="6" fill={css(c)} />
            ))}
          </g>
        ))}
        <text x="150" y="548" className="font-mono" fontSize="17" fill="#5D6474" letterSpacing="2">
          WALLPAPER · MATUGEN M3
        </text>

        {/* Packet log */}
        <g className="font-mono">
          <text x="790" y="214" fontSize="17" fill="#5D6474" letterSpacing="2">
            sync-rgb.py
          </text>
          {log.map((line, i) => (
            <g key={line.dev} transform={`translate(790 ${258 + i * 62})`}>
              <text fontSize="17" fill="#ECEEF2">
                {line.dev}
                <tspan fill="#5D6474">{`  ${line.via}`}</tspan>
              </text>
              <text key={`${active}-${i}`} y="26" fontSize="16" className="rig-bytes" style={{ animationDelay: `${line.delay}s` }} fill={css(pal.primary)}>
                {line.bytes}
              </text>
            </g>
          ))}
        </g>

        {/* Keyboard */}
        <g transform="translate(150 650)">
          {PALETTES.map((p, pi) => (
            <ellipse key={p.name} cx="420" cy="230" rx="440" ry="40" fill={`url(#rig-glow-${pi})`} style={fade(DELAY.keyboard, pi === active)} />
          ))}
          <rect width="840" height="250" rx="22" fill="#121318" stroke="#2A2D36" strokeWidth="2" />
          {PALETTES.map((p, pi) => (
            <g key={p.name} style={fade(DELAY.keyboard, pi === active)}>
              {Array.from({ length: 5 }, (_, row) =>
                Array.from({ length: 15 }, (_, col) => {
                  const c = ramp(p, col / 14);
                  return (
                    <rect
                      key={`${row}-${col}`}
                      x={28 + col * 53}
                      y={26 + row * 42}
                      width="45"
                      height="34"
                      rx="6"
                      fill="#1A1C22"
                      stroke={css(c)}
                      strokeOpacity="0.85"
                      strokeWidth="1.6"
                    />
                  );
                })
              )}
              <rect x="-6" y="40" width="5" height="170" rx="2.5" fill={css(p.tertiary)} />
            </g>
          ))}
          <text y="292" className="font-mono" fontSize="17" fill="#5D6474" letterSpacing="2">
            AKKO 5075B PLUS · KEYS + SIDE STRIP
          </text>
        </g>

        {/* Mouse on its charging base */}
        <g transform="translate(1135 790)">
          <ellipse rx="90" ry="34" cy="62" fill="#121318" stroke="#2A2D36" strokeWidth="2" />
          {PALETTES.map((p, pi) => (
            <g key={p.name} style={fade(DELAY.mouse, pi === active)}>
              <ellipse rx="110" ry="46" cy="62" fill={`url(#rig-glow-${pi})`} />
              <ellipse rx="82" ry="28" cy="62" fill="none" stroke={css(p.primary)} strokeWidth="3" />
            </g>
          ))}
          <path d="M-42 40 C-42 -40 42 -40 42 40 C42 82 -42 82 -42 40 Z" fill="#191B20" stroke="#2E313A" strokeWidth="2" />
          <line x1="0" y1="-18" x2="0" y2="10" stroke="#2E313A" strokeWidth="2" />
          <text x="-90" y="150" className="font-mono" fontSize="17" fill="#5D6474" letterSpacing="2">
            MCHOSE K7 BASE
          </text>
        </g>

        {/* PC case: RAM and two ARGB fans */}
        <rect x="1330" y="190" width="440" height="700" rx="18" fill="#0B0C0E" stroke="#232732" strokeWidth="2" />
        <rect x="1352" y="212" width="396" height="656" rx="10" fill="#0E1013" stroke="#1B1E24" />
        {[0, 1].map((s) => (
          <rect key={s} x={1375 + s * 26} y="240" width="16" height="96" rx="3" fill="#16181D" />
        ))}
        {PALETTES.map((p, pi) => (
          <g key={p.name} style={fade(DELAY.ram, pi === active)}>
            {[0, 1].map((s) =>
              Array.from({ length: 5 }, (_, l) => (
                <rect key={`${s}-${l}`} x={1377 + s * 26} y={246 + l * 18} width="12" height="10" rx="2" fill={css(ramp(p, l / 4))} />
              ))
            )}
          </g>
        ))}
        {fans.map((f, fi) => (
          <g key={fi} transform={`translate(${f.x} ${f.y})`}>
            <circle r="128" fill="#101216" stroke="#20232A" strokeWidth="2" />
            <circle r="34" fill="#16181D" />
            {[0, 72, 144, 216, 288].map((a) => (
              <path key={a} d="M0 -36 C 40 -60 70 -40 92 -8 C 60 -20 30 -18 0 -36 Z" fill="#171A1F" transform={`rotate(${a})`} />
            ))}
            <g className="rig-spin" style={{ animationDuration: `${fi === 0 ? 7 : 9}s` }}>
              {PALETTES.map((p, pi) => (
                <g key={p.name} style={fade(DELAY.fans, pi === active)}>
                  {Array.from({ length: FAN_LEDS }, (_, i) => {
                    const a = (i / FAN_LEDS) * Math.PI * 2;
                    const t = Math.abs(((i / FAN_LEDS) * 2) % 2 - 1);
                    return <circle key={i} cx={Math.cos(a) * 112} cy={Math.sin(a) * 112} r="5" fill={css(ramp(p, t))} />;
                  })}
                </g>
              ))}
            </g>
          </g>
        ))}
        <text x="1330" y="928" className="font-mono" fontSize="17" fill="#5D6474" letterSpacing="2">
          RAM + ARGB FANS · OPENRGB
        </text>
      </svg>

      {/* Palette picker: real buttons, auto cycle stops once you choose */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-[#232732] bg-[#090A0D]/85 p-1 backdrop-blur-md">
        <span className="hidden px-2 font-mono text-[10.5px] text-[#5D6474] sm:inline">
          {locale === "es" ? "Fondo" : "Wallpaper"}
        </span>
        {PALETTES.map((p, i) => (
          <button
            key={p.name}
            type="button"
            onClick={() => {
              setAuto(false);
              setActive(i);
            }}
            aria-pressed={i === active}
            aria-label={`${locale === "es" ? "Aplicar fondo" : "Apply wallpaper"} ${p.name}`}
            className={`flex items-center gap-1.5 rounded-full px-2 py-1 font-mono text-[10.5px] transition-colors duration-150 press-scale ${
              i === active ? "bg-[#171A21] text-[#ECEEF2]" : "text-[#8E95A5] hover:text-[#ECEEF2]"
            }`}
          >
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: css(p.primary) }} />
            <span className="hidden md:inline">{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
