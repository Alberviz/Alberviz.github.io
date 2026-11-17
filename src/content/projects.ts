import type { ExternalLink, LocalizedText } from "./types";

/**
 * Work beyond the two flagship cases, in honest tiers:
 *  - FEATURED: notable work told as a story (MyCrohnie, through its hackathon).
 *  - LAB: small, real projects, kept compact.
 *  - MENTIONS: prototypes worth one line, nothing more.
 * Links are only the ones verified as public (HTTP 200). Private repos get no link.
 */

export interface ProjectMedia {
  src: string;
  width: number;
  height: number;
  alt: LocalizedText;
}

export interface LabProject {
  id: string;
  name: string;
  year: string;
  line: LocalizedText;
  stack: string[];
  plate: { value: string; valueEs?: string; label: LocalizedText };
  links: ExternalLink[];
  note?: LocalizedText;
}

export const WORK_UI = {
  heading: { en: "More things I built.", es: "Más cosas que he construido." },
  lead: {
    en: "A hackathon in 24 hours, then the small lab: tools I made because I needed them.",
    es: "Un hackathon en 24 horas y después el laboratorio: herramientas que hice porque las necesitaba.",
  },
  labHeading: { en: "Lab", es: "Laboratorio" },
  labLead: {
    en: "Smaller, real and running.",
    es: "Más pequeños, reales y funcionando.",
  },
} satisfies Record<string, LocalizedText>;

const live = (en: string, es: string, href: string): ExternalLink => ({ label: { en, es }, href, kind: "live" });

export const MYCROHNIE = {
  eyebrow: { en: "HackYeah 2026 · 24 hours", es: "HackYeah 2026 · 24 horas" },
  title: { en: "24 hours at HackYeah.", es: "24 horas en HackYeah." },
  name: "MyCrohnie",
  lead: {
    en: "One weekend at HackYeah 2026, in the TAURON Arena in Kraków. Our team took the Sport & Healthcare track and built MyCrohnie from an empty repo: a companion for kids aged 8 to 12 with Crohn's disease, and a one-page report for their doctor.",
    es: "Un fin de semana en HackYeah 2026, en el TAURON Arena de Cracovia. Nuestro equipo cogió la categoría Sport & Healthcare y construyó MyCrohnie desde un repo vacío: un compañero para niños de 8 a 12 años con Crohn y un informe de una página para su médico.",
  },
  timeline: [
    { t: { en: "Sat 11:36", es: "sáb 11:36" }, label: { en: "first commit", es: "primer commit" } },
    { t: { en: "Overnight", es: "De madrugada" }, label: { en: "dragon, check-in, report", es: "dragón, registro, informe" } },
    { t: { en: "Sun 10:45", es: "dom 10:45" }, label: { en: "final commit, submitted", es: "último commit, entregado" } },
  ],
  points: [
    {
      value: { en: "Guilt-free", es: "Sin culpa" },
      label: {
        en: "the dragon is never sad and there are no broken streaks to punish a bad day",
        es: "el dragón nunca está triste y no hay rachas rotas que castiguen un mal día",
      },
    },
    {
      value: { en: "1 page", es: "1 página" },
      label: {
        en: "doctor report built with CSS print rules alone, no PDF library",
        es: "de informe médico hecho solo con reglas CSS de impresión, sin librería de PDF",
      },
    },
    {
      value: { en: "On device", es: "En el móvil" },
      label: {
        en: "health data stays in the browser, validated with Zod. No account, no server",
        es: "los datos de salud se quedan en el navegador, validados con Zod. Sin cuenta ni servidor",
      },
    },
  ],
  stack: ["Next.js 16", "React 19", "TypeScript", "Zod", "PWA"],
  links: [
    live("Live demo", "Demo en vivo", "https://mycrohnie.vercel.app"),
    { label: { en: "Code", es: "Código" }, href: "https://github.com/Alberviz/JoseoKings-Hackyeah", kind: "github" },
    { label: { en: "Pitch deck", es: "Presentación" }, href: "/media/mycrohnie/MyCrohnie-deck.pdf", kind: "pdf" },
  ] satisfies ExternalLink[],
  media: {
    src: "/media/mycrohnie/poster.webp",
    width: 1280,
    height: 720,
    alt: {
      en: "MyCrohnie demo: the daily check-in and the doctor report",
      es: "Demo de MyCrohnie: el registro diario y el informe médico",
    },
  } satisfies ProjectMedia,
};

export const LAB: LabProject[] = [
  {
    id: "barber-bot",
    name: "Barber Bot",
    year: "2026",
    line: {
      en: "A Telegram bot that books haircuts from text or voice notes in Spanish, Polish and English.",
      es: "Un bot de Telegram que reserva cortes de pelo por texto o nota de voz en español, polaco e inglés.",
    },
    stack: ["TypeScript", "grammY", "Groq", "Gemini", "Turso"],
    plate: { value: "0 EUR", valueEs: "0 €", label: { en: "a month to run, with a 5-layer fallback", es: "al mes, con 5 capas de respaldo" } },
    links: [live("Web panel", "Panel web", "https://barber-bot-zeta.vercel.app")],
  },
  {
    id: "closhare",
    name: "CloShare",
    year: "2026",
    line: {
      en: "A shared wardrobe. It cuts each garment out of its photo inside the browser, so the AI needs no server.",
      es: "Un armario compartido. Recorta cada prenda de su foto dentro del navegador, así que la IA no necesita servidor.",
    },
    stack: ["Next.js 15", "WebGPU", "Supabase Realtime", "Web Push"],
    plate: { value: "WebGPU", label: { en: "background removal on the device", es: "recorte de fondo en el dispositivo" } },
    links: [live("Demo", "Demo", "https://closhare-indol.vercel.app")],
  },
  {
    id: "universidad",
    name: "University vault",
    year: "2026",
    line: {
      en: "All my double-degree notes as a linked Obsidian vault in git. My agents read it and translate the lectures I get in Polish at AGH.",
      es: "Todos mis apuntes del doble grado como vault de Obsidian enlazado en git. Mis agentes lo leen y traducen las clases que recibo en polaco en la AGH.",
    },
    stack: ["Obsidian", "Git", "Agents"],
    plate: { value: "PL to ES", valueEs: "PL a ES", label: { en: "lectures translated by my agents", es: "clases traducidas por mis agentes" } },
    links: [],
    note: { en: "Private repo", es: "Repo privado" },
  },
];

export const LAB_NAMES_ES: Record<string, string> = { universidad: "Vault de la universidad" };

/** One line, no card: prototypes that don't deserve more weight. */
export const MENTIONS = {
  en: "Also on the bench: Choppy, a taxi-sharing prototype for a student residence.",
  es: "También en el banco de pruebas: Choppy, un prototipo de taxi compartido para una residencia de estudiantes.",
} satisfies LocalizedText;
