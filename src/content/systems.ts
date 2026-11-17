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
    en: "Olimpo is the window; behind it, one Raspberry Pi 5 takes in my money, my health, my mail and my code, crosses them, and hands the result to my phone, my desktop and my voice assistant. Every line below is a real data flow.",
    es: "Olimpo es la ventana; detrás, una Raspberry Pi 5 recibe mi dinero, mi salud, mi correo y mi código, los cruza y entrega el resultado al móvil, al escritorio y a mi asistente de voz. Cada línea de abajo es un flujo de datos real.",
  },
  phases: [
    { en: "Sources write in", es: "Las fuentes escriben" },
    { en: "The Pi crosses them", es: "La Pi las cruza" },
    { en: "Everything reads out", es: "Todo lo lee" },
  ],
  sources: { en: "Sources", es: "Fuentes" },
  outputs: { en: "Where it shows up", es: "Dónde aparece" },
  pi: { en: "Raspberry Pi 5 · at home", es: "Raspberry Pi 5 · en casa" },
  diagramLabel: {
    en: "Data flow diagram: sources on the left, services on the Raspberry Pi in the middle, outputs on the right. Select a node to see its connections.",
    es: "Diagrama de flujo de datos: fuentes a la izquierda, servicios en la Raspberry Pi en el centro y salidas a la derecha. Elige un nodo para ver sus conexiones.",
  },
  details: { en: "The systems, one by one", es: "Los sistemas, uno a uno" },
  star: { en: "Raspberry Pi 5", es: "Raspberry Pi 5" },
  stageLabel: {
    en: "Orbital map of my systems. Select a planet to read about it.",
    es: "Mapa orbital de mis sistemas. Elige un planeta para leer sobre él.",
  },
  hint: {
    en: "Hover, focus or tap a node to follow its data",
    es: "Pasa por encima, enfoca o toca un nodo para seguir sus datos",
  },
  runsOn: { en: "Runs on", es: "Corre en" },
  stack: { en: "Stack", es: "Stack" },
} satisfies Record<string, LocalizedText | LocalizedText[]>;

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
        value: "3",
        label: {
          en: "brokers imported from their own CSV exports, each trade counted once by its ISIN",
          es: "brókers importados de sus propios CSV, cada operación contada una vez por su ISIN",
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
    links: [
      {
        label: { en: "gts2-mando on GitHub", es: "gts2-mando en GitHub" },
        href: "https://github.com/Alberviz/gts2-mando",
        kind: "github",
      },
    ],
    orbit: { r: 36, period: 260, phase: 5.55 },
  },
  {
    id: "instinct",
    name: { en: "Instinct", es: "Instinct" },
    line: {
      en: "My personal assistant, and the closest thing to a second brain.",
      es: "Mi asistente personal, lo más parecido a un segundo cerebro.",
    },
    body: {
      en: "I talk to Instinct on WhatsApp like I'd talk to a person. It reaches every area of Olimpo, so it notes down what I ate, how I trained, a task or an idea the moment I say it, and remembers all of it. Every morning it reads my day and agrees the focus with me; at night it closes the day with me.",
      es: "Hablo con Instinct por WhatsApp como hablaría con una persona. Llega a todas las áreas de Olimpo, así que apunta lo que he comido, cómo he entrenado, una tarea o una idea en cuanto se lo digo, y se acuerda de todo. Cada mañana lee mi día y acordamos el foco; por la noche cerramos el día juntos.",
    },
    host: { en: "WhatsApp, talking to Olimpo through Horas", es: "WhatsApp, hablando con Olimpo a través de Horas" },
    stack: ["WhatsApp", "Olimpo API", "Horas"],
    facts: [
      {
        value: "3 to 5",
        valueEs: "3 a 5",
        label: {
          en: "essential tasks in the focus we agree every morning, never a long list",
          es: "tareas esenciales en el foco que acordamos cada mañana, nunca una lista larga",
        },
      },
      {
        value: "1",
        label: {
          en: "place where everything it notes down lands: Olimpo, never scattered lists",
          es: "sitio donde acaba todo lo que apunta: Olimpo, nunca listas sueltas",
        },
      },
    ],
    orbit: { r: 38, period: 260, phase: 2.4 },
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

/* ------------------------------------------------------------------------
 * The data-flow diagram (rebuilt from the second-pass topology): sources,
 * services on the Pi and outputs. No routes, ports, hosts, schedules or
 * security limits; the business stays unnamed.
 * ---------------------------------------------------------------------- */

export type FlowColumn = "source" | "service" | "output";

export interface FlowNode {
  id: string;
  col: FlowColumn;
  name: LocalizedText;
  sub: LocalizedText;
  /** What crosses through this node, one line. */
  detail: LocalizedText;
  /** Centre in the wide (1200 x 600) and tall (390 x 880) layouts. */
  wide: [number, number];
  tall: [number, number];
}

export const FLOW_NODES: FlowNode[] = [
  { id: "brokers", col: "source", name: { en: "Brokers", es: "Brókers" }, sub: { en: "Trade Republic · MyInvestor · Revolut", es: "Trade Republic · MyInvestor · Revolut" }, detail: { en: "Their CSV exports, checked in a dry run and deduplicated by ISIN, become trades in the portfolio.", es: "Sus exportaciones CSV, revisadas en simulacro y sin duplicados por ISIN, se convierten en operaciones de la cartera." }, wide: [110, 45], tall: [100, 40] },
  { id: "business", col: "source", name: { en: "Personal business", es: "Negocio personal" }, sub: { en: "product sales, synced nightly", es: "venta de productos, cada noche" }, detail: { en: "My personal product-selling business reports cash collected and profit actually made; unsold stock counts as zero.", es: "Mi negocio personal de venta de productos aporta la caja cobrada y el beneficio ya hecho; el stock sin vender cuenta como cero." }, wide: [110, 116], tall: [290, 40] },
  { id: "wari", col: "source", name: { en: "Wari", es: "Wari" }, sub: { en: "my share of group spending", es: "mi parte de los gastos" }, detail: { en: "Wari, my own app, sends my share of group expenses, my income and what I owe per bank.", es: "Wari, mi propia app, envía mi parte de los gastos de grupo, mis ingresos y lo que debo por banco." }, wide: [110, 187], tall: [100, 105] },
  { id: "github", col: "source", name: { en: "GitHub", es: "GitHub" }, sub: { en: "commits and projects", es: "commits y proyectos" }, detail: { en: "Commits land in Olimpo's projects by themselves, so progress is never typed by hand.", es: "Los commits entran solos en los proyectos de Olimpo: el progreso nunca se apunta a mano." }, wide: [110, 258], tall: [290, 105] },
  { id: "google", col: "source", name: { en: "Google Workspace", es: "Google Workspace" }, sub: { en: "mail, calendar, Drive", es: "correo, agenda, Drive" }, detail: { en: "Aurora reaches Gmail, Calendar, Drive and more through 73 MCP tools; university mail is read as inert text.", es: "Aurora llega a Gmail, Calendar, Drive y más con 73 herramientas MCP; el correo de la universidad se lee como texto inerte." }, wide: [110, 329], tall: [100, 170] },
  { id: "watch", col: "source", name: { en: "Watch", es: "Reloj" }, sub: { en: "Amazfit GTS 2 · steps, sleep, pulse", es: "Amazfit GTS 2 · pasos, sueño, pulso" }, detail: { en: "Steps, sleep stages and heart rate come in through the Google Health API; its music buttons log creatine or a meal.", es: "Pasos, fases de sueño y pulso entran por la Google Health API; sus botones de música apuntan la creatina o una comida." }, wide: [110, 400], tall: [290, 170] },
  { id: "meals", col: "source", name: { en: "Meals by voice", es: "Comidas por voz" }, sub: { en: "a voice note on Telegram", es: "una nota de voz en Telegram" }, detail: { en: "I say what I ate; Gemini turns it into foods and calories and the hub weighs it against what I burned.", es: "Digo lo que he comido; Gemini lo convierte en alimentos y calorías y el hub lo compara con lo que gasté." }, wide: [110, 471], tall: [100, 235] },
  { id: "gym", col: "source", name: { en: "Gym log", es: "Gimnasio" }, sub: { en: "my openGym fork", es: "mi fork de openGym" }, detail: { en: "Workouts, sets and body weight from my own openGym fork, mirrored to compute volume, estimated 1RM and PRs.", es: "Entrenos, series y peso de mi propio fork de openGym, replicados para calcular volumen, 1RM estimado y récords." }, wide: [110, 542], tall: [290, 235] },

  { id: "networth", col: "service", name: { en: "Net worth", es: "Patrimonio" }, sub: { en: "Ghostfolio · Postgres · Redis", es: "Ghostfolio · Postgres · Redis" }, detail: { en: "One portfolio from every account, in an isolated Docker network, with 14 daily and 8 weekly backups.", es: "Una cartera con todas las cuentas, en una red Docker aislada, con 14 copias diarias y 8 semanales." }, wide: [600, 115], tall: [100, 400] },
  { id: "olimpo", col: "service", name: { en: "Olimpo + Horas", es: "Olimpo + Horas" }, sub: { en: "the app and its only door", es: "la app y su única puerta" }, detail: { en: "Tasks, projects, health and money in one API behind Horas, the gateway: each client has its own token and permissions.", es: "Tareas, proyectos, salud y dinero en una API tras Horas, la pasarela: cada cliente tiene su token y sus permisos." }, wide: [600, 248], tall: [290, 400] },
  { id: "aurora", col: "service", name: { en: "Aurora", es: "Aurora" }, sub: { en: "Hermes agent, always on", es: "agente Hermes, siempre en marcha" }, detail: { en: "Runs my inbox and calendar, records trades into the portfolio through a least-privilege proxy, and closes tasks in Olimpo.", es: "Lleva mi correo y mi agenda, registra operaciones en la cartera a través de un proxy de mínimo privilegio y cierra tareas en Olimpo." }, wide: [600, 381], tall: [100, 510] },
  { id: "health", col: "service", name: { en: "Health hub", es: "Hub de salud" }, sub: { en: "gym-hub · SQLite · Gemini", es: "gym-hub · SQLite · Gemini" }, detail: { en: "Joins the four feeds per day, estimates the calories burned and keeps an append-only journal where any write can be undone.", es: "Une las cuatro fuentes por día, estima las calorías gastadas y guarda un diario de solo añadir donde toda escritura se puede deshacer." }, wide: [600, 514], tall: [290, 510] },

  { id: "wealthapp", col: "output", name: { en: "Wealth app", es: "App de patrimonio" }, sub: { en: "read-only, behind a PIN", es: "solo lectura, tras un PIN" }, detail: { en: "Net worth curve and allocation; its token can only read, and a test proves every write is refused.", es: "Curva de patrimonio y reparto; su token solo puede leer y un test demuestra que toda escritura se rechaza." }, wide: [1090, 40], tall: [100, 650] },
  { id: "laura", col: "output", name: { en: "Laura", es: "Laura" }, sub: { en: "voice, on my laptop GPU", es: "voz, en la GPU del portátil" }, detail: { en: "Ask out loud for a balance, a task or the day ahead; she reads the Pi with her own token.", es: "Le pregunto en voz alta por un saldo, una tarea o el día; lee la Pi con su propio token." }, wide: [1090, 127], tall: [290, 650] },
  { id: "app", col: "output", name: { en: "Olimpo app", es: "App Olimpo" }, sub: { en: "phone, tablet and PC", es: "móvil, tablet y PC" }, detail: { en: "The sky of the Hours on the phone, Firmamento on the desktop, and Warp between them.", es: "El cielo de las Horas en el móvil, el Firmamento en el escritorio y Warp entre ellos." }, wide: [1090, 213], tall: [100, 715] },
  { id: "telegram", col: "output", name: { en: "Aurora on Telegram", es: "Aurora en Telegram" }, sub: { en: "text and voice notes", es: "texto y notas de voz" }, detail: { en: "Anything outward, like sending an email, waits for my confirmation in the chat.", es: "Todo lo que sale hacia fuera, como enviar un correo, espera mi confirmación en el chat." }, wide: [1090, 300], tall: [290, 715] },
  { id: "coach", col: "output", name: { en: "Telegram coach", es: "Coach en Telegram" }, sub: { en: "habits, week, summary", es: "hábitos, semana, resumen" }, detail: { en: "Reminders per habit and a weekly summary written by Gemini that reads training, sleep, food and steps together.", es: "Recordatorios por hábito y un resumen semanal de Gemini que lee juntos entreno, sueño, comida y pasos." }, wide: [1090, 387], tall: [100, 780] },
  { id: "planet", col: "output", name: { en: "Body planet", es: "Planeta Cuerpo" }, sub: { en: "on my Linux desktop", es: "en mi escritorio Linux" }, detail: { en: "A planet on the desktop drawn from a read-only summary of the hub.", es: "Un planeta del escritorio dibujado con un resumen de solo lectura del hub." }, wide: [1090, 473], tall: [290, 780] },
  { id: "instinct", col: "output", name: { en: "Instinct", es: "Instinct" }, sub: { en: "my personal assistant, on WhatsApp", es: "mi asistente personal, por WhatsApp" }, detail: { en: "My second brain with a voice: it reads everything in Olimpo, notes down what I tell it, remembers it all and runs my morning and evening check-ins, with a token that reaches every area.", es: "Mi segundo cerebro con voz: lo lee todo en Olimpo, apunta lo que le cuento, se acuerda de todo y lleva mis repasos de la mañana y de la noche, con un token que llega a todas las áreas." }, wide: [1090, 560], tall: [195, 845] },
];

/** Edges: phase 0 sources to services, 1 between services, 2 services to outputs. */
export const FLOW_EDGES: { from: string; to: string; phase: 0 | 1 | 2 }[] = [
  { from: "brokers", to: "networth", phase: 0 },
  { from: "business", to: "networth", phase: 0 },
  { from: "wari", to: "networth", phase: 0 },
  { from: "github", to: "olimpo", phase: 0 },
  { from: "google", to: "aurora", phase: 0 },
  { from: "watch", to: "health", phase: 0 },
  { from: "meals", to: "health", phase: 0 },
  { from: "gym", to: "health", phase: 0 },
  { from: "networth", to: "olimpo", phase: 1 },
  { from: "health", to: "olimpo", phase: 1 },
  { from: "aurora", to: "olimpo", phase: 1 },
  { from: "aurora", to: "networth", phase: 1 },
  { from: "networth", to: "wealthapp", phase: 2 },
  { from: "networth", to: "laura", phase: 2 },
  { from: "olimpo", to: "laura", phase: 2 },
  { from: "olimpo", to: "app", phase: 2 },
  { from: "aurora", to: "telegram", phase: 2 },
  { from: "health", to: "coach", phase: 2 },
  { from: "health", to: "planet", phase: 2 },
  { from: "olimpo", to: "instinct", phase: 2 },
  { from: "networth", to: "instinct", phase: 2 },
  { from: "health", to: "instinct", phase: 2 },
];
