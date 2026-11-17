import type { LocalizedText } from "./types";

/**
 * Olimpo and Warp, case 02. Facts were checked against the Olimpo repo
 * (package.json, roadmap table, git history, test files). The interface shown
 * on the page is a recreation with invented data: nothing here is Alberto's
 * real tasks, health, money or places. No routes, ports, hostnames or
 * security thresholds.
 */

export const OLIMPO = {
  eyebrow: { en: "02 · Self-hosted, in daily use", es: "02 · Autoalojado, en uso diario" },
  title: { en: "Olimpo", es: "Olimpo" },
  tagline: {
    en: "The operating system of my life.",
    es: "El sistema operativo de mi vida.",
  },
  lead: {
    en: "One app, on my desktop and my phone, for my tasks, projects, health, money, calendar and the AI agents that work for me. All of the data lives on a Raspberry Pi 5 at home; Olimpo is the window into it. I designed it, built it and use it every day.",
    es: "Una app, en el escritorio y en el móvil, para mis tareas, proyectos, salud, dinero, calendario y los agentes de IA que trabajan para mí. Todos los datos viven en una Raspberry Pi 5 en casa; Olimpo es la ventana a ellos. La diseñé, la programé y la uso cada día.",
  },
  metaphor: {
    en: "The whole interface is a sky. Projects are constellations, tasks are stars, and only what's happening now is lit. On the desktop it's a star map called Firmamento; on the phone, the sky of the Hours, which follows the real time and weather.",
    es: "Toda la interfaz es un cielo. Los proyectos son constelaciones, las tareas son estrellas y solo brilla lo que pasa ahora. En el escritorio es un mapa estelar, el Firmamento; en el móvil, el cielo de las Horas, que sigue la hora y el tiempo de verdad.",
  },
  views: {
    desktop: { en: "Desktop · Firmamento", es: "Escritorio · Firmamento" },
    phone: { en: "Phone · Sky of the Hours", es: "Móvil · Cielo de las Horas" },
    label: { en: "Choose a view", es: "Elige una vista" },
  },
  recreation: {
    en: "Recreated for this page with invented data. The real one stays private.",
    es: "Recreado para esta página con datos inventados. El de verdad es privado.",
  },
  pillars: [
    {
      n: "I",
      title: { en: "Horas, the only door", es: "Horas, la única puerta" },
      body: {
        en: "In the Iliad the Hours guard the gates of Olympus. Here they're a small gateway I hardened myself: nothing else on the Pi is exposed, every client has its own token and permissions, and the gateway only keeps a SHA-256 hash of each token.",
        es: "En la Ilíada las Horas guardan las puertas del Olimpo. Aquí son una pasarela pequeña que endurecí yo: nada más de la Pi está expuesto, cada cliente tiene su token y sus permisos, y la pasarela solo guarda un hash SHA-256 de cada token.",
      },
    },
    {
      n: "II",
      title: { en: "Agents are first-class citizens", es: "Los agentes son de primera" },
      body: {
        en: "Everything I can read or do, my agents can too, through the same API with their own token: my personal assistant, Aurora on the Pi, Laura on my laptop and Claude Code. Every write goes to an append-only journal and can be undone, so they don't need to ask at every step.",
        es: "Todo lo que yo puedo leer o hacer, mis agentes también, por la misma API y con su propio token: mi asistente personal, Aurora en la Pi, Laura en el portátil y Claude Code. Cada escritura va a un diario de solo añadir y se puede deshacer, así que no tienen que pedir permiso a cada paso.",
      },
    },
    {
      n: "III",
      title: { en: "Look, don't maintain", es: "Mirar, no mantener" },
      body: {
        en: "Data arrives on its own: GitHub, my portfolio tracker, my watch and the calendar write it. Home shows three to five things and the rest is one tap away. Opening it should feel calm, not like a to-do list.",
        es: "Los datos entran solos: GitHub, mi cartera, el reloj y el calendario los escriben. Inicio enseña de tres a cinco cosas y el resto está a un toque. Abrirlo tiene que dar calma, no ansiedad.",
      },
    },
  ] satisfies { n: string; title: LocalizedText; body: LocalizedText }[],
  facts: [
    { value: "36", label: { en: "versions planned in its roadmap, each designed before it's built", es: "versiones en su roadmap, cada una diseñada antes de programarla" } },
    { value: "v2.19.1", label: { en: "running in production on the Pi", es: "en producción en la Pi" } },
    { value: "390+", valueEs: "390", preEs: "más de", label: { en: "commits since November 2026", es: "commits desde noviembre de 2026" } },
    { value: "2,000+", valueEs: "2.000", preEs: "más de", label: { en: "automated tests, app and backend", es: "tests automáticos, app y backend" } },
  ] satisfies { value: string; valueEs?: string; preEs?: string; label: LocalizedText }[],
  stack: ["Svelte 5", "TypeScript", "Vite", "WebGL", "Python", "FastAPI", "SQLite", "Docker", "Web Push", "PWA"],
};

/** Invented data for the recreated interface. */
export const OLIMPO_DEMO = {
  greeting: { en: "Good evening", es: "Buenas tardes" },
  date: { en: "Thursday 12 · November", es: "jueves 12 · de noviembre" },
  focus: { en: "Focus for today", es: "Foco de hoy" },
  focusVoice: {
    en: "Four stars for today. The rest of the sky can wait.",
    es: "Cuatro estrellas para hoy. El resto del cielo puede esperar.",
  },
  tasks: [
    { en: "Reply to the beta feedback", es: "Responder al feedback de la beta", project: "Wari", done: true },
    { en: "Linear algebra problem set", es: "Hoja de álgebra lineal", project: "Uni", done: false },
    { en: "Gym: upper body", es: "Gimnasio: tren superior", project: "Vida", done: false },
    { en: "Polish the Warp portal", es: "Pulir el portal de Warp", project: "Olimpo", done: false },
  ],
  search: { en: "Search a star or create one with +", es: "Busca una estrella o crea una con +" },
  now: { en: "now", es: "ahora" },
  next: { en: "Next", es: "Lo siguiente" },
  nextItem: { en: "Seminar · 19:30", es: "Seminario · 19:30" },
  latest: { en: "Latest", es: "Lo último" },
  latestItem: { en: "Aurora closed 2 tasks", es: "Aurora cerró 2 tareas" },
  weather: { en: "4° · clear", es: "4° · despejado" },
  city: { en: "Kraków", es: "Cracovia" },
  constellations: ["WARI", "OLIMPO", "UNI"],
};

export const WARP = {
  title: { en: "Warp", es: "Warp" },
  tagline: {
    en: "Files and the clipboard, from any device to any other, instantly.",
    es: "Archivos y portapapeles, de cualquier dispositivo a cualquier otro, al instante.",
  },
  body: {
    en: "Select files on my laptop, press Super+Space and they fall into a black hole at the top of the screen. On my phone a white hole spits them out. With Super held, each Space jumps to the next device; with Shift it adds one, and the two portals merge into a bigger one. Nothing to pick, no cable, no chat with myself.",
    es: "Selecciono archivos en el portátil, pulso Super+Espacio y caen en un agujero negro en lo alto de la pantalla. En el móvil, un agujero blanco los escupe. Con Super pulsado, cada Espacio salta al siguiente dispositivo; con Shift suma uno, y los dos portales se funden en uno más grande. Nada que elegir, ni cables, ni chats conmigo mismo.",
  },
  shaderNote: {
    en: "The portal on this page is the same GLSL shader that runs in the app and on my desktop, with the light bent around the hole like a gravitational lens.",
    es: "El portal de esta página es el mismo shader GLSL que corre en la app y en mi escritorio, con la luz curvada alrededor del agujero como una lente gravitacional.",
  },
  send: { en: "Send to phone", es: "Enviar al móvil" },
  sent: { en: "Sent", es: "Enviado" },
  again: { en: "Send again", es: "Enviar otra vez" },
  canvasLabel: {
    en: "Warp portal demo: files fall into a black hole",
    es: "Demo del portal de Warp: los archivos caen en un agujero negro",
  },
  files: ["apuntes-algebra.pdf", "foto-rynek.jpg", "“link del piso”"],
  steps: [
    { k: "Super + Space", label: { en: "send what's selected", es: "envía lo seleccionado" } },
    { k: "Space", label: { en: "next device, Super held", es: "siguiente dispositivo, con Super" } },
    { k: "Shift", label: { en: "add a device", es: "suma un dispositivo" } },
  ],
};
