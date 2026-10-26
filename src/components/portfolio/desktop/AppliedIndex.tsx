"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, GithubLogo, Plus } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { APPLIED_AI_PROJECTS } from "@/content/portfolio-data";
import { ASSETS } from "@/content/assets";
import type { MediaAsset } from "@/content/assets";
import { EASE_OUT, revealProps } from "@/lib/motion";

/** Real captures available per project. Only verified media is listed here. */
const PREVIEWS: Record<string, MediaAsset> = {
  closhare: ASSETS.closhare.wardrobe,
};

export function AppliedIndex() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      <motion.div {...revealProps(reduce)} className="flex flex-wrap items-end justify-between gap-4">
        <h3 className="font-display text-[clamp(1.6rem,2.6vw,2.1rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#ECEEF2]">
          {locale === "es" ? "IA aplicada y herramientas en producción" : "Applied AI and production tools"}
        </h3>
        <p className="max-w-[44ch] text-[14px] leading-relaxed text-[#8E95A5]">
          {locale === "es"
            ? "Proyectos pequeños, usados por gente real, a coste de servidor casi cero."
            : "Small tools with real users, running at near-zero server cost."}
        </p>
      </motion.div>

      <ol className="mt-10 border-t border-[#232732]">
        {APPLIED_AI_PROJECTS.map((project, index) => {
          const isOpen = open === project.id;
          const preview = PREVIEWS[project.id];
          const panelId = `applied-${project.id}`;
          return (
            <motion.li key={project.id} {...revealProps(reduce, 0.05 * index)} className="border-b border-[#232732]">
              <div className="grid grid-cols-[2.25rem_1fr_auto] items-start gap-x-3 py-6 sm:grid-cols-[3rem_1fr_auto] sm:gap-x-5">
                <span className="pt-1.5 font-mono text-[11px] text-[#5D6474]">{String(index + 1).padStart(2, "0")}</span>

                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : project.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="group min-w-0 text-left"
                >
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-display text-[clamp(1.25rem,2vw,1.6rem)] font-semibold tracking-[-0.025em] text-[#ECEEF2]">
                      {project.title}
                    </span>
                    <span className="font-mono text-[11px] text-[#10B981]">{project.badge[locale]}</span>
                  </span>
                  <span className="mt-2 block max-w-[68ch] text-[14.5px] leading-relaxed text-[#8E95A5] transition-colors duration-150 group-hover:text-[#B4BAC6]">
                    {project.summary[locale]}
                  </span>
                  <span className="mt-3 flex items-center gap-2 font-mono text-[11px] text-[#5D6474]">
                    <Plus
                      size={11}
                      weight="bold"
                      aria-hidden="true"
                      className="shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)]"
                      style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                    />
                    <span className="truncate">{project.stack.join(" / ")}</span>
                  </span>
                </button>

                <div className="flex items-center gap-1.5 pt-1">
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title}: ${link.label[locale]}`}
                      className="group inline-flex items-center gap-1.5 rounded-full border border-[#232732] px-3 py-1.5 text-[12.5px] text-[#ECEEF2] transition-colors duration-150 hover:border-[#343a48] hover:bg-[#111318] press-scale"
                    >
                      {link.kind === "github" ? <GithubLogo size={13} aria-hidden="true" /> : null}
                      <span className="hidden sm:inline">{link.label[locale]}</span>
                      <ArrowUpRight size={12} className="cta-arrow cta-arrow-diag text-[#8E95A5]" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Accordion drawer: height is the one sanctioned layout animation here */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    key="panel"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1, transition: { duration: 0.32, ease: EASE_OUT } }}
                    exit={{ height: 0, opacity: 0, transition: { duration: 0.2, ease: EASE_OUT } }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 gap-6 pb-8 sm:grid-cols-[3rem_1fr] sm:gap-x-5">
                      <span aria-hidden="true" className="hidden sm:block" />
                      <div className={`grid gap-6 ${preview ? "md:grid-cols-[1fr_200px] md:items-start" : ""}`}>
                        <ul className="space-y-3">
                          {project.highlights.map((highlight, i) => (
                            <li key={i} className="grid grid-cols-[1.25rem_1fr] gap-x-2 text-[14px] leading-relaxed text-[#B4BAC6]">
                              <span aria-hidden="true" className="mt-[0.7em] h-px w-3 bg-[#10B981]" />
                              <span className="max-w-[60ch]">{highlight[locale]}</span>
                            </li>
                          ))}
                        </ul>
                        {preview && (
                          <motion.div
                            initial={{ opacity: 0, transform: reduce ? "none" : "translateY(10px)" }}
                            animate={{ opacity: 1, transform: "translateY(0px)", transition: { duration: 0.4, ease: EASE_OUT, delay: 0.08 } }}
                            className="max-h-[360px] w-[200px] overflow-hidden rounded-[26px] border border-[#232732] bg-[#171A21] p-[5px]"
                          >
                            <img
                              src={preview.src}
                              alt={preview.alt[locale]}
                              width={preview.width}
                              height={preview.height}
                              loading="lazy"
                              draggable={false}
                              className="h-auto w-full rounded-[21px]"
                            />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
