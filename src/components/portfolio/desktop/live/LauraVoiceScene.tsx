"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { ArrowClockwise, CalendarBlank, EnvelopeSimple, Sparkle, Command } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import type { Locale } from "@/lib/i18n-context";
import { ASSETS } from "@/content/assets";

/* -------------------------------------------------------------------------- */
/* Colors & Math from Caelestia Laura overlay (Propuesta E: Borde Gemini)     */
/* -------------------------------------------------------------------------- */

type Rgb = readonly [number, number, number];

const TH = {
  primary: [191, 176, 255] as const, // #bfb0ff (Material 3 primary)
  tertiary: [242, 169, 203] as const, // #f2a9cb (Material 3 tertiary)
  surface: [26, 23, 37] as const,
  on: [235, 231, 246] as const,
  gb: [125, 180, 255] as const, // #7db4ff (Gemini blue)
  gp: [182, 156, 255] as const, // #b69cff (Gemini purple)
  co: [238, 154, 110] as const, // #ee9a6e (Claude orange)
  ca: [246, 197, 138] as const, // #f6c58a (Claude peach)
};

const W = 1280;
const H = 720;
const LTOT = W + H; // Half perimeter: bottom center -> corner -> top center

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const sstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a: Rgb, b: Rgb, t: number): Rgb => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];
const easeInOutCubic = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

function pathPos(s: number): [number, number, number] {
  const h = W / 2;
  if (s < h) return [W / 2 + s, H, 0];
  if (s < h + H) return [W, H - (s - h), -Math.PI / 2];
  return [W - (s - h - H), 0, Math.PI];
}

function palAt(pal: readonly Rgb[], u: number): Rgb {
  const norm = (((u % 1) + 1) % 1) * (pal.length - 1);
  const i = Math.floor(norm);
  const f = norm - i;
  return mix(pal[i] ?? pal[0], pal[Math.min(pal.length - 1, i + 1)] ?? pal[0], f * f * (3 - 2 * f));
}

function glowPoint(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, col: Rgb, a: number) {
  if (a <= 0.002 || r <= 1) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${Math.min(1, a).toFixed(3)})`);
  g.addColorStop(0.35, `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${(Math.min(1, a) * 0.4).toFixed(3)})`);
  g.addColorStop(1, `rgba(${col[0]}, ${col[1]}, ${col[2]}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

function voiceAmp(t: number, isSpeaking: boolean) {
  const f = isSpeaking ? 1.25 : 1;
  const syl = Math.abs(Math.sin(t * 5.2 * f + Math.sin(t * 1.3) * 2));
  const word = 0.5 + 0.5 * Math.sin(t * (isSpeaking ? 1.4 : 1.9) + 0.6);
  const gate = sstep(0.12, 0.5, word);
  return clamp((0.22 + 0.78 * syl) * (0.3 + 0.7 * gate) * (0.82 + 0.18 * Math.sin(t * 13.7)));
}

/* -------------------------------------------------------------------------- */
/* Authentic conversation scenarios                                           */
/* -------------------------------------------------------------------------- */

type StepId = "listen" | "think" | "speak" | "deleg";

interface Scenario {
  id: string;
  name: Record<Locale, string>;
  icon: typeof CalendarBlank;
  agent?: "gemini" | "claude";
  you: Record<Locale, string>;
  her: Record<Locale, string>;
  label: Record<StepId, Record<Locale, string>>;
}

const SCENARIOS: Scenario[] = [
  {
    id: "agenda",
    name: { en: "Calendar", es: "Agenda" },
    icon: CalendarBlank,
    you: {
      en: "Laura, what do I have tomorrow?",
      es: "Laura, ¿qué tengo mañana?",
    },
    her: {
      en: "Tomorrow you have university at 10:00 and the meeting with Marta at 17:00.",
      es: "Mañana tienes clase a las 10:00 y la reunión con Marta a las 17:00.",
    },
    label: {
      listen: { en: "Listening", es: "Escuchando" },
      think: { en: "Checking local calendar", es: "Consultando calendario" },
      speak: { en: "Laura (Kokoro TTS)", es: "Laura (voz Kokoro)" },
      deleg: { en: "Delegating", es: "Delegando" },
    },
  },
  {
    id: "email",
    name: { en: "Email", es: "Correo" },
    icon: EnvelopeSimple,
    you: {
      en: "Laura, check important unread emails",
      es: "Laura, mírame los correos importantes",
    },
    her: {
      en: "You have 2 important emails: university enrollment confirmation and a Hetzner invoice.",
      es: "Tienes 2 correos: confirmación de matrícula y factura mensual de Hetzner.",
    },
    label: {
      listen: { en: "Listening", es: "Escuchando" },
      think: { en: "Workspace MCP · 0 cloud LLM", es: "MCP Workspace · 0 nube" },
      speak: { en: "Laura (Kokoro TTS)", es: "Laura (voz Kokoro)" },
      deleg: { en: "Delegating", es: "Delegando" },
    },
  },
  {
    id: "claude",
    name: { en: "Claude Agent", es: "Agente Claude" },
    icon: Sparkle,
    agent: "claude",
    you: {
      en: "Laura, have Claude refactor the tasks parser",
      es: "Laura, que Claude refactorice el parser de tareas",
    },
    her: {
      en: "Claude is on it. I will notify you as soon as the diff is ready for review.",
      es: "Claude se encarga. Te aviso en cuanto tenga el diff listo para revisar.",
    },
    label: {
      listen: { en: "Listening", es: "Escuchando" },
      think: { en: "Evaluating task tier", es: "Evaluando complejidad" },
      speak: { en: "Laura (Kokoro TTS)", es: "Laura (voz Kokoro)" },
      deleg: { en: "Delegating to Claude", es: "Delegando en Claude" },
    },
  },
];

export function LauraVoiceScene() {
  const { locale } = useLocale();
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inView = useInView(containerRef, { margin: "-5%" });

  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [step, setStep] = useState<StepId>("listen");
  const [manual, setManual] = useState(false);
  const [igniteKey, setIgniteKey] = useState(0);

  const scenario = SCENARIOS[scenarioIdx] ?? SCENARIOS[0];
  const stepRef = useRef<StepId>(step);
  stepRef.current = step;

  // Auto-cycle through states when not locked into manual
  useEffect(() => {
    if (manual || !inView || reduce) return;

    const timings: Record<StepId, number> = {
      listen: 3800,
      think: 1800,
      speak: 4800,
      deleg: 4500,
    };

    const nextState: Record<StepId, StepId> = scenario.agent
      ? { listen: "think", think: "deleg", deleg: "speak", speak: "listen" }
      : { listen: "think", think: "speak", speak: "listen", deleg: "listen" };

    const timer = setTimeout(() => {
      setStep((curr) => {
        const next = nextState[curr] ?? "listen";
        if (next === "listen") {
          setIgniteKey((k) => k + 1);
        }
        return next;
      });
    }, timings[step]);

    return () => clearTimeout(timer);
  }, [step, manual, inView, reduce, scenario.agent]);

  // Restart cycle from scratch
  const handleReplay = useCallback(() => {
    setManual(false);
    setStep("listen");
    setIgniteKey((k) => k + 1);
  }, []);

  // Main canvas animation loop (Borde Gemini)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t0 = performance.now();
    let p = 0; // entry progress: 0 to 1
    let flow = 0;
    let comet = 0;
    let pal: Rgb[] = [TH.gb, TH.gp, TH.tertiary, TH.primary, TH.gb];

    const render = (now: number) => {
      const dt = Math.min(0.064, (now - t0) / 1000);
      t0 = now;

      // Progress animation (takes 1.9s to close the perimeter)
      p = Math.min(1, p + dt / 1.9);
      const easeP = easeInOutCubic(p);
      const d = easeP * LTOT;

      // State-dependent speed and palette
      const currentStep = stepRef.current;
      const isDeleg = currentStep === "deleg";
      const isThink = currentStep === "think";
      const isSpeak = currentStep === "speak";
      const isListen = currentStep === "listen";

      const speed = isDeleg ? 0.2 : isThink ? 0.16 : 0.07;
      flow += dt * speed;

      if (isThink || isDeleg) {
        comet = (comet + dt * (isDeleg ? 0.5 : 0.3)) % 1;
      }

      // Palette interpolation
      let targetPal: Rgb[];
      if (isDeleg) {
        targetPal = [TH.co, TH.ca, [255, 255, 255], TH.ca, TH.co];
      } else if (isThink) {
        targetPal = [TH.gp, TH.tertiary, TH.gb, TH.primary, TH.gp];
      } else {
        targetPal = [TH.gb, TH.gp, TH.tertiary, TH.primary, TH.gb];
      }
      for (let i = 0; i < 5; i++) {
        pal[i] = mix(pal[i] ?? TH.gb, targetPal[i] ?? TH.gb, Math.min(1, dt * 3.5));
      }

      // Voice modulation
      const tSec = now / 1000;
      const amp = voiceAmp(tSec, isSpeak);
      const g = (isListen || isSpeak) ? amp : 0.25;

      const breathe = 0.5 + 0.5 * Math.sin(tSec * 1.5);
      const base = (0.52 + 0.5 * g) * (0.92 + 0.08 * breathe);
      const depth0 = 84 + 190 * g;

      // Clear canvas
      ctx.clearRect(0, 0, W, H);

      // Draw perimeter strips
      const stepPx = 10;
      ctx.globalCompositeOperation = "lighter";

      for (let side = 0; side < 2; side++) {
        for (let s = stepPx / 2; s < d; s += stepPx) {
          const [x0, y, th] = pathPos(s);
          const x = side ? W - x0 : x0;
          const theta = side ? -th : th;

          const fSoft = sstep(d, d - 190, s);
          let alpha = base * fSoft * (0.9 + 0.1 * Math.sin(s * 0.017 - tSec * 2.2));
          if (isThink || isDeleg) {
            alpha += 0.55 * Math.exp(-Math.pow((s - comet * LTOT) / 95, 2));
          }

          if (alpha < 0.004) continue;

          const fDep = sstep(d, d - 240, s);
          let dep = depth0 * (s < W / 2 ? 1.2 : 1) * (0.28 + 0.72 * fDep);
          dep *= 1 + 0.16 * amp * Math.sin(s * 0.02 - tSec * 5);
          if (isThink || isDeleg) {
            dep *= 1 + 0.5 * Math.exp(-Math.pow((s - comet * LTOT) / 95, 2));
          }

          if (dep < 2) continue;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(theta);

          const col = palAt(pal, (s / LTOT) * 0.85 - flow);
          const grad = ctx.createLinearGradient(0, 0, 0, -dep);
          const aClamped = clamp(alpha);

          grad.addColorStop(0, `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${aClamped.toFixed(3)})`);
          grad.addColorStop(0.03, `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${(aClamped * 0.92).toFixed(3)})`);
          grad.addColorStop(0.14, `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${(aClamped * 0.55).toFixed(3)})`);
          grad.addColorStop(0.4, `rgba(${col[0]}, ${col[1]}, ${col[2]}, ${(aClamped * 0.2).toFixed(3)})`);
          grad.addColorStop(1, `rgba(${col[0]}, ${col[1]}, ${col[2]}, 0)`);

          ctx.fillStyle = grad;
          ctx.fillRect(-stepPx / 2, -dep, stepPx, dep);
          ctx.restore();
        }
      }

      // Ignition flash at bottom center when spawning
      const ign = Math.max(0, 1 - p * 2.2);
      if (ign > 0.005) {
        glowPoint(ctx, W / 2, H, 220 * (1 + p), palAt(pal, 0), 0.7 * ign);
      }

      // Symmetrical bright leading heads while wrapping
      const head = (1 - sstep(0.9, 1, p)) * (p > 0.003 ? 1 : 0);
      if (head > 0.01) {
        for (let side = 0; side < 2; side++) {
          const [x0, y] = pathPos(Math.min(d, LTOT - 1));
          const x = side ? W - x0 : x0;
          const inx = y === H ? 0 : x0 === W ? (side ? 14 : -14) : 0;
          const iny = y === H ? -10 : y === 0 ? 10 : 0;
          glowPoint(ctx, x + inx, y + iny, 140, mix(palAt(pal, (d / LTOT) * 0.85 - flow), [255, 255, 255], 0.55), 0.75 * head);
        }
      }

      ctx.globalCompositeOperation = "source-over";

      if (inView && !reduce) {
        raf = requestAnimationFrame(render);
      }
    };

    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [igniteKey, inView, reduce]);

  // Pill active color
  const pillColor =
    step === "deleg"
      ? "#EE9A6E"
      : step === "think"
      ? "#F2A9CB"
      : "#BFB0FF";

  return (
    <div ref={containerRef} className="relative h-full w-full select-none overflow-hidden bg-[#07060B]">
      {/* Real Hyprland desktop background */}
      <img
        src={ASSETS.systems.desktopIcy.src}
        alt={ASSETS.systems.desktopIcy.alt[locale]}
        width={1920}
        height={1080}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover opacity-80"
      />

      {/* Subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-radial-[at_50%_50%] from-transparent via-[#07060B]/30 to-[#07060B]/70" />

      {/* Screen Edge Glow Canvas (Borde Gemini) */}
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="pointer-events-none absolute inset-0 h-full w-full object-fill"
      />

      {/* Top Controls: Scenarios & SUPER+A re-trigger (padded on right for fullscreen toggle) */}
      <div className="absolute left-4 right-4 top-4 z-20 flex flex-wrap items-center justify-between gap-2 text-xs pr-32 sm:pr-40">
        {/* Scenario Picker */}
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-[#0F1016]/80 p-1 backdrop-blur-md">
          {SCENARIOS.map((sc, idx) => {
            const Icon = sc.icon;
            const active = idx === scenarioIdx;
            return (
              <button
                key={sc.id}
                type="button"
                onClick={() => {
                  setScenarioIdx(idx);
                  setStep("listen");
                  setManual(false);
                  setIgniteKey((k) => k + 1);
                }}
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] transition-colors ${
                  active
                    ? "bg-[#10B981] text-[#04130D] font-semibold"
                    : "text-[#B4BAC6] hover:text-white"
                }`}
              >
                <Icon size={12} weight={active ? "bold" : "regular"} />
                <span>{sc.name[locale]}</span>
              </button>
            );
          })}
        </div>

        {/* State Pill & Replay */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 rounded-full border border-white/10 bg-[#0F1016]/80 p-1 backdrop-blur-md">
            {(["listen", "think", "speak", ...(scenario.agent ? ["deleg" as const] : [])] as StepId[]).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStep(st);
                  setManual(true);
                }}
                className={`rounded-full px-2 py-0.5 font-mono text-[10.5px] transition-colors ${
                  step === st
                    ? "bg-white/20 text-white font-medium"
                    : "text-[#8E95A5] hover:text-white"
                }`}
              >
                {st === "listen"
                  ? locale === "es" ? "Escucha" : "Listen"
                  : st === "think"
                  ? locale === "es" ? "Piensa" : "Think"
                  : st === "speak"
                  ? locale === "es" ? "Habla" : "Speak"
                  : locale === "es" ? "Delega" : "Delegate"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleReplay}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#10B981]/40 bg-[#0F1016]/85 px-3 py-1 font-mono text-[11px] font-medium text-[#10B981] backdrop-blur-md hover:border-[#10B981] press-scale"
            title="SUPER+A"
          >
            <Command size={12} weight="bold" />
            <span>SUPER+A</span>
            <ArrowClockwise size={11} className="ml-0.5" />
          </button>
        </div>
      </div>

      {/* Floating Subtitle Pill (Laura UI from LauraOverlay.qml) */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 w-[92%] max-w-[620px] -translate-x-1/2">
        <div
          className="relative overflow-hidden rounded-[22px] border border-white/12 bg-[#14121F]/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300"
          style={{
            boxShadow: `0 0 40px -10px ${pillColor}22, 0 20px 50px rgba(0,0,0,0.8)`,
          }}
        >
          {/* Subtle top light reflection */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-white/8 to-transparent" />

          {/* Status Row */}
          <div className="relative mb-2 flex items-center justify-between font-mono text-[11px] tracking-wider">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full transition-colors duration-300"
                style={{ backgroundColor: pillColor, boxShadow: `0 0 8px ${pillColor}` }}
              />
              <span className="font-semibold uppercase text-[#C4BED4]">
                {scenario.label[step][locale]}
              </span>
            </div>

            {/* 4-bar equalizer animated with voice amplitude */}
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3].map((i) => {
                const isActive = step === "listen" || step === "speak";
                return (
                  <span
                    key={i}
                    className="w-[2.5px] rounded-full transition-all duration-150"
                    style={{
                      backgroundColor: pillColor,
                      height: isActive ? `${4 + ((i * 3 + (step === "speak" ? 9 : 5)) % 10)}px` : "3px",
                      opacity: isActive ? 0.95 : 0.4,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Transcription (Alberto's prompt) */}
          <div className="relative text-[14.5px] leading-snug text-[#A7A0BC]">
            “{scenario.you[locale]}”
          </div>

          {/* Laura's Response */}
          {(step === "speak" || step === "deleg") && (
            <div className="relative mt-2 text-[19px] font-medium leading-snug text-[#F3EEFF]">
              {scenario.her[locale]}
            </div>
          )}

          {/* Delegating bottom gradient beam */}
          {step === "deleg" && (
            <div className="absolute inset-x-0 bottom-0 h-[2.5px] overflow-hidden bg-white/5">
              <div
                className="h-full w-1/2 bg-gradient-to-r from-transparent via-[#EE9A6E] to-transparent animate-pulse"
                style={{
                  animationDuration: "1.4s",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
