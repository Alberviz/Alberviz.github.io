"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLocale } from "@/lib/i18n-context";
import { HARDWARE_STORY } from "@/content/desktop";
import { EASE_OUT, revealProps } from "@/lib/motion";

/**
 * The reverse-engineering story in four steps: sniff, decode, driver, desktop.
 * Wide screens: the visual is pinned on the left and swaps with the step that
 * crosses the middle of the viewport (IntersectionObserver), while a rail fills
 * with the scroll. Narrow screens: each step carries its own visual inline, no
 * pinning. Every visual animates only while active and is still under reduced
 * motion. Bytes are the documented protocol bytes, nothing that identifies a
 * device.
 */

type L = "en" | "es";
const S = HARDWARE_STORY;
const hex = (n: number) => n.toString(16).padStart(2, "0");

/* ---------- 1. Capture ---------- */

const ROWS: { dir: "out" | "in"; data: string; rgb?: [number, number, number] }[] = [
  { dir: "out", data: "07 01 04 04 08 ff 00 00 e8", rgb: [5, 6, 7] },
  { dir: "out", data: "08 01 04 04 08 ff 00 00 e7", rgb: [5, 6, 7] },
  { dir: "out", data: "07 01 04 04 08 00 ff 00 e8", rgb: [5, 6, 7] },
  { dir: "out", data: "08 01 04 04 08 00 ff 00 e7", rgb: [5, 6, 7] },
  { dir: "out", data: "07 01 04 04 08 00 00 ff e8", rgb: [5, 6, 7] },
  { dir: "out", data: "08 01 04 04 08 00 00 ff e7", rgb: [5, 6, 7] },
  { dir: "out", data: "83 00 00 00 00 00 00 7c" },
  { dir: "in", data: "83 4b 00 00 00 00 00 00" },
];

function Capture({ active, locale, still }: { active: boolean; locale: L; still: boolean }) {
  return (
    <div className="hw-panel font-mono text-[11px] sm:text-[12px]">
      <p className="border-b border-line px-4 py-2.5 text-[11px] text-muted">{S.capture.head[locale]}</p>
      <ol className="px-2 py-2">
        {ROWS.map((r, i) => (
          <motion.li
            key={i}
            className="grid grid-cols-[1.6rem_4.6rem_minmax(0,1fr)] items-center gap-2 rounded-md px-2 py-1.5 sm:grid-cols-[2rem_5.6rem_minmax(0,1fr)]"
            initial={false}
            animate={{ opacity: active || still ? 1 : 0.25, transform: active && !still ? "translateY(0px)" : "translateY(0px)" }}
            transition={{ duration: 0.3, delay: active && !still ? i * 0.09 : 0, ease: EASE_OUT }}
          >
            <span className="tabular-nums text-muted/70">{i + 1}</span>
            <span className={r.dir === "out" ? "text-ink/70" : "text-accent"}>{r.dir === "out" ? "host → kb" : "kb → host"}</span>
            <span className="truncate tracking-[0.04em] text-ink/90">
              {r.data.split(" ").map((b, j) => (
                <span key={j} className={r.rgb?.includes(j) && b !== "00" ? "text-accent" : undefined}>
                  {b}
                  {j < 8 ? " " : ""}
                </span>
              ))}
              <span className="text-muted/50">…</span>
            </span>
          </motion.li>
        ))}
      </ol>
      <p className="border-t border-line px-4 py-2.5 text-[11px] text-muted">{S.capture.diff[locale]}</p>
    </div>
  );
}

/* ---------- 2. Decode ---------- */

const AKKO = [0x07, 0x01, 0x04, 0x04, 0x08, 0xf2, 0xb3, 0x6f];
const AKKO_SUM = 0xff - (AKKO.reduce((a, b) => a + b, 0) & 0xff);
const MCHOSE = [0x2b, 0x01, 0x06, 0x00, 0x64, 0x02, 0x03, 0x01, 0x00, 0xf2, 0xb3, 0x6f];

function Decode({ active, locale, still }: { active: boolean; locale: L; still: boolean }) {
  const [flip, setFlip] = useState(false);
  useEffect(() => {
    if (!active) return setFlip(false);
    if (still) return setFlip(true);
    const t = window.setTimeout(() => setFlip(true), 900);
    return () => window.clearTimeout(t);
  }, [active, still]);
  const bytes = [...AKKO, AKKO_SUM];
  const on = active || still;
  return (
    <div className="hw-panel space-y-5 p-4 font-mono sm:p-5">
      <div>
        <p className="text-[11px] text-muted">{S.bytes.akko[locale]}</p>
        <ol className="mt-3 grid grid-cols-9 gap-1">
          {bytes.map((b, i) => (
            <li key={i} className="min-w-0 text-center">
              <span
                className={`block rounded-md border py-1.5 text-[11px] sm:text-[13px] ${
                  i >= 5 && i <= 7 ? "border-accent/50 text-accent" : i === 8 ? "border-ink/25 text-ink" : "border-line text-ink/85"
                }`}
              >
                {hex(b)}
              </span>
              <motion.span
                className="mt-1.5 block truncate text-[8.5px] text-muted sm:text-[10px]"
                initial={false}
                animate={{ opacity: on ? 1 : 0, transform: on || still ? "translateY(0px)" : "translateY(-4px)" }}
                transition={{ duration: 0.28, delay: active && !still ? 0.15 + i * 0.07 : 0, ease: EASE_OUT }}
              >
                {S.bytes.labels[locale][i]}
              </motion.span>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-[10.5px] text-muted/80">{S.bytes.checksum[locale]}</p>
      </div>

      <div>
        <p className="text-[11px] text-muted">{S.bytes.mchose[locale]}</p>
        <ol className="mt-3 grid grid-cols-12 gap-1">
          {MCHOSE.map((b, i) => (
            <li key={i} className="relative h-7 min-w-0 overflow-hidden rounded-md border border-line text-center text-[10px] sm:text-[12px]">
              <motion.span
                className="absolute inset-0 grid place-items-center text-ink/45"
                initial={false}
                animate={{ opacity: flip ? 0 : 1, transform: flip && !still ? "translateY(-100%)" : "translateY(0%)" }}
                transition={{ duration: 0.32, delay: still ? 0 : i * 0.04, ease: EASE_OUT }}
              >
                {hex(b ^ 0xff)}
              </motion.span>
              <motion.span
                className={`absolute inset-0 grid place-items-center ${i >= 9 ? "text-accent" : "text-ink/90"}`}
                initial={false}
                animate={{ opacity: flip ? 1 : 0, transform: flip || still ? "translateY(0%)" : "translateY(100%)" }}
                transition={{ duration: 0.32, delay: still ? 0 : i * 0.04, ease: EASE_OUT }}
              >
                {hex(b)}
              </motion.span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <p className="text-[11px] text-muted">{S.bytes.headset[locale]}</p>
        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] sm:text-[13px]">
          <span className="text-ink/70">55 65 01 00</span>
          <span className="text-muted">→</span>
          <span className="text-ink/90">
            55 65 <span className="text-accent">52</span> <span className="text-accent">02</span>
          </span>
          <span className="text-muted">= {S.bytes.headsetRead[locale]}</span>
        </p>
      </div>
    </div>
  );
}

/* ---------- 3. Driver ---------- */

const CODE = [
  ["def ", "HIDIOCSFEATURE", "(size):"],
  ["    return ", "(3 << 30) | (size << 16) | (ord('H') << 8) | 0x06", ""],
  ["", "", ""],
  ["led ", "= bytearray(64)", ""],
  ["led[0:5] ", "= [0x07, 0x01, 0x04, 0x04, 0x08]", "  # keys, static"],
  ["led[5:8] ", "= r, g, b", ""],
  ["led[8] ", "= 0xFF - (sum(led[:8]) & 0xFF)", "  # checksum"],
  ["", "", ""],
  ["fd ", "= os.open(node, os.O_RDWR | os.O_NONBLOCK)", ""],
  ["fcntl.ioctl", "(fd, HIDIOCSFEATURE(65), b'\\x00' + led)", ""],
];

function Driver({ active, still }: { active: boolean; still: boolean }) {
  const on = active || still;
  return (
    <div className="hw-panel overflow-hidden font-mono text-[10.5px] leading-[1.7] sm:text-[12px]">
      <p className="border-b border-line px-4 py-2.5 text-[11px] text-muted">rgb/akko-rgb · Python</p>
      <pre className="no-scrollbar overflow-x-auto px-4 py-3">
        {CODE.map(([a, b, c], i) => (
          <motion.span
            key={i}
            className="block whitespace-pre"
            initial={false}
            animate={{ opacity: on ? 1 : 0.3 }}
            transition={{ duration: 0.25, delay: active && !still ? i * 0.06 : 0 }}
          >
            <span className="text-accent">{a}</span>
            <span className="text-ink/90">{b}</span>
            <span className="text-muted/70">{c}</span>
            {"​"}
          </motion.span>
        ))}
      </pre>
      <div className="border-t border-line bg-bg/60 px-4 py-3 text-[11px] sm:text-[12px]">
        <p>
          <span className="text-accent">$ </span>
          <span className="text-ink">akko-rgb &apos;#F2B36F&apos;</span>
        </p>
        <motion.p
          className="text-muted"
          initial={false}
          animate={{ opacity: on ? 1 : 0 }}
          transition={{ duration: 0.25, delay: active && !still ? 0.8 : 0 }}
        >
          [akko-rgb] backlight + side strip → RGB(242, 179, 111)
        </motion.p>
      </div>
    </div>
  );
}

/* ---------- 4. The setup ---------- */

function Rig({ active, locale, still }: { active: boolean; locale: L; still: boolean }) {
  const [flash, setFlash] = useState(0);
  const [docked, setDocked] = useState(false);
  const R = S.rig;
  const mouse = docked ? 65 : 64;
  return (
    <div className="hw-panel p-4 sm:p-5">
      <div className={`hw-rig relative ${docked ? "is-docked" : ""}`} data-flash={flash % 2 ? "a" : flash ? "b" : "0"} data-active={active ? "1" : "0"} data-still={still ? "1" : "0"}>
        <svg viewBox="0 0 600 300" role="img" aria-label={R.label[locale]} className="block h-auto w-full">
          {/* LED strip behind the desk */}
          <g className="hw-led hw-fast-slow">
            {Array.from({ length: 30 }, (_, i) => (
              <rect key={i} x={30 + i * 18.3} y={20} width={11} height={6} rx={3} fill="#F2B36F" opacity={0.75} />
            ))}
          </g>
          <text x={30} y={46} className="hw-svg-label">{R.strip[locale]}</text>

          {/* Tower with board ARGB */}
          <rect x={30} y={78} width={86} height={150} rx={10} fill="#0E1015" stroke="#1F232D" />
          <rect x={44} y={92} width={58} height={4} rx={2} className="hw-led" fill="#F2B36F" />
          <rect x={44} y={210} width={58} height={4} rx={2} className="hw-led" fill="#F2B36F" />
          <rect x={52} y={118} width={42} height={7} rx={2} fill="#151820" />
          <rect x={52} y={130} width={42} height={7} rx={2} fill="#151820" />
          <rect x={52} y={118} width={42} height={2} className="hw-led" fill="#F2B36F" />
          <rect x={52} y={130} width={42} height={2} className="hw-led" fill="#F2B36F" />
          <text x={30} y={246} className="hw-svg-label">{R.board[locale]}</text>

          {/* Keyboard */}
          <g transform="translate(150 150)">
            <rect width={250} height={92} rx={10} fill="#12141B" stroke="#1F232D" />
            {Array.from({ length: 5 }, (_, r) =>
              Array.from({ length: 14 }, (_, c) => (
                <rect key={`${r}-${c}`} x={10 + c * 16.5} y={9 + r * 14.5} width={13} height={11} rx={2.5} fill="#1A1D26" />
              ))
            )}
            <rect width={250} height={92} rx={10} className="hw-led hw-fast hw-keys" fill="#F2B36F" opacity={0.13} />
            {/* Side strip: fills with the battery while charging */}
            <rect x={14} y={96} width={222} height={5} rx={2.5} fill="#1A1D26" />
            <rect x={14} y={96} width={222} height={5} rx={2.5} className="hw-led hw-fast hw-strip" fill="#F2B36F" />
            <text x={0} y={122} className="hw-svg-label">{R.keyboard[locale]} · 47 %</text>
          </g>

          {/* Mouse on its base: the ring runs a wave while charging */}
          <g transform="translate(470 176)">
            <ellipse cx={0} cy={44} rx={50} ry={14} fill="#0E1015" stroke="#1F232D" />
            <g className="hw-ring-wrap">
              <ellipse cx={0} cy={44} rx={50} ry={14} fill="none" stroke="#F2B36F" strokeWidth={2.5} className="hw-led hw-fast hw-ring" strokeDasharray="18 10" />
            </g>
            <path d="M -18 36 C -20 4, -12 -12, 0 -12 C 12 -12, 20 4, 18 36 C 12 42, -12 42, -18 36 Z" fill="#151820" stroke="#2A2F3B" className="hw-mouse" />
            <text x={-50} y={80} className="hw-svg-label">
              {R.mouse[locale]} · {mouse} %{docked ? ` · ${R.charging[locale]}` : ""}
            </text>
          </g>

          {/* Headset */}
          <g transform="translate(470 70)">
            <path d="M -30 34 C -30 0, 30 0, 30 34" fill="none" stroke="#2A2F3B" strokeWidth={6} strokeLinecap="round" />
            <rect x={-38} y={28} width={16} height={28} rx={6} fill="#151820" stroke="#2A2F3B" />
            <rect x={22} y={28} width={16} height={28} rx={6} fill="#151820" stroke="#2A2F3B" />
            <text x={-50} y={74} className="hw-svg-label">{R.headset[locale]} · 82 %</text>
          </g>
        </svg>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setFlash((f) => f + 1)} className="press-scale inline-flex h-10 items-center rounded-full bg-accent px-4 text-[13px] font-semibold text-on-accent">
          {R.notify[locale]}
        </button>
        <button
          type="button"
          aria-pressed={docked}
          onClick={() => setDocked((d) => !d)}
          className={`press-scale inline-flex h-10 items-center rounded-full border px-4 text-[13px] transition-colors duration-150 ${docked ? "border-accent bg-accent/15 text-ink" : "border-line text-muted"}`}
        >
          {R.dock[locale]}
        </button>
      </div>
      <p className="mt-3 font-mono text-[11px] text-muted/80">{R.caption[locale]}</p>
    </div>
  );
}

function Visual({ i, active, locale, still }: { i: number; active: boolean; locale: L; still: boolean }) {
  if (i === 0) return <Capture active={active} locale={locale} still={still} />;
  if (i === 1) return <Decode active={active} locale={locale} still={still} />;
  if (i === 2) return <Driver active={active} still={still} />;
  return <Rig active={active} locale={locale} still={still} />;
}

export function HardwareStory() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const still = !!reduce;
  const [active, setActive] = useState(0);
  const [inline, setInline] = useState<boolean[]>([false, false, false, false]);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const inlineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const railRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: railRef, offset: ["start 55%", "end 55%"] });
  const fill = useTransform(scrollYProgress, (v) => `scaleY(${Math.min(1, Math.max(0, v))})`);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        setInline((prev) => {
          const next = [...prev];
          for (const e of entries) next[Number((e.target as HTMLElement).dataset.i)] = e.isIntersecting;
          return next;
        });
      },
      { threshold: 0.35 }
    );
    inlineRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="mt-24 lg:mt-36">
      <motion.div {...revealProps(reduce)} className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <h3 className="font-display text-balance text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-ink lg:col-span-6">
          {S.heading[locale]}
        </h3>
        <p className="max-w-[54ch] text-pretty text-[15.5px] leading-relaxed text-muted lg:col-span-6">{S.lead[locale]}</p>
      </motion.div>

      {/* Wide: pinned visual + steps with a rail */}
      <div className="mt-12 hidden grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-16 lg:grid">
        <div className="relative">
          <div className="sticky top-[calc(50vh-15rem)]">
            {S.steps.map((s, i) => (
              <motion.div
                key={s.id}
                className={i === active ? "relative" : "pointer-events-none absolute inset-x-0 top-0"}
                initial={false}
                animate={{ opacity: i === active ? 1 : 0, transform: i === active || still ? "translateY(0px)" : "translateY(12px)" }}
                transition={{ duration: 0.36, ease: EASE_OUT }}
                aria-hidden={i !== active}
              >
                <Visual i={i} active={i === active} locale={locale} still={still} />
              </motion.div>
            ))}
          </div>
        </div>
        <ol ref={railRef} className="relative pl-10">
          <span aria-hidden="true" className="absolute bottom-[10vh] left-[7px] top-[10vh] w-px bg-line" />
          <motion.span aria-hidden="true" className="absolute bottom-[10vh] left-[7px] top-[10vh] w-px origin-top bg-accent" style={still ? undefined : { transform: fill }} />
          {S.steps.map((s, i) => (
            <li
              key={s.id}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              data-i={i}
              className="relative flex min-h-[70vh] flex-col justify-center"
            >
              <span
                aria-hidden="true"
                className={`absolute -left-10 top-1/2 size-[15px] -translate-y-1/2 rounded-full border transition-colors duration-200 ${
                  i <= active ? "border-accent bg-accent" : "border-line bg-bg"
                }`}
              />
              <p className="font-mono text-[12px] tabular-nums text-muted">
                0{i + 1} · {s.label[locale]}
              </p>
              <p className="mt-3 font-display text-[clamp(1.7rem,2.6vw,2.4rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-ink">{s.title[locale]}</p>
              <p className="mt-4 max-w-[44ch] text-pretty text-[15.5px] leading-relaxed text-muted">{s.body[locale]}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Narrow: each step with its own visual, no pinning */}
      <ol className="mt-10 space-y-16 lg:hidden">
        {S.steps.map((s, i) => (
          <li key={s.id}>
            <p className="font-mono text-[12px] tabular-nums text-muted">
              0{i + 1} · {s.label[locale]}
            </p>
            <p className="mt-2 font-display text-[1.6rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">{s.title[locale]}</p>
            <p className="mt-3 text-pretty text-[15px] leading-relaxed text-muted">{s.body[locale]}</p>
            <div
              ref={(el) => {
                inlineRefs.current[i] = el;
              }}
              data-i={i}
              className="mt-6"
            >
              <Visual i={i} active={inline[i]} locale={locale} still={still} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
