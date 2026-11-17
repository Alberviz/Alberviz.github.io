import type { ExternalLink, LocalizedText } from "./types";
import { LINUXRICING_URL } from "./links";

/**
 * The home setup as an orbital system. A Raspberry Pi 5 is the star; each
 * planet is one system I run. Every figure below comes from the verified-facts
 * pass (code or config read in the repos). No routes, ports, IPs or private URLs.
 */

export interface SystemFact {
  value: string;
  valueEs?: string;
  label: LocalizedText;
}

export interface SystemPlanet {
  id: string;
  name: LocalizedText;
  /** One line, shown under the name and used as the accessible description. */
  line: LocalizedText;
  body: LocalizedText;
  /** Where it physically runs. */
  host: LocalizedText;
  stack: string[];
  facts: [SystemFact, SystemFact];
  links?: ExternalLink[];
  /** Orbit: radius as % of the stage width, period in seconds, start angle in radians. */
  orbit: { r: number; period: number; phase: number };
}

export const SYSTEMS_UI = {
  heading: {
    en: "What runs behind Olimpo.",
    es: "Lo que corre detrás de Olimpo.",
  },
  lead: {
    en: "Olimpo is the window; these are the systems that feed it. They orbit the same Raspberry Pi 5, except Laura, my voice AI, who lives on my laptop GPU and sits on the outer ring.",
    es: "Olimpo es la ventana; estos son los sistemas que la alimentan. Giran alrededor de la misma Raspberry Pi 5, salvo Laura, mi IA de voz, que vive en la GPU del portátil y va en el anillo exterior.",
  },
  star: { en: "Raspberry Pi 5", es: "Raspberry Pi 5" },
  stageLabel: {
    en: "Orbital map of my systems. Select a planet to read about it.",
    es: "Mapa orbital de mis sistemas. Elige un planeta para leer sobre él.",
  },
  hint: {
    en: "Tap a planet or a name below",
    es: "Toca un planeta o un nombre de abajo",
  },
  runsOn: { en: "Runs on", es: "Corre en" },
  stack: { en: "Stack", es: "Stack" },
} satisfies Record<string, LocalizedText>;

export const SYSTEM_PLANETS: SystemPlanet[] = [
  {
    id: "networth",
    name: { en: "Net worth", es: "Patrimonio" },
    line: {
      en: "Every account, one number.",
      es: "Todas mis cuentas, un número.",
    },
    body: {
      en: "Ghostfolio pulls my brokers, my personal product-selling business and Wari's shared expenses into one portfolio. The business only counts cash collected and profit from sales already made, so unsold stock is worth zero until it sells.",
      es: "Ghostfolio junta mis brókers, mi negocio personal de venta de productos y los gastos compartidos de Wari en una sola cartera. El negocio solo cuenta caja cobrada y beneficio de ventas ya hechas: el stock sin vender vale cero hasta que se vende.",
    },
    host: { en: "Raspberry Pi 5, isolated Docker network", es: "Raspberry Pi 5, red Docker aislada" },
    stack: ["Ghostfolio", "PostgreSQL", "Redis", "Docker", "Python"],
    facts: [
      {
        value: "4",
        label: {
          en: "feeds in one portfolio, with 14 daily and 8 weekly backups",
          es: "fuentes en una cartera, con 14 copias diarias y 8 semanales",
        },
      },
      {
        value: "10,000 EUR",
        valueEs: "10.000 €",
        label: {
          en: "cap on any trade my AI can write, and every write can be undone",
          es: "de tope por operación que mi IA puede escribir, y cada escritura se puede deshacer",
        },
      },
    ],
    orbit: { r: 19, period: 150, phase: 2.35 },
  },
  {
    id: "aurora",
    name: { en: "Aurora", es: "Aurora" },
    line: {
      en: "An agent that runs my calendar and inbox.",
      es: "Un agente que lleva mi agenda y mi correo.",
    },
    body: {
      en: "A Hermes agent running around the clock. It reaches Gmail, Calendar, Drive and more through Google Workspace tools, and takes voice notes on Telegram. University email is read as inert text, so a hostile message cannot give it orders.",
      es: "Un agente Hermes que no se apaga. Llega a Gmail, Calendar, Drive y más con herramientas de Google Workspace, y recibe notas de voz por Telegram. El correo de la universidad se lee como texto inerte, así que un mensaje hostil no puede darle órdenes.",
    },
    host: { en: "Raspberry Pi 5, systemd service", es: "Raspberry Pi 5, servicio systemd" },
    stack: ["Python", "Hermes Agent", "MCP", "Google Workspace", "systemd", "Telegram"],
    facts: [
      {
        value: "73",
        label: {
          en: "Google Workspace tools wired in through MCP",
          es: "herramientas de Google Workspace conectadas por MCP",
        },
      },
      {
        value: "400 s to 15 s",
        valueEs: "de 400 s a 15 s",
        label: {
          en: "response time after I made tool lookup dynamic",
          es: "de tiempo de respuesta tras hacer dinámica la búsqueda de herramientas",
        },
      },
    ],
    links: [
      {
        label: { en: "Aurora site", es: "Web de Aurora" },
        href: "https://alberviz.github.io/aurora-site/",
        kind: "live",
      },
    ],
    orbit: { r: 27.5, period: 200, phase: 4.1 },
  },
  {
    id: "health",
    name: { en: "Health", es: "Salud" },
    line: {
      en: "My watch, my meals and my gym log in one place.",
      es: "Mi reloj, mis comidas y mi gimnasio en un solo sitio.",
    },
    body: {
      en: "A hub that reads steps, sleep and heart rate from my Amazfit GTS 2 and my training from my own openGym fork. The watch has a closed OS and no app SDK, so I turned its music buttons into controls I can log creatine or a meal with.",
      es: "Un hub que lee pasos, sueño y pulso de mi Amazfit GTS 2 y mis entrenos de mi propio fork de openGym. El reloj tiene un sistema cerrado y ningún SDK, así que convertí sus botones de música en controles para apuntar la creatina o una comida.",
    },
    host: { en: "Raspberry Pi 5 and an Android app", es: "Raspberry Pi 5 y una app Android" },
    stack: ["Kotlin", "Python", "SQLite (WAL)", "Docker", "Google Health API"],
    facts: [
      {
        value: "3",
        label: {
          en: "watch buttons turned into webhooks, plus a voice channel for meals",
          es: "botones del reloj convertidos en webhooks, más un canal de voz para las comidas",
        },
      },
      {
        value: "Undo",
        valueEs: "Deshacer",
        label: {
          en: "the journal is append-only: triggers block edits and any write can be reverted",
          es: "el diario es de solo añadir: los triggers bloquean ediciones y toda escritura se puede revertir",
        },
      },
    ],
    orbit: { r: 36, period: 260, phase: 5.55 },
  },
  {
    id: "laura",
    name: { en: "Laura", es: "Laura" },
    line: {
      en: "A voice assistant that never leaves my laptop.",
      es: "Una asistente de voz que no sale de mi portátil.",
    },
    body: {
      en: "Press Super+A and talk. Whisper transcribes, a small Qwen model decides what to do, and Kokoro answers out loud, all on my RTX 4050. The screen edge glows with a shader while she listens, and a watchdog checks my calendar, mail and tasks in the background.",
      es: "Pulso Super+A y hablo. Whisper transcribe, un Qwen pequeño decide qué hacer y Kokoro responde en voz alta, todo en mi RTX 4050. El borde de la pantalla brilla con un shader mientras escucha, y un vigía revisa en segundo plano mi calendario, mi correo y mis tareas.",
    },
    host: { en: "My laptop, RTX 4050 6 GB", es: "Mi portátil, RTX 4050 de 6 GB" },
    stack: ["Python", "Faster-Whisper", "Ollama", "Qwen3 4B", "Kokoro", "GLSL"],
    facts: [
      {
        value: "100%",
        label: {
          en: "of the speech and language models run on my own GPU, none in the cloud",
          es: "de los modelos de voz y lenguaje corren en mi propia GPU, ninguno en la nube",
        },
      },
      {
        value: "5 min",
        valueEs: "5 min",
        label: {
          en: "between background checks of calendar, mail and tasks",
          es: "entre revisiones en segundo plano de calendario, correo y tareas",
        },
      },
    ],
    links: [
      {
        label: { en: "LinuxRicing on GitHub", es: "LinuxRicing en GitHub" },
        href: LINUXRICING_URL,
        kind: "github",
      },
    ],
    orbit: { r: 44, period: 330, phase: 1.15 },
  },
];
