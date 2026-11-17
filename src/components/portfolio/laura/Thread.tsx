"use client";

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { EASE, T } from "./holo-geo";

/**
 * The thread: a dotted curve that is drawn from a list row to the viewer that row
 * opened (420 ms), and retracts into the row (180 ms) when the viewer goes. Its
 * ends follow layout positions, so it stays attached when the stage is resized.
 */

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Position of an element inside `root` from layout offsets, so transforms (flight, scale) do not matter. */
function layoutRect(el: HTMLElement, root: HTMLElement): Rect {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

export function Thread({
  container,
  n,
  viewerKey,
  wide,
  tick,
  reduce,
  delay,
  retract,
}: {
  container: React.RefObject<HTMLElement | null>;
  n: number;
  viewerKey: string;
  wide: boolean;
  tick: number;
  reduce: boolean | null;
  delay: number;
  retract: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const maskPath = useRef<SVGPathElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const [geo, setGeo] = useState<{ d: string; ex: number; ey: number } | null>(null);

  useLayoutEffect(() => {
    const root = container.current;
    if (!root) return;
    const row = root.querySelector<HTMLElement>(`[data-holo-list="downloads"] [data-holo-row="${n}"]`);
    const view = root.querySelector<HTMLElement>(`[data-holo-panel="${viewerKey}"]`);
    if (!row || !view) return;
    const a = layoutRect(row, root);
    const b = layoutRect(view, root);
    const sy = a.y + a.h / 2;
    let d: string;
    let ex: number;
    let ey: number;
    if (wide) {
      const sx = a.x + a.w - 4;
      ex = b.x;
      ey = b.y + 23;
      const k = Math.max(50, Math.abs(ex - sx) * 0.5);
      d = `M ${sx} ${sy} C ${sx + k} ${sy}, ${ex - k} ${ey}, ${ex} ${ey}`;
    } else {
      const sx = a.x + a.w - 2;
      ex = b.x + b.w;
      ey = b.y + 23;
      d = `M ${sx} ${sy} C ${sx + 20} ${sy}, ${ex + 20} ${ey}, ${ex} ${ey}`;
    }
    setGeo((g) => (g && g.d === d ? g : { d, ex, ey }));
  }, [container, n, viewerKey, wide, tick]);

  useEffect(() => {
    const p = maskPath.current;
    const c = dot.current;
    if (!p || !geo) return;
    if (reduce) {
      p.style.strokeDashoffset = retract ? "1" : "0";
      if (c) c.style.opacity = retract ? "0" : "1";
      return;
    }
    const anims: Animation[] = [];
    anims.push(
      p.animate(retract ? [{ strokeDashoffset: 0 }, { strokeDashoffset: 1 }] : [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], {
        duration: retract ? T.rapido : T.lento,
        delay: retract ? 0 : delay,
        easing: EASE.change,
        fill: "both",
      })
    );
    if (c) {
      anims.push(
        c.animate(retract ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 1 }], {
          duration: T.rapido,
          delay: retract ? 0 : delay + T.lento - 60,
          fill: "both",
        })
      );
    }
    return () => anims.forEach((x) => x.cancel());
  }, [geo, retract, reduce, delay]);

  if (!geo) return null;
  return (
    <svg aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-visible" style={{ zIndex: 17 }}>
      <defs>
        <mask id={`m${id}`} maskUnits="userSpaceOnUse" x="-2000" y="-2000" width="6000" height="6000">
          <path ref={maskPath} d={geo.d} fill="none" stroke="#fff" strokeWidth={10} pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
        </mask>
      </defs>
      <path d={geo.d} fill="none" stroke="#F2B36F" strokeOpacity={0.85} strokeWidth={1.6} strokeLinecap="round" strokeDasharray="1.5 6" mask={`url(#m${id})`} />
      <circle ref={dot} cx={geo.ex} cy={geo.ey} r={3} fill="#FFE6C7" style={{ opacity: 0 }} />
    </svg>
  );
}
