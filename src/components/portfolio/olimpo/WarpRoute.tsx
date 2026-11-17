"use client";

import React, { useRef } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { DeviceMobile, DeviceTablet, Laptop, Television } from "@phosphor-icons/react";
import { WARP } from "@/content/olimpo";

/**
 * Scroll-drawn route above the demo: one laptop, three destinations. Each arc is
 * drawn by the scroll (pathLength) and a packet rides its tip (an SVG transform
 * written from the scroll value, no React state per frame). Reduced motion: the
 * arcs are simply there.
 */

const NODES = [
  { id: "pc", x: 90, Icon: Laptop },
  { id: "movil", x: 400, Icon: DeviceMobile },
  { id: "tablet", x: 640, Icon: DeviceTablet },
  { id: "tele", x: 900, Icon: Television },
] as const;

const Y = 150;
const arc = (x1: number, x2: number) => {
  const mid = (x1 + x2) / 2;
  const h = 40 + (x2 - x1) * 0.22;
  return `M ${x1} ${Y - 24} Q ${mid} ${Y - 24 - h * 2} ${x2} ${Y - 24}`;
};

function Arc({ d, progress, range, reduce }: { d: string; progress: MotionValue<number>; range: [number, number]; reduce: boolean | null }) {
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const len = useTransform(progress, range, [0, 1]);
  useMotionValueEvent(len, "change", (v) => {
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!path || !dot) return;
    const L = path.getTotalLength();
    const pt = path.getPointAtLength(L * v);
    dot.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
    dot.style.opacity = v > 0.02 && v < 0.98 ? "1" : "0";
  });
  return (
    <g>
      <path d={d} fill="none" stroke="rgb(236 237 240 / 0.08)" strokeWidth={1.5} strokeDasharray="3 6" />
      <motion.path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="#F2B36F"
        strokeWidth={1.75}
        strokeLinecap="round"
        style={reduce ? undefined : { pathLength: len }}
      />
      {!reduce && <circle ref={dotRef} r={4.5} fill="#FFE6C7" style={{ opacity: 0 }} />}
    </g>
  );
}

export function WarpRoute({ locale }: { locale: "en" | "es" }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "end 40%"] });
  const ranges: [number, number][] = [
    [0, 0.5],
    [0.2, 0.72],
    [0.4, 0.95],
  ];
  return (
    <div ref={ref} className="relative mx-auto w-full max-w-3xl">
      <svg viewBox="0 0 1000 200" className="block h-auto w-full" aria-hidden="true">
        {NODES.slice(1).map((n, i) => (
          <Arc key={n.id} d={arc(NODES[0].x, n.x)} progress={scrollYProgress} range={ranges[i]} reduce={reduce} />
        ))}
      </svg>
      <ul className="absolute inset-x-0" style={{ top: `${((Y - 24) / 200) * 100}%` }}>
        {NODES.map(({ id, x, Icon }) => {
          const dev = WARP.devices.find((d) => d.id === id);
          return (
            <li
              key={id}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
              style={{ left: `${x / 10}%` }}
            >
              <span className="grid size-9 place-items-center rounded-full border border-line bg-surface text-ink sm:size-11">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="whitespace-nowrap font-mono text-[10.5px] text-muted sm:text-[11.5px]">
                {id === "pc" ? WARP.route.pc[locale] : dev?.name[locale]}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="sr-only">{WARP.route.label[locale]}</p>
    </div>
  );
}
