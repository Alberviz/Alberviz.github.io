import type { LocalizedText } from "./types";
import { LINUXRICING_URL } from "./links";

/**
 * #laura: the voice assistant on my laptop. Every number comes from the audit of
 * the real repo (67 tools, 0.65 s median, 81% over 185 evaluation phrases, a 6 GB
 * RTX 4050). The demo data (files, agenda) is invented. No paths, sockets, IPs or
 * people: the section only says what Laura does and how she is built.
 */

type T = LocalizedText;

export const LAURA_URL = LINUXRICING_URL;

export const LAURA_HEAD = {
  title: { en: "Laura", es: "Laura" },
  tagline: {
    en: "I talk to my computer and it does the work.",
    es: "Le hablo a mi ordenador y hace el trabajo.",
  },
  lead: {
    en: "Laura lives on my laptop and runs the whole computer by voice: windows, files, calendar, music, the TV, the lights, even other coding agents. Listening, thinking and speaking all happen on the laptop itself, so what I say never leaves the machine.",
    es: "Laura vive en mi portátil y controla el ordenador entero con la voz: ventanas, archivos, calendario, música, la tele, las luces e incluso otros agentes de código. Escuchar, pensar y hablar pasa todo en el propio portátil, así que lo que digo no sale de la máquina.",
  },
  note: {
    en: "I wanted an assistant I could trust with my files. So she can do a lot, and she cannot do anything destructive until I say yes.",
    es: "Quería un asistente al que poder confiar mis archivos. Así que puede hacer mucho, y no puede hacer nada destructivo hasta que yo diga que sí.",
  },
  facts: [
    {
      value: "67",
      valueEs: "67",
      label: { en: "tools she can call, from windows to files to the TV", es: "herramientas que puede llamar, de las ventanas a los archivos y la tele" },
    },
    {
      value: "0.65 s",
      valueEs: "0,65 s",
      label: { en: "median time to her first response", es: "de mediana hasta su primera respuesta" },
    },
  ] satisfies { value: string; valueEs: string; label: T }[],
  repo: { en: "Laura lives in LinuxRicing on GitHub", es: "Laura vive en LinuxRicing, en GitHub" },
} satisfies Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* The holographic demo                                                */
/* ------------------------------------------------------------------ */

export type CommandId = "downloads" | "week" | "duplicates" | "phone" | "focus";

export interface DemoCommand {
  id: CommandId;
  say: T;
  /** Tools she calls for this phrase (internal names, as they are in the code). */
  tools: string[];
  reply: T[];
}

export const DEMO_UI = {
  heading: { en: "Ask her for something.", es: "Pídele algo." },
  lead: {
    en: "When an answer is something I should see, Laura draws it as holograms floating over my desktop. This one runs in your browser.",
    es: "Cuando la respuesta es algo que debo ver, Laura lo dibuja como hologramas que flotan sobre mi escritorio. Esta corre en tu navegador.",
  },
  pick: { en: "Pick what to say", es: "Elige qué decirle" },
  idle: { en: "Say \"Laura\" and ask", es: "Di \"Laura\" y pregunta" },
  states: {
    idle: { en: "Waiting", es: "Esperando" },
    listening: { en: "Listening", es: "Escuchando" },
    thinking: { en: "Thinking", es: "Pensando" },
    speaking: { en: "Speaking", es: "Hablando" },
  },
  caption: {
    en: "A recreation: the files and the agenda are invented, the timings are the real ones from my shell.",
    es: "Una recreación: los archivos y la agenda son inventados, los tiempos son los reales de mi shell.",
  },
  hintRows: {
    en: "Click a row, or press its number, to open it",
    es: "Pulsa una fila, o su número, para abrirla",
  },
  stageLabel: {
    en: "Interactive recreation of Laura's holograms",
    es: "Recreación interactiva de los hologramas de Laura",
  },
  reset: { en: "Clear the screen", es: "Limpiar la pantalla" },
  warpLabel: { en: "Warp", es: "Warp" },
  trashLabel: { en: "Trash", es: "Papelera" },
  voiceReply: { en: "Voice reply", es: "Respuesta por voz" },
} satisfies Record<string, unknown>;

export const DEMO_COMMANDS: DemoCommand[] = [
  {
    id: "downloads",
    say: { en: "Laura, show me the downloads", es: "Laura, enséñame las descargas" },
    tools: ["mostrar_archivos"],
    reply: [
      { en: "Here are your downloads.", es: "Estas son tus descargas." },
      { en: "Eight files, newest first.", es: "Ocho archivos, los más recientes primero." },
    ],
  },
  {
    id: "week",
    say: { en: "What do I have this week?", es: "¿Qué tengo esta semana?" },
    tools: ["agenda"],
    reply: [
      { en: "Thirteen things this week.", es: "Trece cosas esta semana." },
      { en: "Thursday is the heaviest.", es: "El jueves es el más cargado." },
    ],
  },
  {
    id: "duplicates",
    say: { en: "Find the duplicates and delete them", es: "Busca los duplicados y bórralos" },
    tools: ["duplicados", "borrar_archivos"],
    reply: [
      { en: "I found three copies you don't need.", es: "He encontrado tres copias que no necesitas." },
      { en: "Shall I move them to the trash?", es: "¿Las muevo a la papelera?" },
    ],
  },
  {
    id: "phone",
    say: { en: "Send that one to my phone", es: "Manda esa al móvil" },
    tools: ["warp"],
    reply: [{ en: "Sent to your phone.", es: "Enviada a tu móvil." }],
  },
  {
    id: "focus",
    say: { en: "Put something on the TV to help me focus", es: "Pon algo para concentrarme en la tele" },
    tools: ["cola_dj", "mandar_a_tele"],
    reply: [
      { en: "Putting a focus mix on the living room TV.", es: "Pongo una mezcla para concentrarte en la tele del salón." },
    ],
  },
];

export const DEMO_REPLIES = {
  trashed: {
    en: "Done. Three files in the trash. Say undo to bring them back.",
    es: "Hecho. Tres archivos en la papelera. Di deshaz para recuperarlos.",
  },
  undone: { en: "Brought them back.", es: "Los he recuperado." },
  cancelled: { en: "Cancelled. Nothing was touched.", es: "Cancelado. No he tocado nada." },
  expired: { en: "The plan expired. Nothing was touched.", es: "El plan ha caducado. No he tocado nada." },
} satisfies Record<string, T>;

export const DEMO_TOASTS = {
  trashed: { en: "3 files in the trash", es: "3 archivos en la papelera" },
  undo: { en: "Undo", es: "Deshacer" },
  sent: { en: "Sent to the phone by Warp", es: "Enviada al móvil con Warp" },
  asked: { en: "Say yes, or press the button", es: "Di sí, o pulsa el botón" },
} satisfies Record<string, T>;

export type FileKind = "pdf" | "image" | "text" | "zip";

export interface DemoFile {
  n: number;
  kind: FileKind;
  name: T;
  meta: T;
  size: string;
  sizeEs?: string;
}

/** Eight invented downloads, newest first. A Maths and CS student in Krakow. */
export const DEMO_FILES: DemoFile[] = [
  { n: 1, kind: "pdf", name: { en: "linear-algebra-notes-4.pdf", es: "apuntes-algebra-tema-4.pdf" }, meta: { en: "12 pages", es: "12 páginas" }, size: "2.4 MB", sizeEs: "2,4 MB" },
  { n: 2, kind: "image", name: { en: "wawel-sunset.jpg", es: "wawel-atardecer.jpg" }, meta: { en: "Photo", es: "Foto" }, size: "4.1 MB", sizeEs: "4,1 MB" },
  { n: 3, kind: "pdf", name: { en: "erasmus-timetable.pdf", es: "horario-erasmus.pdf" }, meta: { en: "2 pages", es: "2 páginas" }, size: "310 KB" },
  { n: 4, kind: "zip", name: { en: "lab-3-submission.zip", es: "entrega-practica-3.zip" }, meta: { en: "Archive", es: "Archivo" }, size: "18 MB" },
  { n: 5, kind: "pdf", name: { en: "train-krakow-prague.pdf", es: "tren-cracovia-praga.pdf" }, meta: { en: "Ticket", es: "Billete" }, size: "186 KB" },
  { n: 6, kind: "text", name: { en: "pierogi-recipes.txt", es: "recetas-pierogi.txt" }, meta: { en: "Text", es: "Texto" }, size: "4 KB" },
  { n: 7, kind: "image", name: { en: "main-square.jpg", es: "plaza-del-mercado.jpg" }, meta: { en: "Photo", es: "Foto" }, size: "3.6 MB", sizeEs: "3,6 MB" },
  { n: 8, kind: "pdf", name: { en: "matrix-exercises.pdf", es: "ejercicios-matrices.pdf" }, meta: { en: "6 pages", es: "6 páginas" }, size: "1.1 MB", sizeEs: "1,1 MB" },
];

/** Three duplicate copies that the delete flow lists. */
export const DEMO_DUPES: DemoFile[] = [
  { n: 1, kind: "image", name: { en: "wawel-sunset (1).jpg", es: "wawel-atardecer (1).jpg" }, meta: { en: "Same content", es: "Mismo contenido" }, size: "4.1 MB", sizeEs: "4,1 MB" },
  { n: 2, kind: "image", name: { en: "wawel-sunset (2).jpg", es: "wawel-atardecer (2).jpg" }, meta: { en: "Same content", es: "Mismo contenido" }, size: "4.1 MB", sizeEs: "4,1 MB" },
  { n: 3, kind: "pdf", name: { en: "algebra-notes (copy).pdf", es: "apuntes-algebra (copia).pdf" }, meta: { en: "Same content", es: "Mismo contenido" }, size: "2.4 MB", sizeEs: "2,4 MB" },
];

export const DEMO_PANELS = {
  downloads: { en: "Downloads", es: "Descargas" },
  filesCount: { en: "files", es: "archivos" },
  duplicates: { en: "Duplicates", es: "Duplicados" },
  copies: { en: "copies", es: "copias" },
  openHint: { en: "Say a number to open it", es: "Di un número para abrirlo" },
  toPhone: { en: "to phone", es: "al móvil" },
  page: { en: "p.", es: "pág." },
  zoom: { en: "Scroll to zoom", es: "Rueda para ampliar" },
  openWith: { en: "Open with the system app", es: "Abrir con la app del sistema" },
  close: { en: "Close", es: "Cerrar" },
  confirmTitle: { en: "Move 3 files to the trash?", es: "¿Mover 3 archivos a la papelera?" },
  total: { en: "Total", es: "Total" },
  totalSize: "10.6 MB",
  totalSizeEs: "10,6 MB",
  cancel: { en: "Cancel", es: "Cancelar" },
  confirm: { en: "Move to trash", es: "Mover a la papelera" },
  expires: { en: "Plan expires in", es: "El plan caduca en" },
  seconds: { en: "s", es: "s" },
  speedNote: { en: "Countdown runs 2x faster here", es: "Aquí la cuenta atrás va el doble de rápido" },
  agenda: { en: "This week", es: "Esta semana" },
  today: { en: "Today", es: "Hoy" },
  tv: { en: "On the TV", es: "En la tele" },
  tvTitle: { en: "Focus mix", es: "Mezcla para concentrarse" },
  tvMeta: { en: "Chromecast, living room", es: "Chromecast, salón" },
  tvQueue: { en: "25 tracks picked for focus", es: "25 pistas elegidas para concentrarse" },
  tvVolume: { en: "Volume", es: "Volumen" },
  image: { en: "Image", es: "Imagen" },
  pdf: { en: "PDF", es: "PDF" },
  textDoc: { en: "Text", es: "Texto" },
  other: { en: "Archive", es: "Archivo" },
} satisfies Record<string, T | string>;

export const DEMO_DAYS: T[] = [
  { en: "Mon", es: "Lun" },
  { en: "Tue", es: "Mar" },
  { en: "Wed", es: "Mié" },
  { en: "Thu", es: "Jue" },
  { en: "Fri", es: "Vie" },
  { en: "Sat", es: "Sáb" },
  { en: "Sun", es: "Dom" },
];

export interface DemoEvent {
  day: number;
  at: string;
  title: T;
}

export const DEMO_TODAY = 2;

export const DEMO_EVENTS: DemoEvent[] = [
  { day: 0, at: "09:45", title: { en: "Linear algebra", es: "Álgebra lineal" } },
  { day: 0, at: "19:00", title: { en: "Gym", es: "Gimnasio" } },
  { day: 1, at: "12:00", title: { en: "Programming lab", es: "Lab de programación" } },
  { day: 1, at: "17:30", title: { en: "Polish class", es: "Clase de polaco" } },
  { day: 2, at: "08:00", title: { en: "Analysis", es: "Análisis" } },
  { day: 2, at: "20:00", title: { en: "Pierogi night", es: "Cena de pierogi" } },
  { day: 3, at: "09:45", title: { en: "Linear algebra", es: "Álgebra lineal" } },
  { day: 3, at: "13:00", title: { en: "Seminar", es: "Seminario" } },
  { day: 3, at: "16:00", title: { en: "Study group", es: "Grupo de estudio" } },
  { day: 3, at: "19:00", title: { en: "Gym", es: "Gimnasio" } },
  { day: 4, at: "23:59", title: { en: "Lab 3 due", es: "Entrega práctica 3" } },
  { day: 5, at: "08:10", title: { en: "Train to Prague", es: "Tren a Praga" } },
  { day: 6, at: "11:00", title: { en: "Laundry and weekly plan", es: "Colada y plan semanal" } },
];

/* ------------------------------------------------------------------ */
/* What she can do                                                     */
/* ------------------------------------------------------------------ */

export type GroupId = "system" | "files" | "agenda" | "media" | "warp" | "lights" | "memory" | "agents";

export interface Group {
  id: GroupId;
  title: T;
  pitch: T;
  quote: T;
  verbs: T[];
  tools: string[];
  count: number;
}

export const CAPS_UI = {
  heading: { en: "Everything she can do.", es: "Todo lo que puede hacer." },
  lead: {
    en: "Eight families of tools. I never learn their names: I say what I want, the model picks the tool and fills in the arguments.",
    es: "Ocho familias de herramientas. Nunca me aprendo sus nombres: digo lo que quiero, el modelo elige la herramienta y rellena los argumentos.",
  },
  say: { en: "I say", es: "Yo digo" },
  toolsWord: { en: "tools", es: "herramientas" },
  toolWord: { en: "tool", es: "herramienta" },
  total: { en: "67 in total", es: "67 en total" },
  detailOpen: { en: "See every tool", es: "Ver todas las herramientas" },
  detailClose: { en: "Hide the tool list", es: "Ocultar la lista de herramientas" },
} satisfies Record<string, T>;

export const GROUPS: Group[] = [
  {
    id: "system",
    title: { en: "My system and my windows", es: "Mi sistema y mis ventanas" },
    pitch: {
      en: "She sees and drives the desktop the way I would.",
      es: "Ve y maneja el escritorio como lo haría yo.",
    },
    quote: { en: "What does it say on my screen?", es: "¿Qué pone en mi pantalla?" },
    verbs: [
      { en: "Read the screen with OCR: the active window, everything or a selection", es: "Leer la pantalla con OCR: la ventana activa, todo o una selección" },
      { en: "Run shell commands", es: "Ejecutar comandos de shell" },
      { en: "Open apps, web pages and searches", es: "Abrir apps, páginas web y búsquedas" },
      { en: "Screenshot, lock the session, copy, read and paste the clipboard", es: "Captura, bloquear la sesión, copiar, leer y pegar el portapapeles" },
      { en: "List open windows and workspaces", es: "Listar ventanas y espacios de trabajo abiertos" },
      { en: "Switch game mode to free VRAM, check the weather, search the web", es: "Activar el modo juego para liberar VRAM, ver el tiempo, buscar en la web" },
    ],
    tools: ["leer_pantalla", "ejecutar_comando", "ventanas_abiertas", "abrir_app"],
    count: 17,
  },
  {
    id: "files",
    title: { en: "Files and folders", es: "Archivos y carpetas" },
    pitch: {
      en: "She shows, searches, tidies and cleans.",
      es: "Enseña, busca, ordena y limpia.",
    },
    quote: { en: "Find the duplicates and delete them.", es: "Busca los duplicados y bórralos." },
    verbs: [
      { en: "Show a folder as numbered holograms and open any file from it", es: "Enseñar una carpeta como hologramas numerados y abrir cualquier archivo" },
      { en: "Search inside file contents, PDFs included", es: "Buscar dentro del contenido de los archivos, PDFs incluidos" },
      { en: "Find duplicates by content hash, the biggest files and the oldest", es: "Encontrar duplicados por hash de contenido, los archivos más grandes y los más viejos" },
      { en: "Sort a folder into subfolders, batch rename, move, zip", es: "Ordenar una carpeta en subcarpetas, renombrar por lotes, mover, comprimir" },
      { en: "Clean up what I have not touched in 30 days", es: "Limpiar lo que no he tocado en 30 días" },
      { en: "Read a document, then summarise it out loud or write me a note", es: "Leer un documento y resumirlo en voz alta o escribirme una nota" },
    ],
    tools: ["mostrar_archivos", "duplicados", "ordenar_carpeta", "deshacer_archivos"],
    count: 17,
  },
  {
    id: "agenda",
    title: { en: "Agenda, mail and tasks", es: "Agenda, correo y tareas" },
    pitch: {
      en: "My week, my inbox and my backlog, without opening any of them.",
      es: "Mi semana, mi bandeja y mi backlog, sin abrir ninguno.",
    },
    quote: { en: "What do I have this week?", es: "¿Qué tengo esta semana?" },
    verbs: [
      { en: "Show today, tomorrow, the week or the next event as an agenda hologram", es: "Mostrar hoy, mañana, la semana o el próximo evento como holograma de agenda" },
      { en: "Draft an event, point out overlaps and wait for my yes before saving", es: "Preparar un evento, señalar solapamientos y esperar mi sí antes de guardar" },
      { en: "Summarise unread mail and open one in full", es: "Resumir el correo sin leer y abrir uno completo" },
      { en: "Draft a reply in the background, and never send it without asking", es: "Redactar una respuesta en segundo plano, sin enviarla nunca sin preguntar" },
      { en: "List my tasks by project, create one, change its state", es: "Listar mis tareas por proyecto, crear una, cambiar su estado" },
    ],
    tools: ["agenda", "correo", "crear_evento", "listar_tareas"],
    count: 8,
  },
  {
    id: "media",
    title: { en: "Music, Spotify and the TV", es: "Música, Spotify y la tele" },
    pitch: {
      en: "From the keyboard to the living room, with the same sentence.",
      es: "Del teclado al salón, con la misma frase.",
    },
    quote: { en: "Put something on the TV to help me focus.", es: "Pon algo para concentrarme en la tele." },
    verbs: [
      { en: "Play, pause, skip and set the volume without waking the model", es: "Reproducir, pausar, saltar y subir el volumen sin despertar al modelo" },
      { en: "Search and play on Spotify, and move playback between the PC and the TV", es: "Buscar y reproducir en Spotify y pasar la reproducción del PC a la tele" },
      { en: "Ask a cheap model to curate a queue for a mood", es: "Pedir a un modelo barato que prepare una cola para un estado de ánimo" },
      { en: "Control the Chromecast: pause, seek, volume", es: "Controlar el Chromecast: pausa, saltos, volumen" },
      { en: "Cast the video I am watching, a file, a link or my whole screen", es: "Mandar a la tele el vídeo que veo, un archivo, un enlace o toda mi pantalla" },
      { en: "Stream a torrent to the TV while it is still downloading", es: "Emitir un torrent a la tele mientras aún se descarga" },
    ],
    tools: ["spotify", "cola_dj", "tele", "mandar_a_tele"],
    count: 4,
  },
  {
    id: "warp",
    title: { en: "Warp, to my phone", es: "Warp, a mi móvil" },
    pitch: {
      en: "The files I can see are one sentence away from my pocket.",
      es: "Los archivos que veo están a una frase de mi bolsillo.",
    },
    quote: { en: "Send that one to my phone.", es: "Manda esa al móvil." },
    verbs: [
      { en: "Send dictated text, a note, the clipboard, a screenshot or the latest file of a folder", es: "Enviar texto dictado, una nota, el portapapeles, una captura o el último archivo de una carpeta" },
      { en: "Send any file I can see in a hologram, by its number", es: "Enviar cualquier archivo que veo en un holograma, por su número" },
      { en: "Drag a panel to the top edge of the screen and a black hole swallows it", es: "Arrastrar un panel al borde superior de la pantalla y un agujero negro lo traga" },
    ],
    tools: ["warp"],
    count: 1,
  },
  {
    id: "lights",
    title: { en: "Lights, RGB and hardware", es: "Luces, RGB y hardware" },
    pitch: {
      en: "The room answers to her as well.",
      es: "La habitación también le hace caso.",
    },
    quote: { en: "Make the lights blue.", es: "Pon las luces en azul." },
    verbs: [
      { en: "LED strips: on, off, any colour by name or hex code", es: "Tiras LED: encender, apagar, cualquier color por nombre o código hex" },
      { en: "Keyboard backlight and its side strips", es: "Retroiluminación del teclado y sus tiras laterales" },
      { en: "Screen brightness, battery, Wi-Fi and Bluetooth: check and switch", es: "Brillo de pantalla, batería, Wi-Fi y Bluetooth: consultar y cambiar" },
      { en: "Open the picker for external HDMI screens", es: "Abrir el selector de pantallas HDMI externas" },
    ],
    tools: ["luces", "teclado_color", "brillo", "bluetooth"],
    count: 7,
  },
  {
    id: "memory",
    title: { en: "Memory and reminders", es: "Memoria y avisos" },
    pitch: {
      en: "She remembers what I tell her and tells me when it is time.",
      es: "Recuerda lo que le cuento y me avisa cuando toca.",
    },
    quote: { en: "Remind me at six to call home.", es: "Recuérdame a las seis que llame a casa." },
    verbs: [
      { en: "Remember a fact about me, list what she knows, forget it on request", es: "Recordar un dato sobre mí, listar lo que sabe, olvidarlo si se lo pido" },
      { en: "Timers with a label, reminders at a time of day", es: "Temporizadores con etiqueta, recordatorios a una hora del día" },
      { en: "List and cancel the alerts that are running", es: "Listar y cancelar los avisos activos" },
    ],
    tools: ["recordar", "temporizador", "recordatorio", "que_sabes_de_mi"],
    count: 7,
  },
  {
    id: "agents",
    title: { en: "Handing work to other agents", es: "Delegar en otros agentes" },
    pitch: {
      en: "When a job is bigger than a sentence, she passes it on and keeps me posted.",
      es: "Cuando el trabajo es más grande que una frase, lo pasa y me mantiene al tanto.",
    },
    quote: { en: "Ask Claude to refactor that module.", es: "Dile a Claude que refactorice ese módulo." },
    verbs: [
      { en: "Check on running jobs, and tell me what finished while I was away", es: "Ver cómo van los trabajos y contarme qué terminó mientras no estaba" },
    ],
    tools: ["escalar_a_gemini", "escalar_a_claude", "investigar", "pedir_a_aurora"],
    count: 6,
  },
];

/* ------------------------------------------------------------------ */
/* How she works inside                                                */
/* ------------------------------------------------------------------ */

export const PIPE_UI = {
  heading: { en: "From my voice to her answer, on one GPU.", es: "De mi voz a su respuesta, en una sola GPU." },
  lead: {
    en: "Four stages. The tricks that make it feel instant are small and boring, which is the point.",
    es: "Cuatro etapas. Los trucos que hacen que parezca instantáneo son pequeños y aburridos, que es lo que quería.",
  },
  details: { en: "The details that make it fast", es: "Los detalles que la hacen rápida" },
  detailOpen: { en: "See what makes it fast", es: "Ver lo que la hace rápida" },
  detailClose: { en: "Hide the details", es: "Ocultar los detalles" },
  latency: {
    en: "0.65 s median to her first response, 1.33 s at the 95th percentile, 0.69 s median for the whole answer.",
    es: "0,65 s de mediana hasta su primera respuesta, 1,33 s en el percentil 95, 0,69 s de mediana para la respuesta entera.",
  },
  vram: { en: "VRAM budget on the 6 GB card", es: "Presupuesto de VRAM en la tarjeta de 6 GB" },
} satisfies Record<string, T>;

export const PIPE_STAGES = [
  {
    n: "01",
    name: { en: "Wake", es: "Despertar" },
    tech: "openWakeWord · ONNX · CPU",
    body: {
      en: "My own wake phrase. I trained the model here, with synthetic voices plus recordings of me, and it listens on the CPU, so the microphone never goes online.",
      es: "Mi propia palabra de activación. Entrené el modelo aquí, con voces sintéticas y grabaciones mías, y escucha en la CPU, así que el micrófono nunca sale a la red.",
    },
  },
  {
    n: "02",
    name: { en: "Hear", es: "Oír" },
    tech: "Silero VAD · Faster-Whisper small · CUDA",
    body: {
      en: "A voice detector finds where I stop talking. Whisper transcribes in Spanish on the GPU.",
      es: "Un detector de voz encuentra dónde dejo de hablar. Whisper transcribe en español en la GPU.",
    },
  },
  {
    n: "03",
    name: { en: "Think", es: "Pensar" },
    tech: "Qwen3 4B · Ollama · 10,240 tokens",
    body: {
      en: "She reads all 67 tool schemas, picks one, runs it, reads the result and answers. 93% of the time the arguments are right too.",
      es: "Lee los 67 esquemas de herramientas, elige una, la ejecuta, lee el resultado y responde. Y el 93% de las veces también acierta los argumentos.",
    },
  },
  {
    n: "04",
    name: { en: "Speak", es: "Hablar" },
    tech: "Kokoro · CPU · Piper as backup",
    body: {
      en: "The voice runs on the CPU to leave the VRAM to the model. It starts on the first full sentence, not when the answer is done.",
      es: "La voz corre en la CPU para dejar la VRAM al modelo. Empieza con la primera frase completa, no cuando la respuesta está lista.",
    },
  },
] satisfies { n: string; name: T; tech: string; body: T }[];

export const PIPE_DETAILS = {
  streaming: {
    title: { en: "She talks before she finishes thinking", es: "Habla antes de terminar de pensar" },
    body: {
      en: "The model streams its answer and Kokoro speaks each sentence as soon as it is whole. I hear the first one while the rest is still being written.",
      es: "El modelo emite su respuesta en streaming y Kokoro dice cada frase en cuanto está completa. Oigo la primera mientras se escribe el resto.",
    },
  },
  cache: {
    title: { en: "A stable prefix keeps the cache warm", es: "Un prefijo estable mantiene la caché caliente" },
    body: {
      en: "The system prompt never changes. The time, my memory and what is on screen go into the last message, so Ollama reuses the cached tool schemas.",
      es: "El prompt del sistema no cambia nunca. La hora, mi memoria y lo que hay en pantalla van en el último mensaje, así que Ollama reutiliza los esquemas de herramientas ya cacheados.",
    },
    withCache: { en: "Stable prefix", es: "Prefijo estable" },
    without: { en: "Prompt changing every minute", es: "Prompt que cambia cada minuto" },
    prefill: { en: "prefill", es: "prefill" },
  },
  warm: {
    title: { en: "The model warms up while I talk", es: "El modelo se calienta mientras hablo" },
    body: {
      en: "The moment I start speaking she preloads it into VRAM. A cold start costs about 11 seconds, and I never wait for it.",
      es: "En cuanto empiezo a hablar, lo precarga en la VRAM. Un arranque en frío cuesta unos 11 segundos y nunca lo espero.",
    },
    me: { en: "I speak", es: "Hablo" },
    model: { en: "model loads", es: "carga el modelo" },
    answer: { en: "answer", es: "respuesta" },
  },
  shortcuts: {
    title: { en: "Some things never reach the model", es: "Hay cosas que nunca llegan al modelo" },
    body: {
      en: "Pause, volume, brightness, the time, lock, screenshot: the text is normalised and matched against strict patterns first. No LLM, no wait. Anything compound goes to Qwen.",
      es: "Pausar, volumen, brillo, la hora, bloquear, captura: el texto se normaliza y se compara antes con patrones estrictos. Sin LLM, sin espera. Lo compuesto va a Qwen.",
    },
    samples: [
      { en: "pause", es: "pausa" },
      { en: "louder", es: "sube el volumen" },
      { en: "what time is it", es: "qué hora es" },
      { en: "lock the screen", es: "bloquea la pantalla" },
    ] satisfies T[],
    note: { en: "0 ms of model", es: "0 ms de modelo" },
  },
  bargein: {
    title: { en: "I can interrupt her", es: "Puedo interrumpirla" },
    body: {
      en: "If I talk over her, the voice detector hears me, playback stops and she listens. Stop, quiet or enough close the conversation.",
      es: "Si hablo por encima, el detector de voz me oye, la reproducción se corta y me escucha. Para, calla o basta cierran la conversación.",
    },
    her: { en: "she speaks", es: "ella habla" },
    me: { en: "I cut in", es: "la interrumpo" },
  },
  eval: {
    title: { en: "Measured, not felt", es: "Medido, no sentido" },
    body: {
      en: "185 test phrases: 81% right tool, 93% right arguments, and 0 false triggers out of 18 phrases that should do nothing. A bigger 7B model scored worse and slower, so she stays on 4B.",
      es: "185 frases de prueba: 81% de herramienta correcta, 93% de argumentos correctos y 0 falsos disparos en 18 frases que no debían hacer nada. Un modelo más grande de 7B salió peor y más lento, así que se queda en 4B.",
    },
  },
} as const;

export const VRAM = [
  { id: "ollama", label: { en: "Qwen3 4B in Ollama", es: "Qwen3 4B en Ollama" }, gb: 3.7 },
  { id: "speech", label: { en: "Speech models", es: "Modelos de voz" }, gb: 1.0 },
  { id: "free", label: { en: "Free for the desktop", es: "Libre para el escritorio" }, gb: 1.3 },
] satisfies { id: string; label: T; gb: number }[];

/* ------------------------------------------------------------------ */
/* The safety net                                                      */
/* ------------------------------------------------------------------ */

export const SAFE_UI = {
  heading: { en: "She asks first.", es: "Pregunta antes." },
  lead: {
    en: "An assistant that can move my files has to be boring about permission: she proposes a plan, I see it, and only a yes carries it out.",
    es: "Un asistente que puede mover mis archivos tiene que ser aburrido con los permisos: propone un plan, yo lo veo y solo un sí lo lleva a cabo.",
  },
  flow: { en: "The life of a plan", es: "La vida de un plan" },
  lanes: { en: "Shell commands are classified first", es: "Los comandos de shell se clasifican antes" },
  local: {
    en: "100% local. Only a web search, or a job I hand to another agent, ever touches the network.",
    es: "100% local. Solo una búsqueda web, o un trabajo que paso a otro agente, toca la red.",
  },
} satisfies Record<string, T>;

export const SAFE_FLOW = [
  { id: "plan", name: { en: "Plan", es: "Plan" }, body: { en: "An immutable list of what would change", es: "Una lista inmutable de lo que cambiaría" } },
  { id: "ask", name: { en: "Ask", es: "Pregunta" }, body: { en: "A hologram and a spoken question", es: "Un holograma y una pregunta en voz alta" } },
  { id: "yes", name: { en: "Yes", es: "Sí" }, body: { en: "By voice or by button. Silence is a no: after 60 s the plan is dropped", es: "Por voz o por botón. El silencio es un no: a los 60 s el plan se descarta" } },
  { id: "trash", name: { en: "Trash", es: "Papelera" }, body: { en: "Never rm: she cannot delete for good, only send to the system trash", es: "Nunca rm: no sabe borrar del todo, solo manda a la papelera del sistema" } },
  { id: "journal", name: { en: "Journal", es: "Diario" }, body: { en: "Every operation written down, so undo works even after a reboot", es: "Cada operación anotada, para que deshacer funcione incluso tras reiniciar" } },
] satisfies { id: string; name: T; body: T }[];

export const SAFE_FENCE = {
  title: { en: "A fence around where she can act", es: "Una valla alrededor de dónde puede actuar" },
  body: {
    en: "Only my usual folders: downloads, documents, desktop, pictures, videos, music and my projects. Hidden files, git folders and links pointing outside are out of bounds.",
    es: "Solo mis carpetas de siempre: descargas, documentos, escritorio, imágenes, vídeos, música y mis proyectos. Los archivos ocultos, las carpetas git y los enlaces que apuntan fuera están vetados.",
  },
} satisfies { title: T; body: T };

export const SAFE_LANES = [
  {
    id: "blocked",
    name: { en: "Blocked", es: "Bloqueado" },
    body: { en: "Patterns that can wreck a disk are refused outright", es: "Los patrones que pueden destrozar un disco se rechazan sin más" },
    sample: "rm -rf",
  },
  {
    id: "direct",
    name: { en: "Direct", es: "Directo" },
    body: { en: "Read-only commands run without interrupting me", es: "Los comandos de solo lectura corren sin interrumpirme" },
    sample: "git status · df -h · uptime",
  },
  {
    id: "confirm",
    name: { en: "Ask me", es: "Preguntarme" },
    body: { en: "Anything that changes something waits for my yes", es: "Lo que cambia algo espera a mi sí" },
    sample: "systemctl restart",
  },
] satisfies { id: string; name: T; body: T; sample: string }[];
