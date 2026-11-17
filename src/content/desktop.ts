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
