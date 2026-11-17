import type { LocalizedText } from "./types";

/**
 * The site map: the home and one page per big case. Order matters: it is the
 * order of the previews on the home and of the "next case" chain at the end of
 * each case (Wari, Olimpo, Laura, Desktop, back home).
 */

export type CaseId = "wari" | "olimpo" | "laura" | "escritorio";
export type PageId = "home" | CaseId;

export interface CaseSection {
  /** Anchor on the case page. */
  id: string;
  title: LocalizedText;
  /** Short label for the phone sheet. */
  short: LocalizedText;
  keywords: string;
}

export interface CasePage {
  id: CaseId;
  n: string;
  path: string;
  name: string;
  nav: LocalizedText;
  /** Preview on the home and the "next case" link. */
  headline: LocalizedText;
  lines: LocalizedText;
  /** <title> and description of the page. */
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  sections: CaseSection[];
}

export const CASES: CasePage[] = [
  {
    id: "wari",
    n: "01",
    path: "/wari/",
    name: "Wari",
    nav: { en: "Wari", es: "Wari" },
    headline: {
      en: "Money and plans for groups, in one app.",
      es: "El dinero y los planes del grupo, en una sola app.",
    },
    lines: {
      en: "Splits group expenses, reads receipts product by product and keeps the trip in the same place. Card payments become expenses and paying back takes one tap. My product, in beta on its way to the stores.",
      es: "Reparte los gastos del grupo, lee los tickets producto a producto y guarda el viaje en el mismo sitio. Los pagos con tarjeta se vuelven gastos y devolver el dinero es un toque. Mi producto, en beta camino de las tiendas.",
    },
    metaTitle: "Wari, group expenses and trips",
    metaDescription:
      "Wari, my product: group expenses, receipts read product by product and the trip in one app. Card payments become expenses and settling up takes one tap. In beta, on its way to Google Play and the App Store.",
    keywords: "wari app beta product producto gastos expenses tickets receipts viajes trips revolut bizum",
    sections: [
      { id: "wari", title: { en: "Wari, my product in beta", es: "Wari, mi producto en beta" }, short: { en: "Wari", es: "Wari" }, keywords: "wari beta product producto" },
      { id: "wari-historia", title: { en: "How Wari works", es: "Cómo funciona Wari" }, short: { en: "How it works", es: "Cómo funciona" }, keywords: "story historia capture captura ticket receipt pagar pay revolut bizum viaje trip" },
    ],
  },
  {
    id: "olimpo",
    n: "02",
    path: "/olimpo/",
    name: "Olimpo",
    nav: { en: "Olimpo", es: "Olimpo" },
    headline: {
      en: "The operating system of my life.",
      es: "El sistema operativo de mi vida.",
    },
    lines: {
      en: "One app for my tasks, projects, health, money and the AI agents that work for me, on a Raspberry Pi 5 at home. Inside it, Warp sends files between devices through a black hole.",
      es: "Una app para mis tareas, proyectos, salud, dinero y los agentes de IA que trabajan para mí, en una Raspberry Pi 5 en casa. Dentro, Warp manda archivos entre dispositivos a través de un agujero negro.",
    },
    metaTitle: "Olimpo, the operating system of my life",
    metaDescription:
      "Olimpo: one self-hosted app for my tasks, projects, health, money and AI agents, on a Raspberry Pi 5. With Warp, files between devices through a real-time black hole shader you can play with, and the systems that run behind it.",
    keywords: "olimpo svelte pwa raspberry pi firmamento cielo sky",
    sections: [
      { id: "olimpo", title: { en: "Olimpo, the operating system of my life", es: "Olimpo, el sistema operativo de mi vida" }, short: { en: "Olimpo", es: "Olimpo" }, keywords: "olimpo firmamento cielo sky horas agents agentes" },
      { id: "warp", title: { en: "Warp, files between devices", es: "Warp, archivos entre dispositivos" }, short: { en: "Warp", es: "Warp" }, keywords: "warp portal black hole agujero files archivos clipboard portapapeles cast" },
      { id: "sistemas", title: { en: "What runs behind Olimpo", es: "Lo que corre detrás de Olimpo" }, short: { en: "Systems", es: "Sistemas" }, keywords: "systems sistemas homelab raspberry pi instinct aurora patrimonio wealth salud health" },
    ],
  },
  {
    id: "laura",
    n: "03",
    path: "/laura/",
    name: "Laura",
    nav: { en: "Laura", es: "Laura" },
    headline: {
      en: "I talk to my computer and it does the work.",
      es: "Le hablo a mi ordenador y hace el trabajo.",
    },
    lines: {
      en: "A voice assistant that runs the whole laptop: windows, files, calendar, the TV. Listening, thinking and speaking all happen on one laptop GPU, and nothing destructive happens until I say yes.",
      es: "Un asistente de voz que controla el portátil entero: ventanas, archivos, calendario, la tele. Escuchar, pensar y hablar pasa en una GPU de portátil, y nada destructivo ocurre hasta que digo que sí.",
    },
    metaTitle: "Laura, my local voice assistant",
    metaDescription:
      "Laura: a voice assistant that runs my whole laptop locally, with holograms you can play with, everything she can do, how she works inside and the safety net around her.",
    keywords: "laura voice voz assistant asistente holograms hologramas whisper qwen kokoro local",
    sections: [
      { id: "laura", title: { en: "Laura, my voice assistant", es: "Laura, mi asistente de voz" }, short: { en: "Laura", es: "Laura" }, keywords: "laura voice voz assistant asistente" },
      { id: "laura-demo", title: { en: "Laura's holograms, playable", es: "Los hologramas de Laura, jugables" }, short: { en: "Holograms", es: "Hologramas" }, keywords: "holograms hologramas demo play jugar" },
    ],
  },
  {
    id: "escritorio",
    n: "04",
    path: "/escritorio/",
    name: "Escritorio",
    nav: { en: "Desktop", es: "Escritorio" },
    headline: {
      en: "The desktop I work in, down to the USB bytes.",
      es: "El escritorio en el que trabajo, hasta los bytes USB.",
    },
    lines: {
      en: "Arch Linux with Hyprland, shaders I wrote by hand, and drivers for gear that only came with Windows apps: I listened to their USB traffic and decoded the protocols byte by byte.",
      es: "Arch Linux con Hyprland, shaders que escribí a mano y drivers para periféricos que solo traían apps de Windows: escuché su tráfico USB y decodifiqué los protocolos byte a byte.",
    },
    metaTitle: "The Linux desktop and its drivers",
    metaDescription:
      "My Linux desktop, explorable live, and the reverse-engineering story of my peripherals: USB captures, protocols decoded byte by byte, my own drivers and lights that follow the desktop.",
    keywords: "desktop escritorio linux hyprland quickshell caelestia gargantua shader webgl rgb hidraw usb driver reverse engineering ingenieria inversa",
    sections: [
      { id: "escritorio", title: { en: "The Linux desktop", es: "El escritorio Linux" }, short: { en: "Desktop", es: "Escritorio" }, keywords: "desktop escritorio linux hyprland" },
      { id: "hardware", title: { en: "Reverse-engineering my peripherals", es: "Ingeniería inversa de mis periféricos" }, short: { en: "Hardware", es: "Hardware" }, keywords: "hardware usb hid bytes driver reverse ingenieria inversa" },
    ],
  },
];

export const CASE_BY_ID = Object.fromEntries(CASES.map((c) => [c.id, c])) as Record<CaseId, CasePage>;

/** Which page a pathname belongs to ("/olimpo/" or "/olimpo" both give "olimpo"). */
export function pageFromPath(pathname: string | null): PageId {
  const seg = (pathname ?? "/").split("/").filter(Boolean)[0];
  return CASES.find((c) => c.id === seg)?.id ?? "home";
}

/** Sections of the home itself. */
export const HOME_SECTIONS: CaseSection[] = [
  { id: "hero", title: { en: "Top", es: "Inicio" }, short: { en: "Top", es: "Inicio" }, keywords: "hero home inicio top gargantua" },
  { id: "casos", title: { en: "The four cases", es: "Los cuatro casos" }, short: { en: "Cases", es: "Casos" }, keywords: "cases casos work trabajo" },
  { id: "proyectos", title: { en: "More work: hackathon and lab", es: "Más trabajo: hackathon y laboratorio" }, short: { en: "Work", es: "Trabajo" }, keywords: "projects proyectos trabajo work mycrohnie hackyeah closhare barber lab laboratorio" },
  { id: "trayectoria", title: { en: "Background", es: "Trayectoria" }, short: { en: "Background", es: "Trayectoria" }, keywords: "background trayectoria stel order education olympiad umu agh" },
];

/**
 * Anchors of the old single page and where they live now. The home reads its
 * hash on load and replaces the URL, so old links keep working.
 */
export const OLD_ANCHORS: Record<string, string> = {
  wari: "/wari/",
  olimpo: "/olimpo/",
  warp: "/olimpo/#warp",
  sistemas: "/olimpo/#sistemas",
  laura: "/laura/",
  "laura-demo": "/laura/#laura-demo",
  escritorio: "/escritorio/",
};

export const CASES_UI = {
  heading: { en: "Four things I built end to end.", es: "Cuatro cosas que construí de punta a punta." },
  lead: {
    en: "Each one has its own page, with the real thing to play with: screens, shaders, holograms and bytes.",
    es: "Cada una tiene su página, con lo de verdad para tocar: pantallas, shaders, hologramas y bytes.",
  },
  cta: { en: "See the case", es: "Ver el caso" },
  next: { en: "Next case", es: "Siguiente caso" },
  backHome: { en: "Back to the start", es: "Volver al inicio" },
  homeHeadline: {
    en: "The rest of the work, the background and how to reach me.",
    es: "El resto del trabajo, la trayectoria y cómo escribirme.",
  },
  homeLines: {
    en: "MyCrohnie and its 24-hour hackathon, the lab, where I come from and my email.",
    es: "MyCrohnie y su hackathon de 24 horas, el laboratorio, de dónde vengo y mi email.",
  },
  pages: { en: "Pages", es: "Páginas" },
  onThisPage: { en: "On this page", es: "En esta página" },
} satisfies Record<string, LocalizedText>;
