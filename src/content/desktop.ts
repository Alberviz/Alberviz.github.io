import type { ExternalLink, LocalizedText } from "./types";
import { LINUXRICING_URL } from "./links";

/**
 * The Linux desktop section (LinuxRicing). Copy is limited to what was verified
 * against the repo: protocols, shaders, models and numbers. No routes, ports or IPs.
 */

export interface DesktopMoment {
  id: "gargantua-shader" | "celestial-desktop" | "laura-voice" | "laura-drawer" | "rgb-sync";
  title: LocalizedText;
  tech: string;
  summary: LocalizedText;
  details: LocalizedText[];
}

export const DESKTOP_UI = {
  heading: {
    en: "The desktop I actually work in.",
    es: "El escritorio en el que trabajo de verdad.",
  },
  lead: {
    en: "Arch Linux with Hyprland and my own build of Quickshell Caelestia. I wrote the shaders, the voice assistant and the drivers for gear that had no Linux support.",
    es: "Arch Linux con Hyprland y mi propia build de Quickshell Caelestia. Escribí los shaders, el asistente de voz y los drivers de periféricos que no tenían soporte en Linux.",
  },
  hint: {
    en: "Click a numbered pin or pick a moment",
    es: "Pulsa un pin numerado o elige un momento",
  },
  caption: {
    en: "Live in your browser: the real Gargantua shader ported to WebGL2 · sample data",
    es: "En vivo en tu navegador: el shader real de Gargantua portado a WebGL2 · datos de ejemplo",
  },
  rigCaption: {
    en: "Animated diagram · packet bytes as written by sync-rgb.py",
    es: "Diagrama animado · bytes de los paquetes tal como los escribe sync-rgb.py",
  },
  lauraCaption: {
    en: "Interactive simulation of the voice pill and screen-edge glow · Super+A",
    es: "Simulación interactiva de la píldora de voz y el brillo del borde de pantalla · Super+A",
  },
  fullscreen: { en: "Full screen", es: "Pantalla completa" },
  exitFullscreen: { en: "Exit full screen", es: "Salir de pantalla completa" },
  repo: { en: "LinuxRicing on GitHub", es: "LinuxRicing en GitHub" },
  hardwareNote: {
    en: "a small Android hack that turns the music buttons of my Amazfit GTS 2 into shortcuts.",
    es: "un hack pequeño para Android que convierte los botones de música de mi Amazfit GTS 2 en atajos.",
  },
  hardwareHeading: {
    en: "Hardware I hacked to work my way",
    es: "Hardware que hackeé para que funcione a mi manera",
  },
} satisfies Record<string, LocalizedText>;

export const DESKTOP_LINKS: ExternalLink[] = [
  { label: DESKTOP_UI.repo, href: LINUXRICING_URL, kind: "github" },
];

export const DESKTOP_MOMENTS: DesktopMoment[] = [
  {
    id: "gargantua-shader",
    title: { en: "Gargantua, listening to the music", es: "Gargantua, escuchando la música" },
    tech: "GLSL · PipeWire · Hyprland",
    summary: {
      en: "My wallpaper is a black hole I wrote by hand. Light bends around a Schwarzschild horizon, the accretion disk is lensed above and below, and the side coming toward you burns brighter. The disk pulses with whatever is playing.",
      es: "Mi fondo de pantalla es un agujero negro que escribí a mano. La luz se curva alrededor de un horizonte de Schwarzschild, el disco de acreción se ve deformado por arriba y por abajo, y el lado que se acerca brilla más. El disco late con lo que suena.",
    },
    details: [
      {
        en: "Ray deflection is analytic, with relativistic Doppler beaming and ACES filmic tone mapping. Audio comes from PipeWire FFT bands.",
        es: "La deflexión de los rayos es analítica, con efecto Doppler relativista y mapeo tonal fílmico ACES. El audio llega de bandas FFT de PipeWire.",
      },
      {
        en: "I profiled the whole animated background from 15.1% down to 4.7% of one CPU core.",
        es: "Perfilé todo el fondo animado hasta bajarlo del 15,1% al 4,7% de un núcleo de CPU.",
      },
    ],
  },
  {
    id: "celestial-desktop",
    title: { en: "A desktop that is a solar system", es: "Un escritorio que es un sistema solar" },
    tech: "Quickshell Caelestia · QML · GLSL",
    summary: {
      en: "The wallpaper is a live map of my machine. Laura is the star, my coding agents are planets, wireless devices are satellites and my tasks are a comet. Nothing is decoration: everything is real state.",
      es: "El fondo es un mapa vivo de mi máquina. Laura es la estrella, mis agentes de código son planetas, los dispositivos inalámbricos son satélites y mis tareas son un cometa. Nada es decoración: todo es estado real.",
    },
    details: [
      {
        en: "Each satellite draws its battery as a ring, read from the HID reports I reverse-engineered rather than from a vendor app.",
        es: "Cada satélite dibuja su batería como un anillo, leída de los informes HID que descifré y no de una app del fabricante.",
      },
    ],
  },
  {
    id: "laura-voice",
    title: { en: "Laura, my voice assistant", es: "Laura, mi asistente de voz" },
    tech: "Faster-Whisper · Qwen3 4B · Kokoro · Super+A",
    summary: {
      en: "One shortcut and I talk to a model that lives on my own GPU. The edge of the screen glows with a shader while it listens, and an orb in the shell shows what it is doing.",
      es: "Un atajo y hablo con un modelo que vive en mi propia GPU. El borde de la pantalla brilla con un shader mientras escucha, y un orbe en la shell muestra lo que hace.",
    },
    details: [
      {
        en: "Faster-Whisper (small) on CUDA transcribes in under a second, Qwen3 4B runs on Ollama with a 10,240 token context, and Kokoro speaks the answer.",
        es: "Faster-Whisper (small) en CUDA transcribe en menos de un segundo, Qwen3 4B corre en Ollama con 10.240 tokens de contexto y Kokoro dice la respuesta.",
      },
      {
        en: "A watchdog checks my calendar, mail and tasks every 5 minutes and leaves the GPU alone when nothing is new.",
        es: "Un vigía revisa mi calendario, mi correo y mis tareas cada 5 minutos y deja la GPU en paz cuando no hay novedades.",
      },
    ],
  },
  {
    id: "laura-drawer",
    title: { en: "Multi-agent panel", es: "Panel multiagente" },
    tech: "Wayland Layer Shell · Quickshell QML · Super+I",
    summary: {
      en: "A drawer that slides in from the right edge. It is where I confirm what my agents want to do, review git changes and see which background jobs are running.",
      es: "Un cajón que entra desde el borde derecho. Ahí confirmo lo que quieren hacer mis agentes, reviso cambios de git y veo qué trabajos corren en segundo plano.",
    },
    details: [
      {
        en: "It follows Laura, Claude, Gemini and Aurora jobs across workspaces, with pips in the bar so I notice without switching windows.",
        es: "Sigue los trabajos de Laura, Claude, Gemini y Aurora entre escritorios, con indicadores en la barra para enterarme sin cambiar de ventana.",
      },
    ],
  },
  {
    id: "rgb-sync",
    title: { en: "Drivers for gear with no Linux support", es: "Drivers para periféricos sin soporte en Linux" },
    tech: "usbmon · Python · /dev/hidraw · OpenRGB · Matugen",
    summary: {
      en: "I captured the USB traffic of my peripherals and wrote their protocols myself. Change the wallpaper and the keyboard, the mouse base, the RAM and the LED strip follow its palette.",
      es: "Capturé el tráfico USB de mis periféricos y escribí sus protocolos yo mismo. Cambio el fondo y el teclado, la base del ratón, la RAM y la tira LED siguen su paleta.",
    },
    details: [
      {
        en: "MCHOSE K7 Ultra 8K: feature report 0x11 on interface 2, with a 20 byte payload masked with XOR 0xFF.",
        es: "MCHOSE K7 Ultra 8K: feature report 0x11 en la interfaz 2, con una carga de 20 bytes enmascarada con XOR 0xFF.",
      },
      {
        en: "Akko 5075B Plus on 2.4 GHz: reports 0x07 and 0x08 for the lighting, opcode 0x83 for the wireless battery.",
        es: "Akko 5075B Plus por 2,4 GHz: informes 0x07 y 0x08 para la iluminación y el opcode 0x83 para la batería inalámbrica.",
      },
    ],
  },
];

export interface HardwarePiece {
  id: string;
  name: string;
  kind: LocalizedText;
  value: string;
  label: LocalizedText;
  link?: ExternalLink;
}

/**
 * Reverse engineering of the peripherals, told as four steps. Bytes are from the
 * protocols documented in LinuxRicing/hardware (opcodes, payloads, checksums);
 * no serial numbers, MACs, addresses or ports. Battery levels shown in the demo
 * are sample values.
 */
export const HARDWARE_STORY = {
  heading: {
    en: "I reverse-engineered my own peripherals.",
    es: "Hice ingeniería inversa de mis periféricos.",
  },
  lead: {
    en: "My mouse, my headset and my keyboard only came with Windows apps. I listened to their USB traffic, decoded the protocols byte by byte and wrote my own drivers. Now every light in the setup follows the desktop, each wireless device reports its battery, and the LEDs react to notifications and to charging.",
    es: "Mi ratón, mis cascos y mi teclado solo traían apps para Windows. Escuché su tráfico USB, decodifiqué los protocolos byte a byte y escribí mis propios drivers. Ahora todas las luces del setup siguen al escritorio, cada aparato inalámbrico dice su batería y los LEDs reaccionan a las notificaciones y a la carga.",
  },
  steps: [
    {
      id: "sniff",
      label: { en: "Sniff", es: "Escuchar" },
      title: { en: "Listen to the cable.", es: "Escuchar el cable." },
      body: {
        en: "With the official Windows app running, I captured every USB packet with USBPcap and Wireshark, and with usbmon on Linux. Change one colour, capture again, compare: the bytes that move are the ones that matter.",
        es: "Con la app oficial de Windows abierta, capturé cada paquete USB con USBPcap y Wireshark, y con usbmon en Linux. Cambias un color, vuelves a capturar y comparas: los bytes que se mueven son los que importan.",
      },
    },
    {
      id: "decode",
      label: { en: "Decode", es: "Decodificar" },
      title: { en: "Name every byte.", es: "Ponerle nombre a cada byte." },
      body: {
        en: "The keyboard speaks 64-byte feature reports: an opcode, the mode, speed, brightness, a flag for custom colour, red, green, blue and a checksum. The mouse base hides the same idea behind an XOR 0xFF on every byte, and the headset answers a two-byte question with its battery level and whether it's charging.",
        es: "El teclado habla en feature reports de 64 bytes: un opcode, el modo, la velocidad, el brillo, una bandera de color propio, rojo, verde, azul y un checksum. La base del ratón esconde lo mismo tras un XOR 0xFF en cada byte, y los cascos responden a una pregunta de dos bytes con su batería y si están cargando.",
      },
    },
    {
      id: "driver",
      label: { en: "Driver", es: "Driver" },
      title: { en: "Write the driver.", es: "Escribir el driver." },
      body: {
        en: "A few dozen lines of Python per device and no dependencies: find the right hidraw node, build the packet, send it with an ioctl. Over 2.4 GHz the keyboard only answers after a handshake I also had to capture: ask, poll until the radio has the frame, then read it back.",
        es: "Unas decenas de líneas de Python por aparato y sin dependencias: encontrar el nodo hidraw correcto, montar el paquete y mandarlo con un ioctl. Por 2,4 GHz el teclado solo responde tras un saludo que también tuve que capturar: preguntar, sondear hasta que la radio tiene la trama y leerla.",
      },
    },
    {
      id: "desktop",
      label: { en: "Desktop", es: "Escritorio" },
      title: { en: "Wire it into the desktop.", es: "Conectarlo al escritorio." },
      body: {
        en: "Change the wallpaper and the keyboard, the mouse base, the RAM, the motherboard's ARGB and the Wi-Fi LED strip take its colour. A notification, like an AI agent finishing a task, flashes the fast devices. Put the mouse on its base and the ring runs a charging wave while the keyboard's side strip fills with its battery. A daemon routes every battery event to the zone it belongs to.",
        es: "Cambio el fondo y el teclado, la base del ratón, la RAM, el ARGB de la placa y la tira LED Wi-Fi toman su color. Una notificación, como un agente de IA que acaba una tarea, hace destellar los aparatos rápidos. Dejo el ratón en su base y el anillo hace una ola de carga mientras la tira lateral del teclado se llena con su batería. Un demonio lleva cada evento de batería a la zona que le toca.",
      },
    },
  ],
  capture: {
    head: { en: "USB capture · keyboard, interface 2", es: "Captura USB · teclado, interfaz 2" },
    diff: { en: "only R, G, B move between captures", es: "entre capturas solo se mueven R, G y B" },
  },
  bytes: {
    akko: { en: "Keyboard · set colour (0x07)", es: "Teclado · fijar color (0x07)" },
    labels: {
      en: ["opcode", "mode", "speed", "bright", "custom", "R", "G", "B", "sum"],
      es: ["opcode", "modo", "veloc.", "brillo", "propio", "R", "G", "B", "suma"],
    },
    checksum: { en: "checksum = 0xFF - (sum of bytes 0-7)", es: "checksum = 0xFF - (suma de los bytes 0-7)" },
    mchose: { en: "Mouse base · on the wire, then XOR 0xFF", es: "Base del ratón · en el cable y tras XOR 0xFF" },
    headset: { en: "Headset · battery", es: "Cascos · batería" },
    headsetRead: { en: "82 %, in use", es: "82 %, en uso" },
  },
  rig: {
    notify: { en: "Simulate a notification", es: "Simular una notificación" },
    dock: { en: "Mouse on its base", es: "Ratón en su base" },
    mouse: { en: "Mouse", es: "Ratón" },
    headset: { en: "Headset", es: "Cascos" },
    keyboard: { en: "Keyboard", es: "Teclado" },
    charging: { en: "charging", es: "cargando" },
    strip: { en: "LED strip", es: "Tira LED" },
    board: { en: "Board ARGB", es: "ARGB placa" },
    caption: {
      en: "Simulation · battery levels are sample values",
      es: "Simulación · los niveles de batería son de ejemplo",
    },
    label: {
      en: "Simulated setup: keyboard with side strip, mouse on its charging base, headset, LED strip and motherboard lights",
      es: "Setup simulado: teclado con tira lateral, ratón en su base de carga, cascos, tira LED y luces de la placa",
    },
  },
} as const;

export const HARDWARE: HardwarePiece[] = [
  {
    id: "mchose",
    name: "MCHOSE K7 Ultra 8K",
    kind: { en: "Mouse and base", es: "Ratón y base" },
    value: "0x11",
    label: {
      en: "feature report that sets the lights. 20 bytes, XOR 0xFF, found by sniffing the vendor configurator with usbmon",
      es: "feature report que fija las luces. 20 bytes, XOR 0xFF, descubierto espiando el configurador del fabricante con usbmon",
    },
  },
  {
    id: "akko",
    name: "Akko 5075B Plus",
    kind: { en: "Keyboard, 2.4 GHz", es: "Teclado, 2,4 GHz" },
    value: "0x83",
    label: {
      en: "opcode that returns the wireless battery. Reports 0x07 and 0x08 set the key and side lighting",
      es: "opcode que devuelve la batería inalámbrica. Los informes 0x07 y 0x08 fijan la luz de teclas y laterales",
    },
  },
];
