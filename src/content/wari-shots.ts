import type { LocalizedText } from "./types";

/**
 * Real screenshots of the Wari app shown in the portal. Dimensions are exact
 * (they reserve the layout, no CLS). To swap in new captures, only edit this list.
 *
 * Provisional set: old dark captures from public/media/krakount (no Next badge).
 * Replace with public/media/wari/* (Cristal theme) when they exist.
 */
export interface WariShot {
  src: string;
  width: number;
  height: number;
  alt: LocalizedText;
}

export const WARI_SHOTS: WariShot[] = [
  {
    src: "/media/krakount/shot-balances.webp",
    width: 780,
    height: 1688,
    alt: {
      en: "Wari screen listing who owes what, with a button to settle each debt",
      es: "Pantalla de Wari con quién debe qué y un botón para saldar cada deuda",
    },
  },
  {
    src: "/media/krakount/shot-receipt.webp",
    width: 780,
    height: 1688,
    alt: {
      en: "Wari screen splitting a supermarket receipt, product by product",
      es: "Pantalla de Wari repartiendo un ticket del súper producto a producto",
    },
  },
  {
    src: "/media/krakount/shot-itinerary.webp",
    width: 780,
    height: 1688,
    alt: {
      en: "Wari screen with a trip itinerary, a map and a checklist for the day",
      es: "Pantalla de Wari con el itinerario de un viaje, un mapa y la lista del día",
    },
  },
];
