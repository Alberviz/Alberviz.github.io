/**
 * Motion tokens & easing curves adhering to Emil Kowalski's animation craft
 * and design-taste-frontend standards.
 *
 * Rules encoded here:
 * - Custom curves only (never ease-in on UI).
 * - Springs for anything interruptible or pointer-driven.
 * - Pointer effects only on fine pointers, and never under reduced motion.
 * - Transforms are composed as full transform strings (hardware accelerated).
 */

import { useCallback, useEffect, useState } from "react";
import type React from "react";
import {
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

export const DURATION = {
  press: 0.14,
  micro: 0.18,
  ui: 0.24,
  swap: 0.32,
  reveal: 0.7,
} as const;

export const SPRING_SNAPPY = {
  type: "spring",
  duration: 0.45,
  bounce: 0.15,
} as const;

export const SPRING_GENTLE = {
  type: "spring",
  stiffness: 110,
  damping: 18,
} as const;

export const SPRING_BOUNCY = {
  type: "spring",
  stiffness: 300,
  damping: 20,
} as const;

/** Shared layoutId indicators (nav pills, tabs, selectors). Crisp, no overshoot. */
export const SPRING_LAYOUT = {
  type: "spring",
  stiffness: 520,
  damping: 42,
  mass: 0.7,
} as const;

/** Camera moves across a large artifact (desktop explorer zoom). Calm, zero bounce. */
export const SPRING_CAMERA = {
  type: "spring",
  duration: 0.9,
  bounce: 0,
} as const;

/** Decorative pointer tracking. Soft momentum so it never feels glued to the cursor. */
export const SPRING_POINTER = {
  stiffness: 150,
  damping: 20,
  mass: 0.6,
} as const;

/** Number tickers (balances, totals). Settles fast, exact final value. */
export const SPRING_NUMBER = {
  stiffness: 220,
  damping: 32,
  mass: 0.8,
} as const;

export const Z_LAYERS = {
  canvas: 0,
  surface: 1,
  card: 10,
  stickyHeader: 30,
  overlay: 40,
  modal: 50,
  popover: 60,
  toast: 70,
  noise: 99,
} as const;

/**
 * Viewport reveal preset: rises 14px from an already-visible-ish state.
 * Reduced motion keeps the opacity fade and drops the movement.
 */
export function revealProps(reduce: boolean | null, delay = 0) {
  return {
    initial: { opacity: 0, transform: reduce ? "none" : "translateY(14px)" },
    whileInView: { opacity: 1, transform: "translateY(0px)" },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: DURATION.reveal, ease: EASE_OUT, delay },
  } as const;
}

/** Crossfade preset for swapped media (screens, scenes). Opacity + tiny scale only. */
export function swapProps(reduce: boolean | null) {
  return {
    initial: { opacity: 0, transform: reduce ? "none" : "scale(0.985)" },
    animate: { opacity: 1, transform: "scale(1)" },
    exit: { opacity: 0, transform: reduce ? "none" : "scale(1.01)" },
    transition: { duration: DURATION.swap, ease: EASE_OUT },
  } as const;
}

/** True only for devices that can actually hover with a precise pointer. */
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return fine;
}

/**
 * Subtle cursor-tilted depth for a showcase surface plus a pointer-following
 * illumination layer. Driven entirely by motion values (zero React renders
 * per frame), gated to fine pointers, disabled under reduced motion.
 */
export function usePointerDepth(maxTiltDeg = 3) {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const enabled = fine && !reduce;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);

  const sx = useSpring(px, SPRING_POINTER);
  const sy = useSpring(py, SPRING_POINTER);
  const sgx = useSpring(glowX, SPRING_POINTER);
  const sgy = useSpring(glowY, SPRING_POINTER);

  const rotateX = useTransform(sy, (v) => -v * maxTiltDeg * 2);
  const rotateY = useTransform(sx, (v) => v * maxTiltDeg * 2);

  const transform = useMotionTemplate`perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  const glowTransform = useMotionTemplate`translate3d(${sgx}px, ${sgy}px, 0)`;

  /** Parallax offset for a layer floating above the surface (in px per unit of depth). */
  const parallaxX = useTransform(sx, (v) => v * 18);
  const parallaxY = useTransform(sy, (v) => v * 18);
  const parallaxTransform = useMotionTemplate`translate3d(${parallaxX}px, ${parallaxY}px, 0)`;

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width;
      const relY = (event.clientY - rect.top) / rect.height;
      px.set(relX - 0.5);
      py.set(relY - 0.5);
      glowX.set(event.clientX - rect.left);
      glowY.set(event.clientY - rect.top);
    },
    [enabled, px, py, glowX, glowY]
  );

  const onPointerLeave = useCallback(() => {
    px.set(0);
    py.set(0);
  }, [px, py]);

  return {
    enabled,
    transform,
    glowTransform,
    parallaxTransform,
    handlers: { onPointerMove, onPointerLeave },
  };
}
