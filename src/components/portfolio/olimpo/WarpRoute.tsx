"use client";

import { useReducedMotionSafe } from "@/lib/motion";

import React, { useRef } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { DeviceMobile, DeviceTablet, Laptop, Television } from "@phosphor-icons/react";
import { WARP } from "@/content/olimpo";

/**
 * Scroll-drawn map of a send: one laptop, three destinations, and the way back.
 * Arcs are nested (each one higher than the last) so none leaves the frame; a
 * labelled packet rides each tip (SVG transform written from the scroll value,
 * no React state per frame). Reduced motion: everything is simply drawn.
 */

const W = 1000;
const H = 330;
const BASE = 150; // y of the device icons
const START = BASE - 26; // arcs leave from the top of the icons

const NODES = [
  { id: "pc", x: 100, Icon: Laptop },
  { id: "movil", x: 420, Icon: DeviceMobile },
  { id: "tablet", x: 660, Icon: DeviceTablet },
  { id: "tele", x: 900, Icon: Television },
] as const;

/** Quadratic arc from x1 to x2 whose highest point sits at y = peak. */
const arc = (x1: number, x2: number, peak: number) => {
  const cy = 2 * peak - START;
  return `M ${x1} ${START} Q ${(x1 + x2) / 2} ${cy} ${x2} ${START}`;
};

/** The way back, under the labels: phone to laptop. */
const RETURN = `M ${NODES[1].x} ${BASE + 92} Q ${(NODES[0].x + NODES[1].x) / 2} ${BASE + 190} ${NODES[0].x} ${BASE + 92}`;

const PACKETS = {
  movil: { en: "PDF", es: "PDF" },
  tablet: { en: "photo", es: "foto" },
  tele: { en: "video", es: "vídeo" },
  back: { en: "text", es: "texto" },
} as const;

const CAPTIONS = {
  movil: WARP.trayDetail,
  tablet: WARP.trayDetail,
  tele: WARP.tvDetail,
} as const;

const BACK_LABEL = {
  en: "and back: from the phone, out of a white hole",
  es: "y al revés: del móvil al PC, por un agujero blanco",
};

function Arc({
  d,
  progress,
  range,
  reduce,
  label,
  stroke = "#F2B36F",
  dot = "#FFE6C7",
  dashed = false,
}: {
  d: string;
  progress: MotionValue<number>;
  range: [number, number];
  reduce: boolean | null;
  label: string;
  stroke?: string;
  dot?: string;
  dashed?: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGGElement>(null);
  const len = useTransform(progress, range, [0, 1]);
  useMotionValueEvent(len, "change", (v) => {
    const path = pathRef.current;
    const tip = tipRef.current;
    if (!path || !tip) return;
    const pt = path.getPointAtLength(path.getTotalLength() * v);
    tip.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
    tip.style.opacity = v > 0.03 && v < 0.97 ? "1" : "0";
  });
  return (
    <g>
      <path d={d} fill="none" stroke="rgb(236 237 240 / 0.08)" strokeWidth={1.5} strokeDasharray="3 6" />
      <motion.path
        ref={pathRef}
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeDasharray={dashed ? "6 7" : undefined}
        style={reduce ? undefined : { pathLength: len }}
      />
      {!reduce && (
        <g ref={tipRef} style={{ opacity: 0, transition: "opacity 160ms var(--ease-out)" }}>
          <circle r={4.5} fill={dot} />
          <g className="hidden sm:inline">
          <rect x={10} y={-13} rx={9} height={26} width={label.length * 10.5 + 20} fill="#151820" stroke="rgb(242 179 111 / 0.35)" />
          <text x={20} y={5.5} fontSize={15} fill="#ECEDF0" fontFamily="var(--font-geist-mono), monospace">
            {label}
          </text>
          </g>
        </g>
      )}
    </g>
  );
}

export function WarpRoute({ locale }: { locale: "en" | "es" }) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "end 35%"] });
  const peaks = [72, 44, 18];
  const ranges: [number, number][] = [
    [0, 0.45],
    [0.15, 0.62],
    [0.3, 0.8],
  ];
  return (
    <div ref={ref} className="relative mx-auto w-full max-w-3xl">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" aria-hidden="true">
        {NODES.slice(1).map((n, i) => (
          <Arc
            key={n.id}
            d={arc(NODES[0].x, n.x, peaks[i])}
            progress={scrollYProgress}
            range={ranges[i]}
            reduce={reduce}
            label={PACKETS[n.id as "movil" | "tablet" | "tele"][locale]}
          />
        ))}
        <Arc
          d={RETURN}
          progress={scrollYProgress}
          range={[0.6, 1]}
          reduce={reduce}
          label={PACKETS.back[locale]}
          stroke="rgb(236 237 240 / 0.7)"
          dot="#FFFFFF"
          dashed
        />
      </svg>
      <ul className="absolute inset-x-0" style={{ top: `${(BASE / H) * 100}%` }}>
        {NODES.map(({ id, x, Icon }) => {
          const dev = WARP.devices.find((d) => d.id === id);
          const caption = id === "pc" ? null : CAPTIONS[id];
          return (
            <li
              key={id}
              className="absolute flex w-[22%] -translate-x-1/2 -translate-y-[18px] flex-col sm:-translate-y-[22px] items-center gap-1.5 text-center"
              style={{ left: `${x / 10}%` }}
            >
              <span className="grid size-9 place-items-center rounded-full border border-line bg-surface text-ink sm:size-11">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="whitespace-nowrap font-mono text-[10.5px] text-ink/85 sm:text-[11.5px]">
                {id === "pc" ? WARP.route.pc[locale] : dev?.name[locale]}
              </span>
              {caption && (
                <span className="hidden text-balance text-[11.5px] leading-snug text-muted sm:block">{caption[locale]}</span>
              )}
            </li>
          );
        })}
      </ul>
      <p
        className="absolute left-0 font-mono text-[10.5px] text-muted sm:left-[var(--back-x)] sm:-translate-x-1/2 sm:whitespace-nowrap sm:text-[12px]"
        style={{ "--back-x": `${(NODES[0].x + NODES[1].x) / 20}%`, top: `${((BASE + 158) / H) * 100}%` } as React.CSSProperties}
      >
        {BACK_LABEL[locale]}
      </p>
      <p className="sr-only">{WARP.route.label[locale]}</p>
    </div>
  );
}
