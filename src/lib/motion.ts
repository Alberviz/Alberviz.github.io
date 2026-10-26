/**
 * Motion tokens & easing curves adhering to Emil Kowalski's animation craft
 * and design-taste-frontend standards.
 */

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

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
