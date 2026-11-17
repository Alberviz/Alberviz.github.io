"use client";

import React, { useEffect, useLayoutEffect, useRef } from "react";
import { X } from "@phosphor-icons/react";
import { EASE, T } from "./holo-geo";
import type { Box } from "./holo-geo";

/**
 * The holographic chassis: dark glass, a translucent double border in the accent,
 * scan lines, a dot screen, a light line that sweeps the panel when it lands and
 * HUD corners. It also owns the life of a panel: a beam leaves the pill, the panel
 * flies out behind it, flickers and gets swept; on the way out it goes back to the
 * pill, falls into the trash or rises into the Warp portal.
 *
 * Everything is the Web Animations API on transform, opacity and clip-path, so it
 * runs off the main thread. Under reduced motion a panel simply fades in or out.
 */

export type Exit = "out" | "trash" | "send";

export interface Pt {
  x: number;
  y: number;
}

export interface Anchors {
  /** Top centre of the pill: where the beam leaves from. */
  pill: Pt;
  /** Centre of the pill: where a panel goes back to. */
  pillCentre: Pt;
  trash: Pt;
  portal: Pt;
}

export interface HoloFrameProps {
  id: string;
  box: Box;
  wide: boolean;
  scale: number;
  /** Stagger of this panel among the ones born together (ms). */
  delay: number;
  from: "pill" | "trash";
  exit: Exit | null;
  exitDelay: number;
  reduce: boolean | null;
  getAnchors: () => Anchors;
  onExited: (id: string) => void;
  onArrived?: (id: string) => void;
  title: string;
  meta?: string;
  icon: React.ReactNode;
  onClose?: () => void;
  closeLabel?: string;
  /** Narrow layout: fixed height so the stage does not jump (0 = content height). */
  flowHeight?: number;
  z?: number;
  children: (arriveMs: number) => React.ReactNode;
  ariaLabel?: string;
}

export function HoloFrame({
  id,
  box,
  wide,
  scale,
  delay,
  from,
  exit,
  exitDelay,
  reduce,
  getAnchors,
  onExited,
  onArrived,
  title,
  meta,
  icon,
  onClose,
  closeLabel,
  flowHeight,
  z = 10,
  children,
  ariaLabel,
}: HoloFrameProps) {
  const posRef = useRef<HTMLDivElement>(null);
  const flyRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const beamRef = useRef<HTMLDivElement>(null);
  const beamCoreRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<HTMLSpanElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const cornerA = useRef<HTMLSpanElement>(null);
  const cornerB = useRef<HTMLSpanElement>(null);
  const live = useRef<Animation[]>([]);
  const arrivedCb = useRef(onArrived);
  arrivedCb.current = onArrived;
  const exitedCb = useRef(onExited);
  exitedCb.current = onExited;
  const anchorsRef = useRef(getAnchors);
  anchorsRef.current = getAnchors;
  const scaleRef = useRef(scale);
  scaleRef.current = scale;

  /* Birth */
  useLayoutEffect(() => {
    const pos = posRef.current;
    const fly = flyRef.current;
    const body = bodyRef.current;
    if (!pos || !fly || !body) return;
    const anims: Animation[] = [];
    const add = (a: Animation | undefined) => {
      if (a) anims.push(a);
      return a;
    };
    const k = scaleRef.current || 1;

    if (reduce || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const a = add(body.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, delay, easing: EASE.fade, fill: "both" }));
      a?.finished.then(() => arrivedCb.current?.(id)).catch(() => undefined);
      live.current = anims;
      return () => anims.forEach((x) => x.cancel());
    }

    const a = anchorsRef.current();
    const r = pos.getBoundingClientRect();
    const origin = from === "trash" ? a.trash : a.pill;
    const dx = (origin.x - (r.left + r.width / 2)) / k;
    const dy = (origin.y - (r.top + r.height / 2)) / k;
    const fromTrash = from === "trash";
    const dur = fromTrash ? T.medio : T.vuelo;
    const d0 = delay + (fromTrash ? 0 : 60);

    add(fly.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0px, 0px)" }], { duration: dur, delay: d0, easing: EASE.enter, fill: "both" }));
    add(body.animate(
      [{ transform: `scale(${fromTrash ? 0.05 : 0.12}) rotate(${fromTrash ? 0 : -4}deg)` }, { transform: "scale(1) rotate(0deg)" }],
      { duration: dur, delay: d0, easing: fromTrash ? EASE.enter : EASE.settle, fill: "both" }
    ));
    add(body.animate([{ opacity: 0 }, { opacity: 0.9 }], { duration: T.rapido, delay: d0, easing: EASE.fade, fill: "both" }));

    const landed = d0 + dur;
    if (!fromTrash) {
      /* The hologram flicker as it locks on (about 205 ms), then the sweep. */
      add(body.animate(
        [
          { opacity: 0.9, offset: 0 },
          { opacity: 0.55, offset: 40 / 205 },
          { opacity: 1, offset: 90 / 205 },
          { opacity: 0.8, offset: 125 / 205 },
          { opacity: 1, offset: 1 },
        ],
        { duration: 205, delay: landed, fill: "forwards" }
      ));
      add(sweepRef.current?.animate(
        [
          { transform: "translateY(-105%)", opacity: 0 },
          { transform: "translateY(-30%)", opacity: 1, offset: 0.2 },
          { transform: "translateY(300%)", opacity: 0 },
        ],
        { duration: T.barrido, delay: landed + 125, easing: EASE.sine, fill: "both" }
      ));
    } else {
      add(body.animate([{ opacity: 0.9 }, { opacity: 1 }], { duration: T.rapido, delay: landed, fill: "forwards" }));
    }
    /* HUD corners lock in from outside. */
    const c = (el: HTMLSpanElement | null, sign: 1 | -1) =>
      add(el?.animate(
        [
          { transform: `translate(${-10 * sign}px, ${-10 * sign}px)`, opacity: 0 },
          { transform: "translate(0px, 0px)", opacity: 0.9 },
        ],
        { duration: T.medio, delay: landed - 40, easing: EASE.enter, fill: "both" }
      ));
    c(cornerA.current, 1);
    c(cornerB.current, -1);

    /* The beam: the tip grows, the tail follows, it fades out (230 / 330 / 140 ms of the real one). */
    const beam = beamRef.current;
    const core = beamCoreRef.current;
    const spark = sparkRef.current;
    if (beam && core && !fromTrash) {
      const ox = (origin.x - r.left) / k;
      const oy = (origin.y - r.top) / k;
      const tx = r.width / k / 2;
      const ty = r.height / k / 2;
      const vx = tx - ox;
      const vy = ty - oy;
      const L = Math.hypot(vx, vy);
      beam.style.left = `${ox}px`;
      beam.style.top = `${oy}px`;
      beam.style.transform = `rotate(${Math.atan2(-vx, vy)}rad)`;
      core.style.height = `${L}px`;
      const tail = (ms: number) => {
        const t = Math.min(1, Math.max(0, (ms - 110) / 330));
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };
      const grow = (ms: number) => 1 - Math.pow(1 - Math.min(1, ms / 230), 3);
      const ms = [0, 55, 110, 170, 230, 330, 440];
      const clip = ms.map((m) => `inset(${(tail(m) * 100).toFixed(1)}% 0px ${((1 - grow(m)) * 100).toFixed(1)}% 0px)`);
      add(core.animate(
        ms.map((m, i) => ({ clipPath: clip[i], opacity: m < 300 ? 1 : 1 - (m - 300) / 140, offset: m / 440 })),
        { duration: 440, delay, easing: "linear", fill: "both" }
      ));
      if (spark) {
        add(spark.animate(
          ms.map((m) => ({ transform: `translateY(${(grow(m) * L).toFixed(1)}px)`, opacity: m < 300 ? 1 : 1 - (m - 300) / 140, offset: m / 440 })),
          { duration: 440, delay, easing: "linear", fill: "both" }
        ));
      }
    }

    const done = window.setTimeout(() => arrivedCb.current?.(id), landed);
    live.current = anims;
    return () => {
      window.clearTimeout(done);
      anims.forEach((x) => x.cancel());
    };
    // Birth runs once per mount, on purpose: a panel never re-flies when props change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Death */
  useEffect(() => {
    if (!exit) return;
    const pos = posRef.current;
    const fly = flyRef.current;
    const body = bodyRef.current;
    if (!pos || !fly || !body) return;
    const k = scaleRef.current || 1;
    const quick = reduce || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const anims: Animation[] = [];

    if (quick) {
      const a = body.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, delay: 0, easing: EASE.fade, fill: "forwards" });
      anims.push(a);
      a.finished.then(() => exitedCb.current(id)).catch(() => undefined);
      return () => anims.forEach((x) => x.cancel());
    }

    const a = anchorsRef.current();
    const r = pos.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const to = exit === "trash" ? a.trash : exit === "send" ? a.portal : a.pillCentre;
    const dx = (to.x - cx) / k;
    const dy = (to.y - cy) / k;

    /* Anything still arriving is cut short; the exit starts from where it is. */
    live.current.forEach((x) => {
      try {
        x.commitStyles();
      } catch {
        /* element not rendered */
      }
      x.cancel();
    });
    const startFly = fly.style.transform || "translate(0px, 0px)";
    const startBody = body.style.transform || "scale(1) rotate(0deg)";
    const startOp = body.style.opacity || "1";

    const go = () => {
      if (exit === "out") {
        anims.push(fly.animate([{ transform: startFly }, { transform: `translate(${dx}px, ${dy}px)` }], { duration: T.salida, delay: exitDelay, easing: EASE.exit, fill: "forwards" }));
        anims.push(body.animate([{ transform: startBody, opacity: startOp }, { transform: "scale(0.12) rotate(3deg)", opacity: 0 }], { duration: T.salida, delay: exitDelay, easing: EASE.exit, fill: "forwards" }));
      } else if (exit === "trash") {
        /* A short crackle, then it falls into the corner shrinking. */
        anims.push(body.animate(
          [
            { opacity: 1, offset: 0 },
            { opacity: 0.45, offset: 45 / 510 },
            { opacity: 0.95, offset: 90 / 510 },
            { opacity: 0.95, offset: (90 + T.lento * 0.45) / 510 },
            { opacity: 0, offset: 1 },
          ],
          { duration: 90 + T.lento, delay: exitDelay, fill: "forwards" }
        ));
        anims.push(fly.animate([{ transform: startFly }, { transform: `translate(${dx}px, ${dy}px)` }], { duration: T.lento, delay: exitDelay + 90, easing: EASE.exit, fill: "forwards" }));
        anims.push(body.animate([{ transform: startBody }, { transform: "scale(0.05) rotate(0deg)" }], { duration: T.lento, delay: exitDelay + 90, easing: EASE.exit, fill: "forwards" }));
      } else {
        /* To Warp: it stretches and rises into the black hole at the top edge. */
        anims.push(fly.animate([{ transform: startFly }, { transform: `translate(${dx}px, ${dy}px)` }], { duration: 460, delay: exitDelay, easing: EASE.exit, fill: "forwards" }));
        anims.push(body.animate([{ transform: startBody }, { transform: "scale(0.28, 0.9) rotate(0deg)" }], { duration: 460, delay: exitDelay, easing: EASE.exit, fill: "forwards" }));
        anims.push(body.animate(
          [{ opacity: 1, offset: 0 }, { opacity: 1, offset: 240 / 460 }, { opacity: 0, offset: 1 }],
          { duration: 460, delay: exitDelay, fill: "forwards" }
        ));
      }
      Promise.all(anims.map((x) => x.finished)).then(() => exitedCb.current(id)).catch(() => undefined);
    };
    go();
    return () => {
      anims.forEach((x) => x.cancel());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exit]);

  const style: React.CSSProperties = wide
    ? { left: box.x, top: box.y, width: box.w, height: box.h, zIndex: z }
    : { position: "relative", width: "100%", height: flowHeight || undefined, zIndex: z };
  const arrive = delay + (from === "trash" ? T.medio : T.vuelo) + 60;

  return (
    <div ref={posRef} data-holo-panel={id} className={wide ? "absolute" : "relative"} style={style}>
      {/* The beam leaves the pill before the panel does */}
      <div ref={beamRef} aria-hidden="true" className="pointer-events-none absolute z-0 h-0 w-0 origin-top">
        <div ref={beamCoreRef} className="absolute left-[-3px] top-0 w-[6px] rounded-full opacity-0" style={{ background: "linear-gradient(180deg, rgb(242 179 111 / 0), rgb(242 179 111 / 0.55))" }}>
          <span className="absolute left-[2.25px] top-0 h-full w-[1.5px]" style={{ background: "linear-gradient(180deg, rgb(255 230 199 / 0.15), #ffe6c7)" }} />
        </div>
        <span ref={sparkRef} className="absolute left-[-4px] top-[-4px] h-2 w-2 rounded-full bg-[#ffe6c7] opacity-0" style={{ boxShadow: "0 0 10px 2px rgb(242 179 111 / 0.7)" }} />
      </div>

      <div ref={flyRef} className="relative h-full w-full will-change-transform">
        <div ref={bodyRef} className="relative h-full w-full" style={{ opacity: 0 }}>
          <section
            role="group"
            aria-label={ariaLabel ?? title}
            className="holo-glass flex h-full w-full flex-col overflow-hidden"
          >
            <header className="relative z-[1] flex h-[46px] shrink-0 items-center gap-2.5 border-b border-accent/15 px-3.5">
              <span className="grid size-6 place-items-center text-accent" aria-hidden="true">
                {icon}
              </span>
              <h3 className="min-w-0 flex-1 truncate text-[13.5px] font-semibold tracking-[-0.005em] text-ink">{title}</h3>
              {meta && <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted">{meta}</span>}
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={closeLabel}
                  className="holo-close -mr-1.5 grid size-8 shrink-0 place-items-center rounded-full text-muted transition-colors duration-150"
                >
                  <X size={13} weight="bold" aria-hidden="true" />
                </button>
              )}
            </header>
            <div className="relative z-[1] min-h-0 flex-1">{children(arrive)}</div>
            <div aria-hidden="true" className="holo-dots" />
            <div aria-hidden="true" className="holo-scanlines" />
            <div ref={sweepRef} aria-hidden="true" className="holo-sweep" />
          </section>
          <span ref={cornerA} aria-hidden="true" className="holo-corner holo-corner-a" />
          <span ref={cornerB} aria-hidden="true" className="holo-corner holo-corner-b" />
        </div>
      </div>
    </div>
  );
}
