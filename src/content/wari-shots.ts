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

/** Screens for the scroll story, one per chapter (same ids as WARI.chapters). */
export const WARI_STORY_SHOTS: Record<string, WariShot> = {
  inicio: {
    src: "/media/wari/wari-inicio-light.webp",
    width: 780,
    height: 1688,
    alt: {
      en: "Wari home: the total balance, what you are owed and what you owe, and the people in your groups",
      es: "Inicio de Wari: el saldo total, lo que te deben y lo que debes, y las personas de tus grupos",
    },
  },
  ticket: {
    src: "/media/wari/wari-ticket-light.webp",
    width: 780,
    height: 1688,
    alt: {
      en: "Wari splitting a supermarket receipt, product by product",
      es: "Wari repartiendo un ticket del súper producto a producto",
    },
  },
  gasto: {
    src: "/media/wari/wari-gasto-nuevo-light.webp",
    width: 780,
    height: 1688,
    alt: {
      en: "New expense in Wari: 36 euros with the equivalent in złoty, who paid and who it is split between",
      es: "Gasto nuevo en Wari: 36 euros con su equivalencia en złotys, quién pagó y entre quiénes se reparte",
    },
  },
  viaje: {
    src: "/media/wari/wari-itinerario-light.webp",
    width: 780,
    height: 1688,
    alt: {
      en: "Wari trip itinerary for the day, with stops, times and a flight ticket",
      es: "Itinerario del viaje en Wari para el día, con paradas, horas y un billete de avión",
    },
  },
};
