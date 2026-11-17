/**
 * Multimedia & Visual Asset Manifest for Alberto Vizcaino Ponte Portfolio.
 * All dimensions are verified via ffprobe and ImageMagick to ensure CLS = 0.
 * All alt text strings provide bilingual descriptions (en/es).
 */

export interface MediaAsset {
  src: string;
  width: number;
  height: number;
  alt: {
    en: string;
    es: string;
  };
  poster?: string;
}

export const ASSETS = {
  systems: {
    celestial: {
      src: "/media/systems/celestial-desktop.webp",
      width: 1920,
      height: 1080,
      alt: {
        en: "Hyprland desktop with the Quickshell solar system: Laura star, agent planets, device satellites, the Cuerpo health planet, and Gargantua playing CONTIGO by Lucho RK",
        es: "Escritorio Hyprland con el sistema solar de Quickshell: estrella Laura, planetas de agentes, satélites de dispositivos, el planeta Cuerpo y Gargantua reproduciendo CONTIGO de Lucho RK",
      },
    } satisfies MediaAsset,

    desktopIcy: {
      src: "/media/systems/desktop-icy.webp",
      width: 1920,
      height: 1080,
      alt: {
        en: "Linux desktop in icy-blue Matugen palette playing 120 by Bad Bunny inside Gargantua",
        es: "Escritorio Linux con paleta fría Matugen reproduciendo 120 de Bad Bunny en Gargantua",
      },
    } satisfies MediaAsset,

    lauraDrawer: {
      src: "/media/systems/laura-drawer.webp",
      width: 1280,
      height: 720,
      alt: {
        en: "Wayland multi-agent drawer showing Laura, Gemini, Claude, and Aurora background tasks",
        es: "Cajón multi-agente en Wayland con tareas en segundo plano de Laura, Gemini, Claude y Aurora",
      },
    } satisfies MediaAsset,
  },
} as const;
