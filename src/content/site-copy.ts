import type { LocalizedText } from "./types";

/** Copy for the shell of the page (nav, hero, Wari portal, contact). EN/ES. */

export const NAV = {
  home: { en: "Home", es: "Inicio" },
  wari: { en: "Wari", es: "Wari" },
  systems: { en: "Systems", es: "Sistemas" },
  projects: { en: "Projects", es: "Proyectos" },
  background: { en: "Background", es: "Trayectoria" },
  contact: { en: "Contact", es: "Contacto" },
  menu: { en: "Menu", es: "Menú" },
  palette: { en: "Open command palette", es: "Abrir paleta de comandos" },
} satisfies Record<string, LocalizedText>;

export const HERO = {
  headline: {
    en: "I build whole systems, from the proof to the hardware.",
    es: "Construyo sistemas enteros, de la demostración al hardware.",
  },
  sub: {
    en: "Maths and CS student in Kraków. I ship apps my friends use daily and run my own AI at home.",
    es: "Estudio Matemáticas e Informática en Cracovia. Hago apps que mis amigos usan a diario y mi IA corre en casa.",
  },
  ctaPrimary: { en: "See Wari", es: "Ver Wari" },
  ctaSecondary: { en: "Contact", es: "Contacto" },
  legendLive: {
    en: "Live: the black hole from my desktop, rendered in your browser",
    es: "En vivo: el agujero negro de mi escritorio, renderizado en tu navegador",
  },
  legendStill: {
    en: "The black hole from my desktop (still image)",
    es: "El agujero negro de mi escritorio (imagen fija)",
  },
  posterAlt: {
    en: "A black hole with a glowing accretion disk on a field of stars",
    es: "Un agujero negro con un disco de acreción brillante sobre un campo de estrellas",
  },
} satisfies Record<string, LocalizedText>;

export const WARI = {
  title: {
    en: "The app my friends open every day.",
    es: "La app que mis amigos abren cada día.",
  },
  lead: {
    en: "Wari splits group expenses, supermarket receipts product by product, and the trips that go with them. I built it for my Erasmus group in Kraków.",
    es: "Wari reparte los gastos del grupo, los tickets del súper producto a producto y los viajes que los acompañan. La hice para mi grupo Erasmus en Cracovia.",
  },
  name: {
    en: "The name comes from 割り勘 (warikan), Japanese for splitting the bill evenly. Before that it was called Krakount.",
    es: "El nombre viene de 割り勘 (warikan), pagar a partes iguales en japonés. Antes se llamaba Krakount.",
  },
  stats: [
    { value: "32", valueEs: "32", label: { en: "currencies, exact to the cent", es: "monedas, exactas al céntimo" } },
    {
      value: "2,700+",
      valueEs: "2.700",
      preEs: "más de",
      label: { en: "automated tests", es: "tests automáticos" },
    },
    {
      value: "80+",
      valueEs: "80",
      preEs: "más de",
      label: { en: "database migrations", es: "migraciones de base de datos" },
    },
  ] satisfies { value: string; valueEs: string; preEs?: string; label: LocalizedText }[],
  cta: { en: "Open the Wari website", es: "Abrir la web de Wari" },
  caption: { en: "Screens from the real app", es: "Capturas de la app real" },
} satisfies Record<string, unknown>;

export const CONTACT = {
  heading: {
    en: "Let's build something whole.",
    es: "Construyamos algo entero.",
  },
  sub: {
    en: "Open to fellowships and early teams. Email is the fastest way.",
    es: "Abierto a fellowships y equipos en fase temprana. El email es lo más rápido.",
  },
  copy: { en: "Copy email", es: "Copiar email" },
  copied: { en: "Copied", es: "Copiado" },
  cv: { en: "CV (PDF)", es: "CV (PDF)" },
  signature: { en: "Made by hand by Alberto", es: "Hecho a mano por Alberto" },
  signatureLink: { en: "See Wari", es: "Ver Wari" },
} satisfies Record<string, LocalizedText>;
