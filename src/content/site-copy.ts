import type { LocalizedText } from "./types";

/** Copy for the shell of the page (nav, hero, Wari portal, contact). EN/ES. */

export const NAV = {
  home: { en: "Home", es: "Inicio" },
  wari: { en: "Wari", es: "Wari" },
  olimpo: { en: "Olimpo", es: "Olimpo" },
  systems: { en: "Systems", es: "Sistemas" },
  desktop: { en: "Desktop", es: "Escritorio" },
  projects: { en: "Work", es: "Trabajo" },
  background: { en: "Background", es: "Trayectoria" },
  contact: { en: "Contact", es: "Contacto" },
  menu: { en: "More", es: "Más" },
  menuTitle: { en: "Everything on this page", es: "Todo lo que hay en la página" },
  close: { en: "Close", es: "Cerrar" },
  search: { en: "Search", es: "Buscar" },
  language: { en: "Language", es: "Idioma" },
  palette: { en: "Open command palette", es: "Abrir paleta de comandos" },
} satisfies Record<string, LocalizedText>;

export const HERO = {
  headline: {
    en: "I build whole systems, from the proof to the hardware.",
    es: "Construyo sistemas enteros, de la demostración al hardware.",
  },
  sub: {
    en: "Maths and CS student in Kraków. I'm taking my own app from beta to the stores, and my life runs on a Raspberry Pi I set up myself.",
    es: "Estudio Matemáticas e Informática en Cracovia. Estoy llevando mi propia app de la beta a las tiendas, y mi vida corre en una Raspberry Pi que monté yo.",
  },
  ctaPrimary: { en: "See the work", es: "Ver el trabajo" },
  ctaSecondary: { en: "Contact", es: "Contacto" },
  casesLabel: { en: "Two things I'm proudest of", es: "Las dos cosas de las que más orgulloso estoy" },
  cases: [
    {
      id: "wari",
      n: "01",
      name: "Wari",
      line: {
        en: "Group expenses, receipts and trips. My product, in beta on its way to the stores.",
        es: "Gastos de grupo, tickets y viajes. Mi producto, en beta camino de las tiendas.",
      },
    },
    {
      id: "olimpo",
      n: "02",
      name: "Olimpo + Warp",
      line: {
        en: "The operating system of my life, self-hosted on a Raspberry Pi 5.",
        es: "El sistema operativo de mi vida, autoalojado en una Raspberry Pi 5.",
      },
    },
  ],
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
} satisfies Record<string, unknown>;

export const WARI = {
  eyebrow: { en: "01 · My product, in beta", es: "01 · Mi producto, en beta" },
  title: {
    en: "Money and plans for groups, in one app.",
    es: "El dinero y los planes del grupo, en una sola app.",
  },
  lead: {
    en: "Wari splits group expenses, reads supermarket receipts product by product and keeps the trip in the same place. It's my product: I design it, build it and run it, and it's in beta now, growing a little at a time on its way to Google Play and the App Store.",
    es: "Wari reparte los gastos del grupo, lee los tickets del súper producto a producto y guarda el viaje en el mismo sitio. Es mi producto: lo diseño, lo programo y lo mantengo, y ahora está en beta, creciendo poco a poco camino de Google Play y la App Store.",
  },
  status: { en: "In beta", es: "En beta" },
  statusNext: { en: "Next: Google Play and the App Store", es: "Lo siguiente: Google Play y App Store" },
  name: {
    en: "The name comes from 割り勘 (warikan), Japanese for splitting the bill evenly. It started in Kraków under another name, Krakount.",
    es: "El nombre viene de 割り勘 (warikan), pagar a partes iguales en japonés. Empezó en Cracovia con otro nombre, Krakount.",
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
  caption: { en: "Real screens from the beta, with demo data", es: "Pantallas reales de la beta, con datos de demo" },
  storyLabel: { en: "How Wari works", es: "Cómo funciona Wari" },
  swipeHint: { en: "Swipe", es: "Desliza" },
  chapters: [
    {
      id: "inicio",
      title: { en: "Everything you owe, in one number.", es: "Todo lo que debes, en un número." },
      body: {
        en: "Home adds up every group: what they owe you, what you owe, and who to settle with first. If you owe each other in two groups, one tap evens it out.",
        es: "Inicio suma todos los grupos: lo que te deben, lo que debes y con quién saldar primero. Si os debéis en dos grupos, un toque lo compensa.",
      },
    },
    {
      id: "ticket",
      title: { en: "The receipt, product by product.", es: "El ticket, producto a producto." },
      body: {
        en: "Take a photo of the receipt and an AI reads it, Polish supermarkets included. Everyone ticks what's theirs in real time. The photo is only read, never stored.",
        es: "Haces una foto del ticket y una IA lo lee, también los de supermercados polacos. Cada uno marca lo suyo en tiempo real. La foto solo se lee, no se guarda.",
      },
    },
    {
      id: "gasto",
      title: { en: "Any currency, exact to the cent.", es: "Cualquier moneda, exacta al céntimo." },
      body: {
        en: "Type 36 in euros and it already shows the złoty. Amounts are stored as integer cents in their own currency, so nothing drifts when the rate moves.",
        es: "Escribes 36 en euros y ya ves los złotys. Los importes se guardan en céntimos enteros en su moneda, así que nada se descuadra cuando cambia el tipo.",
      },
    },
    {
      id: "viaje",
      title: { en: "And the trip, in the same app.", es: "Y el viaje, en la misma app." },
      body: {
        en: "Stops, times and tickets for each day, with the next step always on top. Splitwise and Tricount only do the money; Wari keeps both together.",
        es: "Paradas, horas y billetes de cada día, con el siguiente paso siempre arriba. Splitwise y Tricount solo llevan el dinero; Wari junta las dos cosas.",
      },
    },
  ] satisfies { id: string; title: LocalizedText; body: LocalizedText }[],
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
