"use client";

import React from "react";
import { motion } from "motion/react";
import { Brain, CalendarBlank, Desktop, FolderOpen, Lightbulb, MusicNotes, PaperPlaneTilt, Robot } from "@phosphor-icons/react";
import type { Locale } from "@/lib/i18n-context";
import { CAPS_UI, GROUPS } from "@/content/laura";
import type { Group, GroupId } from "@/content/laura";
import { revealProps } from "@/lib/motion";
import { Detail } from "../Detail";

/**
 * What she can do, in two layers. The summary is a map of eight families, each with
 * one line (the first four get more room; Warp has its own little black hole;
 * delegation is drawn as the hand-off it is). The full list of the 67 tools, with the
 * sentence I would say and the verbs each covers, sits behind one tap and is open on
 * a wide screen.
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
  system: "lg:col-span-3",
  files: "lg:col-span-3",
  agenda: "lg:col-span-3",
  media: "lg:col-span-3",
  warp: "lg:col-span-4",
  lights: "lg:col-span-4",
  memory: "lg:col-span-4",
  agents: "lg:col-span-12",
};

function Hole() {
  return (
    <svg viewBox="0 0 120 70" className="h-[44px] w-[75px] shrink-0 lg:h-[56px] lg:w-[96px]" aria-hidden="true">
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

function toolsLabel(g: Group, locale: Locale) {
  return `${g.count} ${g.count === 1 ? CAPS_UI.toolWord[locale] : CAPS_UI.toolsWord[locale]}`;
}

/** The summary tile: icon, title, one line and how many tools. */
function Tile({ g, locale, index, reduce }: { g: Group; locale: Locale; index: number; reduce: boolean | null }) {
  const Icon = ICONS[g.id];
  return (
    <motion.article {...revealProps(reduce, (index % 4) * 0.04)} className={`laura-group pt-5 ${SPAN[g.id]}`} aria-labelledby={`laura-g-${g.id}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="grid size-9 place-items-center rounded-full border border-accent/30 text-accent" aria-hidden="true">
          <Icon size={17} weight="duotone" />
        </span>
        {g.id === "warp" && <Hole />}
      </div>
      <h3
        id={`laura-g-${g.id}`}
        className="mt-4 font-display text-[1.12rem] font-semibold leading-[1.1] tracking-[-0.025em] text-ink lg:text-[1.35rem]"
        style={{ fontVariationSettings: '"opsz" 60' }}
      >
        {g.title[locale]}
      </h3>
      <p className="mt-2 text-pretty text-[13.5px] leading-snug text-muted lg:text-[14.5px] lg:leading-relaxed">{g.pitch[locale]}</p>
      <p className="mt-4 font-mono text-[11px] tabular-nums text-accent/90">{toolsLabel(g, locale)}</p>
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
    <motion.ul {...revealProps(reduce, 0.05)} className="grid grid-cols-2 gap-px overflow-hidden rounded-[16px] border border-line bg-line lg:grid-cols-4">
      {nodes.map((n) => (
        <li key={n.name} className="bg-bg px-4 py-4 lg:px-5 lg:py-5">
          <p className="font-display text-[1.05rem] font-semibold tracking-[-0.02em] text-ink lg:text-[1.15rem]">{n.name}</p>
          <p className="mt-1 text-[12.5px] leading-snug text-muted lg:text-[13px]">{n.sub}</p>
          <p className={`mt-3 font-mono text-[10.5px] ${n.gate ? "text-accent" : "text-muted/70"}`}>{n.gate ? yes : locale === "es" ? "sin permiso extra" : "no extra gate"}</p>
        </li>
      ))}
    </motion.ul>
  );
}

/** The full list: every family with the sentence I would say, its verbs and the tool names. */
function ToolList({ locale }: { locale: Locale }) {
  return (
    <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
      {GROUPS.map((g) => (
        <section key={g.id} className="laura-group pt-5" aria-label={g.title[locale]}>
          <div className="flex items-baseline justify-between gap-4">
            <h4 className="font-display text-[1.2rem] font-semibold leading-tight tracking-[-0.02em] text-ink">{g.title[locale]}</h4>
            <span className="shrink-0 font-mono text-[11px] tabular-nums text-muted">{toolsLabel(g, locale)}</span>
          </div>
          <blockquote className="mt-4 border-l border-accent/60 pl-4">
            <p className="text-pretty font-display text-[1.08rem] font-medium leading-snug tracking-[-0.02em] text-ink">
              {locale === "es" ? `«${g.quote[locale]}»` : `“${g.quote[locale]}”`}
            </p>
          </blockquote>
          <ul className="mt-5 space-y-2.5">
            {g.verbs.map((v) => (
              <li key={v.en} className="laura-verb grid grid-cols-[1.1rem_1fr] gap-x-1.5 text-pretty text-[14px] leading-relaxed text-ink/85">
                <span>{v[locale]}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex flex-wrap gap-1.5" aria-hidden="true">
            {g.tools.map((t) => (
              <code key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] leading-none text-ink/70">
                {t}
              </code>
            ))}
          </p>
        </section>
      ))}
    </div>
  );
}

export function Capabilities({ locale, reduce }: { locale: Locale; reduce: boolean | null }) {
  const agents = GROUPS.find((g) => g.id === "agents")!;
  const AgentsIcon = ICONS.agents;
  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-6">
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

      <div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-8 lg:mt-14 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-12">
        {GROUPS.filter((g) => g.id !== "agents").map((g, i) => (
          <Tile key={g.id} g={g} locale={locale} index={i} reduce={reduce} />
        ))}
        <div className={`laura-group col-span-2 pt-5 ${SPAN.agents}`}>
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
            <motion.div {...revealProps(reduce)} className="lg:col-span-5">
              <span className="grid size-9 place-items-center rounded-full border border-accent/30 text-accent" aria-hidden="true">
                <AgentsIcon size={17} weight="duotone" />
              </span>
              <h3 className="mt-4 font-display text-[1.12rem] font-semibold leading-[1.1] tracking-[-0.025em] text-ink lg:text-[1.35rem]" style={{ fontVariationSettings: '"opsz" 60' }}>
                {agents.title[locale]}
              </h3>
              <p className="mt-2 max-w-[44ch] text-pretty text-[13.5px] leading-snug text-muted lg:text-[14.5px] lg:leading-relaxed">{agents.pitch[locale]}</p>
              <p className="mt-4 font-mono text-[11px] tabular-nums text-accent/90">{toolsLabel(agents, locale)}</p>
            </motion.div>
            <div className="lg:col-span-7">
              <Handoff locale={locale} reduce={reduce} />
            </div>
          </div>
        </div>
      </div>

      <Detail className="mt-12 lg:mt-16" label={CAPS_UI.detailOpen[locale]} closeLabel={CAPS_UI.detailClose[locale]}>
        <ToolList locale={locale} />
      </Detail>
    </div>
  );
}
