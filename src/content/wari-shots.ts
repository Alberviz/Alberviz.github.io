import type { LocalizedText } from "./types";

/**
 * Real screenshots of the Wari app (v2.1, Cristal theme, demo seed data) shown
 * in the portal. Dimensions are exact (they reserve the layout, no CLS). To swap
 * captures, only edit this list. The same folder also has "-dark" variants.
 */
export interface WariShot {
  src: string;
  width: number;
  height: number;
  alt: LocalizedText;
}

export const WARI_SHOTS: WariShot[] = [
  {
    src: "/media/wari/wari-saldos-light.webp",
    width: 780,
    height: 1688,
    alt: {
      en: "Wari balances screen: who pays whom in the group, with a Paid button for each debt",
      es: "Pantalla de saldos de Wari: quién paga a quién en el grupo, con un botón Pagado en cada deuda",
    },
  },
  {
    src: "/media/wari/wari-ticket-light.webp",
    width: 780,
    height: 1688,
    alt: {
      en: "Wari screen splitting a supermarket receipt, product by product",
      es: "Pantalla de Wari repartiendo un ticket del súper producto a producto",
    },
  },
  {
    src: "/media/wari/wari-viaje-light.webp",
    width: 780,
    height: 1688,
    alt: {
      en: "Wari trip screen with the day's itinerary, a map and the next step on top",
      es: "Pantalla de viaje de Wari con el itinerario del día, un mapa y el siguiente paso arriba",
    },
  },
];
