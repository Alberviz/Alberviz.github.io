"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { DeviceMobile, DeviceTablet, File, FilePdf, FileVideo, Image as ImageIcon, Television, TextAa, X } from "@phosphor-icons/react";
import { WARP } from "@/content/olimpo";
import { EASE_OUT } from "@/lib/motion";
import { WarpEngine } from "./warp-engine";
import type { Rect } from "./warp-engine";
import { fileArea, paintDesktop } from "./warp-desktop";

/**
 * Warp, playable. A recreated laptop screen with real files; drag one toward the
 * top and the portals open (phone and tablet on the top edge, the TV on the
 * right), with the real AE1 shader and the lens bending the screen. Drop it in
 * one: the hole swallows it and a white hole spits it out on that device. Shift
 * over two portals merges them ("a los dos"). Touch: tap a file, then a portal.
 * Keyboard: Enter on a file, then a portal (1, 2, 3), Esc cancels. A real file
 * dropped from the visitor's system is only read for its name and size, locally.
 */

type Kind = "pdf" | "image" | "video" | "text" | "file";

interface Item {
  name: string;
  size: string;
  kind: Kind;
  /** Object URL for a dropped image (local only, revoked on replace/unmount). */
  url?: string;
  demo?: number;
}

type Mode = "idle" | "choosing" | "sending" | "arriving";
type DeviceId = "movil" | "tablet" | "tele";

interface Geo {
  W: number;
  H: number;
  screen: Rect;
  R: number;
  compact: boolean;
  portals: { id: DeviceId; x: number; y: number }[];
}

const DEVICES = WARP.devices as unknown as { id: DeviceId; kicker: string; name: { en: string; es: string }; title: { en: string; es: string } }[];
const FILE_ICONS: Record<Kind, typeof File> = { pdf: FilePdf, image: ImageIcon, video: FileVideo, text: TextAa, file: File };
const DEVICE_ICONS: Record<DeviceId, typeof File> = { movil: DeviceMobile, tablet: DeviceTablet, tele: Television };

function fmtSize(bytes: number, locale: "en" | "es") {
  const units = ["B", "KB", "MB", "GB"];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i += 1;
  }
  const n = v.toFixed(i === 0 ? 0 : 1);
  return `${locale === "es" ? n.replace(".", ",") : n} ${units[i]}`;
}

function kindOf(file: { name: string; type: string }): Kind {
  if (file.type.startsWith("video/") || /\.(torrent|mkv|mp4|webm|mov)$/i.test(file.name)) return "video";
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf") return "pdf";
  if (file.type.startsWith("text/")) return "text";
  return "file";
}

const accepts = (dev: DeviceId, item: Item | null) => dev !== "tele" || item?.kind === "video";

export function WarpDemo({ locale }: { locale: "en" | "es" }) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLCanvasElement>(null);
  const deviceRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const portalBtnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const engineRef = useRef<WarpEngine | null>(null);
  const paintRef = useRef<HTMLCanvasElement | null>(null);
  const geoRef = useRef<Geo | null>(null);
  const urlsRef = useRef<string[]>([]);
  const timers = useRef<number[]>([]);
  const drag = useRef<{ i: number; pid: number; x0: number; y0: number; on: boolean; el: HTMLButtonElement } | null>(null);
  const shiftRef = useRef(false);
  const selRef = useRef<DeviceId[]>([]);
  const hoverRef = useRef<DeviceId | "fused" | null>(null);
  const modeRef = useRef<Mode>("idle");

  const [gl, setGl] = useState<"pending" | "on" | "off">("pending");
  const [geo, setGeo] = useState<Geo | null>(null);
  const [mode, setModeState] = useState<Mode>("idle");
  const [picked, setPicked] = useState<Item | null>(null);
  const [hover, setHoverState] = useState<DeviceId | "fused" | null>(null);
  const [fused, setFused] = useState(false);
  const [both, setBoth] = useState(false);
  const [received, setReceived] = useState<Partial<Record<DeviceId, Item>>>({});
  const [status, setStatus] = useState("");
  const [fine, setFine] = useState(false);
  const [hidden, setHidden] = useState<number | null>(null);

  const setMode = (m: Mode) => {
    modeRef.current = m;
    setModeState(m);
  };
  const setHover = (h: DeviceId | "fused" | null) => {
    if (hoverRef.current === h) return;
    hoverRef.current = h;
    setHoverState(h);
    engineRef.current?.hover(h && h !== "fused" ? h : null);
  };
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  useEffect(() => {
    setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    const t = timers.current;
    const urls = urlsRef.current;
    return () => {
      t.forEach((id) => window.clearTimeout(id));
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  /* Engine: one per mount (and per reduced-motion flip). */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const still = !!reduce || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const engine = WarpEngine.create(canvas, still);
    engineRef.current = engine;
    setGl(engine ? "on" : "off");
    return () => {
      engine?.dispose();
      engineRef.current = null;
    };
  }, [reduce]);

  /* Layout: measure the screen and the devices, paint the desktop, hand both to the engine. */
  const measure = useCallback(() => {
    const stage = stageRef.current;
    const screen = screenRef.current;
    if (!stage || !screen) return;
    const s = stage.getBoundingClientRect();
    const r = screen.getBoundingClientRect();
    const scr: Rect = { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height };
    const compact = r.width < 560;
    const R = Math.max(compact ? 15 : 22, Math.min(40, r.width * 0.04));
    const bar = Math.max(18, r.height * 0.06);
    const portals: Geo["portals"] = [
      { id: "movil", x: scr.x + scr.w * (compact ? 0.3 : 0.34), y: scr.y + bar + R * 1.3 },
      { id: "tablet", x: scr.x + scr.w * (compact ? 0.62 : 0.56), y: scr.y + bar + R * 1.3 },
      { id: "tele", x: scr.x + scr.w - R * 1.3, y: scr.y + scr.h * (compact ? 0.6 : 0.52) },
    ];
    const g: Geo = { W: s.width, H: s.height, screen: scr, R, compact, portals };
    geoRef.current = g;
    setGeo(g);

    const devices: Record<string, Rect> = {};
    for (const d of DEVICES) {
      const el = deviceRefs.current[d.id];
      if (!el) continue;
      const q = el.getBoundingClientRect();
      devices[d.id] = { x: q.left - s.left, y: q.top - s.top, w: q.width, h: q.height };
    }
    const engine = engineRef.current;
    const dpr = engine?.pixelRatio ?? Math.min(window.devicePixelRatio || 1, 1.5);
    if (!paintRef.current) paintRef.current = document.createElement("canvas");
    const target = engine ? paintRef.current : fallbackRef.current;
    if (target) paintDesktop(target, scr.w, scr.h, dpr, { compact, locale });
    if (engine) {
      engine.setLayout({ width: s.width, height: s.height, screen: scr, portals, R, devices });
      engine.setDesktop(paintRef.current);
    }
  }, [locale]);

  useLayoutEffect(() => {
    if (gl === "pending") return;
    measure();
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(stage);
    return () => ro.disconnect();
  }, [gl, measure]);

  /* ----- choosing and sending ----- */

  const reset = useCallback(() => {
    selRef.current = [];
    setFused(false);
    setHover(null);
    setPicked(null);
    setMode("idle");
    engineRef.current?.open(false);
  }, []);

  const cancel = useCallback(() => {
    const d = drag.current;
    if (d?.el) {
      d.el.animate([{ transform: d.el.style.transform || "none" }, { transform: "translate(0px, 0px)" }], {
        duration: reduce ? 0 : 320,
        easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      });
      d.el.style.transform = "";
    }
    drag.current = null;
    reset();
  }, [reduce, reset]);

  const open = useCallback((item: Item) => {
    setPicked(item);
    setMode("choosing");
    selRef.current = [];
    engineRef.current?.open(true);
  }, []);

  const centreOf = (target: DeviceId | "fused") => {
    const g = geoRef.current;
    if (!g) return null;
    if (target === "fused") {
      const c = engineRef.current?.fusedCentre();
      if (c) return c;
      const a = g.portals[0];
      const b = g.portals[1];
      return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, R: g.R * 1.3 };
    }
    const p = g.portals.find((q) => q.id === target);
    return p ? { x: p.x, y: p.y, R: g.R } : null;
  };

  const send = useCallback(
    (targets: DeviceId[], item: Item | null = picked) => {
      if (!item || modeRef.current === "sending" || modeRef.current === "arriving") return;
      if (targets.some((t) => !accepts(t, item))) {
        setStatus(WARP.onlyVideo[locale]);
        return;
      }
      const into: DeviceId | "fused" = targets.length > 1 ? "fused" : targets[0];
      setMode("sending");
      setHover(null);
      const c = centreOf(into);
      const stage = stageRef.current;
      const el = item.demo != null ? tileRefs.current[item.demo] : null;
      if (el && c && stage) {
        const s = stage.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        const cur = new DOMMatrixReadOnly(getComputedStyle(el).transform === "none" ? undefined : getComputedStyle(el).transform);
        const dx = c.x - (r.left - s.left + r.width / 2) + cur.m41;
        const dy = c.y - (r.top - s.top + r.height / 2) + cur.m42;
        el.animate(
          reduce
            ? [{ opacity: 1 }, { opacity: 0 }]
            : [
                { transform: `translate(${cur.m41}px, ${cur.m42}px) scale(1)`, opacity: 1 },
                { transform: `translate(${dx}px, ${dy}px) scale(0.08)`, opacity: 0 },
              ],
          { duration: reduce ? 200 : 460, easing: "cubic-bezier(0.77, 0, 0.175, 1)", fill: "forwards" }
        );
        setHidden(item.demo ?? null);
      }
      drag.current = null;
      later(() => engineRef.current?.swallow(into), reduce ? 0 : 360);
      later(() => {
        engineRef.current?.open(false);
        setFused(false);
        setMode("arriving");
        for (const t of targets) engineRef.current?.spit(t);
        later(() => {
          setReceived((prev) => {
            for (const t of targets) {
              const old = prev[t];
              if (old?.url && old.url !== item.url && !targets.some((x) => x !== t && prev[x]?.url === old.url)) {
                URL.revokeObjectURL(old.url);
              }
            }
            const next = { ...prev };
            for (const t of targets) next[t] = item;
            return next;
          });
          const names = targets.map((t) => DEVICES.find((d) => d.id === t)?.title[locale]).join(" + ");
          setStatus(`${WARP.sent[locale]} ${names}: ${item.name}`);
        }, reduce ? 0 : 420);
      }, reduce ? 250 : 980);
      later(() => {
        if (el) {
          el.getAnimations().forEach((a) => a.cancel());
          el.style.transform = "";
        }
        setHidden(null);
        selRef.current = [];
        setPicked(null);
        setMode("idle");
      }, reduce ? 900 : 2600);
    },
    [picked, locale, reduce]
  );

  /** Shift (or the "to both" chip): add a portal; with two, they merge. */
  const add = useCallback(
    (id: DeviceId, sendWhenMerged: boolean) => {
      if (id === "tele") return false;
      if (!selRef.current.includes(id)) selRef.current = [...selRef.current, id];
      if (selRef.current.length === 2) {
        engineRef.current?.fuse("movil", "tablet");
        setFused(true);
        setHover("fused");
        if (sendWhenMerged) later(() => send(["movil", "tablet"]), reduce ? 50 : 620);
      } else {
        setStatus(locale === "es" ? "Elige el segundo portal" : "Pick the second portal");
      }
      return true;
    },
    [send, reduce, locale]
  );

  /* Hover test in stage coordinates. */
  const hit = (x: number, y: number): DeviceId | "fused" | null => {
    const g = geoRef.current;
    if (!g) return null;
    if (selRef.current.length === 2) {
      const c = centreOf("fused");
      if (c && Math.hypot(x - c.x, y - c.y) < c.R * 3.2) return "fused";
    }
    let best: DeviceId | null = null;
    let bd = Infinity;
    for (const p of g.portals) {
      const d = Math.hypot(x - p.x, y - p.y);
      if (d < g.R * 2.6 && d < bd) {
        bd = d;
        best = p.id;
      }
    }
    return best;
  };

  /* Mouse and pen drag of the demo files (touch uses tap, so scrolling stays native). */
  const onTileDown = (e: React.PointerEvent<HTMLButtonElement>, i: number) => {
    if (e.pointerType === "touch" || mode !== "idle" || e.button !== 0) return;
    drag.current = { i, pid: e.pointerId, x0: e.clientX, y0: e.clientY, on: false, el: e.currentTarget };
  };

  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current;
      if (!d || e.pointerId !== d.pid) return;
      const dx = e.clientX - d.x0;
      const dy = e.clientY - d.y0;
      if (!d.on) {
        if (Math.hypot(dx, dy) < 6) return;
        d.on = true;
        try {
          d.el.setPointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
        const f = WARP.files[d.i];
        open({ name: f.name, size: f.size, kind: f.kind, demo: d.i });
      }
      d.el.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
      const s = stageRef.current?.getBoundingClientRect();
      if (!s) return;
      const h = hit(e.clientX - s.left, e.clientY - s.top);
      setHover(h);
      if (h && h !== "fused" && shiftRef.current) add(h, false);
    };
    const up = (e: PointerEvent) => {
      const d = drag.current;
      if (!d || e.pointerId !== d.pid) return;
      if (!d.on) {
        drag.current = null;
        return;
      }
      const h = hoverRef.current;
      if (h === "fused") send(["movil", "tablet"]);
      else if (h && accepts(h, picked ?? { name: "", size: "", kind: WARP.files[d.i].kind })) send([h]);
      else cancel();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Shift") return;
      shiftRef.current = e.type === "keydown";
      const h = hoverRef.current;
      if (shiftRef.current && drag.current?.on && h && h !== "fused") add(h, false);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("keydown", key);
    window.addEventListener("keyup", key);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("keydown", key);
      window.removeEventListener("keyup", key);
    };
  });

  /* A file from the visitor's own system: read locally, never uploaded. */
  const isFiles = (e: React.DragEvent) => Array.from(e.dataTransfer.types).includes("Files");
  const onDragEnter = (e: React.DragEvent) => {
    if (!isFiles(e) || modeRef.current === "sending" || modeRef.current === "arriving") return;
    e.preventDefault();
    if (modeRef.current === "idle") open({ name: "", size: "", kind: "file" });
  };
  const onDragOver = (e: React.DragEvent) => {
    if (!isFiles(e) || modeRef.current !== "choosing") return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    const s = stageRef.current?.getBoundingClientRect();
    if (s) setHover(hit(e.clientX - s.left, e.clientY - s.top));
  };
  const onDragLeave = (e: React.DragEvent) => {
    const next = e.relatedTarget as Node | null;
    if (modeRef.current === "choosing" && (!next || !stageRef.current?.contains(next))) reset();
  };
  const onDrop = (e: React.DragEvent) => {
    if (!isFiles(e)) return;
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    const h = hoverRef.current;
    if (!f || !h) return reset();
    const kind = kindOf(f);
    const item: Item = { name: f.name, size: fmtSize(f.size, locale), kind };
    if (kind === "image" && f.size < 25 * 1024 * 1024) {
      item.url = URL.createObjectURL(f);
      urlsRef.current.push(item.url);
    }
    setPicked(item);
    send(h === "fused" ? ["movil", "tablet"] : [h], item);
  };

  /* Keyboard: Esc cancels, 1/2/3 pick a portal. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" && modeRef.current === "choosing") {
      e.preventDefault();
      cancel();
    }
    if (modeRef.current === "choosing" && ["1", "2", "3"].includes(e.key)) {
      e.preventDefault();
      send([DEVICES[Number(e.key) - 1].id]);
    }
  };

  /* Focus the first portal when the portals open from the keyboard or a tap. */
  const focusPortal = useRef(false);
  useEffect(() => {
    if (mode === "choosing" && focusPortal.current) {
      focusPortal.current = false;
      const first = picked?.kind === "video" ? "tele" : "movil";
      requestAnimationFrame(() => portalBtnRefs.current[first]?.focus({ preventScroll: true }));
    }
  }, [mode, picked]);

  const onPortal = (e: React.MouseEvent, id: DeviceId) => {
    if (e.shiftKey || both) {
      if (add(id, true)) return;
    }
    send([id]);
  };

  const g = geo;
  const plateFor = hover && mode === "choosing" ? hover : null;
  const plate = (() => {
    if (!plateFor || !g) return null;
    const isFused = plateFor === "fused";
    const dev = isFused ? null : DEVICES.find((d) => d.id === plateFor)!;
    const p = isFused ? centreOf("fused") : g.portals.find((q) => q.id === plateFor);
    if (!p) return null;
    const ok = isFused || accepts(plateFor as DeviceId, picked);
    const right = plateFor === "tele";
    return {
      kicker: isFused ? "WARP" : dev!.kicker,
      title: isFused ? (locale === "es" ? "Móvil y Tablet · Olimpo" : "Phone and Tablet · Olimpo") : dev!.title[locale],
      detail: isFused ? WARP.both[locale] : right ? WARP.tvDetail[locale] : WARP.trayDetail[locale],
      pill: !ok ? WARP.onlyVideo[locale] : right ? WARP.dropToPlay[locale] : WARP.dropToSend[locale],
      ok,
      style: g.compact
        ? ({ left: g.screen.x + 10, top: g.screen.y + g.screen.h - 10, transform: "translateY(-100%)" } as React.CSSProperties)
        : right
          ? ({ left: p.x - g.R * 1.6, top: p.y - g.R * 1.5, transform: "translate(-100%, -100%)" } as React.CSSProperties)
          : ({ left: Math.min(p.x + g.R * 1.8, g.screen.x + g.screen.w - 230), top: p.y + g.R * 0.2 } as React.CSSProperties),
    };
  })();

  const area = fileArea(g?.compact ?? false);
  const touchHint = !fine;

  return (
    <div>
      <div
        ref={stageRef}
        role="group"
        aria-label={WARP.canvasLabel[locale]}
        onKeyDown={onKeyDown}
        onDragEnter={fine ? onDragEnter : undefined}
        onDragOver={fine ? onDragOver : undefined}
        onDragLeave={fine ? onDragLeave : undefined}
        onDrop={fine ? onDrop : undefined}
        className="warp-demo relative grid gap-3 lg:grid-cols-[minmax(0,1fr)_13.5rem] lg:gap-4"
      >
        {/* The laptop screen */}
        <div ref={screenRef} className="warp-screen relative aspect-[16/10] w-full overflow-hidden rounded-[14px] border border-line">
          {gl === "off" && <canvas ref={fallbackRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />}
          <ul aria-label={WARP.filesLabel[locale]} className="absolute grid grid-cols-2 content-start gap-1.5 sm:gap-2" style={{ left: `${area.x * 100}%`, top: `${area.y * 100}%`, width: `${area.w * 100}%` }}>
            {WARP.files.map((f, i) => {
              const Icon = FILE_ICONS[f.kind];
              const isPicked = picked?.demo === i;
              return (
                <li key={f.name} className="min-w-0">
                  <button
                    ref={(el) => {
                      tileRefs.current[i] = el;
                    }}
                    type="button"
                    onPointerDown={(e) => onTileDown(e, i)}
                    onClick={() => {
                      if (drag.current?.on || modeRef.current !== "idle") return;
                      focusPortal.current = true;
                      open({ name: f.name, size: f.size, kind: f.kind, demo: i });
                    }}
                    aria-label={`${f.name}, ${f.size}`}
                    aria-pressed={isPicked}
                    className={`warp-tile relative z-20 flex w-full min-w-0 items-center gap-2 rounded-lg border px-2 py-1.5 text-left font-mono text-[10.5px] leading-tight text-ink sm:px-2.5 sm:py-2 sm:text-[12px] ${
                      isPicked ? "border-accent/70 bg-accent/10" : "border-ink/10 bg-[#141722]/90"
                    } ${hidden === i ? "pointer-events-none" : ""}`}
                    style={{ touchAction: "manipulation" }}
                  >
                    <Icon size={16} aria-hidden="true" className="shrink-0 text-accent" />
                    <span className="min-w-0 truncate">{f.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Fallback portals (no WebGL): plain CSS holes */}
          {gl === "off" && g && mode === "choosing" &&
            g.portals.map((p) => (
              <span
                key={p.id}
                aria-hidden="true"
                className="warp-fallback pointer-events-none absolute"
                style={{ left: p.x - g.screen.x, top: p.y - g.screen.y, width: g.R * 3.2, height: g.R * 3.2 }}
              />
            ))}
        </div>

        {/* The devices that receive */}
        <ul aria-label={WARP.devicesLabel[locale]} className="grid grid-cols-3 gap-2.5 lg:grid-cols-1 lg:grid-rows-3 lg:gap-3">
          {DEVICES.map((d) => {
            const Icon = DEVICE_ICONS[d.id];
            const got = received[d.id];
            return (
              <li key={d.id} className="warp-device flex min-w-0 flex-col rounded-[14px] border border-line bg-surface/80 p-2 sm:p-2.5">
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-muted sm:text-[11px]">
                  <Icon size={13} aria-hidden="true" />
                  <span className="truncate">{d.name[locale]}</span>
                </div>
                <div
                  ref={(el) => {
                    deviceRefs.current[d.id] = el;
                  }}
                  className={`warp-device-screen relative mt-1.5 flex-1 overflow-hidden rounded-[10px] bg-[#04071A] ${d.id === "tele" ? "min-h-[4.5rem]" : "min-h-[5.5rem]"} lg:min-h-0`}
                  aria-live="polite"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {got ? (
                      <motion.div
                        key={got.name}
                        initial={{ opacity: 0, transform: reduce ? "none" : "scale(0.96)" }}
                        animate={{ opacity: 1, transform: "scale(1)" }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.32, ease: EASE_OUT }}
                        className="absolute inset-0 flex flex-col justify-end p-2"
                      >
                        {got.url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={got.url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
                        )}
                        <p className="relative font-mono text-[9.5px] uppercase tracking-[0.12em] text-accent">
                          {d.id === "tele" ? WARP.playing[locale] : WARP.tray[locale]}
                        </p>
                        <p className="relative mt-0.5 truncate font-mono text-[10.5px] text-ink sm:text-[11.5px]">{got.name}</p>
                        <p className="relative font-mono text-[9.5px] text-muted">{got.size}</p>
                        {d.id === "tele" && (
                          <span aria-hidden="true" className="relative mt-1.5 block h-[3px] overflow-hidden rounded-full bg-ink/15">
                            <span className={`block h-full w-full origin-left rounded-full bg-accent ${reduce ? "scale-x-[0.3]" : "warp-stream"}`} />
                          </span>
                        )}
                      </motion.div>
                    ) : (
                      <motion.p key="empty" exit={{ opacity: 0 }} className="absolute inset-0 grid place-items-center font-mono text-[10px] text-muted/70">
                        {WARP.trayEmpty[locale]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </li>
            );
          })}
        </ul>

        {/* The shader canvas covers everything (screen, portals, white holes); it never takes the pointer */}
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 h-full w-full" />

        {/* Portal targets: real buttons over the holes (tap, click or keyboard) */}
        {g && mode === "choosing" && (
          <div role="group" aria-label={WARP.portalsLabel[locale]}>
            {g.portals.map((p, i) => {
              const dev = DEVICES.find((d) => d.id === p.id)!;
              const ok = accepts(p.id, picked);
              return (
                <button
                  key={p.id}
                  ref={(el) => {
                    portalBtnRefs.current[p.id] = el;
                  }}
                  type="button"
                  onClick={(e) => onPortal(e, p.id)}
                  onFocus={() => setHover(p.id)}
                  onBlur={() => setHover(null)}
                  onPointerEnter={(e) => e.pointerType !== "touch" && !drag.current?.on && setHover(p.id)}
                  onPointerLeave={(e) => e.pointerType !== "touch" && !drag.current?.on && setHover(null)}
                  aria-label={`${i + 1}. ${dev.title[locale]}${ok ? "" : ` (${WARP.onlyVideo[locale]})`}`}
                  aria-disabled={!ok}
                  className="warp-portal-btn absolute z-20 rounded-full"
                  style={{ left: p.x, top: p.y, width: Math.max(44, g.R * 3), height: Math.max(44, g.R * 3) }}
                />
              );
            })}
          </div>
        )}

        {/* HUD plate next to the portal under the pointer */}
        <AnimatePresence>
          {plate && (
            <motion.div
              key={plateFor}
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: EASE_OUT }}
              className="warp-plate pointer-events-none absolute z-30"
              style={plate.style}
            >
              <p className="font-mono text-[9.5px] font-medium tracking-[0.22em] text-accent">{plate.kicker}</p>
              <p className="mt-1 text-[14px] font-medium leading-tight text-ink">{plate.title}</p>
              <p className="mt-1 font-mono text-[10px] text-muted">{plate.detail}</p>
              {picked?.name && <p className="mt-1 max-w-[13rem] truncate font-mono text-[10.5px] text-ink/90">{picked.name}</p>}
              <p className={`mt-2 inline-flex rounded-full px-2.5 py-1 font-mono text-[10px] font-medium ${plate.ok ? "bg-accent text-on-accent" : "border border-ink/20 text-ink/80"}`}>
                {plate.pill}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls and hints */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <p className="min-w-0 max-w-[60ch] text-[13px] leading-snug text-muted">
          {touchHint ? WARP.demoHintTouch[locale] : WARP.demoHint[locale]}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-pressed={both}
            onClick={() => setBoth((b) => !b)}
            className={`press-scale inline-flex h-10 items-center rounded-full border px-4 font-mono text-[12px] transition-colors duration-150 ${
              both ? "border-accent bg-accent/15 text-ink" : "border-line text-muted"
            }`}
          >
            {WARP.both[locale]}
          </button>
          {mode === "choosing" && (
            <button
              type="button"
              onClick={cancel}
              className="press-scale inline-flex h-10 items-center gap-1.5 rounded-full border border-line px-4 text-[13px] text-muted"
            >
              <X size={13} aria-hidden="true" />
              {WARP.cancel[locale]}
            </button>
          )}
        </div>
      </div>
      {fine && <p className="mt-2 max-w-[62ch] text-[12.5px] leading-snug text-muted/80">{WARP.realFile[locale]}</p>}
      <p className="sr-only" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
