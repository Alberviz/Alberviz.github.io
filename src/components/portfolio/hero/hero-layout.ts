import type { BhLayout, Palette } from "../desktop/live/gargantua-renderer";

/**
 * The hero poster (LCP) and the live WebGL canvas must frame the same scene,
 * so both are defined here: same aspect ratio, same black hole placement
 * (as fractions of the frame), same space color.
 */
const WIDE_MARGINS = { left: 3.8, right: 4.2, up: 2.8, down: 2.6 };
const TALL_MARGINS = { left: 3.8, right: 3.8, up: 2.8, down: 2.6 };

export type HeroVariant = "wide" | "tall";

export const HERO_VARIANTS: Record<
  HeroVariant,
  {
    aspect: number;
    maxWidth: number;
    minWidth: number;
    poster: string;
    place: (w: number, h: number) => BhLayout;
  }
> = {
  wide: {
    aspect: 16 / 9,
    maxWidth: 1600,
    minWidth: 960,
    poster: "/media/hero/gargantua-wide.webp",
    place: (w, h) => ({ cx: 0.75 * w, cy: 0.46 * h, shadow: 0.165 * h, margins: WIDE_MARGINS }),
  },
  tall: {
    aspect: 9 / 16,
    maxWidth: 720,
    minWidth: 540,
    poster: "/media/hero/gargantua-tall.webp",
    place: (w, h) => ({ cx: 0.55 * w, cy: 0.27 * h, shadow: 0.19 * w, margins: TALL_MARGINS }),
  },
};

/** Space color behind the disk: #07080B, as written to the framebuffer. */
export const HERO_BG: readonly [number, number, number] = [7 / 255, 8 / 255, 11 / 255];

/** Landscape layout from 5:4 upwards; everything narrower gets the portrait frame. */
export const WIDE_QUERY = "(min-aspect-ratio: 5/4)";

/** Warm accretion disk (the page accent, #F2B36F, as its mid tone). */
export const HERO_PALETTE: Palette = {
  primary: [0xf2, 0xb3, 0x6f],
  onPrimaryContainer: [0xff, 0xd8, 0xa8],
  primaryContainer: [0xe0, 0x82, 0x3a],
  tertiary: [0xb8, 0x4a, 0x22],
  onSurface: [0xff, 0xf0, 0xdc],
};
