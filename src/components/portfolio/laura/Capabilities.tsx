"use client";

import React from "react";
import { motion } from "motion/react";
import { Brain, CalendarBlank, Desktop, FolderOpen, Lightbulb, MusicNotes, PaperPlaneTilt, Robot } from "@phosphor-icons/react";
import type { Locale } from "@/lib/i18n-context";
import { CAPS_UI, GROUPS } from "@/content/laura";
import type { Group, GroupId } from "@/content/laura";
import { revealProps } from "@/lib/motion";

/**
 * What she can do, as a map and not a grid of equal cards: eight families of
 * different weight, each with a sentence I would really say, the verbs it covers
 * and a hairline whose length is the share of the 67 tools. The first four get
 * more room; Warp has its own little black hole; delegation is drawn as the
 * hand-off it is.
 */

const ICONS: Record<GroupId, typeof Desktop> = {
  system: Desktop,
  files: FolderOpen,
  agenda: CalendarBlank,
  media: MusicNotes,
  warp: PaperPlaneTilt,
  lights: Lightbulb,
  memory: Brain,
  agents: Robot,
};

const SPAN: Record<GroupId, string> = {
  system: "lg:col-span-7",
  files: "lg:col-span-5",
  agenda: "lg:col-span-5",
  media: "lg:col-span-7",
  warp: "lg:col-span-4",
  lights: "lg:col-span-4",
  memory: "lg:col-span-4",
  agents: "lg:col-span-12",
};

const BIG: GroupId[] = ["system", "files", "agenda", "media"];

function Hole() {
  return (
    <svg viewBox="0 0 120 70" className="h-[70px] w-[120px] shrink-0" aria-hidden="true">
      <defs>
        <radialGradient id="cap-hole" cx="50%" cy="50%" r="50%">
          <stop offset="0.5" stopColor="#000" />
          <stop offset="0.62" stopColor="#ffe6c7" stopOpacity="0.95" />
          <stop offset="0.76" stopColor="#f2b36f" stopOpacity="0.4" />
          <stop offset="1" stopColor="#f2b36f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="2" y="14" width="46" height="34" rx="5" fill="none" stroke="rgb(236 237 240 / 0.35)" strokeWidth="1.4" />
      <rect x="8" y="22" width="14" height="9" rx="2" fill="rgb(242 179 111 / 0.8)" />
      <path d="M26 27 C 54 -6, 70 -6, 92 14" fill="none" stroke="#F2B36F" strokeWidth="1.4" strokeDasharray="2 5" strokeLinecap="round" />
      <circle cx="96" cy="24" r="22" fill="url(#cap-hole)" />
    </svg>
  );
}

function GroupBlock({ g, locale, index, reduce }: { g: Group; locale: Locale; index: number; reduce: boolean | null }) {
  const Icon = ICONS[g.id];
  const big = BIG.includes(g.id);
  const share = Math.max(6, Math.round((g.count / 17) * 100));
  return (
    <motion.article
      {...revealProps(reduce, (index % 3) * 0.05)}
      className={`laura-group pt-6 ${SPAN[g.id]}`}
      aria-labelledby={`laura-g-${g.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <span className="grid size-9 place-items-center rounded-full border border-accent/30 text-accent" aria-hidden="true">
            <Icon size={17} weight="duotone" />
          </span>
          <h3
            id={`laura-g-${g.id}`}
            className={`mt-5 font-display font-semibold leading-[1.05] tracking-[-0.03em] text-ink ${big ? "text-[clamp(1.7rem,2.9vw,2.4rem)]" : "text-[1.5rem]"}`}
            style={{ fontVariationSettings: '"opsz" 60' }}
          >
            {g.title[locale]}
          </h3>
          <p className="mt-2.5 max-w-[44ch] text-pretty text-[14.5px] leading-relaxed text-muted">{g.pitch[locale]}</p>
        </div>
        {g.id === "warp" && <Hole />}
      </div>

      <div className="mt-5 flex items-center gap-3" aria-hidden="true">
        <span className="h-px bg-accent" style={{ width: `${share * 0.6}%`, minWidth: 14 }} />
        <span className="font-mono text-[11px] tabular-nums text-muted">
          {g.count} {g.count === 1 ? CAPS_UI.toolWord[locale] : CAPS_UI.toolsWord[locale]}
        </span>
      </div>

      <blockquote className={`mt-6 border-l border-accent/60 pl-4 ${big ? "max-w-[34ch]" : ""}`}>
        <p className={`text-pretty font-display font-medium leading-snug tracking-[-0.02em] text-ink ${big ? "text-[1.3rem]" : "text-[1.08rem]"}`}>
          {locale === "es" ? `«${g.quote[locale]}»` : `“${g.quote[locale]}”`}
        </p>
      </blockquote>

      <ul className={`mt-6 gap-x-8 gap-y-3 ${big ? "grid sm:grid-cols-2" : "space-y-3"}`}>
        {g.verbs.map((v) => (
          <li key={v.en} className="laura-verb grid grid-cols-[1.1rem_1fr] gap-x-1.5 text-pretty text-[14px] leading-relaxed text-ink/85">
            <span>{v[locale]}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 flex flex-wrap gap-1.5" aria-hidden="true">
        {g.tools.map((t) => (
          <code key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] leading-none text-ink/70">
            {t}
          </code>
        ))}
      </p>
    </motion.article>
  );
}

function Handoff({ locale, reduce }: { locale: Locale; reduce: boolean | null }) {
  const yes = locale === "es" ? "pide mi sí" : "needs my yes";
  const nodes = [
    { name: "Gemini", sub: locale === "es" ? "cambios ligeros de código" : "light code changes", gate: true },
    { name: "Claude Code", sub: locale === "es" ? "refactors y desarrollo largo" : "refactors and long builds", gate: true },
    { name: "Aurora", sub: locale === "es" ? "el agente de mi Raspberry Pi" : "the agent on my Raspberry Pi", gate: false },
    { name: locale === "es" ? "Investigación" : "Research", sub: locale === "es" ? "en segundo plano, queda como nota" : "in the background, filed as a note", gate: false },
  ];
  return (
    <motion.ul {...revealProps(reduce, 0.05)} className="grid gap-px overflow-hidden rounded-[16px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
      {nodes.map((n) => (
        <li key={n.name} className="bg-bg px-5 py-5">
          <p className="font-display text-[1.15rem] font-semibold tracking-[-0.02em] text-ink">{n.name}</p>
          <p className="mt-1 text-[13px] leading-snug text-muted">{n.sub}</p>
          <p className={`mt-3 font-mono text-[10.5px] ${n.gate ? "text-accent" : "text-muted/70"}`}>{n.gate ? yes : locale === "es" ? "sin permiso extra" : "no extra gate"}</p>
        </li>
      ))}
    </motion.ul>
  );
}

export function Capabilities({ locale, reduce }: { locale: Locale; reduce: boolean | null }) {
  const agents = GROUPS.find((g) => g.id === "agents")!;
  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <motion.h3
          {...revealProps(reduce)}
          className="font-display text-balance text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink lg:col-span-7"
          style={{ fontVariationSettings: '"opsz" 80' }}
        >
          {CAPS_UI.heading[locale]}
        </motion.h3>
        <motion.p {...revealProps(reduce, 0.05)} className="max-w-[46ch] text-pretty text-[15.5px] leading-relaxed text-muted lg:col-span-5">
          {CAPS_UI.lead[locale]}
        </motion.p>
      </div>

      <div className="mt-12 grid gap-x-12 gap-y-14 lg:mt-16 lg:grid-cols-12">
        {GROUPS.filter((g) => g.id !== "agents").map((g, i) => (
          <GroupBlock key={g.id} g={g} locale={locale} index={i} reduce={reduce} />
        ))}
        <div className={`laura-group pt-6 ${SPAN.agents}`}>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <GroupInline g={agents} locale={locale} reduce={reduce} />
            </div>
            <div className="lg:col-span-7 lg:pt-14">
              <Handoff locale={locale} reduce={reduce} />
              <ul className="mt-6 space-y-3">
                {agents.verbs.map((v) => (
                  <li key={v.en} className="laura-verb grid grid-cols-[1.1rem_1fr] gap-x-1.5 text-pretty text-[14px] leading-relaxed text-ink/85">
                    <span>{v[locale]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupInline({ g, locale, reduce }: { g: Group; locale: Locale; reduce: boolean | null }) {
  const Icon = ICONS[g.id];
  return (
    <motion.div {...revealProps(reduce)}>
      <span className="grid size-9 place-items-center rounded-full border border-accent/30 text-accent" aria-hidden="true">
        <Icon size={17} weight="duotone" />
      </span>
      <h3 className="mt-5 font-display text-[clamp(1.7rem,2.9vw,2.4rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink" style={{ fontVariationSettings: '"opsz" 60' }}>
        {g.title[locale]}
      </h3>
      <p className="mt-2.5 max-w-[44ch] text-pretty text-[14.5px] leading-relaxed text-muted">{g.pitch[locale]}</p>
      <div className="mt-5 flex items-center gap-3" aria-hidden="true">
        <span className="h-px w-[22%] bg-accent" />
        <span className="font-mono text-[11px] tabular-nums text-muted">
          {g.count} {CAPS_UI.toolsWord[locale]}
        </span>
      </div>
      <blockquote className="mt-6 max-w-[34ch] border-l border-accent/60 pl-4">
        <p className="text-pretty font-display text-[1.3rem] font-medium leading-snug tracking-[-0.02em] text-ink">
          {locale === "es" ? `«${g.quote[locale]}»` : `“${g.quote[locale]}”`}
        </p>
      </blockquote>
    </motion.div>
  );
}
