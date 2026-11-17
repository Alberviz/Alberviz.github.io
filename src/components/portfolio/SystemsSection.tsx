"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {motion, useMotionValueEvent, useScroll} from "motion/react";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { FLOW_EDGES, FLOW_NODES, SYSTEMS_UI, SYSTEM_PLANETS } from "@/content/systems";
import type { FlowNode, SystemPlanet } from "@/content/systems";
import { revealProps, useReducedMotionSafe } from "@/lib/motion";

/**
 * #sistemas: a data-flow diagram of everything that crosses the Raspberry Pi.
 * Sources on the left, the services on the Pi in the middle, outputs on the
 * right (on phones: top to bottom). The edges are drawn by the scroll in three
 * phases and, once drawn, data packets ride them. On wide screens the diagram
 * is pinned while it draws; on phones it simply scrolls. Hover, focus or tap a
 * node to light its connections and read what crosses it. Below, the systems
 * one by one. Packets run from one rAF loop that only writes SVG transforms,
 * only while the diagram is on screen, and never under reduced motion.
 */

type Layout = "wide" | "tall";
const BOX = { wide: { w: 210, h: 52, W: 1200, H: 600 }, tall: { w: 172, h: 50, W: 390, H: 880 } } as const;

const byId = Object.fromEntries(FLOW_NODES.map((n) => [n.id, n])) as Record<string, FlowNode>;

function edgePath(from: FlowNode, to: FlowNode, layout: Layout) {
  const b = BOX[layout];
  const [x1, y1] = from[layout];
  const [x2, y2] = to[layout];
  if (layout === "wide") {
    if (from.col === to.col) {
      // Between two services: a bulge on the right of the Pi column.
      const x = x1 + b.w / 2;
      const k = 40 + Math.abs(y2 - y1) * 0.22;
      return `M ${x} ${y1} C ${x + k} ${y1}, ${x + k} ${y2}, ${x} ${y2}`;
    }
    const sx = x1 + b.w / 2;
    const ex = x2 - b.w / 2;
    const mx = (sx + ex) / 2;
    return `M ${sx} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${ex} ${y2}`;
  }
  if (from.col === to.col) return `M ${x1} ${y1} L ${x2} ${y2}`;
  const sy = y1 + b.h / 2;
  const ey = y2 - b.h / 2;
  const my = (sy + ey) / 2;
  return `M ${x1} ${sy} C ${x1} ${my}, ${x2} ${my}, ${x2} ${ey}`;
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const PHASE: [number, number][] = [
  [0.02, 0.36],
  [0.34, 0.6],
  [0.58, 0.92],
];

function Diagram({ layout, locale, reduce }: { layout: Layout; locale: "en" | "es"; reduce: boolean | null }) {
  const b = BOX[layout];
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);
  const drawn = useRef<number[]>(FLOW_EDGES.map(() => (reduce ? 1 : 0)));
  const [active, setActive] = useState<string | null>(null);
  const [phase, setPhase] = useState(reduce ? 2 : -1);
  const visible = useRef(false);

  const { scrollYProgress } = useScroll(
    layout === "wide"
      ? { target: wrapRef, offset: ["start start", "end end"] }
      : { target: wrapRef, offset: ["start 85%", "end 70%"] }
  );

  const apply = (v: number) => {
    FLOW_EDGES.forEach((e, i) => {
      const [a, z] = PHASE[e.phase];
      const n = FLOW_EDGES.filter((x) => x.phase === e.phase).indexOf(e);
      const total = FLOW_EDGES.filter((x) => x.phase === e.phase).length;
      const span = (z - a) * 0.55;
      const start = a + ((z - a - span) * n) / Math.max(1, total - 1);
      const t = reduce ? 1 : smooth(start, start + span, v);
      drawn.current[i] = t;
      const p = pathRefs.current[i];
      if (p) p.style.strokeDashoffset = String(1 - t);
    });
    const ph = reduce ? 2 : v < PHASE[0][0] ? -1 : v < PHASE[1][0] ? 0 : v < PHASE[2][0] ? 1 : 2;
    setPhase((old) => (old === ph ? old : ph));
  };

  useMotionValueEvent(scrollYProgress, "change", apply);
  useEffect(() => {
    apply(scrollYProgress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  /* Packets: one per edge, riding it once it is drawn. */
  useEffect(() => {
    if (reduce) return;
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { rootMargin: "60px" });
    io.observe(el);
    let raf = 0;
    const lens = FLOW_EDGES.map((_, i) => pathRefs.current[i]?.getTotalLength() ?? 0);
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible.current || document.hidden) return;
      FLOW_EDGES.forEach((e, i) => {
        const p = pathRefs.current[i];
        const d = dotRefs.current[i];
        if (!p || !d) return;
        const ok = drawn.current[i] > 0.98;
        d.style.opacity = ok ? "1" : "0";
        if (!ok) return;
        const L = lens[i] || p.getTotalLength();
        const period = 1800 + L * 6;
        const t = ((now + i * 433) % period) / period;
        const pt = p.getPointAtLength(L * t);
        d.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
      });
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduce, layout]);

  const linked = useMemo(() => {
    if (!active) return null;
    const set = new Set<string>([active]);
    FLOW_EDGES.forEach((e) => {
      if (e.from === active) set.add(e.to);
      if (e.to === active) set.add(e.from);
    });
    return set;
  }, [active]);

  const node = active ? byId[active] : null;
  const services = FLOW_NODES.filter((n) => n.col === "service");
  const piTop = Math.min(...services.map((n) => n[layout][1])) - b.h / 2 - (layout === "wide" ? 44 : 40);
  const piBot = Math.max(...services.map((n) => n[layout][1])) + b.h / 2 + 22;
  const piX0 = layout === "wide" ? 600 - b.w / 2 - 34 : 12;
  const piX1 = layout === "wide" ? 600 + b.w / 2 + 34 : 378;

  const stage = (
    <div className="relative w-full" style={{ aspectRatio: `${b.W} / ${b.H}`, containerType: "inline-size" }}>
      <svg viewBox={`0 0 ${b.W} ${b.H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
        <rect x={piX0} y={piTop} width={piX1 - piX0} height={piBot - piTop} rx={22} className="flow-pi" />
        {FLOW_EDGES.map((e, i) => {
          const on = !linked || (linked.has(e.from) && linked.has(e.to) && (e.from === active || e.to === active));
          return (
            <g key={`${e.from}-${e.to}`} style={{ opacity: on ? 1 : 0.14, transition: "opacity 200ms var(--ease-out)" }}>
              <path d={edgePath(byId[e.from], byId[e.to], layout)} className="flow-track" />
              <path
                ref={(el) => {
                  pathRefs.current[i] = el;
                }}
                d={edgePath(byId[e.from], byId[e.to], layout)}
                pathLength={1}
                className="flow-edge"
                style={{ strokeDasharray: 1, strokeDashoffset: reduce ? 0 : 1 }}
              />
              {!reduce && (
                <circle
                  ref={(el) => {
                    dotRefs.current[i] = el;
                  }}
                  r={layout === "wide" ? 3.2 : 2.8}
                  className="flow-dot"
                  style={{ opacity: 0 }}
                />
              )}
            </g>
          );
        })}
      </svg>
      <p
        className="pointer-events-none absolute font-mono text-accent"
        style={{ left: `${((piX0 + 16) / b.W) * 100}%`, top: `${((piTop + 12) / b.H) * 100}%`, fontSize: layout === "wide" ? "max(10px, 0.95cqw)" : "max(10px, 2.8cqw)" }}
      >
        {SYSTEMS_UI.pi[locale]}
      </p>
      <ul role="list" aria-label={SYSTEMS_UI.diagramLabel[locale]}>
        {FLOW_NODES.map((n) => {
          const [x, y] = n[layout];
          const dim = linked && !linked.has(n.id);
          return (
            <li
              key={n.id}
              className="absolute"
              style={{ left: `${((x - b.w / 2) / b.W) * 100}%`, top: `${((y - b.h / 2) / b.H) * 100}%`, width: `${(b.w / b.W) * 100}%`, height: `${(b.h / b.H) * 100}%` }}
            >
              <button
                type="button"
                className={`flow-node press-scale ${n.col === "service" ? "is-service" : ""} ${active === n.id ? "is-active" : ""}`}
                style={{ opacity: dim ? 0.35 : 1 }}
                onPointerEnter={(e) => e.pointerType !== "touch" && setActive(n.id)}
                onPointerLeave={(e) => e.pointerType !== "touch" && setActive(null)}
                onFocus={() => setActive(n.id)}
                onBlur={() => setActive(null)}
                onClick={() => setActive((a) => (a === n.id ? null : n.id))}
                aria-describedby={active === n.id ? `flow-detail-${layout}` : undefined}
              >
                <span className="block truncate font-medium text-ink" style={{ fontSize: layout === "wide" ? "max(11px, 1.12cqw)" : "max(11px, 3.3cqw)" }}>
                  {n.name[locale]}
                </span>
                <span className="block truncate font-mono text-muted" style={{ fontSize: layout === "wide" ? "max(9.5px, 0.85cqw)" : "max(9px, 2.55cqw)" }}>
                  {n.sub[locale]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const caption = (
    <div className="flex min-h-[4.5rem] flex-col justify-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
      <ol className="flex flex-wrap gap-x-5 gap-y-1 font-mono text-[11.5px]">
        {SYSTEMS_UI.phases.map((p, i) => (
          <li key={i} className={`transition-colors duration-200 ${i <= phase ? "text-accent" : "text-muted/60"}`}>
            0{i + 1} · {p[locale]}
          </li>
        ))}
      </ol>
      <p id={`flow-detail-${layout}`} className="max-w-[56ch] text-pretty text-[13.5px] leading-snug text-muted sm:text-right" aria-live="polite">
        {node ? (
          <>
            <span className="text-ink">{node.name[locale]}: </span>
            {node.detail[locale]}
          </>
        ) : (
          SYSTEMS_UI.hint[locale]
        )}
      </p>
    </div>
  );

  if (layout === "wide") {
    return (
      <div ref={wrapRef} className="flow-track-wide relative" data-reduce={reduce ? "1" : "0"}>
        <div className="flow-pin flex flex-col justify-center gap-5">
          {caption}
          {stage}
        </div>
      </div>
    );
  }
  return (
    <div ref={wrapRef} className="space-y-5">
      {caption}
      {stage}
    </div>
  );
}

function Fact({ fact, locale }: { fact: SystemPlanet["facts"][number]; locale: "en" | "es" }) {
  return (
    <div className="min-w-0">
      <dt className="font-display text-[1.6rem] font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink">
        {locale === "es" && fact.valueEs ? fact.valueEs : fact.value}
      </dt>
      <dd className="mt-2 max-w-[30ch] text-[13px] leading-snug text-muted">{fact.label[locale]}</dd>
    </div>
  );
}

export function SystemsSection() {
  const { locale } = useLocale();
  const reduce = useReducedMotionSafe();

  return (
    <section id="sistemas" data-scene="systems" className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-5 pt-[var(--spacing-section)] sm:px-8">
        <motion.div {...revealProps(reduce)} className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2
            className="font-display text-balance text-[clamp(2.2rem,4.4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink lg:col-span-6"
            style={{ fontVariationSettings: '"opsz" 80' }}
          >
            {SYSTEMS_UI.heading[locale]}
          </h2>
          <p className="max-w-[54ch] text-pretty text-[15.5px] leading-relaxed text-muted lg:col-span-6">{SYSTEMS_UI.lead[locale]}</p>
        </motion.div>

        <div className="mt-10 hidden lg:block">
          <Diagram layout="wide" locale={locale} reduce={reduce} />
        </div>
        <div className="mt-10 lg:hidden">
          <Diagram layout="tall" locale={locale} reduce={reduce} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-[var(--spacing-section)] pt-16 sm:px-8 lg:pt-8">
        <motion.h3 {...revealProps(reduce)} className="font-display text-[clamp(1.4rem,2.4vw,1.9rem)] font-semibold tracking-[-0.03em] text-ink">
          {SYSTEMS_UI.details[locale]}
        </motion.h3>
        <ul className="mt-8 grid gap-x-12 gap-y-14 md:grid-cols-2">
          {SYSTEM_PLANETS.map((p, i) => (
            <motion.li key={p.id} {...revealProps(reduce, (i % 2) * 0.06)} className="border-t border-line pt-6">
              <p className="font-display text-[1.45rem] font-semibold leading-tight tracking-[-0.02em] text-ink">{p.name[locale]}</p>
              <p className="mt-1 text-[14.5px] text-ink/80">{p.line[locale]}</p>
              <p className="mt-4 max-w-[58ch] text-pretty text-[14.5px] leading-relaxed text-muted">{p.body[locale]}</p>
              <dl className="mt-6 grid grid-cols-2 gap-6">
                {p.facts.map((f) => (
                  <Fact key={f.value} fact={f} locale={locale} />
                ))}
              </dl>
              <p className="mt-5 font-mono text-[11.5px] text-muted">
                {SYSTEMS_UI.runsOn[locale]}: <span className="text-ink/80">{p.host[locale]}</span>
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={SYSTEMS_UI.stack[locale]}>
                {p.stack.map((s) => (
                  <li key={s} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] leading-none text-ink/75">
                    {s}
                  </li>
                ))}
              </ul>
              {p.links?.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group press-scale mt-5 inline-flex items-center gap-2 text-[13.5px] font-medium text-accent"
                >
                  {l.kind === "github" && <GithubLogo size={15} aria-hidden="true" />}
                  <span className="link-rule">{l.label[locale]}</span>
                  <ArrowUpRight size={12} className="cta-arrow cta-arrow-diag" aria-hidden="true" />
                </a>
              ))}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
