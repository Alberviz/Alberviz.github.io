"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { CalendarBlank, Folders, Microphone, Television, Trash, X, DeviceMobile, Copy } from "@phosphor-icons/react";
import type { Locale } from "@/lib/i18n-context";
import {
  DEMO_COMMANDS,
  DEMO_DUPES,
  DEMO_FILES,
  DEMO_PANELS,
  DEMO_REPLIES,
  DEMO_TOASTS,
  DEMO_UI,
} from "@/content/laura";
import type { CommandId, DemoCommand } from "@/content/laura";
import { useReducedMotionSafe } from "@/lib/motion";
import { WarpEngine } from "../olimpo/warp-engine";
import { BOX, EASE, PILL, STAGE, T, TRASH } from "./holo-geo";
import { HoloFrame } from "./HoloFrame";
import type { Anchors, Exit } from "./HoloFrame";
import { HoloAgenda, HoloConfirm, HoloList, HoloTv, HoloViewer, fileIcon, viewerLabel } from "./panels";
import { LauraPill } from "./LauraPill";
import type { PillState } from "./LauraPill";
import { Thread } from "./Thread";

/**
 * The star piece: Laura's holograms, recreated. Pick a phrase and she "hears" it,
 * a beam leaves her pill and the panels fly out behind it with the real timings.
 * The delete flow asks first (a countdown that shakes at the end), disintegrates
 * the panel into the trash and offers Undo. "Send that one to my phone" lifts the
 * viewer into the real Warp portal shader. Everything shown is invented.
 *
 * Wide: one fixed 1120x640 stage scaled to the container (panels placed like the
 * real placer would). Narrow: its own layout, with the panels stacked above the
 * pill and the phrases in a scrolling strip.
 */

type Kind = "list" | "viewer" | "agenda" | "dupes" | "confirm" | "tv";

interface Item {
  key: string;
  kind: Kind;
  n?: number;
  slot?: number;
  delay: number;
  from: "pill" | "trash";
  exit: Exit | null;
  exitDelay: number;
}

interface PillView {
  state: PillState;
  text: string;
  caret: boolean;
}

const q = (s: string, locale: Locale) => (locale === "es" ? `«${s}»` : `“${s}”`);

function useMedia(query: string): boolean | null {
  const [v, setV] = useState<boolean | null>(null);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setV(m.matches);
    on();
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, [query]);
  return v;
}

export function HoloDemo({ locale }: { locale: Locale }) {
  const reduce = useReducedMotionSafe();
  const wideQuery = useMedia("(min-width: 1024px)");
  const wide = wideQuery === true;

  const stageRef = useRef<HTMLDivElement>(null);
  const logicalRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const trashRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<WarpEngine | null>(null);
  const blankRef = useRef<HTMLCanvasElement | null>(null);
  const runRef = useRef(0);
  const seqRef = useRef(0);
  const timers = useRef<number[]>([]);
  const intervals = useRef<number[]>([]);
  const itemsRef = useRef<Item[]>([]);

  const seen = useInView(stageRef, { once: true, margin: "300px" });
  const engaged = useInView(stageRef, { once: true, amount: 0.3 });
  const autoplayed = useRef(false);
  const onScreen = useInView(stageRef, { margin: "80px" });

  const [size, setSize] = useState<{ w: number; h: number }>({ w: STAGE.w, h: STAGE.h });
  const [items, setItemsState] = useState<Item[]>([]);
  const [pill, setPill] = useState<PillView>({ state: "idle", text: "", caret: false });
  const [trail, setTrail] = useState<string[]>([]);
  const [active, setActive] = useState<CommandId | null>(null);
  const [toast, setToast] = useState<null | "trashed" | "sent">(null);
  const [sentNs, setSentNs] = useState<number[]>([]);
  const [announce, setAnnounce] = useState("");
  const [gl, setGl] = useState<"pending" | "on" | "off">("pending");
  const [hole, setHole] = useState(false);
  const [binPulse, setBinPulse] = useState(0);
  const [tick, setTick] = useState(0);

  const scale = wide ? size.w / STAGE.w : 1;

  const setItems = useCallback((fn: (prev: Item[]) => Item[]) => {
    setItemsState((prev) => {
      const next = fn(prev);
      itemsRef.current = next;
      return next;
    });
  }, []);

  /* ----- measuring ----- */

  useLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
      setTick((x) => x + 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [wide]);

  /** Portal centre in stage-visual px. */
  const portalGeo = useCallback(() => {
    const W = size.w;
    const R = wide ? Math.max(18, Math.min(44, W * 0.036)) : 20;
    const x = wide ? (BOX.viewer[0].x + BOX.viewer[0].w / 2) * scale : W / 2;
    return { x, y: R * 1.55 + 6, R };
  }, [size.w, wide, scale]);

  const getAnchors = useCallback((): Anchors => {
    const c = (el: Element | null, fy = 0.5) => {
      const r = el?.getBoundingClientRect();
      return r ? { x: r.left + r.width / 2, y: r.top + r.height * fy } : { x: 0, y: 0 };
    };
    return {
      pill: c(pillRef.current, 0.08),
      pillCentre: c(pillRef.current, 0.5),
      trash: c(trashRef.current),
      portal: c(portalRef.current),
    };
  }, []);

  /* ----- the Warp portal: the real shader, as an overlay ----- */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduce === null || !seen) return;
    const still = !!reduce || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const engine = WarpEngine.create(canvas, still);
    if (engine) engine.setBare(true);
    engineRef.current = engine;
    setGl(engine ? "on" : "off");
    return () => {
      engine?.dispose();
      engineRef.current = null;
    };
  }, [reduce, seen]);

  useLayoutEffect(() => {
    const engine = engineRef.current;
    if (!engine || gl !== "on" || size.w < 10) return;
    const g = portalGeo();
    if (!blankRef.current) {
      blankRef.current = document.createElement("canvas");
      blankRef.current.width = 2;
      blankRef.current.height = 2;
    }
    engine.setLayout({
      width: size.w,
      height: size.h,
      screen: { x: 0, y: -60, w: size.w, h: size.h + 60 },
      portals: [{ id: "movil", x: g.x, y: g.y }],
      R: g.R,
      devices: {},
    });
    engine.setDesktop(blankRef.current);
  }, [gl, size, portalGeo, wide]);

  /* ----- run control ----- */

  const later = useCallback((fn: () => void, ms: number) => {
    const id = runRef.current;
    timers.current.push(
      window.setTimeout(() => {
        if (runRef.current === id) fn();
      }, ms)
    );
  }, []);

  const startRun = useCallback(() => {
    runRef.current += 1;
    timers.current.forEach((t) => window.clearTimeout(t));
    intervals.current.forEach((t) => window.clearInterval(t));
    timers.current = [];
    intervals.current = [];
    return runRef.current;
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      intervals.current.forEach((t) => window.clearInterval(t));
    },
    []
  );

  const typeInto = useCallback(
    (text: string, onDone: () => void) => {
      if (reduce) {
        setPill({ state: "listening", text, caret: false });
        later(onDone, 120);
        return;
      }
      const run = runRef.current;
      let i = 0;
      const per = Math.max(2, Math.ceil(text.length / 26));
      const id = window.setInterval(() => {
        if (runRef.current !== run) {
          window.clearInterval(id);
          return;
        }
        i = Math.min(text.length, i + per);
        setPill({ state: "listening", text: text.slice(0, i), caret: true });
        if (i >= text.length) {
          window.clearInterval(id);
          later(onDone, 260);
        }
      }, 28);
      intervals.current.push(id);
    },
    [reduce, later]
  );

  /* ----- scene ----- */

  const removeItem = useCallback(
    (key: string) => setItems((prev) => prev.filter((i) => i.key !== key)),
    [setItems]
  );

  const makeItem = useCallback(
    (kind: Kind, delay: number, extra?: Partial<Item>): Item => {
      seqRef.current += 1;
      return { key: `${kind}-${seqRef.current}`, kind, delay, from: "pill", exit: null, exitDelay: 0, ...extra };
    },
    []
  );

  /** Everything on screen goes back to the pill, in a quick cascade. Returns how long it takes. */
  const clearScene = useCallback(
    (keep?: (i: Item) => boolean) => {
      let n = 0;
      setItems((prev) =>
        prev.map((i) => {
          if (i.exit || keep?.(i)) return i;
          const it = { ...i, exit: "out" as Exit, exitDelay: n * T.stepExit };
          n += 1;
          return it;
        })
      );
      return n;
    },
    [setItems]
  );

  const speak = useCallback(
    (sentences: string[], after?: () => void) => {
      const gap = reduce ? 0 : 520;
      sentences.forEach((_, i) => {
        later(() => setPill({ state: "speaking", text: sentences.slice(0, i + 1).join(" "), caret: false }), i * gap + (reduce ? 0 : 40));
      });
      later(() => {
        setPill((p) => ({ ...p, state: "idle" }));
        after?.();
      }, sentences.length * gap + (reduce ? 200 : 900));
    },
    [reduce, later]
  );

  const viewersOf = (list: Item[]) => list.filter((i) => i.kind === "viewer" && !i.exit);

  const openViewer = useCallback(
    (n: number, delay = 0) => {
      setItems((prev) => {
        if (!prev.some((i) => i.kind === "list" && !i.exit)) return prev;
        const open = viewersOf(prev);
        const existing = open.find((v) => v.n === n);
        if (existing) {
          return prev.map((i) => (i === existing ? { ...i, exit: "out" as Exit, exitDelay: 0 } : i));
        }
        let next = prev;
        if (open.length >= 2) {
          const oldest = open[0];
          next = prev.map((i) => (i === oldest ? { ...i, exit: "out" as Exit, exitDelay: 0 } : i));
        }
        const used = new Set(viewersOf(next).map((v) => v.slot));
        const slot = used.has(0) ? 1 : 0;
        return [...next, makeItem("viewer", delay, { n, slot })];
      });
    },
    [setItems, makeItem]
  );

  const sendToPhone = useCallback(
    (viewerKey: string, n: number | undefined) => {
      const engine = engineRef.current;
      setItems((prev) => prev.map((i) => (i.key === viewerKey ? { ...i, exit: "send" as Exit, exitDelay: 0 } : i)));
      if (engine) engine.open(true, ["movil"]);
      else setHole(true);
      later(() => engine?.swallow("movil"), reduce ? 0 : 300);
      later(() => {
        if (n != null) setSentNs((s) => (s.includes(n) ? s : [...s, n]));
        setToast("sent");
        setTrail((t) => t);
        engine?.open(false);
        setHole(false);
      }, reduce ? 260 : 900);
      later(() => setToast((t) => (t === "sent" ? null : t)), reduce ? 4000 : 5600);
    },
    [setItems, later, reduce]
  );

  const runCommand = useCallback(
    (cmd: DemoCommand) => {
      startRun();
      setActive(cmd.id);
      setToast(null);
      setTrail([]);
      setPill({ state: "listening", text: "", caret: true });
      setAnnounce(`${cmd.say[locale]}. ${cmd.reply.map((r) => r[locale]).join(" ")}`);
      const thinkMs = reduce ? 100 : 420;

      typeInto(cmd.say[locale], () => {
        setPill({ state: "thinking", text: cmd.say[locale], caret: false });
        setTrail(cmd.tools);
        later(() => {
          const hasListAndViewer =
            itemsRef.current.some((i) => i.kind === "list" && !i.exit) && viewersOf(itemsRef.current).length > 0;
          if (cmd.id === "phone" && hasListAndViewer) {
            const v = viewersOf(itemsRef.current).slice(-1)[0];
            speak(cmd.reply.map((r) => r[locale]));
            sendToPhone(v.key, v.n);
            return;
          }
          clearScene();
          const base = reduce ? 0 : 200;
          const born: Item[] = [];
          if (cmd.id === "downloads" || cmd.id === "phone") {
            born.push(makeItem("list", base), makeItem("viewer", base + T.stepPanel, { n: 2, slot: 0 }));
          } else if (cmd.id === "week") {
            born.push(makeItem("agenda", base));
          } else if (cmd.id === "duplicates") {
            born.push(makeItem("dupes", base), makeItem("confirm", base + T.stepPanel));
          } else {
            born.push(makeItem("tv", base));
          }
          setItems((prev) => [...prev, ...born]);
          if (cmd.id === "downloads") setSentNs([]);
          if (cmd.id === "phone") {
            /* "That one" is the photo that was just on screen: it lands, then she sends it. */
            const v = born[1];
            const land = base + T.stepPanel + 60 + T.vuelo + 205 + 380;
            later(() => {
              speak(cmd.reply.map((r) => r[locale]));
              sendToPhone(v.key, v.n);
            }, reduce ? 400 : land);
          } else {
            speak(cmd.reply.map((r) => r[locale]));
          }
        }, thinkMs);
      });
    },
    [startRun, typeInto, later, speak, clearScene, makeItem, setItems, sendToPhone, locale, reduce]
  );

  /* The first time the stage is in view it plays the first phrase, so it never looks empty. */
  useEffect(() => {
    if (!engaged || autoplayed.current || reduce === null || runRef.current > 0) return;
    autoplayed.current = true;
    runCommand(DEMO_COMMANDS[0]);
  }, [engaged, reduce, runCommand]);

  /* ----- the delete flow ----- */

  const finishPlan = useCallback(
    (kind: "trash" | "cancel" | "expire") => {
      startRun();
      const confirmIt = itemsRef.current.find((i) => i.kind === "confirm" && !i.exit);
      const dupes = itemsRef.current.find((i) => i.kind === "dupes" && !i.exit);
      if (!confirmIt) return;
      if (kind === "trash") {
        setItems((prev) =>
          prev.map((i) =>
            i === confirmIt ? { ...i, exit: "trash" as Exit, exitDelay: 0 } : i === dupes ? { ...i, exit: "trash" as Exit, exitDelay: T.stepPanel } : i
          )
        );
        const fall = reduce ? 200 : 90 + T.lento + 140;
        later(() => {
          setToast("trashed");
          setBinPulse((x) => x + 1);
          setPill({ state: "speaking", text: DEMO_REPLIES.trashed[locale], caret: false });
          setAnnounce(DEMO_REPLIES.trashed[locale]);
        }, fall);
        later(() => setPill((p) => ({ ...p, state: "idle" })), fall + 2200);
      } else {
        setItems((prev) => prev.map((i) => (i === confirmIt ? { ...i, exit: "out" as Exit, exitDelay: 0 } : i)));
        const text = (kind === "cancel" ? DEMO_REPLIES.cancelled : DEMO_REPLIES.expired)[locale];
        setPill({ state: "speaking", text, caret: false });
        setAnnounce(text);
        later(() => setPill((p) => ({ ...p, state: "idle" })), 2000);
      }
    },
    [startRun, setItems, later, reduce, locale]
  );

  const undo = useCallback(() => {
    startRun();
    setToast(null);
    setItems((prev) => [
      ...prev.filter((i) => i.kind !== "dupes" && i.kind !== "confirm"),
      makeItem("dupes", 0, { from: "trash" }),
      makeItem("confirm", T.stepPanel, { from: "trash" }),
    ]);
    setPill({ state: "speaking", text: DEMO_REPLIES.undone[locale], caret: false });
    setAnnounce(DEMO_REPLIES.undone[locale]);
    later(() => setPill((p) => ({ ...p, state: "idle" })), 1800);
  }, [startRun, setItems, makeItem, later, locale]);

  const clearAll = useCallback(() => {
    startRun();
    setActive(null);
    setToast(null);
    setTrail([]);
    setSentNs([]);
    setPill({ state: "idle", text: "", caret: false });
    clearScene();
    engineRef.current?.open(false);
    setHole(false);
  }, [startRun, clearScene]);

  /* Keyboard: a digit opens that file when a list is on screen. */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^[1-8]$/.test(e.key)) {
      const list = itemsRef.current.find((i) => i.kind === "list" && !i.exit);
      if (list) {
        e.preventDefault();
        openViewer(Number(e.key));
      }
    }
  };

  /* ----- rendering of panels ----- */

  const activeNs = viewersOf(items).map((v) => v.n!) ;
  const hasList = items.some((i) => i.kind === "list" && !i.exit);
  const compact = !wide;

  const renderItem = (it: Item, index: number) => {
    const common = {
      id: it.key,
      wide,
      scale,
      delay: it.delay,
      from: it.from,
      exit: it.exit,
      exitDelay: it.exitDelay,
      reduce,
      getAnchors,
      onExited: removeItem,
      z: 10 + index,
    } as const;
    const locFiles = DEMO_FILES.length;
    switch (it.kind) {
      case "list":
        return (
          <HoloFrame
            key={it.key}
            {...common}
            box={BOX.list}
            flowHeight={376}
            title={DEMO_PANELS.downloads[locale]}
            meta={`${locFiles} ${DEMO_PANELS.filesCount[locale]}`}
            icon={<Folders size={17} weight="duotone" />}
          >
            {(arrive) => (
              <HoloList
                files={DEMO_FILES}
                locale={locale}
                arriveMs={arrive}
                compact={compact}
                activeNs={activeNs}
                sentNs={sentNs}
                onOpen={(n) => openViewer(n)}
                footer={DEMO_PANELS.openHint[locale]}
              />
            )}
          </HoloFrame>
        );
      case "viewer": {
        const file = DEMO_FILES.find((f) => f.n === it.n)!;
        const box = BOX.viewer[it.slot ?? 0];
        return (
          <HoloFrame
            key={it.key}
            {...common}
            box={box}
            flowHeight={file.kind === "zip" ? 220 : 264}
            title={file.name[locale]}
            meta={viewerLabel(file.kind, locale)}
            icon={fileIcon(file.kind, 17)}
            onClose={() => openViewer(file.n)}
            closeLabel={`${DEMO_PANELS.close[locale]}: ${file.name[locale]}`}
          >
            {(arrive) => <HoloViewer file={file} locale={locale} arriveMs={arrive} />}
          </HoloFrame>
        );
      }
      case "agenda":
        return (
          <HoloFrame
            key={it.key}
            {...common}
            box={BOX.agenda}
            title={DEMO_PANELS.agenda[locale]}
            meta="13"
            icon={<CalendarBlank size={17} weight="duotone" />}
          >
            {(arrive) => <HoloAgenda locale={locale} arriveMs={arrive} compact={compact} />}
          </HoloFrame>
        );
      case "dupes":
        return (
          <HoloFrame
            key={it.key}
            {...common}
            box={BOX.dupes}
            flowHeight={208}
            title={DEMO_PANELS.duplicates[locale]}
            meta={`${DEMO_DUPES.length} ${DEMO_PANELS.copies[locale]}`}
            icon={<Copy size={17} weight="duotone" />}
          >
            {(arrive) => <HoloList files={DEMO_DUPES} locale={locale} arriveMs={arrive} compact={compact} variant="dupes" />}
          </HoloFrame>
        );
      case "confirm":
        return (
          <HoloFrame
            key={it.key}
            {...common}
            box={BOX.confirm}
            flowHeight={356}
            title={DEMO_PANELS.confirmTitle[locale]}
            icon={<Trash size={17} weight="duotone" />}
          >
            {(arrive) => (
              <HoloConfirm
                files={DEMO_DUPES}
                locale={locale}
                arriveMs={arrive}
                reduce={reduce}
                paused={!!it.exit}
                onConfirm={() => finishPlan("trash")}
                onCancel={() => finishPlan("cancel")}
                onExpire={() => finishPlan("expire")}
              />
            )}
          </HoloFrame>
        );
      case "tv":
        return (
          <HoloFrame
            key={it.key}
            {...common}
            box={BOX.tv}
            flowHeight={332}
            title={DEMO_PANELS.tv[locale]}
            icon={<Television size={17} weight="duotone" />}
          >
            {() => <HoloTv locale={locale} reduce={reduce} />}
          </HoloFrame>
        );
    }
  };

  const panels = items.map(renderItem);

  const threads = viewersOf(items).map((v) => ({ key: v.key, n: v.n!, delay: v.delay }));
  const exitingThreads = items.filter((i) => i.kind === "viewer" && i.exit).map((v) => ({ key: v.key, n: v.n!, delay: v.delay }));

  const pillEl = (
    <LauraPill ref={pillRef} state={pill.state} text={pill.text} caret={pill.caret} locale={locale} reduce={reduce} running={onScreen} className="w-full" />
  );

  const trailEl = (
    <ul className="flex min-h-[22px] flex-wrap items-center justify-center gap-1.5" aria-label="tools">
      {trail.map((tname, i) => (
        <li
          key={`${active}-${tname}`}
          className="holo-row rounded-full border border-accent/25 bg-accent/[0.06] px-2 py-0.5 font-mono text-[10.5px] text-accent"
          style={{ ["--d" as string]: `${i * 80}ms`, ["--arrive" as string]: "0ms" }}
        >
          {tname}
        </li>
      ))}
    </ul>
  );

  const toastEl = toast && (
    <div
      key={toast}
      className="holo-toast inline-flex items-center gap-3 rounded-full border border-accent/30 bg-[#0c0b0a]/95 py-1.5 pl-4 pr-1.5 text-[12.5px] text-ink"
    >
      {toast === "sent" && <DeviceMobile size={15} weight="duotone" className="text-accent" aria-hidden="true" />}
      {toast === "trashed" && <Trash size={15} weight="duotone" className="text-accent" aria-hidden="true" />}
      <span>{toast === "trashed" ? DEMO_TOASTS.trashed[locale] : DEMO_TOASTS.sent[locale]}</span>
      {toast === "trashed" ? (
        <button type="button" onClick={undo} className="holo-btn-primary press-scale h-8 rounded-full bg-accent px-3.5 text-[12.5px] font-semibold text-on-accent">
          {DEMO_TOASTS.undo[locale]}
        </button>
      ) : (
        <span className="w-1.5" />
      )}
    </div>
  );

  const trashEl = (
    <div
      ref={trashRef}
      className="grid place-items-center rounded-2xl border border-white/[0.07] bg-white/[0.02] text-muted"
      style={wide ? { position: "absolute", left: TRASH.x, top: TRASH.y, width: TRASH.s, height: TRASH.s } : { width: 48, height: 48 }}
      title={DEMO_UI.trashLabel[locale]}
    >
      <span key={binPulse} className={binPulse ? "holo-bin-hit" : ""}>
        <Trash size={wide ? 22 : 20} weight="duotone" aria-hidden="true" />
      </span>
      <span className="sr-only">{DEMO_UI.trashLabel[locale]}</span>
    </div>
  );

  const bar = (
    <div className="pointer-events-none flex h-[26px] items-center justify-between px-4 font-mono text-[10.5px] text-muted/80" aria-hidden="true">
      <span className="flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-accent" />
        <span className="size-1.5 rounded-full bg-white/20" />
        <span className="size-1.5 rounded-full bg-white/20" />
      </span>
      <span className="tabular-nums">10:42</span>
      <span>{locale === "es" ? "Esp 1" : "WS 1"}</span>
    </div>
  );

  const holeFallback = hole && gl !== "on" && (
    <span aria-hidden="true" className="warp-fallback pointer-events-none absolute z-30" style={{ left: portalGeo().x, top: portalGeo().y }} />
  );

  const canvas = (
    <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-30 h-full w-full" />
  );

  const portalAnchor = (
    <span ref={portalRef} aria-hidden="true" className="pointer-events-none absolute size-px" style={{ left: portalGeo().x, top: portalGeo().y }} />
  );

  const threadsEl = (
    <>
      {[...threads, ...exitingThreads.map((t) => ({ ...t, out: true }))].map((t) => (
        <Thread
          key={t.key}
          container={wide ? logicalRef : flowRef}
          n={t.n}
          viewerKey={t.key}
          wide={wide}
          tick={tick}
          reduce={reduce}
          delay={t.delay + T.vuelo + 60}
          retract={"out" in t}
        />
      ))}
    </>
  );

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <p className="font-mono text-[11.5px] text-muted">{DEMO_UI.pick[locale]}</p>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="press-scale -mr-1 inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[12.5px] text-muted transition-colors duration-150 hover:text-ink"
          >
            <X size={12} weight="bold" aria-hidden="true" />
            {DEMO_UI.reset[locale]}
          </button>
        )}
      </div>

      {/* Phrases: a scrolling strip on phones */}
      <div className="holo-chips -mx-5 mb-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
        {DEMO_COMMANDS.map((c) => {
          const on = active === c.id;
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => runCommand(c)}
              className={`holo-chip press-scale inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-[13.5px] transition-colors duration-150 ${
                on ? "border-accent bg-accent/10 text-ink" : "border-line bg-surface/60 text-ink/90"
              }`}
            >
              <Microphone size={14} weight={on ? "fill" : "regular"} className={on ? "text-accent" : "text-muted"} aria-hidden="true" />
              {q(c.say[locale], locale)}
            </button>
          );
        })}
      </div>

      <div
        ref={stageRef}
        role="group"
        aria-label={DEMO_UI.stageLabel[locale]}
        onKeyDown={onKeyDown}
        className={`holo-stage relative isolate w-full overflow-hidden rounded-[20px] border border-white/[0.09] ${wide ? "" : "flex min-h-[820px] flex-col p-3 sm:p-4"}`}
        style={wide ? { aspectRatio: `${STAGE.w} / ${STAGE.h}` } : undefined}
      >
        
        {wide ? (
          <div
            ref={logicalRef}
            className="absolute left-0 top-0 origin-top-left"
            style={{ width: STAGE.w, height: STAGE.h, transform: `scale(${scale || 1})` }}
          >
            {bar}
            {threadsEl}
            {panels}
            {trashEl}
            <div className="absolute z-20" style={{ left: PILL.x, top: PILL.y, width: PILL.w }}>
              {pillEl}
            </div>
            <div className="absolute z-20 flex w-[480px] justify-center" style={{ left: PILL.x, top: PILL.y + PILL.h + 10 }}>
              {trailEl}
            </div>
            <div className="absolute z-20" style={{ left: 40, top: PILL.y + 4 }}>
              {toastEl}
            </div>
          </div>
        ) : (
          <>
            <div className="h-[58px] shrink-0" aria-hidden="true" />
            <div ref={flowRef} className="relative mx-auto flex w-full max-w-[640px] flex-col gap-3">
              {threadsEl}
              {panels}
            </div>
            <div className="mx-auto mt-auto w-full max-w-[640px] pt-8">
              <div className="mb-3 flex min-h-[40px] justify-center">{toastEl}</div>
              <div className="flex items-center gap-2.5">
                <div className="min-w-0 flex-1">{pillEl}</div>
                {trashEl}
              </div>
              <div className="mt-2">{trailEl}</div>
            </div>
          </>
        )}
        {portalAnchor}
        {holeFallback}
        {canvas}
      </div>

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
      <div className="mt-4 flex flex-col gap-1 font-mono text-[11px] leading-relaxed text-muted sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <span className="max-w-[78ch]">{DEMO_UI.caption[locale]}</span>
        {hasList && <span className="shrink-0 text-muted/90">{DEMO_UI.hintRows[locale]}</span>}
      </div>
    </div>
  );
}
