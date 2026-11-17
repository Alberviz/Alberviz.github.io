"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowCounterClockwise, Check, File, FileImage, TextAa } from "@phosphor-icons/react";
import { WARP } from "@/content/olimpo";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import { WARP_BLACK, WARP_COMMON, WARP_VERTEX } from "./warp-shaders";

/**
 * Warp, playable. The real portal shader sits at the top of the stage; the
 * files below fly into it (transform + opacity) and the hole answers with a
 * swallow wave. Runs only on screen, caps the pixel ratio, and under reduced
 * motion draws one still frame and lets the files simply fade.
 */

type Phase = "idle" | "sending" | "sent";

interface PortalHandle {
  swallow: () => void;
  dispose: () => void;
}

function startPortal(canvas: HTMLCanvasElement, still: boolean): PortalHandle | null {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? "shader");
    return sh;
  };
  let prog: WebGLProgram;
  try {
    prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, WARP_VERTEX));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, WARP_COMMON + WARP_BLACK));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  } catch {
    return null;
  }
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = (n: string) => gl.getUniformLocation(prog, n);
  const U = {
    res: u("uRes"),
    c: u("uC"),
    R: u("R"),
    U: u("U"),
    en: u("en"),
    vis: u("vis"),
    pulse: u("pulse"),
    spin: u("spin"),
    pull: u("pull"),
    T: u("T"),
    closing: u("closing"),
  };

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  let w = 0;
  let h = 0;
  const size = () => {
    w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  };
  size();

  const state = { vis: still ? 1 : 0, en: 0.55, pulse: 0, spin: 0, pull: 0, boost: 0 };
  const draw = (t: number) => {
    const R = Math.min(w, h) * 0.075;
    gl.uniform2f(U.res, w, h);
    gl.uniform2f(U.c, w * 0.5, h * 0.3);
    gl.uniform1f(U.R, R);
    gl.uniform1f(U.U, dpr);
    gl.uniform1f(U.en, Math.min(1, state.en + state.boost));
    gl.uniform1f(U.vis, state.vis);
    gl.uniform1f(U.pulse, state.pulse);
    gl.uniform1f(U.spin, state.spin);
    gl.uniform1f(U.pull, state.pull);
    gl.uniform1f(U.T, t);
    gl.uniform1f(U.closing, 0);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  if (still) {
    draw(0);
    const ro = new ResizeObserver(() => {
      size();
      draw(0);
    });
    ro.observe(canvas);
    return {
      swallow: () => undefined,
      dispose: () => ro.disconnect(),
    };
  }

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: "60px" });
  io.observe(canvas);
  const ro = new ResizeObserver(size);
  ro.observe(canvas);

  let raf = 0;
  let last = performance.now();
  const t0 = last;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    if (!visible || document.hidden) {
      last = now;
      return;
    }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = (now - t0) / 1000;
    state.vis = Math.min(1, state.vis + dt / 0.9);
    state.en = 0.5 + 0.06 * Math.sin(2.2 * t);
    state.pulse = Math.max(0, state.pulse - dt / 0.9);
    state.boost = Math.max(0, state.boost - dt / 1.6);
    state.spin += dt * (0.5 + 4 * state.pulse);
    state.pull += dt * (0.15 + 1.5 * state.pulse);
    draw(t);
  };
  raf = requestAnimationFrame(frame);

  return {
    swallow: () => {
      state.pulse = 1;
      state.boost = 0.45;
    },
    dispose: () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

const ICONS = [File, FileImage, TextAa];

export function WarpDemo({ locale }: { locale: "en" | "es" }) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tileRefs = useRef<(HTMLLIElement | null)[]>([]);
  const portal = useRef<PortalHandle | null>(null);
  const [gl, setGl] = useState<"pending" | "on" | "off">("pending");
  const [phase, setPhase] = useState<Phase>("idle");
  const [run, setRun] = useState(0);
  const [targets, setTargets] = useState<{ x: number; y: number }[]>([]);
  const autoplayed = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const still = !!reduce || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let handle: PortalHandle | null = null;
    try {
      handle = startPortal(canvas, still);
    } catch {
      handle = null;
    }
    portal.current = handle;
    setGl(handle ? "on" : "off");
    return () => {
      handle?.dispose();
      portal.current = null;
    };
  }, [reduce]);

  const send = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    if (phase === "sent") {
      setPhase("idle");
      setRun((r) => r + 1);
      return;
    }
    if (phase !== "idle") return;
    const s = stage.getBoundingClientRect();
    const cx = s.left + s.width * 0.5;
    const cy = s.top + s.height * 0.3;
    setTargets(
      tileRefs.current.map((el) => {
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return { x: cx - (r.left + r.width / 2), y: cy - (r.top + r.height / 2) };
      })
    );
    setPhase("sending");
    window.setTimeout(() => portal.current?.swallow(), reduce ? 0 : 820);
    window.setTimeout(() => setPhase("sent"), reduce ? 200 : 1500);
  }, [phase, reduce]);

  /* Play once by itself the first time the stage is well in view. */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduce) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !autoplayed.current) {
          autoplayed.current = true;
          window.setTimeout(() => send(), 900);
          io.disconnect();
        }
      },
      { threshold: 0.7 }
    );
    io.observe(stage);
    return () => io.disconnect();
  }, [reduce, send]);

  return (
    <div>
      <div
        ref={stageRef}
        className="warp-stage relative isolate aspect-[3/4] w-full overflow-hidden rounded-[20px] border border-line sm:aspect-[16/10]"
      >
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
        {gl === "off" && <div aria-hidden="true" className="warp-fallback absolute left-1/2 top-[30%]" />}

        {/* Screen edge hint: the portal lives at the top edge of the desktop */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        <ul key={run} className="absolute inset-x-0 bottom-[19%] flex flex-wrap justify-center gap-2 px-4 sm:bottom-[20%] sm:gap-2.5" aria-label={WARP.canvasLabel[locale]}>
          {WARP.files.map((name, i) => {
            const Icon = ICONS[i] ?? File;
            const tgt = targets[i] ?? { x: 0, y: -200 };
            const flying = phase !== "idle";
            return (
              <motion.li
                key={name}
                ref={(el) => {
                  tileRefs.current[i] = el;
                }}
                className="flex h-11 items-center gap-2 rounded-xl border border-ink/15 bg-elevated/90 px-3.5 font-mono text-[12.5px] text-ink shadow-[0_18px_30px_-18px_rgb(0_0_0/0.9)] backdrop-blur-sm"
                initial={run > 0 ? { opacity: 0, transform: reduce ? "none" : "translateY(14px)" } : false}
                animate={
                  !flying
                    ? { opacity: 1, transform: "translate(0px, 0px) scale(1) rotate(0deg)" }
                    : reduce
                      ? { opacity: 0 }
                      : {
                          opacity: [1, 1, 0],
                          transform: [
                            "translate(0px, 0px) scale(1) rotate(0deg)",
                            "translate(0px, 10px) scale(1.03) rotate(0deg)",
                            `translate(${tgt.x}px, ${tgt.y}px) scale(0.12) rotate(${(i - 1) * 40}deg)`,
                          ],
                        }
                }
                transition={
                  flying && !reduce
                    ? { duration: 1.05, delay: i * 0.08, ease: EASE_IN_OUT, times: [0, 0.2, 1] }
                    : { duration: 0.32, delay: run > 0 ? i * 0.06 : 0, ease: EASE_OUT }
                }
              >
                <Icon size={15} aria-hidden="true" className="text-accent" />
                {name}
              </motion.li>
            );
          })}
        </ul>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-ink/10 bg-bg/60 px-4 py-3 backdrop-blur-md sm:px-5">
          <p className="min-w-0 font-mono text-[12px] leading-snug text-muted" aria-live="polite">
            {phase === "sent" ? (
              <span className="inline-flex items-center gap-1.5 text-ink">
                <Check size={13} weight="bold" className="text-accent" aria-hidden="true" />
                {WARP.sent[locale]} · 3 → {locale === "es" ? "móvil" : "phone"}
              </span>
            ) : (
              <span>
                <kbd className="font-mono">Super</kbd> + <kbd className="font-mono">{locale === "es" ? "Espacio" : "Space"}</kbd>
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={send}
            disabled={phase === "sending"}
            className="press-scale inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-accent px-5 text-[14px] font-semibold text-on-accent transition-colors duration-150 hover:bg-accent-pressed disabled:opacity-60"
          >
            {phase === "sent" && <ArrowCounterClockwise size={14} weight="bold" aria-hidden="true" />}
            {phase === "sent" ? WARP.again[locale] : WARP.send[locale]}
          </button>
        </div>
      </div>
    </div>
  );
}
