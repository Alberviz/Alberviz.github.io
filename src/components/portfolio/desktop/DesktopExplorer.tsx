"use client";

import React, { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, CornersOut, GithubLogo, X } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import type { Locale } from "@/lib/i18n-context";
import { LINUX_DESKTOP_SHOWCASE, SELECTED_CASE_STUDIES } from "@/content/portfolio-data";
import { ASSETS } from "@/content/assets";
import type { MediaAsset } from "@/content/assets";
import type { LinuxDesktopShowcaseItem } from "@/content/types";
import { EASE_OUT, SPRING_CAMERA, SPRING_LAYOUT, revealProps } from "@/lib/motion";

/* -------------------------------------------------------------------------- */
/* Scene geometry: every coordinate below was measured on the real captures.  */
/* -------------------------------------------------------------------------- */

type SceneId = "celestial" | "icy" | "drawer";

const SCENES: Record<SceneId, { asset: MediaAsset; file: string }> = {
  celestial: { asset: ASSETS.systems.celestial, file: "celestial-desktop.webp" },
  icy: { asset: ASSETS.systems.desktopIcy, file: "desktop-icy.webp" },
  drawer: { asset: ASSETS.systems.lauraDrawer, file: "laura-drawer.webp" },
};

type Focus = { scene: SceneId; x: number; y: number; zoom: number };

/** Where the camera travels for each subsystem (percent of frame, zoom factor). */
const FOCUS: Record<string, Focus> = {
  "gargantua-shader": { scene: "celestial", x: 85, y: 20, zoom: 1.6 },
  "celestial-desktop": { scene: "celestial", x: 36, y: 60, zoom: 1.32 },
  "laura-voice": { scene: "icy", x: 24, y: 56, zoom: 1.55 },
  "laura-drawer": { scene: "drawer", x: 50, y: 50, zoom: 1 },
  "tasks-and-drivers": { scene: "celestial", x: 15, y: 16, zoom: 1.85 },
};

const MEDIA_SCENE: Record<LinuxDesktopShowcaseItem["mediaKey"], SceneId> = {
  gargantua: "celestial",
  celestial: "celestial",
  desktopIcy: "icy",
  lauraDrawer: "drawer",
};

/** Numbered hotspot pins, placed on the exact UI element in each capture. */
const PINS: Record<SceneId, { id: string; x: number; y: number }[]> = {
  celestial: [
    { id: "gargantua-shader", x: 85.9, y: 16.5 },
    { id: "celestial-desktop", x: 45.8, y: 65.7 },
    { id: "laura-voice", x: 25.4, y: 52.3 },
    { id: "laura-drawer", x: 1.6, y: 22.9 },
    { id: "tasks-and-drivers", x: 11.5, y: 19.2 },
  ],
  icy: [
    { id: "gargantua-shader", x: 85.9, y: 10.6 },
    { id: "celestial-desktop", x: 47.3, y: 63.5 },
    { id: "laura-voice", x: 23.4, y: 55.5 },
    { id: "laura-drawer", x: 1.6, y: 18.4 },
    { id: "tasks-and-drivers", x: 14, y: 10.4 },
  ],
  drawer: [{ id: "laura-drawer", x: 73.4, y: 21.5 }],
};

function focusFor(item: LinuxDesktopShowcaseItem): Focus {
  return FOCUS[item.id] ?? { scene: MEDIA_SCENE[item.mediaKey] ?? "celestial", x: 50, y: 50, zoom: 1 };
}

/**
 * Camera transform that zooms toward (x, y) and pulls that point 60% of the
 * way to the frame center, clamped so the capture edge never shows.
 */
function cameraTransform(focus: Focus) {
  const s = focus.zoom;
  if (s <= 1) return { frame: "translate(0%, 0%) scale(1)", pin: "translate(-50%, -50%) scale(1)" };
  const limit = 50 * (s - 1);
  const target = (p: number) => p + (50 - p) * 0.6;
  const shift = (p: number) => Math.max(-limit, Math.min(limit, target(p) - 50 - (p - 50) * s));
  return {
    frame: `translate(${shift(focus.x).toFixed(3)}%, ${shift(focus.y).toFixed(3)}%) scale(${s})`,
    pin: `translate(-50%, -50%) scale(${(1 / s).toFixed(4)})`,
  };
}

const UI = {
  heading: {
    en: "The desktop I actually work in.",
    es: "El escritorio en el que trabajo de verdad.",
  },
  lead: {
    en: "Hyprland and my own Quickshell Caelestia 2.5 build: a raymarched black hole that listens to the music, a voice AI running fully on the laptop GPU, and a drawer where every agent waits for my OK.",
    es: "Hyprland y mi propia build de Quickshell Caelestia 2.5: un agujero negro con raymarching que escucha la música, una IA de voz que corre entera en la GPU del portátil y un cajón donde cada agente espera mi OK.",
  },
  hint: {
    en: "Click a numbered pin or a subsystem",
    es: "Pulsa un pin numerado o un subsistema",
  },
  inspect: { en: "Inspect shader render", es: "Ver render del shader" },
  close: { en: "Close shader render", es: "Cerrar render del shader" },
} satisfies Record<string, Record<Locale, string>>;

export function DesktopExplorer() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const items = LINUX_DESKTOP_SHOWCASE;
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [inspecting, setInspecting] = useState(false);

  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId));
  const active = items[activeIndex];
  if (!active) return null;

  const focus = focusFor(active);
  const camera = cameraTransform(focus);
  const scene = SCENES[focus.scene];

  const select = (id: string) => {
    setActiveId(id);
    setInspecting(false);
  };

  const systemsStudy = SELECTED_CASE_STUDIES.find((study) => study.category === "systems");
  const repoLinks = systemsStudy?.links.filter((link) => link.kind === "github") ?? [];

  return (
    <div id="desktop" className="scroll-mt-20">
      <motion.div {...revealProps(reduce)} className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
        <h2 className="font-display text-balance text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-[#ECEEF2] lg:col-span-6">
          {UI.heading[locale]}
        </h2>
        <p className="max-w-[60ch] text-pretty text-[15px] leading-relaxed text-[#8E95A5] lg:col-span-6">
          {UI.lead[locale]}
        </p>
      </motion.div>

      {/* Frame */}
      <motion.div
        className="mt-12"
        initial={{ opacity: 0, clipPath: reduce ? "inset(0% 0% 0% 0% round 16px)" : "inset(8% 6% 8% 6% round 16px)" }}
        whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 16px)" }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 1.1, ease: EASE_OUT }}
      >
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[#232732] bg-[#050608]">
          <AnimatePresence initial={false}>
            <motion.div
              key={focus.scene}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE_OUT }}
            >
              <motion.div
                className="absolute inset-0 origin-center will-change-transform"
                initial={{ transform: "translate(0%, 0%) scale(1)" }}
                animate={{ transform: reduce ? "translate(0%, 0%) scale(1)" : camera.frame }}
                transition={SPRING_CAMERA}
              >
                <img
                  src={scene.asset.src}
                  alt={scene.asset.alt[locale]}
                  width={scene.asset.width}
                  height={scene.asset.height}
                  draggable={false}
                  className="h-full w-full select-none object-cover"
                />

                {PINS[focus.scene].map((pin) => {
                  const index = items.findIndex((item) => item.id === pin.id);
                  const item = items[index];
                  if (!item) return null;
                  const isActive = pin.id === active.id;
                  return (
                    <motion.button
                      key={pin.id}
                      type="button"
                      onClick={() => select(pin.id)}
                      aria-label={`${index + 1}. ${item.title}`}
                      aria-pressed={isActive}
                      className="group absolute z-10 grid h-7 w-7 place-items-center rounded-full"
                      style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                      initial={{ transform: "translate(-50%, -50%) scale(1)" }}
                      animate={{ transform: reduce ? "translate(-50%, -50%) scale(1)" : camera.pin }}
                      transition={SPRING_CAMERA}
                    >
                      {!isActive && (
                        <span aria-hidden="true" className="pin-pulse absolute inset-0 rounded-full border border-[#10B981]/70" />
                      )}
                      <span
                        aria-hidden="true"
                        className={`relative grid h-7 w-7 place-items-center rounded-full border font-mono text-[11px] font-semibold transition-colors duration-200 ${
                          isActive
                            ? "border-[#10B981] bg-[#10B981] text-[#04130D]"
                            : "border-[#10B981]/60 bg-[#090A0D]/85 text-[#ECEEF2] group-hover:border-[#10B981]"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full border border-[#232732] bg-[#090A0D]/90 px-2.5 py-1 font-mono text-[10.5px] text-[#ECEEF2] opacity-0 transition-opacity duration-150 md:block group-hover:opacity-100 group-focus-visible:opacity-100 ${
                          pin.x > 60 ? "right-9" : "left-9"
                        }`}
                      >
                        {item.title}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Shader inspection: the pure 1024x1024 render, revealed with a clip wipe */}
          <AnimatePresence>
            {active.id === "gargantua-shader" && !inspecting && (
              <motion.button
                key="inspect"
                type="button"
                onClick={() => setInspecting(true)}
                className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-full border border-[#232732] bg-[#090A0D]/85 px-3 py-1.5 text-[12px] font-medium text-[#ECEEF2] backdrop-blur-md press-scale"
                initial={{ opacity: 0, transform: "translateY(6px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)", transition: { duration: 0.24, ease: EASE_OUT, delay: 0.4 } }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
              >
                <CornersOut size={13} aria-hidden="true" />
                {UI.inspect[locale]}
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {inspecting && (
              <motion.div
                key="shader"
                className="absolute inset-y-0 right-0 z-30 flex aspect-square max-w-full items-center justify-center border-l border-[#232732] bg-[#050608]"
                initial={{ clipPath: "inset(0% 0% 0% 100%)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.6, ease: EASE_OUT } }}
                exit={{ clipPath: "inset(0% 0% 0% 100%)", transition: { duration: 0.28, ease: EASE_OUT } }}
              >
                <img
                  src={ASSETS.systems.gargantua.src}
                  alt={ASSETS.systems.gargantua.alt[locale]}
                  width={ASSETS.systems.gargantua.width}
                  height={ASSETS.systems.gargantua.height}
                  draggable={false}
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-3 left-3 rounded-full border border-[#232732] bg-[#090A0D]/85 px-2.5 py-1 font-mono text-[10.5px] text-[#8E95A5]">
                  Gargantua GLSL · 1024 x 1024 · ACES
                </span>
                <button
                  type="button"
                  onClick={() => setInspecting(false)}
                  aria-label={UI.close[locale]}
                  className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-[#232732] bg-[#090A0D]/85 text-[#ECEEF2] press-scale"
                >
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4 font-mono text-[11px] text-[#5D6474]">
          <span>
            {scene.file} · {scene.asset.width} x {scene.asset.height}
          </span>
          <span className="hidden sm:block">{UI.hint[locale]}</span>
        </div>
      </motion.div>

      {/* Subsystem selector + active detail */}
      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        <LayoutGroup id="desktop-subsystems">
          <ol className="border-t border-[#232732] lg:col-span-5">
            {items.map((item, index) => {
              const isActive = item.id === active.id;
              return (
                <li key={item.id} className="border-b border-[#232732]">
                  <button
                    type="button"
                    onClick={() => select(item.id)}
                    aria-pressed={isActive}
                    className="relative isolate grid w-full grid-cols-[2rem_1fr] items-baseline gap-x-3 px-3 py-4 text-left"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="desktop-subsystem-bg"
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 bg-[#111318]"
                        transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                      >
                        <span className="absolute inset-y-0 left-0 w-px bg-[#10B981]" />
                      </motion.span>
                    )}
                    <span
                      className={`font-mono text-[11px] transition-colors duration-200 ${
                        isActive ? "text-[#10B981]" : "text-[#5D6474]"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`block text-[15px] font-semibold tracking-[-0.01em] transition-colors duration-200 ${
                          isActive ? "text-[#ECEEF2]" : "text-[#B4BAC6] hover:text-[#ECEEF2]"
                        }`}
                      >
                        {item.title}
                      </span>
                      <span className="mt-1 block truncate font-mono text-[11px] text-[#5D6474]">{item.tech}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </LayoutGroup>

        <div className="lg:col-span-7" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              initial={{ opacity: 0, transform: reduce ? "none" : "translateY(8px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={{ opacity: 0, transform: reduce ? "none" : "translateY(-4px)" }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
            >
              <p className="font-mono text-[11px] text-[#10B981]">{active.badge[locale]}</p>
              <h3 className="mt-3 font-display text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#ECEEF2]">
                {active.title}
              </h3>
              <p className="mt-4 max-w-[62ch] text-pretty text-[15px] leading-relaxed text-[#B4BAC6]">
                {active.summary[locale]}
              </p>
              <ul className="mt-6 space-y-3">
                {active.details.slice(0, 2).map((detail, i) => (
                  <li key={i} className="grid grid-cols-[1.25rem_1fr] gap-x-2 text-[14px] leading-relaxed text-[#8E95A5]">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-3 bg-[#10B981]" />
                    <span className="max-w-[60ch]">{detail[locale]}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>

          {repoLinks.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-[#232732] pt-6">
              {repoLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-[#232732] px-3.5 py-1.5 text-[13px] text-[#ECEEF2] transition-colors duration-150 hover:border-[#343a48] hover:bg-[#111318] press-scale"
                >
                  <GithubLogo size={14} aria-hidden="true" />
                  {link.label[locale]}
                  <ArrowUpRight size={12} className="cta-arrow cta-arrow-diag text-[#8E95A5]" aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
