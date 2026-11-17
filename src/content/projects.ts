import type { ExternalLink, LocalizedText } from "./types";

/**
 * The project index. Links are only the ones verified as public (HTTP 200);
 * years and roles come from each repo's git history. Private repos get no link.
 */

export type ProjectAxis = "product" | "ai" | "hardware";

export interface ProjectMedia {
  src: string;
  width: number;
  height: number;
  alt: LocalizedText;
}

export interface Project {
  id: string;
  name: LocalizedText;
  year: string;
  axis: ProjectAxis;
  role: LocalizedText;
  line: LocalizedText;
  stack: string[];
  links: ExternalLink[];
  /** Shown when there is nothing public to link (private repo, internal testing). */
  note?: LocalizedText;
  media?: ProjectMedia;
  /** Typographic plate used on hover when there is no media. */
  plate: { value: string; valueEs?: string; label: LocalizedText };
}

export const PROJECTS_UI = {
  heading: { en: "Things I built.", es: "Cosas que he construido." },
  lead: {
    en: "A hackathon in 24 hours, a bot that costs nothing to run, a watch I taught new tricks. Filter by what they are about.",
    es: "Un hackathon en 24 horas, un bot que no cuesta nada mantener, un reloj al que enseñé trucos nuevos. Filtra por de qué van.",
  },
  filterLabel: { en: "Filter projects", es: "Filtrar proyectos" },
  filters: {
    all: { en: "All", es: "Todos" },
    product: { en: "Product", es: "Producto" },
    ai: { en: "Applied AI", es: "IA aplicada" },
    hardware: { en: "Hardware", es: "Hardware" },
  } satisfies Record<"all" | ProjectAxis, LocalizedText>,
  empty: { en: "Nothing here yet.", es: "Aquí todavía no hay nada." },
} satisfies Record<string, unknown>;

const live = (en: string, es: string, href: string): ExternalLink => ({ label: { en, es }, href, kind: "live" });
const code = (href: string, en = "Code", es = "Código"): ExternalLink => ({ label: { en, es }, href, kind: "github" });

export const PROJECTS: Project[] = [
  {
    id: "mycrohnie",
    name: { en: "MyCrohnie", es: "MyCrohnie" },
    year: "2026",
    axis: "product",
    role: { en: "Developer, hackathon team", es: "Desarrollo, equipo del hackathon" },
    line: {
      en: "A guilt-free dragon for kids with Crohn's disease, and a one-page report for their doctor. Built in 24 hours at HackYeah 2026.",
      es: "Un dragón sin culpa para niños con Crohn y un informe de una página para su médico. Hecha en 24 horas en HackYeah 2026.",
    },
    stack: ["Next.js 16", "React 19", "TypeScript", "Zod", "PWA"],
    links: [
      live("Demo", "Demo", "https://mycrohnie.vercel.app"),
      code("https://github.com/Alberviz/JoseoKings-Hackyeah"),
      { label: { en: "Deck", es: "Presentación" }, href: "/media/mycrohnie/MyCrohnie-deck.pdf", kind: "pdf" },
    ],
    media: {
      src: "/media/mycrohnie/poster.webp",
      width: 1280,
      height: 720,
      alt: {
        en: "MyCrohnie demo: the daily check-in and the doctor report",
        es: "Demo de MyCrohnie: el registro diario y el informe médico",
      },
    },
    plate: { value: "24 h", label: { en: "from zero to a working app", es: "de cero a una app funcionando" } },
  },
  {
    id: "barber-bot",
    name: { en: "Barber Bot", es: "Barber Bot" },
    year: "2026",
    axis: "ai",
    role: { en: "Solo developer", es: "Desarrollo en solitario" },
    line: {
      en: "A Telegram bot that books haircuts from text or voice notes in Spanish, Polish and English. It runs serverless for 0 EUR a month.",
      es: "Un bot de Telegram que reserva cortes de pelo por texto o nota de voz en español, polaco e inglés. Corre serverless por 0 € al mes.",
    },
    stack: ["TypeScript", "grammY", "Groq", "Gemini", "Turso"],
    links: [live("Web panel", "Panel web", "https://barber-bot-zeta.vercel.app")],
    plate: { value: "0 EUR", valueEs: "0 €", label: { en: "a month, behind a 5-layer fallback cascade", es: "al mes, con una cascada de respaldo de 5 capas" } },
  },
  {
    id: "closhare",
    name: { en: "CloShare", es: "CloShare" },
    year: "2026",
    axis: "ai",
    role: { en: "Co-developer", es: "Desarrollo a medias" },
    line: {
      en: "A wardrobe my friends share. It cuts each garment out of its photo inside the browser with WebGPU, so the AI costs me no server.",
      es: "Un armario que comparten mis amigas. Recorta cada prenda de su foto dentro del navegador con WebGPU, así que la IA no me cuesta servidor.",
    },
    stack: ["Next.js 15", "WebGPU", "Tailwind v4", "Supabase Realtime", "Web Push"],
    links: [live("Demo", "Demo", "https://closhare-indol.vercel.app")],
    media: {
      src: "/media/closhare/wardrobe.webp",
      width: 780,
      height: 1768,
      alt: {
        en: "CloShare shared wardrobe with the available garments",
        es: "Armario compartido de CloShare con las prendas disponibles",
      },
    },
    plate: { value: "WebGPU", label: { en: "background removal, on the device", es: "recorte de fondo, en el dispositivo" } },
  },
  {
    id: "choppy",
    name: { en: "Choppy", es: "Choppy" },
    year: "2026",
    axis: "product",
    role: { en: "Co-developer", es: "Desarrollo a medias" },
    line: {
      en: "Taxi sharing for student residences. Post a ride in two taps, split the fare and settle with a direct payment link.",
      es: "Taxi compartido para residencias de estudiantes. Publicas un trayecto en dos toques, repartes la tarifa y liquidas con un enlace de pago directo.",
    },
    stack: ["Next.js 15", "TypeScript", "Supabase Realtime", "Capacitor"],
    links: [],
    note: { en: "Internal testing, private repo", es: "En pruebas internas, repo privado" },
    plate: { value: "800+", label: { en: "students in the Kraków residence it is made for", es: "estudiantes en la residencia de Cracovia para la que nace" } },
  },
  {
    id: "gts2-mando",
    name: { en: "gts2-mando", es: "gts2-mando" },
    year: "2026",
    axis: "hardware",
    role: { en: "Author", es: "Autor" },
    line: {
      en: "An Android app that plays a silent media session so the three music buttons of my closed-OS watch become webhooks and a voice channel.",
      es: "Una app Android que reproduce una sesión multimedia silenciosa para que los tres botones de música de mi reloj de sistema cerrado sean webhooks y un canal de voz.",
    },
    stack: ["Kotlin", "Android MediaSession", "Bluetooth SCO"],
    links: [code("https://github.com/Alberviz/gts2-mando")],
    plate: { value: "3", label: { en: "wrist buttons turned into controls", es: "botones de muñeca convertidos en controles" } },
  },
  {
    id: "universidad",
    name: { en: "University vault", es: "Vault de la universidad" },
    year: "2026",
    axis: "ai",
    role: { en: "Author", es: "Autor" },
    line: {
      en: "All my double-degree notes in one git repo, as a linked Obsidian vault. My agents read it and translate the lectures I get in Polish at AGH into Spanish.",
      es: "Todos mis apuntes del doble grado en un repo git, como vault de Obsidian enlazado. Mis agentes lo leen y traducen al español las clases que recibo en polaco en la AGH.",
    },
    stack: ["Obsidian", "Git", "Agents"],
    links: [],
    note: { en: "Private repo", es: "Repo privado" },
    plate: { value: "PL to ES", valueEs: "PL a ES", label: { en: "lectures translated by my agents", es: "clases traducidas por mis agentes" } },
  },
];
