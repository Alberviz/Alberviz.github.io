"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  ChartLineUp,
  DeviceMobile,
  HardDrives,
  Receipt,
  Storefront,
  TelegramLogo,
  Waveform,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { WealthFlowItem } from "@/content/types";
import { useLocale } from "@/lib/i18n-context";
import { HOMELAB_WEALTH_SYSTEM } from "@/content/portfolio-data";
import { EASE_OUT } from "@/lib/motion";
import { MobileWealthPreview } from "./MobileWealthPreview";

const { inputs, core, outputs } = HOMELAB_WEALTH_SYSTEM.wealthFlow;
const INPUT_IDS = inputs.map((item) => item.id);
const OUTPUT_IDS = outputs.map((item) => item.id);
const CORE_ID = "core";

const ICONS: Record<string, Icon> = {
  brokers: ChartLineUp,
  business: Storefront,
  krakount: Receipt,
  aurora: TelegramLogo,
  "mobile-app": DeviceMobile,
  "voice-queries": Waveform,
};

const CORE_FACTS = [
  { en: "Isolated Docker bridge", es: "Red Docker aislada" },
  { en: "Encrypted private network", es: "Red privada cifrada" },
  { en: "0 public ports", es: "0 puertos públicos" },
  { en: "Nightly pg_dump backup", es: "Backup pg_dump nocturno" },
] as const;

type EdgeState = "primary" | "secondary" | "idle";

/** An edge is named after the input or output node it connects to the core. */
function edgeState(edgeId: string, activeId: string): EdgeState {
  if (activeId === CORE_ID) return "primary";
  if (edgeId === activeId) return "primary";
  const activeIsInput = INPUT_IDS.includes(activeId);
  const edgeIsInput = INPUT_IDS.includes(edgeId);
  return activeIsInput !== edgeIsInput ? "secondary" : "idle";
}

interface MeasuredEdge {
  id: string;
  d: string;
}

export function WealthTopology() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const [activeId, setActiveId] = useState<string>("business");
  const [edges, setEdges] = useState<MeasuredEdge[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLElement>());
  const inView = useInView(containerRef, { margin: "160px" });

  const register = useCallback(
    (id: string) => (el: HTMLElement | null) => {
      if (el) nodeRefs.current.set(id, el);
      else nodeRefs.current.delete(id);
    },
    [],
  );

  // Wires are measured from the real node boxes so they always land on the borders.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const desktop = window.matchMedia("(min-width: 1024px)");

    const measure = () => {
      const coreEl = nodeRefs.current.get(CORE_ID);
      if (!desktop.matches || !coreEl) {
        setEdges([]);
        return;
      }
      const box = container.getBoundingClientRect();
      const c = coreEl.getBoundingClientRect();
      const coreY = c.top + c.height / 2 - box.top;
      const curve = (x1: number, y1: number, x2: number, y2: number) => {
        const dx = (x2 - x1) * 0.55;
        return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
      };

      const next: MeasuredEdge[] = [];
      INPUT_IDS.forEach((id, i) => {
        const el = nodeRefs.current.get(id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const port = coreY + (i - (INPUT_IDS.length - 1) / 2) * 12;
        next.push({
          id,
          d: curve(r.right - box.left, r.top + r.height / 2 - box.top, c.left - box.left, port),
        });
      });
      OUTPUT_IDS.forEach((id, i) => {
        const el = nodeRefs.current.get(id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        const port = coreY + (i - (OUTPUT_IDS.length - 1) / 2) * 12;
        next.push({
          id,
          d: curve(c.right - box.left, port, r.left - box.left, r.top + r.height / 2 - box.top),
        });
      });
      setSize({ w: box.width, h: box.height });
      setEdges(next);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    desktop.addEventListener("change", measure);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", measure);
    };
  }, [locale]);

  const activate = (id: string) => setActiveId(id);
  const hoverProps = (id: string) => ({
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") activate(id);
    },
    onFocus: () => activate(id),
    onClick: () => activate(id),
  });

  const nodeTone = (id: string) => {
    if (id === activeId) return "active";
    if (id === CORE_ID) return "lit";
    return edgeState(id, activeId) === "idle" ? "idle" : "lit";
  };

  const toneClass = {
    active: "border-[#10B981]/60 bg-[#111318]",
    lit: "border-[#2C3240] bg-[#0D0F13]",
    idle: "border-[#232732] bg-[#0B0C10]",
  } as const;

  const nodeBase =
    "group relative w-full text-left rounded-xl border transition-[border-color,background-color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090A0D]";

  const renderFlowNode = (item: WealthFlowItem, side: "in" | "out") => {
    const NodeIcon = ICONS[item.id] ?? ChartLineUp;
    const tone = nodeTone(item.id);
    const isBusiness = item.id === "business";
    return (
      <button
        key={item.id}
        ref={register(item.id)}
        type="button"
        aria-pressed={item.id === activeId}
        {...hoverProps(item.id)}
        className={`${nodeBase} ${toneClass[tone]} px-4 py-3.5`}
      >
        <span className="flex items-start gap-3">
          <span
            className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg border border-[#232732] bg-[#090A0D] transition-colors duration-200 ${
              tone === "idle" ? "text-[#8E95A5]" : "text-[#10B981]"
            }`}
          >
            <NodeIcon size={16} weight={tone === "active" ? "fill" : "regular"} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-[15px] font-medium leading-snug text-[#ECEEF2]">
              {item.title[locale]}
            </span>
            <span className="mt-0.5 block truncate font-mono text-[11px] text-[#8E95A5]">
              {item.source}
            </span>
          </span>
        </span>
        {isBusiness && (
          <span className="mt-3 ml-11 inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-2 py-0.5 font-mono text-[10.5px] text-[#34D399]">
            <span className="size-1.5 rounded-full bg-[#10B981] animate-pulse motion-reduce:animate-none" />
            {locale === "en" ? "Live profit sync" : "Profit en vivo"}
          </span>
        )}
        {side === "out" && item.id === "mobile-app" && <MobileWealthPreview />}
      </button>
    );
  };

  const mobileWire = (lit: boolean) => (
    <div aria-hidden className="flex justify-center py-1 lg:hidden">
      <span
        className={`block h-8 w-px transition-colors duration-200 ${
          lit ? "bg-[#10B981]/70" : "bg-[#232732]"
        }`}
      />
    </div>
  );

  const anyInputLit = INPUT_IDS.some((id) => edgeState(id, activeId) !== "idle");
  const anyOutputLit = OUTPUT_IDS.some((id) => edgeState(id, activeId) !== "idle");

  const activeItem =
    activeId === CORE_ID
      ? {
          title: core.title[locale],
          meta: core.platform,
          detail: core.specs.map((spec) => spec[locale]).join(" "),
        }
      : (() => {
          const item = [...inputs, ...outputs].find((n) => n.id === activeId) ?? inputs[1];
          return {
            title: item.title[locale],
            meta: [item.source, item.protocol].filter(Boolean).join(" · "),
            detail: item.detail[locale],
          };
        })();

  const columnLabel = "hidden lg:block mb-3 font-mono text-[11px] text-[#8E95A5]";

  return (
    <div>
      <style>{`
        @keyframes wealth-signal { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
        .wealth-signal { animation: wealth-signal 2.2s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .wealth-signal { animation: none; opacity: 0; } }
      `}</style>

      <div
        ref={containerRef}
        className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-x-20 xl:gap-x-28"
      >
        {size.w > 0 && edges.length > 0 && (
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden lg:block"
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
          >
            {edges.map((edge, i) => {
              const state = edgeState(edge.id, activeId);
              return (
                <g key={edge.id}>
                  <path d={edge.d} fill="none" stroke="#232732" strokeWidth={1.25} />
                  <path
                    d={edge.d}
                    fill="none"
                    stroke="#10B981"
                    strokeWidth={1.5}
                    style={{
                      opacity: state === "primary" ? 0.9 : state === "secondary" ? 0.3 : 0,
                      transition: "opacity 220ms cubic-bezier(0.23, 1, 0.32, 1)",
                    }}
                  />
                  {state === "primary" && !reduce && (
                    <path
                      d={edge.d}
                      className="wealth-signal"
                      fill="none"
                      stroke="#6EE7B7"
                      strokeWidth={2}
                      strokeLinecap="round"
                      pathLength={100}
                      strokeDasharray="5 95"
                      style={{
                        animationDelay: `${i * -0.35}s`,
                        animationPlayState: inView ? "running" : "paused",
                      }}
                    />
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {/* Inputs */}
        <div className="relative">
          <p className={columnLabel}>{locale === "en" ? "4 live feeds" : "4 fuentes en vivo"}</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {inputs.map((item) => renderFlowNode(item, "in"))}
          </div>
        </div>

        {mobileWire(anyInputLit)}

        {/* Core */}
        <div className="relative">
          <p className={columnLabel}>
            {locale === "en" ? "Isolated core" : "Núcleo aislado"}
          </p>
          <button
            ref={register(CORE_ID)}
            type="button"
            aria-pressed={activeId === CORE_ID}
            {...hoverProps(CORE_ID)}
            className={`${nodeBase} ${toneClass[nodeTone(CORE_ID)]} rounded-2xl p-5 lg:p-6`}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] text-[#8E95A5]">Raspberry Pi 5</span>
              <span className="flex items-center gap-1.5 font-mono text-[10.5px] text-[#34D399]">
                <span className="size-1.5 rounded-full bg-[#10B981]" />
                24/7
              </span>
            </span>
            <span className="mt-4 flex items-center gap-3.5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-[#10B981]/35 bg-[#10B981]/10 text-[#10B981]">
                <HardDrives size={22} weight={activeId === CORE_ID ? "fill" : "regular"} />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-lg font-semibold leading-tight text-[#ECEEF2] sm:text-xl">
                  {core.title[locale]}
                </span>
                <span className="mt-1 block font-mono text-[11px] text-[#8E95A5]">
                  {core.platform}
                </span>
              </span>
            </span>
            <span className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#232732] bg-[#232732]">
              {CORE_FACTS.map((fact) => (
                <span
                  key={fact.en}
                  className="flex items-center gap-2 bg-[#090A0D] px-2.5 py-2 text-[11.5px] leading-tight text-[#C5CAD3]"
                >
                  <span className="size-1 shrink-0 rounded-[1px] bg-[#10B981]" />
                  {fact[locale]}
                </span>
              ))}
            </span>
          </button>
        </div>

        {mobileWire(anyOutputLit)}

        {/* Outputs */}
        <div className="relative">
          <p className={columnLabel}>
            {locale === "en" ? "2 read-only outputs" : "2 salidas de solo lectura"}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {outputs.map((item) => renderFlowNode(item, "out"))}
          </div>
        </div>
      </div>

      {/* Single-focus inspector */}
      <div
        aria-live="polite"
        className="mt-8 min-h-[6.5rem] border-t border-[#232732] pt-5 sm:min-h-[5.5rem]"
      >
        <motion.div
          key={`${activeId}-${locale}`}
          initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "translateY(4px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.18, ease: EASE_OUT }}
          className="grid gap-1.5 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-10"
        >
          <div>
            <p className="font-display text-base font-medium text-[#ECEEF2]">{activeItem.title}</p>
            <p className="mt-0.5 font-mono text-[11px] text-[#8E95A5]">{activeItem.meta}</p>
          </div>
          <p className="max-w-[72ch] text-sm leading-relaxed text-[#B4BAC6] sm:text-[15px]">
            {activeItem.detail}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
