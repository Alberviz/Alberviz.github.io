"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { Check, DeviceMobile, FilePdf, FileText, FileZip, ImageSquare, SpeakerHigh, Television } from "@phosphor-icons/react";
import type { Locale } from "@/lib/i18n-context";
import { DEMO_DAYS, DEMO_EVENTS, DEMO_PANELS, DEMO_TODAY, DEMO_TOASTS } from "@/content/laura";
import type { DemoFile, FileKind } from "@/content/laura";
import { rowStep } from "./holo-geo";

/** Bodies of the holographic panels (list, viewers, agenda, confirm, TV). Invented data only. */

type RowVars = React.CSSProperties & { "--d"?: string; "--arrive"?: string };

const rowVars = (i: number, arriveMs: number): RowVars => ({ "--d": `${rowStep(i)}ms`, "--arrive": `${arriveMs}ms` });

export const fileIcon = (kind: FileKind, size = 16) => {
  const p = { size, weight: "duotone" as const, "aria-hidden": true as const };
  if (kind === "pdf") return <FilePdf {...p} />;
  if (kind === "image") return <ImageSquare {...p} />;
  if (kind === "zip") return <FileZip {...p} />;
  return <FileText {...p} />;
};

const sizeOf = (f: DemoFile, locale: Locale) => (locale === "es" && f.sizeEs ? f.sizeEs : f.size);

/* ------------------------------------------------------------------ */
/* HoloList: numbered rows that arrive in a 26 ms cascade               */
/* ------------------------------------------------------------------ */

export function HoloList({
  files,
  locale,
  arriveMs,
  compact,
  activeNs = [],
  sentNs = [],
  onOpen,
  footer,
  gone,
  variant = "downloads",
}: {
  files: DemoFile[];
  locale: Locale;
  arriveMs: number;
  compact: boolean;
  activeNs?: number[];
  sentNs?: number[];
  onOpen?: (n: number) => void;
  footer?: string;
  gone?: boolean;
  variant?: "downloads" | "dupes";
}) {
  const rowH = compact ? 34 : 38;
  return (
    <div className="flex h-full flex-col" data-holo-list={variant}>
      <ul className="mt-1.5 flex-1 px-1.5" aria-label={variant === "dupes" ? DEMO_PANELS.duplicates[locale] : DEMO_PANELS.downloads[locale]}>
        {files.map((f, i) => {
          const active = activeNs.includes(f.n);
          const sent = sentNs.includes(f.n);
          const inner = (
            <>
              <span className="w-4 shrink-0 text-center font-mono text-[11px] font-semibold tabular-nums text-accent">{f.n}</span>
              <span className={`shrink-0 ${active ? "text-accent" : "text-ink/70"}`}>{fileIcon(f.kind)}</span>
              <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink/95">{f.name[locale]}</span>
              {sent ? (
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-accent/40 px-1.5 py-0.5 font-mono text-[10px] text-accent">
                  <DeviceMobile size={10} weight="bold" aria-hidden="true" />
                  <Check size={9} weight="bold" aria-hidden="true" />
                </span>
              ) : (
                <span className="hidden shrink-0 font-mono text-[10.5px] text-muted sm:inline">{f.meta[locale]}</span>
              )}
              <span className="w-[3.4rem] shrink-0 text-right font-mono text-[10.5px] tabular-nums text-muted">{sizeOf(f, locale)}</span>
            </>
          );
          return (
            <li
              key={f.n}
              className="holo-row"
              style={{ ...rowVars(i, arriveMs), height: rowH, opacity: gone ? 0 : undefined, transition: gone ? "opacity 420ms var(--ease-out)" : undefined }}
            >
              {onOpen ? (
                <button
                  type="button"
                  data-holo-row={f.n}
                  onClick={() => onOpen(f.n)}
                  aria-pressed={active}
                  aria-label={`${f.n}. ${f.name[locale]}`}
                  className={`holo-rowbtn flex h-full w-full items-center gap-2.5 rounded-lg px-2 text-left transition-colors duration-150 ${
                    active ? "bg-accent/[0.09] shadow-[inset_2px_0_0_var(--accent)]" : ""
                  }`}
                >
                  {inner}
                </button>
              ) : (
                <div data-holo-row={f.n} className="flex h-full w-full items-center gap-2.5 rounded-lg px-2">
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {footer && (
        <p className="shrink-0 border-t border-accent/10 px-3.5 py-2.5 font-mono text-[10.5px] text-muted">{footer}</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Viewers                                                             */
/* ------------------------------------------------------------------ */

function Photo({ locale }: { locale: Locale }) {
  const id = useId().replace(/:/g, "");
  return (
    <div className="relative h-full overflow-hidden rounded-lg">
      <svg viewBox="0 0 320 210" preserveAspectRatio="xMidYMid slice" className="h-full w-full" role="img" aria-label={locale === "es" ? "Foto de un castillo al atardecer, inventada" : "Invented photo of a castle at sunset"}>
        <defs>
          <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a1630" />
            <stop offset="0.55" stopColor="#6a3b4c" />
            <stop offset="0.85" stopColor="#f0a45e" />
            <stop offset="1" stopColor="#f6c58a" />
          </linearGradient>
          <linearGradient id={`${id}w`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5a3a48" />
            <stop offset="1" stopColor="#14111c" />
          </linearGradient>
        </defs>
        <rect width="320" height="210" fill={`url(#${id}s)`} />
        <circle cx="214" cy="128" r="22" fill="#ffe6c7" opacity="0.92" />
        <circle cx="214" cy="128" r="46" fill="#f2b36f" opacity="0.14" />
        {/* hill and castle silhouette */}
        <path d="M0 150 C50 132 96 138 140 128 C190 118 250 134 320 126 V210 H0 Z" fill="#1a1426" />
        <path d="M70 140 V104 h10 v-8 h8 v8 h10 v-14 l8 -10 l8 10 v14 h10 v-8 h8 v8 h10 V146 Z" fill="#120e1c" />
        <rect x="104" y="112" width="4" height="9" fill="#f0a45e" opacity="0.8" />
        <rect x="126" y="112" width="4" height="9" fill="#f0a45e" opacity="0.8" />
        {/* river */}
        <rect y="152" width="320" height="58" fill={`url(#${id}w)`} />
        <path d="M0 170 H320 M0 184 H320 M0 198 H320" stroke="#f0a45e" strokeOpacity="0.16" strokeWidth="1" strokeDasharray="14 10" />
        <path d="M196 156 V210" stroke="#ffe6c7" strokeOpacity="0.4" strokeWidth="10" strokeDasharray="2 7" />
      </svg>
      <span className="absolute bottom-2 right-2 rounded-full border border-accent/30 bg-bg/70 px-2 py-0.5 font-mono text-[10px] text-ink/80">1×</span>
    </div>
  );
}

function PdfPage({ locale, arriveMs }: { locale: Locale; arriveMs: number }) {
  const lines = [92, 100, 84, 100, 70, 96, 100, 58];
  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1 overflow-hidden rounded-lg bg-[#e9e4da] px-5 py-4">
        <div className="h-2.5 w-2/3 rounded-sm bg-[#2c2a35]/85" />
        <div className="mt-1.5 h-1.5 w-1/3 rounded-sm bg-[#2c2a35]/35" />
        <div className="mt-4 space-y-[7px]">
          {lines.map((w, i) => (
            <div key={i} className="holo-row h-[5px] rounded-sm bg-[#2c2a35]/40" style={{ width: `${w}%`, ...rowVars(i, arriveMs) }} />
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-1.5 font-mono text-[10px] text-[#2c2a35]/75" aria-hidden="true">
          {["2  1  0", "0  3  1", "1  0  2"].map((r, i) => (
            <div key={i} className="rounded-sm border border-[#2c2a35]/25 px-1.5 py-1 text-center">
              {r}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-2 text-center font-mono text-[10.5px] tabular-nums text-muted">
        {DEMO_PANELS.page[locale]} 1/12
      </p>
    </div>
  );
}

function TextDoc({ arriveMs }: { arriveMs: number }) {
  const rows = ["pierogi ruskie", "", "- 500 g potato", "- 250 g quark cheese", "- 1 onion, fried slowly", "- salt, pepper", "", "boil 4 min after they float"];
  return (
    <div className="h-full overflow-hidden rounded-lg border border-accent/10 bg-bg/60 px-3.5 py-3 font-mono text-[11.5px] leading-[1.7] text-ink/85">
      {rows.map((r, i) => (
        <div key={i} className="holo-row whitespace-pre" style={rowVars(i, arriveMs)}>
          {r || " "}
        </div>
      ))}
    </div>
  );
}

function Archive({ file, locale }: { file: DemoFile; locale: Locale }) {
  return (
    <div className="grid h-full place-items-center rounded-lg border border-dashed border-accent/20 text-center">
      <div>
        <FileZip size={34} weight="duotone" className="mx-auto text-accent" aria-hidden="true" />
        <p className="mt-2.5 text-[13px] text-ink">{file.name[locale]}</p>
        <p className="mt-1 font-mono text-[11px] text-muted">{sizeOf(file, locale)}</p>
        <span className="mt-3 inline-block rounded-full border border-accent/30 px-3 py-1 text-[11.5px] text-accent">{DEMO_PANELS.openWith[locale]}</span>
      </div>
    </div>
  );
}

export function HoloViewer({ file, locale, arriveMs }: { file: DemoFile; locale: Locale; arriveMs: number }) {
  return (
    <div className="h-full p-3">
      {file.kind === "image" && <Photo locale={locale} />}
      {file.kind === "pdf" && <PdfPage locale={locale} arriveMs={arriveMs} />}
      {file.kind === "text" && <TextDoc arriveMs={arriveMs} />}
      {file.kind === "zip" && <Archive file={file} locale={locale} />}
    </div>
  );
}

export const viewerLabel = (kind: FileKind, locale: Locale) =>
  kind === "image" ? DEMO_PANELS.image[locale] : kind === "pdf" ? DEMO_PANELS.pdf[locale] : kind === "text" ? DEMO_PANELS.textDoc[locale] : DEMO_PANELS.other[locale];

/* ------------------------------------------------------------------ */
/* HoloAgenda: the week, seven columns                                  */
/* ------------------------------------------------------------------ */

export function HoloAgenda({ locale, arriveMs, compact }: { locale: Locale; arriveMs: number; compact: boolean }) {
  return (
    <div className={`grid h-full gap-1.5 p-3 ${compact ? "grid-cols-1" : "grid-cols-7"}`}>
      {DEMO_DAYS.map((d, di) => {
        const today = di === DEMO_TODAY;
        const evs = DEMO_EVENTS.filter((e) => e.day === di);
        return (
          <div
            key={di}
            className={`flex min-w-0 ${compact ? "items-start gap-3" : "flex-col"} rounded-lg px-2 pb-2 pt-2 ${
              today ? "bg-accent/[0.09] shadow-[inset_0_0_0_1px_rgb(242_179_111/0.35)]" : "bg-white/[0.02]"
            }`}
          >
            <p className={`flex shrink-0 items-baseline gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] ${compact ? "w-14" : ""} ${today ? "text-accent" : "text-muted"}`}>
              {d[locale]}
              {today && <span className="rounded-full bg-accent px-1.5 py-px text-[9px] font-semibold normal-case tracking-normal text-on-accent">{DEMO_PANELS.today[locale]}</span>}
            </p>
            <ul className={`min-w-0 flex-1 space-y-1.5 ${compact ? "" : "mt-2.5"}`}>
              {evs.map((e, ei) => (
                <li
                  key={ei}
                  className="holo-row rounded-md border border-accent/15 bg-bg/60 px-2 py-1.5"
                  style={rowVars(di * 2 + ei, arriveMs)}
                >
                  <p className="font-mono text-[10px] tabular-nums text-accent">{e.at}</p>
                  <p className="mt-0.5 text-[12px] leading-tight text-ink/95">{e.title[locale]}</p>
                </li>
              ))}
              {evs.length === 0 && <li className="font-mono text-[10.5px] text-muted/70">{locale === "es" ? "libre" : "free"}</li>}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HoloConfirm: the plan, a countdown that shakes in its last seconds    */
/* ------------------------------------------------------------------ */

/** The real plan lives 60 s. Here the clock runs this many times faster so the end is worth waiting for. */
export const PLAN_SECONDS = 60;
export const DEMO_SPEED = 2;

export function HoloConfirm({
  files,
  locale,
  arriveMs,
  reduce,
  paused,
  onConfirm,
  onCancel,
  onExpire,
}: {
  files: DemoFile[];
  locale: Locale;
  arriveMs: number;
  reduce: boolean | null;
  paused?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onExpire: () => void;
}) {
  const fillRef = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(PLAN_SECONDS);
  const doneRef = useRef(false);
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;

  useEffect(() => {
    if (paused) return;
    const t0 = performance.now() + arriveMs + 250;
    const total = (PLAN_SECONDS * 1000) / DEMO_SPEED;
    const tick = () => {
      const el = Math.max(0, performance.now() - t0);
      const rem = Math.max(0, 1 - el / total);
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${rem.toFixed(4)})`;
      setLeft((prev) => {
        const s = Math.ceil(rem * PLAN_SECONDS);
        return s === prev ? prev : s;
      });
      if (rem <= 0 && !doneRef.current) {
        doneRef.current = true;
        expireRef.current();
      }
    };
    const id = window.setInterval(tick, reduce ? 1000 : 100);
    tick();
    return () => window.clearInterval(id);
  }, [arriveMs, paused, reduce]);

  const urge = left <= 10;
  const total = locale === "es" ? DEMO_PANELS.totalSizeEs : DEMO_PANELS.totalSize;

  return (
    <div className="flex h-full flex-col px-3.5 pb-3.5 pt-2.5">
      <ul className="space-y-0.5">
        {files.map((f, i) => (
          <li key={f.n} className="holo-row flex h-[26px] items-center gap-2.5" style={rowVars(i * 2, arriveMs + 140)}>
            <span className="shrink-0 text-accent/90">{fileIcon(f.kind, 15)}</span>
            <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink/95">{f.name[locale]}</span>
            <span className="shrink-0 font-mono text-[10.5px] tabular-nums text-muted">{sizeOf(f, locale)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2.5 flex items-center justify-between border-t border-accent/10 pt-2.5 font-mono text-[11px] text-muted">
        <span>{DEMO_PANELS.total[locale]}</span>
        <span className="tabular-nums text-ink/90">{total}</span>
      </p>

      <div className="mt-auto pt-4">
        <div className="flex items-baseline justify-between font-mono text-[10.5px] text-muted">
          <span>{DEMO_PANELS.expires[locale]}</span>
          <span className={`tabular-nums ${urge ? "text-accent" : "text-ink/80"}`}>
            {left} {DEMO_PANELS.seconds[locale]}
          </span>
        </div>
        <div className={`mt-1.5 h-[5px] overflow-hidden rounded-full bg-white/[0.07] ${urge && !reduce ? "holo-urge" : ""}`} role="progressbar" aria-valuemin={0} aria-valuemax={PLAN_SECONDS} aria-valuenow={left} aria-label={DEMO_PANELS.expires[locale]}>
          <div
            ref={fillRef}
            className="h-full w-full origin-left rounded-full"
            style={{ background: urge ? "linear-gradient(90deg, #f2b36f, #ffe6c7)" : "rgb(242 179 111 / 0.7)", transition: "background 180ms var(--ease-out)" }}
          />
        </div>
        <p className="mt-1.5 font-mono text-[10px] text-muted/80">{DEMO_PANELS.speedNote[locale]}</p>

        <div className="mt-3.5 flex gap-2">
          <button type="button" onClick={onCancel} className="holo-btn press-scale h-10 flex-1 whitespace-nowrap rounded-full border border-ink/20 px-3 text-[13px] font-medium text-ink">
            {DEMO_PANELS.cancel[locale]}
          </button>
          <button type="button" onClick={onConfirm} className="holo-btn-primary press-scale h-10 flex-[2] whitespace-nowrap rounded-full bg-accent px-3 text-[13px] font-semibold text-on-accent">
            {DEMO_PANELS.confirm[locale]}
          </button>
        </div>
        <p className="mt-2 text-center font-mono text-[10.5px] text-muted">{DEMO_TOASTS.asked[locale]}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* HoloTv: what she put on the television                               */
/* ------------------------------------------------------------------ */

const BARS = Array.from({ length: 32 }, (_, i) => ({
  h: 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6)),
  d: (i * 97) % 900,
}));

export function HoloTv({ locale, reduce }: { locale: Locale; reduce: boolean | null }) {
  return (
    <div className="flex h-full flex-col px-5 pb-5 pt-4">
      <div className="flex items-center gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
          <Television size={26} weight="duotone" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-[22px] font-semibold leading-tight tracking-[-0.02em] text-ink">{DEMO_PANELS.tvTitle[locale]}</p>
          <p className="mt-0.5 font-mono text-[11px] text-muted">{DEMO_PANELS.tvMeta[locale]}</p>
        </div>
      </div>
      <div className="mt-5 flex h-[88px] items-end gap-[3px]" aria-hidden="true">
        {BARS.map((b, i) => (
          <span
            key={i}
            className="holo-bar flex-1 origin-bottom rounded-full bg-accent/80"
            style={{
              height: "100%",
              transform: `scaleY(${b.h})`,
              animationDelay: `${b.d}ms`,
              animationPlayState: reduce ? "paused" : "running",
              ["--hi" as string]: b.h.toFixed(2),
              ["--lo" as string]: (b.h * 0.3).toFixed(2),
            }}
          />
        ))}
      </div>
      <div className="mt-5 flex items-center gap-3 font-mono text-[10.5px] text-muted">
        <span className="tabular-nums">0:42</span>
        <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/[0.08]">
          <span className="absolute inset-y-0 left-0 w-[18%] rounded-full bg-accent" />
        </span>
        <span className="tabular-nums">3:20</span>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 border-t border-accent/10 pt-3 text-[12px] text-ink/85">
        <span>{DEMO_PANELS.tvQueue[locale]}</span>
        <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[10.5px] text-muted">
          <SpeakerHigh size={13} aria-hidden="true" />
          {DEMO_PANELS.tvVolume[locale]} 30%
        </span>
      </div>
    </div>
  );
}
