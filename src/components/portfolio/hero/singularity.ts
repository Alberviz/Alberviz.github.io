/**
 * Where the hero's black hole collapsed, shared with the section that comes
 * out of it (the #casos heading is born from that point, like a file that
 * leaves a Warp portal through a white hole on the other side).
 *
 * Plain module state: written by HeroSection when it measures, read inside
 * scroll transforms (no React renders).
 */
export const singularity = {
  /** False when the hero is still (poster, reduced motion): nothing is born from it. */
  on: false,
  /** Point of the collapse inside the pinned screen, in px. */
  x: 0,
  y: 0,
  /** Scroll distance while the hero screen stays pinned (track height minus screen). */
  travel: 0,
};

/** The collapse point in viewport coordinates for a given scroll position. */
export function singularityOnScreen(scrollY: number) {
  return { x: singularity.x, y: singularity.y - Math.max(0, scrollY - singularity.travel) };
}
