"use client";

import React, { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, FilePdf, GithubLogo } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import type { Locale } from "@/lib/i18n-context";
import { SELECTED_CASE_STUDIES } from "@/content/portfolio-data";
import { ASSETS } from "@/content/assets";
import type { MediaAsset } from "@/content/assets";
import type { ExternalLink } from "@/content/types";
import { EASE_OUT, SPRING_LAYOUT, revealProps } from "@/lib/motion";

type ViewId = "demo" | "home" | "checkin" | "report";

const VIEWS: { id: ViewId; label: Record<Locale, string>; shot?: MediaAsset }[] = [
  { id: "demo", label: { en: "Demo", es: "Demo" } },
  { id: "home", label: { en: "Home", es: "Inicio" }, shot: ASSETS.mycrohnie.shots.home },
  { id: "checkin", label: { en: "Check-in", es: "Registro" }, shot: ASSETS.mycrohnie.shots.checkin },
  { id: "report", label: { en: "Doctor report", es: "Informe médico" }, shot: ASSETS.mycrohnie.shots.report },
];

function LinkIcon({ kind }: { kind: ExternalLink["kind"] }) {
  if (kind === "github") return <GithubLogo size={14} aria-hidden="true" />;
  if (kind === "pdf") return <FilePdf size={14} aria-hidden="true" />;
  return <ArrowUpRight size={14} aria-hidden="true" />;
}

export function MyCrohnieCase() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const [view, setView] = useState<ViewId>("demo");

  const study = SELECTED_CASE_STUDIES.find((s) => s.id === "mycrohnie") ?? SELECTED_CASE_STUDIES[0];
  if (!study) return null;

  const current = VIEWS.find((v) => v.id === view) ?? VIEWS[0];

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
      {/* Story */}
      <motion.div {...revealProps(reduce)} className="lg:col-span-5">
        <p className="font-mono text-[11px] text-[#8E95A5]">{study.statusLabel[locale]}</p>
        <h3 className="mt-4 font-display text-[clamp(2rem,3.2vw,2.6rem)] font-semibold leading-none tracking-[-0.035em] text-[#ECEEF2]">
          {study.title}
        </h3>
        <p className="mt-4 max-w-[40ch] text-balance text-[17px] font-medium leading-snug text-[#ECEEF2]">
          {study.tagline[locale]}
        </p>
        <p className="mt-4 max-w-[56ch] text-pretty text-[14.5px] leading-relaxed text-[#8E95A5]">
          {study.problem[locale]}
        </p>

        <ol className="mt-8 border-t border-[#232732]">
          {study.engineeringHighlights.slice(0, 3).map((highlight, i) => (
            <li
              key={i}
              className="grid grid-cols-[2rem_1fr] gap-x-2 border-b border-[#232732] py-4 text-[14px] leading-relaxed text-[#B4BAC6]"
            >
              <span className="pt-0.5 font-mono text-[11px] text-[#5D6474]">{String(i + 1).padStart(2, "0")}</span>
              <span>{highlight[locale]}</span>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {study.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150 press-scale ${
                link.kind === "live"
                  ? "bg-[#ECEEF2] text-[#090A0D] hover:bg-[#D9DCE3]"
                  : "border border-[#232732] text-[#ECEEF2] hover:border-[#343a48] hover:bg-[#111318]"
              }`}
            >
              <LinkIcon kind={link.kind} />
              {link.label[locale]}
            </a>
          ))}
        </div>
      </motion.div>

      {/* Media stage */}
      <motion.div {...revealProps(reduce, 0.08)} className="lg:col-span-7">
        <div className="overflow-hidden rounded-2xl border border-[#232732] bg-[#0C0E12]">
          <div className="flex items-center justify-between gap-3 border-b border-[#232732] px-3 py-2.5">
            <LayoutGroup id="mycrohnie-views">
              <div role="tablist" aria-label="MyCrohnie" className="flex flex-wrap items-center gap-1">
                {VIEWS.map((v) => {
                  const selected = v.id === view;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setView(v.id)}
                      className={`relative isolate rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors duration-150 press-scale ${
                        selected ? "text-[#ECEEF2]" : "text-[#8E95A5] hover:text-[#ECEEF2]"
                      }`}
                    >
                      {selected && (
                        <motion.span
                          layoutId="mycrohnie-view-pill"
                          aria-hidden="true"
                          className="absolute inset-0 -z-10 rounded-full border border-[#2A2F3B] bg-[#171A21]"
                          transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                        />
                      )}
                      {v.label[locale]}
                    </button>
                  );
                })}
              </div>
            </LayoutGroup>
            <span className="hidden font-mono text-[10.5px] text-[#5D6474] sm:block">HackYeah 2026 · 24h</span>
          </div>

          <div role="tabpanel" className="relative aspect-video w-full">
            <AnimatePresence initial={false}>
              {current.shot ? (
                <motion.div
                  key={current.id}
                  className="absolute inset-0 flex items-end justify-center pt-6"
                  initial={{ opacity: 0, transform: reduce ? "none" : "translateY(16px)" }}
                  animate={{ opacity: 1, transform: "translateY(0px)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                >
                  <div className="h-[108%] translate-y-[8%] rounded-[30px] border border-[#232732] bg-[#171A21] p-[5px] shadow-[0_40px_70px_-30px_rgba(0,0,0,0.95)]">
                    <img
                      src={current.shot.src}
                      alt={current.shot.alt[locale]}
                      width={current.shot.width}
                      height={current.shot.height}
                      draggable={false}
                      className="h-full w-auto rounded-[25px] object-cover object-top"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.video
                  key="demo"
                  src={ASSETS.mycrohnie.demoLoop.src}
                  poster={ASSETS.mycrohnie.demoLoop.poster}
                  width={ASSETS.mycrohnie.demoLoop.width}
                  height={ASSETS.mycrohnie.demoLoop.height}
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-label={ASSETS.mycrohnie.demoLoop.alt[locale]}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE_OUT }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
        <p className="mt-3 font-mono text-[11px] text-[#5D6474]">{study.stack.join(" / ")}</p>
      </motion.div>
    </div>
  );
}
