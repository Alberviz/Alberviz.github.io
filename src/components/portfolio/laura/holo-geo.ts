/**
 * Timings and curves of the real holographic layer (HoloGeo in my Quickshell
 * config), in ms, plus the logical stage the recreation is drawn on.
 */

export const T = {
  micro: 110, // hover, press
  rapido: 180, // fades, retracting a thread
  medio: 280, // state changes, a row coming in
  lento: 420, // drawing a thread, falling into the trash
  vuelo: 520, // a panel flying out of the pill
  salida: 330, // a panel flying back to the pill
  barrido: 620, // the light line that sweeps a panel when it lands
  stepPanel: 85, // panels born in the same instant
  stepExit: 55,
  stepRow: 26, // rows of a list
  maxStep: 340, // cap so a long cascade never drags
} as const;

/** The real curves, except that exits use the portfolio's in-out instead of a plain ease-in. */
export const EASE = {
  enter: "cubic-bezier(0.215, 0.61, 0.355, 1)", // OutCubic
  change: "cubic-bezier(0.645, 0.045, 0.355, 1)", // InOutCubic
  fade: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // OutQuad
  sine: "cubic-bezier(0.445, 0.05, 0.55, 0.95)", // InOutSine
  exit: "cubic-bezier(0.77, 0, 0.175, 1)",
  settle: "cubic-bezier(0.34, 1.35, 0.64, 1)", // small overshoot, a settle and not a spring
} as const;

export const STAGE = { w: 1120, h: 640 } as const;

export interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const rowStep = (i: number) => Math.min(T.maxStep, i * T.stepRow);

/** Panel boxes on the wide stage (logical px). In the narrow layout panels stack. */
export const BOX = {
  list: { x: 36, y: 34, w: 372, h: 416 },
  viewer: [
    { x: 452, y: 46, w: 340, h: 304 },
    { x: 740, y: 186, w: 344, h: 304 },
  ],
  agenda: { x: 56, y: 70, w: 1008, h: 352 },
  dupes: { x: 40, y: 52, w: 408, h: 244 },
  confirm: { x: 494, y: 40, w: 440, h: 332 },
  tv: { x: 300, y: 56, w: 520, h: 340 },
} as const satisfies Record<string, Box | readonly Box[]>;

/** Pill and trash on the wide stage. */
export const PILL = { x: 320, y: 556, w: 480, h: 54 } as const;
export const TRASH = { x: 1034, y: 548, s: 52 } as const;
