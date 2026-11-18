"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useReducedMotionSafe } from "@/lib/motion";

/**
 * Page changes as a Warp jump. Tapping a link to another page opens a black
 * hole right under the finger that swallows the screen (the same move as
 * dropping a file into a Warp portal); the new page comes out of it as the hole
 * closes at the centre of the screen.
 *
 * Only `clip-path` is animated (Web Animations API). Reduced motion, modifier
 * clicks, new tabs, downloads, same-page anchors and external links keep the
 * browser's normal behaviour.
 */

const CLOSE_MS = 440;
const OPEN_MS = 720;
const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";
const EASE_DRAWER = "cubic-bezier(0.32, 0.72, 0, 1)";
/** Extra radius of each layer over the black disk: the bright rim and its glow. */
const LAYERS = [{ extra: 34 }, { extra: 5 }, { extra: 0 }] as const;
/** If the new page has not arrived by then, open anyway. */
const NAV_TIMEOUT_MS = 2400;

const norm = (p: string) => (p.endsWith("/") ? p : `${p}/`);

function farthestCorner(x: number, y: number) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  return Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) + 8;
}

export function WarpTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotionSafe();
  const rootRef = useRef<HTMLDivElement>(null);
  const pending = useRef<{ from: string; timer: number } | null>(null);

  const play = (from: string[], to: string[], ms: number, easing: string) => {
    const root = rootRef.current;
    if (!root) return Promise.resolve();
    const layers = Array.from(root.children) as HTMLElement[];
    const anims = layers.map((el, i) =>
      el.animate([{ clipPath: from[i] }, { clipPath: to[i] }], { duration: ms, easing, fill: "forwards" })
    );
    return Promise.all(anims.map((a) => a.finished.catch(() => undefined))).then(() => undefined);
  };

  const circles = (r: number, x: number, y: number) =>
    LAYERS.map(({ extra }) => `circle(${Math.max(0, r > 0 ? r + extra : 0)}px at ${x}px ${y}px)`);

  // Arrival: the hole closes at the centre and lets the new page out.
  useEffect(() => {
    const root = rootRef.current;
    const p = pending.current;
    if (!root || !p || norm(pathname) === p.from) return;
    window.clearTimeout(p.timer);
    pending.current = null;
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    const r = farthestCorner(x, y);
    // Two frames: let the new page paint under the black before revealing it.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        void play(circles(r, x, y), circles(0, x, y), OPEN_MS, EASE_DRAWER).then(() => {
          root.dataset.on = "0";
          root.getAnimations({ subtree: true }).forEach((a) => a.cancel());
        });
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (reduce !== false) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.dataset.noWarp !== undefined) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      const from = norm(location.pathname);
      if (norm(url.pathname) === from) return;
      // Static files (the CV, media) are not pages.
      if (/\.[a-z0-9]+$/i.test(url.pathname)) return;
      const root = rootRef.current;
      if (!root || pending.current) return;

      e.preventDefault();
      let x = e.clientX;
      let y = e.clientY;
      if (e.detail === 0) {
        // Keyboard activation: open from the link itself.
        const box = a.getBoundingClientRect();
        x = box.left + box.width / 2;
        y = box.top + box.height / 2;
      }
      const target = url.pathname + url.search + url.hash;
      router.prefetch(url.pathname);
      root.dataset.on = "1";
      const timer = window.setTimeout(() => {
        // Navigation took too long (or failed): let the browser take over.
        pending.current = null;
        location.assign(target);
      }, NAV_TIMEOUT_MS);
      pending.current = { from, timer };
      void play(circles(0, x, y), circles(farthestCorner(x, y), x, y), CLOSE_MS, EASE_IN_OUT).then(() => {
        if (pending.current) router.push(target);
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [reduce, router]);

  return (
    <div ref={rootRef} aria-hidden="true" className="warp-veil" data-on="0">
      <div className="warp-veil-glow" />
      <div className="warp-veil-rim" />
      <div className="warp-veil-hole" />
    </div>
  );
}
