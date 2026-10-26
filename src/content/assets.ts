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

export interface DocumentAsset {
  src: string;
  title: {
    en: string;
    es: string;
  };
  sizeBytes: number;
}

export const ASSETS = {
  cv: {
    pdf: {
      src: "/cv/Alberto_Vizcaino_Ponte_CV.pdf",
      title: {
        en: "Alberto Vizcaíno Ponte - Curriculum Vitae",
        es: "Alberto Vizcaíno Ponte - Curriculum Vitae",
      },
      sizeBytes: 24436,
    } satisfies DocumentAsset,
  },

  favicon: {
    src: "/favicon.svg",
    width: 64,
    height: 64,
    alt: {
      en: "Alberto Vizcaíno geometric monogram favicon",
      es: "Favicon monograma geométrico de Alberto Vizcaíno",
    },
  } satisfies MediaAsset,

  krakount: {
    icon: {
      src: "/media/krakount/icon.svg",
      width: 512,
      height: 512,
      alt: {
        en: "Krakount app icon with amber Kazimierz neon",
        es: "Icono de la app Krakount con neón ámbar Kazimierz",
      },
    } satisfies MediaAsset,

    logo: {
      src: "/media/krakount/logo.svg",
      width: 512,
      height: 512,
      alt: {
        en: "Krakount circular emblem with Kraków Erasmus typography",
        es: "Emblema circular Krakount con tipografía Kraków Erasmus",
      },
    } satisfies MediaAsset,

    logo660: {
      src: "/media/krakount/logo-660.webp",
      width: 660,
      height: 660,
      alt: {
        en: "Krakount high-resolution logo emblem",
        es: "Emblema de logotipo Krakount en alta resolución",
      },
    } satisfies MediaAsset,

    reel30s: {
      src: "/media/krakount/reel-30s.mp4",
      width: 608,
      height: 1080,
      poster: "/media/krakount/reel-poster.webp",
      alt: {
        en: "Krakount 30-second mobile showcase video reel",
        es: "Reel de vídeo de 30 segundos mostrando la app Krakount",
      },
    } satisfies MediaAsset,

    reelPoster: {
      src: "/media/krakount/reel-poster.webp",
      width: 608,
      height: 1080,
      alt: {
        en: "Poster frame for Krakount 30-second showcase reel",
        es: "Fotograma de portada para el reel de 30 segundos de Krakount",
      },
    } satisfies MediaAsset,

    tripMobileLoop: {
      src: "/media/krakount/trip-mobile-loop.mp4",
      width: 608,
      height: 1080,
      poster: "/media/krakount/trip-poster.webp",
      alt: {
        en: "Krakount interactive trip workflow and offline QR boarding pass loop",
        es: "Bucle de flujo de viaje interactivo y pase de embarque QR offline en Krakount",
      },
    } satisfies MediaAsset,

    tripPoster: {
      src: "/media/krakount/trip-poster.webp",
      width: 608,
      height: 1080,
      alt: {
        en: "Poster frame for Krakount trip mobile loop",
        es: "Fotograma de portada para el bucle de viaje de Krakount",
      },
    } satisfies MediaAsset,

    shots: {
      home: {
        src: "/media/krakount/shot-home.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Krakount home: 267 EUR owed to you, payments captured on Android to review, and your groups with live trips",
          es: "Inicio de Krakount: te deben 267 €, pagos capturados en Android por revisar y tus grupos con viajes en marcha",
        },
      } satisfies MediaAsset,

      currency: {
        src: "/media/krakount/shot-currency.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Your currencies: euro as main, Polish złoty one tap away, 32 currencies to add",
          es: "Tus monedas: euro como principal, złoty a un toque y 32 monedas para añadir",
        },
      } satisfies MediaAsset,

      itinerary: {
        src: "/media/krakount/shot-itinerary.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Wrocław trip itinerary: day tabs, a drawn map and timed stops with your boarding pass",
          es: "Itinerario del viaje a Wrocław: días en pestañas, mapa dibujado y paradas con hora junto a tu billete",
        },
      } satisfies MediaAsset,

      flight: {
        src: "/media/krakount/shot-flight.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Wrocław trip in progress: what is next today, the itinerary map and your boarding pass",
          es: "Viaje a Wrocław en marcha: lo que toca hoy, el mapa del itinerario y tu billete",
        },
      } satisfies MediaAsset,

      pass: {
        src: "/media/krakount/shot-pass.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Trip wallet with stacked boarding passes, offline QR codes and who still needs a ticket",
          es: "Cartera del viaje con billetes apilados, QR sin conexión y quién aún no tiene billete",
        },
      } satisfies MediaAsset,

      expense: {
        src: "/media/krakount/shot-expense.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Expense detail: weekly Biedronka shop of 187.34 PLN split equally between 5",
          es: "Detalle de gasto: compra semanal de Biedronka de 187,34 PLN repartida a partes iguales entre 5",
        },
      } satisfies MediaAsset,

      receipt: {
        src: "/media/krakount/shot-receipt.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Live Biedronka receipt where each friend ticks the items that are theirs",
          es: "Ticket de Biedronka en vivo donde cada amigo marca los productos que son suyos",
        },
      } satisfies MediaAsset,

      balances: {
        src: "/media/krakount/shot-balances.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Zakopane balances: who owes you and how much, with one tap reminders",
          es: "Saldos de Zakopane: quién te debe y cuánto, con recordatorios de un toque",
        },
      } satisfies MediaAsset,

      settled: {
        src: "/media/krakount/shot-settled.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "All debts: the simplified plan as a constellation and a why button for every debt",
          es: "Todas las deudas: el plan simplificado como constelación y un porqué para cada deuda",
        },
      } satisfies MediaAsset,

      wrapped: {
        src: "/media/krakount/shot-wrapped.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Zakopane Wrapped story: 2295 PLN spent together, about 85 PLN per person per day",
          es: "Historia Wrapped de Zakopane: 2295 PLN gastados entre todos, unos 85 PLN por persona y día",
        },
      } satisfies MediaAsset,

      misGastos: {
        src: "/media/krakount/shot-mis-gastos.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Mis gastos: 437.04 EUR this month across every group plus personal spending, against a 600 EUR budget",
          es: "Mis gastos: 437,04 € este mes entre todos los grupos y lo personal, frente a un presupuesto de 600 €",
        },
      } satisfies MediaAsset,

      captura: {
        src: "/media/krakount/shot-captura.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Payments to review: Revolut and Wallet notifications captured on Android, waiting to be filed",
          es: "Pagos por revisar: avisos de Revolut y Wallet capturados en Android, esperando a colocarse",
        },
      } satisfies MediaAsset,
    },

    pops: {
      balance: {
        src: "/media/krakount/pop-balance.webp",
        width: 700,
        height: 526,
        alt: {
          en: "Krakount home card: 267 EUR owed to you overall, this month's spending and the breakdown by person",
          es: "Tarjeta de inicio de Krakount: en total te deben 267 €, lo que llevas este mes y el desglose por persona",
        },
      } satisfies MediaAsset,

      share: {
        src: "/media/krakount/pop-share.webp",
        width: 700,
        height: 338,
        alt: {
          en: "Your share of an open Biedronka receipt so far: 2 of 5 items ticked",
          es: "Tu parte de un ticket abierto de Biedronka, de momento: 2 de 5 productos marcados",
        },
      } satisfies MediaAsset,

      flight: {
        src: "/media/krakount/pop-flight.webp",
        width: 700,
        height: 282,
        alt: {
          en: "Trip wallet card with your Wrocław to Madrid boarding pass ready to show",
          es: "Tarjeta de la cartera del viaje con tu billete Wrocław a Madrid listo para enseñar",
        },
      } satisfies MediaAsset,

      pass: {
        src: "/media/krakount/pop-pass.webp",
        width: 700,
        height: 792,
        alt: {
          en: "Offline boarding pass MAD to WRO with a QR code redrawn without network",
          es: "Billete de embarque MAD a WRO sin conexión, con el QR redibujado sin red",
        },
      } satisfies MediaAsset,

      transfer: {
        src: "/media/krakount/pop-transfer.webp",
        width: 700,
        height: 506,
        alt: {
          en: "Debt card: Marco owes you 1.14 EUR, with remind, invite and swipe to mark paid",
          es: "Tarjeta de deuda: Marco te debe 1,14 €, con recordar, invitar y deslizar para marcar pagado",
        },
      } satisfies MediaAsset,
    },
  },

  mycrohnie: {
    deck: {
      src: "/media/mycrohnie/MyCrohnie-deck.pdf",
      title: {
        en: "MyCrohnie HackYeah 2026 Presentation Deck",
        es: "Presentación de MyCrohnie para HackYeah 2026",
      },
      sizeBytes: 2518221,
    } satisfies DocumentAsset,

    demoLoop: {
      src: "/media/mycrohnie/demo-loop.mp4",
      width: 1280,
      height: 720,
      poster: "/media/mycrohnie/poster.webp",
      alt: {
        en: "MyCrohnie 18-second video demo showing daily check-in and doctor report",
        es: "Demo en vídeo de 18 segundos de MyCrohnie mostrando el registro diario e informe médico",
      },
    } satisfies MediaAsset,

    poster: {
      src: "/media/mycrohnie/poster.webp",
      width: 1280,
      height: 720,
      alt: {
        en: "Poster frame for MyCrohnie video demo",
        es: "Fotograma de portada para la demo en vídeo de MyCrohnie",
      },
    } satisfies MediaAsset,

    shots: {
      home: {
        src: "/media/mycrohnie/shot-home.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "MyCrohnie mobile home dashboard with daily streak and symptom log",
          es: "Panel principal de MyCrohnie con racha diaria y registro de síntomas",
        },
      } satisfies MediaAsset,

      checkin: {
        src: "/media/mycrohnie/shot-checkin.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "MyCrohnie rapid daily check-in flow with medical symptom metrics",
          es: "Flujo de registro diario rápido en MyCrohnie con métricas de síntomas médicos",
        },
      } satisfies MediaAsset,

      chest: {
        src: "/media/mycrohnie/shot-chest.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "MyCrohnie gamified adherence reward chest unlock screen",
          es: "Pantalla de desbloqueo de cofre gamificado por adherencia en MyCrohnie",
        },
      } satisfies MediaAsset,

      patterns: {
        src: "/media/mycrohnie/shot-patterns.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "MyCrohnie flare correlation analysis and dietary trigger charts",
          es: "Análisis de correlación de brotes y gráficos de detonantes dietéticos en MyCrohnie",
        },
      } satisfies MediaAsset,

      report: {
        src: "/media/mycrohnie/shot-report.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "MyCrohnie single-page clinical report export for gastroenterologist consultations",
          es: "Exportación de informe clínico en una página de MyCrohnie para consultas de gastroenterología",
        },
      } satisfies MediaAsset,
    },
  },

  systems: {
    gargantua: {
      src: "/media/systems/gargantua-shader.webp",
      width: 1024,
      height: 1024,
      alt: {
        en: "Raymarched Gargantua black hole GLSL shader running in realtime with ACES tonemapping",
        es: "Shader GLSL con raymarching del agujero negro Gargantua ejecutándose en tiempo real con mapeo ACES",
      },
    } satisfies MediaAsset,

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

  closhare: {
    wardrobe: {
      src: "/media/closhare/wardrobe.webp",
      width: 780,
      height: 1768,
      alt: {
        en: "CloShare group wardrobe interface showing available clothing items",
        es: "Interfaz de armario de grupo en CloShare mostrando prendas disponibles",
      },
    } satisfies MediaAsset,
  },

  aurora: {
    logo: {
      src: "/media/aurora/logo.webp",
      width: 2048,
      height: 2048,
      alt: {
        en: "Aurora project identity logo",
        es: "Logotipo de identidad del proyecto Aurora",
      },
    } satisfies MediaAsset,
  },
} as const;
