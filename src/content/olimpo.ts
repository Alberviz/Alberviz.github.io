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
  kicker: { en: "Inside Olimpo", es: "Dentro de Olimpo" },
  tagline: {
    en: "Files and the clipboard, from any device to any other, through a black hole.",
    es: "Archivos y portapapeles, de cualquier dispositivo a cualquier otro, a través de un agujero negro.",
  },
  body: {
    en: "Drag something toward the top of my laptop's screen and a portal opens for each device: phone and tablet along the top edge, the TV on the right. Drop it in one and the black hole swallows it; on that device a white hole spits it out. Both are real-time shaders: a disk traced along true light paths, and a gravitational lens that bends the screen itself around the shadow.",
    es: "Arrastro algo hacia arriba en la pantalla del portátil y se abre un portal por dispositivo: el móvil y la tablet en el borde de arriba, la tele a la derecha. Lo suelto en uno y el agujero negro se lo traga; en ese dispositivo, un agujero blanco lo escupe. Los dos son shaders en tiempo real: un disco trazado siguiendo rayos de luz de verdad y una lente gravitatoria que curva la propia pantalla alrededor de la sombra.",
  },
  demoHint: {
    en: "Drag a file to the top edge and drop it in a portal. Hold Shift over two portals to merge them.",
    es: "Arrastra un archivo al borde de arriba y suéltalo en un portal. Con Shift sobre dos portales, se funden.",
  },
  demoHintTouch: {
    en: "Tap a file, then tap a portal.",
    es: "Toca un archivo y después un portal.",
  },
  realFile: {
    en: "You can also drop a file of your own. It never leaves your browser: only its name and size are read, to draw it.",
    es: "También puedes soltar un archivo tuyo. Nunca sale de tu navegador: solo se leen su nombre y su tamaño para dibujarlo.",
  },
  both: { en: "Shift · to both", es: "Shift · a los dos" },
  cancel: { en: "Cancel", es: "Cancelar" },
  canvasLabel: {
    en: "Warp demo: a recreated laptop screen with files, three portals on its top edge and three devices that receive",
    es: "Demo de Warp: una pantalla de portátil recreada con archivos, tres portales en su borde superior y tres dispositivos que reciben",
  },
  filesLabel: { en: "Files in Downloads", es: "Archivos de Descargas" },
  portalsLabel: { en: "Portals", es: "Portales" },
  devicesLabel: { en: "Devices that receive", es: "Dispositivos que reciben" },
  tray: { en: "From the PC", es: "Desde el PC" },
  trayEmpty: { en: "Nothing yet", es: "Nada todavía" },
  playing: { en: "Streaming to the TV", es: "En streaming en la tele" },
  dropToSend: { en: "Drop to send", es: "Suelta para enviar" },
  dropToPlay: { en: "Drop to play", es: "Suelta para reproducir" },
  onlyVideo: { en: "Video and torrents only", es: "Solo vídeo y torrents" },
  trayDetail: { en: "Tray “From the PC”", es: "Bandeja «Desde el PC»" },
  tvDetail: { en: "Video and torrents, streamed", es: "Vídeo y torrents, en streaming" },
  sent: { en: "Sent to", es: "Enviado a" },
  devices: [
    { id: "movil", kicker: "WARP", name: { en: "Phone", es: "Móvil" }, title: { en: "Phone · Olimpo", es: "Móvil · Olimpo" } },
    { id: "tablet", kicker: "WARP", name: { en: "Tablet", es: "Tablet" }, title: { en: "Tablet · Olimpo", es: "Tablet · Olimpo" } },
    { id: "tele", kicker: "TELE", name: { en: "TV", es: "Tele" }, title: { en: "Living room TV", es: "Tele del salón" } },
  ] satisfies { id: string; kicker: string; name: LocalizedText; title: LocalizedText }[],
  files: [
    { name: "apuntes-algebra.pdf", kind: "pdf", size: "2,4 MB" },
    { name: "foto-rynek.jpg", kind: "image", size: "4,1 MB" },
    { name: "tatras-timelapse.mp4", kind: "video", size: "812 MB" },
    { name: "“link del piso”", kind: "text", size: "38 B" },
  ] satisfies { name: string; kind: "pdf" | "image" | "video" | "text"; size: string }[],
  keys: [
    { k: ["Super", "Space"], label: { en: "sends what's selected to the last device, or the clipboard if nothing is", es: "manda lo seleccionado al último dispositivo, o el portapapeles si no hay nada" } },
    { k: ["Space"], label: { en: "with Super held, jumps to the next device's portal", es: "con Super pulsado, salta al portal del siguiente dispositivo" } },
    { k: ["Shift"], label: { en: "adds a device: the two portals merge into a bigger one", es: "suma un dispositivo: los dos portales se funden en uno más grande" } },
  ] satisfies { k: string[]; label: LocalizedText }[],
  detailOpen: { en: "See the shortcuts and how it is made", es: "Ver los atajos y cómo está hecho" },
  detailClose: { en: "Hide the shortcuts", es: "Ocultar los atajos" },
  keysNote: {
    en: "No menus and no device picker: the keyboard chooses the destination. Dropping a file between two portals merges them too, and it lands on both.",
    es: "Sin menús ni selector de dispositivos: el teclado elige el destino. Soltar un archivo entre dos portales también los funde, y llega a los dos.",
  },
  cast: {
    title: { en: "And the TV is just another portal.", es: "Y la tele es un portal más." },
    body: {
      en: "Dropping a video on the TV portal casts it; dropping a torrent or a magnet link streams it while it downloads, so the film starts in seconds. The same system that moves a PDF to my phone puts things on the big screen.",
      es: "Si suelto un vídeo en el portal de la tele, se reproduce en ella; si suelto un torrent o un enlace magnet, se emite en streaming mientras se descarga, así que la peli empieza en segundos. El mismo sistema que pasa un PDF al móvil pone cosas en la pantalla grande.",
    },
  },
  shaderNote: {
    en: "Ported to WebGL from Olimpo v2.16 to v2.19.1 and my desktop: holes born from a point, a lensed starfield, soft edges and dithering, the screen bent around the shadow, the HUD plate and the merge.",
    es: "Portado a WebGL desde Olimpo v2.16 a v2.19.1 y mi escritorio: agujeros que nacen desde un punto, cielo con lente, bordes suaves y tramado, la pantalla curvada alrededor de la sombra, la placa del HUD y la fusión.",
  },
  route: {
    label: { en: "One send, any direction", es: "Un envío, en cualquier dirección" },
    pc: { en: "Laptop", es: "Portátil" },
  },
};
