/**
 * "A los dos" (Olimpo v2.19, `app/src/warp/fusion.ts`): two still portals that
 * merge into one. A pure function of the progress p (0-1), so letting go halfway
 * is just walking p back to 0. Anticipation, approach, a spiral with a gas bridge
 * and mutual lensing, contact and settling; the merged hole ends 30 % bigger.
 */

export const FUSION_MS = 500;
export const FUSION_GROWTH = 0.3;

export interface FusionState {
  /** Distance between centres (px). */
  sep: number;
  /** Spiral angle (rad). */
  ang: number;
  en: number;
  /** 0 two holes, 1 one. */
  uno: number;
  /** Gravitational wave in the sky (1 to 0). */
  onda: number;
  /** Damped wobble of the merged shadow. */
  oval: number;
  /** Radius of each hole (px); at the end, the merged one. */
  R: number;
}

const cl = (x: number) => Math.min(1, Math.max(0, x));
const io = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const A = 0.12;
const B = 0.28;
const C = 0.58;
const D = 0.64;

export function fusionAt(p: number, sep0: number, Rb: number): FusionState {
  const t = cl(p);
  const e: FusionState = { sep: sep0, ang: 0, en: 0.55, uno: 0, onda: 0, oval: 0, R: Rb };
  if (t <= 0) return e;
  if (t < A) {
    e.en = 0.55 + 0.4 * io(t / A);
  } else if (t < B) {
    e.sep = lerp(sep0, Math.min(sep0, 5 * Rb), io((t - A) / (B - A)));
    e.en = 0.95;
  } else if (t < C) {
    const k = (t - B) / (C - B);
    e.sep = lerp(Math.min(sep0, 5 * Rb), 1.25 * Rb, Math.pow(k, 1.6));
    e.ang = k * k * Math.PI * 1.8;
    e.en = 0.95;
  } else if (t < D) {
    const k = (t - C) / (D - C);
    e.sep = lerp(1.25 * Rb, 0, io(k));
    e.ang = Math.PI * 1.8 + k * 0.5;
    e.uno = k;
    e.en = 1;
  } else {
    const k = (t - D) / (1 - D);
    const s = k * 1.6;
    e.sep = 0;
    e.ang = Math.PI * 1.8 + 0.5;
    e.uno = 1;
    e.onda = 1 - k;
    e.oval = 0.16 * Math.exp(-s * 3.2) * Math.cos(s * 15) * (1 - k);
    e.R = Rb * (1 + FUSION_GROWTH * io(cl(s / 0.4)));
    e.en = 0.8;
  }
  return e;
}
