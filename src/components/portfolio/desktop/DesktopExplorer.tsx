"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight, CornersIn, CornersOut, GithubLogo } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import type { Locale } from "@/lib/i18n-context";
import { LINUX_DESKTOP_SHOWCASE, SELECTED_CASE_STUDIES } from "@/content/portfolio-data";
import { ASSETS } from "@/content/assets";
import type { LinuxDesktopShowcaseItem } from "@/content/types";
import { EASE_OUT, SPRING_CAMERA, SPRING_LAYOUT, revealProps } from "@/lib/motion";
import { BODY, CONFIG, LAURA, LiveDesktop } from "./live/LiveDesktop";
import { RgbRig } from "./live/RgbRig";
import { LauraVoiceScene } from "./live/LauraVoiceScene";

/* -------------------------------------------------------------------------- */
/* Scene geometry: desktop pixels (1920 x 1080) shared with the live scene.   */
/* -------------------------------------------------------------------------- */

type SceneId = "live" | "rig" | "drawer" | "laura";

type Focus = { scene: SceneId; x: number; y: number; zoom: number };

const pct = (x: number, y: number) => ({ x: (x / 1920) * 100, y: (y / 1080) * 100 });

/** Where the camera travels for each subsystem (percent of frame, zoom factor). */
const FOCUS: Record<string, Focus> = {
  "gargantua-shader": { scene: "live", x: 84, y: 14, zoom: 1.55 },
  "celestial-desktop": { scene: "live", x: 50, y: 50, zoom: 1 },
  "health-planet": { scene: "live", ...pct(BODY.x + 60, BODY.y + 20), zoom: 2 },
  "rgb-sync": { scene: "rig", x: 50, y: 50, zoom: 1 },
  "laura-voice": { scene: "laura", x: 50, y: 50, zoom: 1 },
  "laura-drawer": { scene: "drawer", x: 50, y: 50, zoom: 1 },
};

/** Numbered hotspot pins, placed next to the element they describe. */
const PINS: Record<SceneId, { id: string; x: number; y: number }[]> = {
  live: [
    { id: "gargantua-shader", ...pct(1470, 330) },
    { id: "celestial-desktop", ...pct(1010, 700) },
    { id: "health-planet", ...pct(BODY.x - 60, BODY.y - 56) },
    { id: "rgb-sync", ...pct(CONFIG.x - 46, CONFIG.y - 50) },
    { id: "laura-voice", ...pct(LAURA.x + 52, LAURA.y - 56) },
    { id: "laura-drawer", ...pct(30, 435) },
  ],
  rig: [],
  drawer: [{ id: "laura-drawer", x: 73.4, y: 21.5 }],
  laura: [],
};

function focusFor(item: LinuxDesktopShowcaseItem): Focus {
  return FOCUS[item.id] ?? { scene: "live", x: 50, y: 50, zoom: 1 };
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
    en: "Hyprland and my own Quickshell Caelestia 2.5 build, where every service is a celestial body: a raymarched black hole that listens to the music, agents orbiting a local voice AI, my watch as a planet, and peripherals whose protocols I reverse-engineered.",
    es: "Hyprland y mi propia build de Quickshell Caelestia 2.5, donde cada servicio es un cuerpo celeste: un agujero negro con raymarching que escucha la música, agentes orbitando una IA de voz local, mi reloj convertido en planeta y periféricos cuyos protocolos saqué por ingeniería inversa.",
  },
  hint: {
    en: "Click a numbered pin or a subsystem",
    es: "Pulsa un pin numerado o un subsistema",
  },
  caption: {
    en: "Live in your browser: the real Gargantua shader ported to WebGL2 · sample data",
    es: "En vivo en tu navegador: el shader real de Gargantua portado a WebGL2 · datos de ejemplo",
  },
  rigCaption: {
    en: "Animated diagram · packet bytes as written by sync-rgb.py",
    es: "Diagrama animado · bytes de los paquetes tal como los escribe sync-rgb.py",
  },
  lauraCaption: {
    en: "Interactive simulation: Gemini edge glow shader, sub-second Whisper transcription and Kokoro voice pill · SUPER+A",
    es: "Simulación interactiva: shader de borde Gemini, transcripción Whisper y píldora de voz Kokoro · SUPER+A",
  },
  fullscreen: { en: "Full screen", es: "Pantalla completa" },
  exitFullscreen: { en: "Exit full screen", es: "Salir de pantalla completa" },
  healthLink: { en: "See the full health system", es: "Ver el sistema de salud completo" },
} satisfies Record<string, Record<Locale, string>>;

export function DesktopExplorer() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const items = LINUX_DESKTOP_SHOWCASE;
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [fullscreen, setFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCanFullscreen(Boolean(document.fullscreenEnabled));
    const onChange = () => setFullscreen(document.fullscreenElement === shellRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId));
  const active = items[activeIndex];
  if (!active) return null;

  const focus = focusFor(active);
  const liveFocus = focus.scene === "live" && !fullscreen ? focus : { ...focus, zoom: 1 };
  const camera = cameraTransform(liveFocus);
  const drawer = ASSETS.systems.lauraDrawer;

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void shellRef.current?.requestFullscreen();
  };

  const systemsStudy = SELECTED_CASE_STUDIES.find((study) => study.category === "systems");
  const repoLinks = active.links ?? systemsStudy?.links.filter((link) => link.kind === "github") ?? [];

  const pinButton = (pin: { id: string; x: number; y: number }, pinTransform: string) => {
    const index = items.findIndex((item) => item.id === pin.id);
    const item = items[index];
    if (!item) return null;
    const isActive = pin.id === active.id;
    return (
      <motion.button
        key={pin.id}
        type="button"
        onClick={() => setActiveId(pin.id)}
        aria-label={`${index + 1}. ${item.title}`}
        aria-pressed={isActive}
        className="group absolute z-10 grid h-7 w-7 place-items-center rounded-full"
        style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        initial={{ transform: "translate(-50%, -50%) scale(1)" }}
        animate={{ transform: reduce ? "translate(-50%, -50%) scale(1)" : pinTransform }}
        transition={SPRING_CAMERA}
      >
        {!isActive && <span aria-hidden="true" className="pin-pulse absolute inset-0 rounded-full border border-[#10B981]/70" />}
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
  };

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
        <div ref={shellRef} className={fullscreen ? "flex h-full w-full items-center justify-center bg-[#030304]" : ""}>
          <div
            className={`relative aspect-video w-full overflow-hidden bg-[#030304] ${
              fullscreen ? "max-h-full max-w-[calc(100vh*16/9)]" : "rounded-2xl border border-[#232732]"
            }`}
          >
            {/* Live scene stays mounted so the shader cache is baked only once */}
            <motion.div
              className="absolute inset-0 origin-center will-change-transform"
              initial={{ transform: "translate(0%, 0%) scale(1)" }}
              animate={{ transform: reduce ? "translate(0%, 0%) scale(1)" : camera.frame }}
              transition={SPRING_CAMERA}
            >
              <LiveDesktop paused={focus.scene !== "live"} />
              {PINS.live.map((pin) => pinButton(pin, camera.pin))}
            </motion.div>

            <AnimatePresence initial={false}>
              {focus.scene === "rig" && (
                <motion.div
                  key="rig"
                  className="absolute inset-0 z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                >
                  <RgbRig />
                </motion.div>
              )}
              {focus.scene === "laura" && (
                <motion.div
                  key="laura"
                  className="absolute inset-0 z-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                >
                  <LauraVoiceScene />
                </motion.div>
              )}
              {focus.scene === "drawer" && (
                <motion.div
                  key="drawer"
                  className="absolute inset-0 z-20 bg-[#050608]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                >
                  <img
                    src={drawer.src}
                    alt={drawer.alt[locale]}
                    width={drawer.width}
                    height={drawer.height}
                    draggable={false}
                    className="h-full w-full select-none object-cover"
                  />
                  {PINS.drawer.map((pin) => pinButton(pin, "translate(-50%, -50%) scale(1)"))}
                </motion.div>
              )}
            </AnimatePresence>

            {canFullscreen && (
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={fullscreen ? UI.exitFullscreen[locale] : UI.fullscreen[locale]}
                className="absolute right-3 top-3 z-30 inline-flex items-center gap-1.5 rounded-full border border-[#232732] bg-[#090A0D]/85 px-3 py-1.5 text-[12px] font-medium text-[#ECEEF2] backdrop-blur-md press-scale"
              >
                {fullscreen ? <CornersIn size={13} aria-hidden="true" /> : <CornersOut size={13} aria-hidden="true" />}
                <span className="hidden sm:inline">{fullscreen ? UI.exitFullscreen[locale] : UI.fullscreen[locale]}</span>
              </button>
            )}

            {fullscreen && (
              <ol className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-1 rounded-full border border-[#232732] bg-[#090A0D]/85 p-1 backdrop-blur-md">
                {items.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      aria-pressed={item.id === active.id}
                      className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors duration-150 ${
                        item.id === active.id ? "bg-[#10B981] text-[#04130D]" : "text-[#B4BAC6] hover:text-[#ECEEF2]"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")} {item.title}
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4 font-mono text-[11px] text-[#5D6474]">
          <span>
            {focus.scene === "rig"
              ? UI.rigCaption[locale]
              : focus.scene === "laura"
                ? UI.lauraCaption[locale]
                : UI.caption[locale]}
          </span>
          <span className="hidden shrink-0 sm:block">{UI.hint[locale]}</span>
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
                    onClick={() => setActiveId(item.id)}
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
                {active.details.map((detail, i) => (
                  <li key={i} className="grid grid-cols-[1.25rem_1fr] gap-x-2 text-[14px] leading-relaxed text-[#8E95A5]">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-3 bg-[#10B981]" />
                    <span className="max-w-[60ch]">{detail[locale]}</span>
                  </li>
                ))}
              </ul>
              {active.id === "health-planet" && (
                <a
                  href="#health"
                  className="group mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-[#10B981] hover:text-[#34D399]"
                >
                  {UI.healthLink[locale]}
                  <ArrowDown size={13} className="cta-arrow cta-arrow-down" aria-hidden="true" />
                </a>
              )}
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
