"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ArrowUpRight, FilePdf, GithubLogo } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import { PROJECTS, PROJECTS_UI } from "@/content/projects";
import type { Project, ProjectAxis } from "@/content/projects";
import type { ExternalLink } from "@/content/types";
import { EASE_OUT, revealProps, useFinePointer } from "@/lib/motion";

type Filter = "all" | ProjectAxis;
const FILTERS: Filter[] = ["all", "product", "ai", "hardware"];

const REVEAL_W = 300;
const REVEAL_H = 200;

function LinkIcon({ kind }: { kind: ExternalLink["kind"] }) {
  if (kind === "github") return <GithubLogo size={14} aria-hidden="true" />;
  if (kind === "pdf") return <FilePdf size={14} aria-hidden="true" />;
  return <ArrowUpRight size={14} aria-hidden="true" />;
}

/** What shows in the floating reveal and the mobile thumbnail: media, or a typographic plate. */
function Visual({ project, locale, small }: { project: Project; locale: "en" | "es"; small?: boolean }) {
  const { media, plate } = project;
  if (media) {
    const portrait = media.height > media.width;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={media.src}
        width={media.width}
        height={media.height}
        alt=""
        loading="lazy"
        decoding="async"
        draggable={false}
        className={`h-full w-full ${portrait ? "object-contain" : "object-cover"}`}
      />
    );
  }
  return (
    <div className="flex h-full w-full flex-col justify-between p-3 sm:p-4">
      <p
        className={`font-display font-semibold leading-none tracking-[-0.03em] tabular-nums text-ink ${
          small ? "text-[1.05rem]" : "text-[2.6rem]"
        }`}
      >
        {locale === "es" && plate.valueEs ? plate.valueEs : plate.value}
      </p>
      {!small && <p className="max-w-[22ch] text-[12.5px] leading-snug text-muted">{plate.label[locale]}</p>}
    </div>
  );
}

export function ProjectsSection() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const fine = useFinePointer();
  const [filter, setFilter] = useState<Filter>("all");
  const [hoverId, setHoverId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  /* Pointer lives in motion values: no React render per mouse move. */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 220, damping: 26, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 220, damping: 26, mass: 0.5 });

  const place = (clientX: number, clientY: number) => {
    const rect = listRef.current?.getBoundingClientRect();
    if (!rect) return;
    /* On wide rows keep the card in the empty gutter between text and role column. */
    const gutter = rect.width >= 900 ? Math.min(rect.width * 0.55, rect.width - REVEAL_W - 8) : 0;
    let x = Math.max(gutter, clientX - rect.left + 28);
    if (x + REVEAL_W > rect.width - 8) x = rect.width - REVEAL_W - 8;
    px.set(Math.max(0, x));
    py.set(clientY - rect.top - REVEAL_H / 2);
  };

  const onRowFocus = (id: string, el: HTMLElement) => {
    if (!fine) return;
    const r = el.getBoundingClientRect();
    place(r.left + r.width * 0.62, r.top + r.height / 2);
    setHoverId(id);
  };

  const shown = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.axis === filter);
  const hovered = fine ? PROJECTS.find((p) => p.id === hoverId) : undefined;

  return (
    <section id="proyectos" data-scene="work" className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-[var(--spacing-section)] sm:px-8">
        <motion.div {...revealProps(reduce)} className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2
            className="font-display text-balance text-[clamp(2.2rem,4.4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink lg:col-span-7"
            style={{ fontVariationSettings: '"opsz" 80' }}
          >
            {PROJECTS_UI.heading[locale]}
          </h2>
          <p className="max-w-[46ch] text-pretty text-[15.5px] leading-relaxed text-muted lg:col-span-5">
            {PROJECTS_UI.lead[locale]}
          </p>
        </motion.div>

        <div
          role="group"
          aria-label={PROJECTS_UI.filterLabel[locale]}
          className="mt-12 flex flex-wrap gap-2 lg:mt-16"
        >
          {FILTERS.map((f) => {
            const on = filter === f;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f)}
                className={`press-scale h-10 rounded-full border px-4 text-[13.5px] font-medium transition-colors duration-150 ${
                  on ? "border-ink bg-ink text-bg" : "border-line text-ink/85 hover:border-ink/40"
                }`}
              >
                {PROJECTS_UI.filters[f][locale]}
              </button>
            );
          })}
        </div>

        <div
          ref={listRef}
          className="proj-list relative mt-8"
          onPointerMove={(e) => {
            if (fine && e.pointerType === "mouse") place(e.clientX, e.clientY);
          }}
          onPointerLeave={() => setHoverId(null)}
        >
          <ul className="border-t border-line">
            <AnimatePresence mode="popLayout" initial={false}>
              {shown.map((project) => (
                <motion.li
                  key={project.id}
                  layout={reduce ? false : "position"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.24, ease: EASE_OUT }}
                  className="border-b border-line"
                  onPointerEnter={(e) => {
                    if (fine && e.pointerType === "mouse") setHoverId(project.id);
                  }}
                  onFocusCapture={(e) => onRowFocus(project.id, e.currentTarget)}
                  onBlurCapture={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHoverId(null);
                  }}
                >
                  <article className="proj-row group/row grid gap-x-8 gap-y-3 py-7 md:grid-cols-[4.5rem_minmax(0,1fr)_14rem] md:py-9">
                    <p className="font-mono text-[12px] tabular-nums text-muted md:pt-3">{project.year}</p>

                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <h3
                          className="font-display text-[clamp(2rem,4.6vw,3.9rem)] font-semibold leading-[1] tracking-[-0.035em] text-ink transition-transform duration-300 ease-[var(--ease-out)] md:group-hover/row:translate-x-1.5"
                          style={{ fontVariationSettings: '"opsz" 96' }}
                        >
                          {project.name[locale]}
                        </h3>
                        {/* Mobile thumbnail, inline */}
                        <div
                          aria-hidden="true"
                          className="h-14 w-14 shrink-0 overflow-hidden rounded-[14px] border border-line bg-elevated md:hidden"
                        >
                          <Visual project={project} locale={locale} small />
                        </div>
                      </div>
                      <p className="mt-4 max-w-[54ch] text-pretty text-[15px] leading-relaxed text-muted">
                        {project.line[locale]}
                      </p>
                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        {project.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group press-scale inline-flex h-10 items-center gap-2 rounded-full border border-ink/25 px-4 text-[13.5px] font-medium text-ink transition-colors duration-150 hover:border-ink/50"
                          >
                            <LinkIcon kind={link.kind} />
                            {link.label[locale]}
                            {link.kind !== "github" && (
                              <ArrowUpRight size={12} className="cta-arrow cta-arrow-diag text-muted" aria-hidden="true" />
                            )}
                          </a>
                        ))}
                        {project.note && <p className="font-mono text-[11.5px] text-muted">{project.note[locale]}</p>}
                      </div>
                    </div>

                    <div className="md:pt-3">
                      <p className="text-[13.5px] text-ink/90">{project.role[locale]}</p>
                      <p className="mt-1 font-mono text-[11.5px] text-muted">{PROJECTS_UI.filters[project.axis][locale]}</p>
                      <p className="mt-3 hidden font-mono text-[11.5px] leading-relaxed text-muted md:block">
                        {project.stack.join(" · ")}
                      </p>
                    </div>
                  </article>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {/* One floating reveal for the whole list. Fine pointers only. */}
          {fine && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-20 overflow-hidden rounded-[20px] border border-line bg-surface shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)]"
              style={{ x: reduce ? px : sx, y: reduce ? py : sy, width: REVEAL_W, height: REVEAL_H }}
              initial={false}
              animate={{ opacity: hovered ? 1 : 0, scale: hovered || reduce ? 1 : 0.96 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
            >
              <AnimatePresence initial={false}>
                {hovered && (
                  <motion.div
                    key={hovered.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.16, ease: EASE_OUT }}
                  >
                    <Visual project={hovered} locale={locale} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
