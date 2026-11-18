"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { ArrowRight } from "@phosphor-icons/react";
import { useLocale } from "@/lib/i18n-context";
import type { Locale } from "@/lib/i18n-context";
import { CASES, CASES_UI, CASE_CTA } from "@/content/pages";
import type { CasePage } from "@/content/pages";
import { EASE_OUT, revealProps, useReducedMotionSafe } from "@/lib/motion";
import { DesktopVisual, LauraVisual, OlimpoVisual, WariVisual } from "./CaseVisuals";
import { singularity, singularityOnScreen } from "./hero/singularity";

/**
 * #casos on the home: one rich preview per case, each with its own composition
 * (Wari in its fog, Olimpo as a wide window with a live portal, Laura centred on
 * a hologram, the desktop with its bytes decoding), a headline, two lines and a
 * clear way into the case page. The visual opens with a clip-path as it enters
 * and drifts against the copy while it crosses the screen.
 */

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const ease3 = (t: number) => 1 - Math.pow(1 - t, 3);
const rot = (x: number, y: number, a: number) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];

/**
 * The #casos heading comes out of the point where the hero's black hole
 * collapsed: a white hole on the other side of the portal. It unwinds from
 * that point to its place as it scrolls in. Still hero or reduced motion: in place.
 */
function BornHeading({ text, reduce }: { text: string; reduce: boolean | null }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const home = useRef({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.36"] });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      let x = el.offsetWidth / 2;
      let y = el.offsetHeight / 2;
      let node: HTMLElement | null = el;
      while (node) {
        x += node.offsetLeft;
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      home.current = { x, y };
      scrollYProgress.set(scrollYProgress.get());
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [scrollYProgress]);

  const off = () => !!reduce || !singularity.on;
  const transform = useTransform(scrollYProgress, (t) => {
    if (off() || t >= 1) return "none";
    const e = ease3(t);
    const sy = window.scrollY;
    const h = singularityOnScreen(sy);
    const nx = home.current.x;
    const ny = home.current.y - sy;
    const turn = 1.3 * (1 - e);
    const [rx, ry] = rot(nx - h.x, ny - h.y, turn);
    const dx = h.x + rx * e - nx;
    const dy = h.y + ry * e - ny;
    return `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, 0) rotate(${(turn * 38).toFixed(1)}deg) scale(${(0.04 + 0.96 * e).toFixed(3)})`;
  });
  const opacity = useTransform(scrollYProgress, (t) => (off() ? 1 : clamp01(t / 0.3)));

  return (
    <motion.h2
      ref={ref}
      className="font-display text-balance text-[clamp(2.2rem,4.4vw,3.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-ink lg:col-span-7"
      style={{ fontVariationSettings: '"opsz" 80', transform, opacity }}
    >
      {text}
    </motion.h2>
  );
}

/**
 * Laura: her case headline is transcribed as you scroll, word by word, like
 * Whisper writing down what you say. The whole sentence stays in the DOM.
 */
function Transcript({ text, reduce }: { text: string; reduce: boolean | null }) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.92", "start 0.42"] });
  const words = text.split(" ");
  return (
    <span ref={ref}>
      {words.map((w, i) => (
        <TranscriptWord key={`${i}-${w}`} word={w} i={i} n={words.length} progress={scrollYProgress} reduce={reduce} />
      ))}
    </span>
  );
}

function TranscriptWord({ word, i, n, progress, reduce }: { word: string; i: number; n: number; progress: MotionValue<number>; reduce: boolean | null }) {
  const heard = useTransform(progress, (t) => (reduce ? 1 : clamp01(t * (n + 1.5) - i)));
  const opacity = useTransform(heard, (h) => 0.16 + 0.84 * h);
  const y = useTransform(heard, (h) => (1 - h) * 6);
  return (
    <>
      <motion.span className="inline-block" style={{ opacity, y }}>
        {word}
      </motion.span>{" "}
    </>
  );
}

const HEX = "0123456789ABCDEF";

/**
 * The desktop: its headline arrives as raw HID bytes and is decoded letter by
 * letter once it is on screen, like the reverse engineering in the case.
 */
function HexDecode({ text, reduce }: { text: string; reduce: boolean | null }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.8 });
  const [shown, setShown] = useState<string | null>(null);

  useEffect(() => {
    if (reduce !== false || !seen) return;
    let raf = 0;
    const t0 = performance.now();
    const letters = Array.from(text);
    const tick = (now: number) => {
      const t = now - t0;
      let done = true;
      const out = letters.map((ch, i) => {
        if (ch === " " || t > 140 + i * 26) return ch;
        done = false;
        return HEX[(Math.floor(t / 55) * 7 + i * 13) % 16];
      });
      setShown(done ? null : out.join(""));
      if (!done) raf = requestAnimationFrame(tick);
    };
    setShown(letters.map((ch, i) => (ch === " " ? ch : HEX[(i * 13) % 16])).join(""));
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, reduce, text]);

  // Before it is seen it already reads as bytes (only with motion on).
  const pending = reduce === false && !seen;
  const visible = pending ? Array.from(text).map((ch, i) => (ch === " " ? ch : HEX[(i * 13) % 16])).join("") : shown;
  return (
    <span ref={ref}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className={visible ? "text-ink/85" : undefined}>
        {visible ?? text}
      </span>
    </span>
  );
}

type Tone = "fog" | "sky" | "holo" | "plain";

const LAYOUT: Record<CasePage["id"], { tone: Tone; flip: boolean; visual: string }> = {
  wari: { tone: "fog", flip: false, visual: "aspect-[5/4] sm:aspect-[4/3]" },
  olimpo: { tone: "sky", flip: true, visual: "aspect-[16/11]" },
  laura: { tone: "holo", flip: false, visual: "aspect-[4/5] sm:aspect-[5/4]" },
  escritorio: { tone: "plain", flip: true, visual: "aspect-[3/4] sm:aspect-[16/11]" },
};

function Visual({ c, locale, hot, enter }: { c: CasePage; locale: Locale; hot: boolean; enter?: MotionValue<number> }) {
  if (c.id === "wari") return <WariVisual locale={locale} split={enter} />;
  if (c.id === "olimpo") return <OlimpoVisual locale={locale} hot={hot} />;
  if (c.id === "laura") return <LauraVisual locale={locale} />;
  return <DesktopVisual locale={locale} />;
}

function Preview({ c, locale, reduce }: { c: CasePage; locale: Locale; reduce: boolean | null }) {
  const ref = useRef<HTMLElement>(null);
  const [hot, setHot] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Function transforms (not ranges): see DESIGN.md, Motion would hand ranges to a page-wide ScrollTimeline.
  const drift = useTransform(scrollYProgress, (v) => (0.5 - v) * 48);
  // Each case enters in its own way, scrubbed by the visual's own way into the screen.
  const visRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: visIn } = useScroll({ target: visRef, offset: ["start end", "center center"] });
  const enter = useTransform(visIn, (v) => (reduce ? 1 : ease3(clamp01((v - 0.2) / 0.7))));
  // Olimpo: the window lies back like a sky above you and rises to face you.
  const sky = useTransform(enter, (e) =>
    c.id === "olimpo" && !reduce ? `perspective(1300px) rotateX(${(24 * (1 - e)).toFixed(2)}deg) scale(${(0.93 + 0.07 * e).toFixed(4)})` : "none"
  );
  const L = LAYOUT[c.id];
  const fog = L.tone === "fog";
  const titleId = `case-${c.id}-title`;

  return (
    <article
      ref={ref}
      id={`caso-${c.id}`}
      aria-labelledby={titleId}
      data-tone={L.tone}
      data-surface={fog ? "wari" : undefined}
      className={`case-preview relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12 ${fog ? "case-fog font-wari" : ""}`}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHot(true)}
      onPointerLeave={() => setHot(false)}
    >
      {/* Copy */}
      <motion.div {...revealProps(reduce)} className={`relative z-[1] lg:col-span-5 ${L.flip ? "lg:order-2 lg:col-start-8" : ""}`}>
        <p className={`flex items-baseline gap-3 ${fog ? "text-[color:var(--wari-ink)]" : "text-ink"}`}>
          <span className={`font-mono text-[12px] tabular-nums ${fog ? "text-[color:var(--wari-action)]" : "text-accent"}`}>{c.n}</span>
          <span className={`text-[1.05rem] font-semibold tracking-[-0.01em] ${fog ? "font-wari-display" : "font-display"}`}>{c.name}</span>
        </p>
        <h3
          id={titleId}
          className={`mt-4 max-w-[18ch] text-balance text-[clamp(1.9rem,3.6vw,3.1rem)] font-semibold leading-[1.02] tracking-[-0.035em] ${
            fog ? "font-wari-display text-[color:var(--wari-ink)]" : "font-display text-ink"
          }`}
          style={fog ? undefined : { fontVariationSettings: '"opsz" 80' }}
        >
          {c.id === "laura" ? (
            <Transcript text={c.headline[locale]} reduce={reduce} />
          ) : c.id === "escritorio" ? (
            <HexDecode text={c.headline[locale]} reduce={reduce} />
          ) : (
            c.headline[locale]
          )}
        </h3>
        <p className={`mt-5 max-w-[46ch] text-pretty text-[15.5px] leading-relaxed ${fog ? "text-[color:var(--wari-ink-2)]" : "text-muted"}`}>
          {c.lines[locale]}
        </p>
        <Link
          href={c.path}
          className={`group press-scale mt-8 inline-flex h-12 items-center gap-2 rounded-full px-6 text-[15px] font-semibold transition-colors duration-150 ${
            fog
              ? "bg-[color:var(--wari-action)] text-[color:var(--wari-on-action)] hover:bg-[#1F3A69]"
              : "bg-accent text-on-accent hover:bg-accent-pressed"
          }`}
          aria-label={`${(CASE_CTA.byPath[c.path] ?? CASE_CTA.fallback)[locale]}: ${c.name}`}
        >
          {(CASE_CTA.byPath[c.path] ?? CASE_CTA.fallback)[locale]}
          <ArrowRight size={16} weight="bold" className="cta-arrow" aria-hidden="true" />
        </Link>
      </motion.div>

      {/* Visual: a real fragment of the case; the whole of it is also a way in (mouse only, the CTA is the keyboard stop) */}
      <motion.div className={`relative lg:col-span-7 ${L.flip ? "lg:order-1 lg:col-start-1" : ""}`} style={reduce ? undefined : { y: drift }}>
        <motion.div ref={visRef} style={{ transform: sky, transformOrigin: "50% 100%" }}>
        <motion.div
          className={`case-visual relative w-full ${L.visual}`}
          initial={reduce ? false : { clipPath: "inset(7% 7% 7% 7% round 28px)", opacity: 0.4 }}
          whileInView={{ clipPath: "inset(0% 0% 0% 0% round 28px)", opacity: 1 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.9, ease: EASE_OUT }}
        >
          <Visual c={c} locale={locale} hot={hot} enter={enter} />
          <Link href={c.path} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-[2]" />
        </motion.div>
        </motion.div>
      </motion.div>
    </article>
  );
}

export function CaseReel() {
  const { locale } = useLocale();
  const reduce = useReducedMotionSafe();

  return (
    <section id="casos" data-scene="cases" className="case-reel relative isolate">
      <div className="mx-auto max-w-7xl px-5 pb-[var(--spacing-section)] pt-[calc(var(--spacing-section)*0.8)] sm:px-8">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <BornHeading text={CASES_UI.heading[locale]} reduce={reduce} />
        </div>

        <div className="mt-16 space-y-24 lg:mt-24 lg:space-y-36">
          {CASES.map((c) => (
            <Preview key={c.id} c={c} locale={locale} reduce={reduce} />
          ))}
        </div>
      </div>
    </section>
  );
}
