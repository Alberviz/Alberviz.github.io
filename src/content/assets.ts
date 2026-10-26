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
        en: "Alberto Vizcaino Ponte - Curriculum Vitae",
        es: "Alberto Vizcaino Ponte - Curriculum Vitae",
      },
      sizeBytes: 24436,
    } satisfies DocumentAsset,
  },

  favicon: {
    src: "/favicon.svg",
    width: 64,
    height: 64,
    alt: {
      en: "Alberto Vizcaino geometric monogram favicon",
      es: "Favicon monograma geometrico de Alberto Vizcaino",
    },
  } satisfies MediaAsset,

  krakount: {
    icon: {
      src: "/media/krakount/icon.svg",
      width: 512,
      height: 512,
      alt: {
        en: "Krakount app icon with amber Kazimierz neon",
        es: "Icono de la app Krakount con neon ambar Kazimierz",
      },
    } satisfies MediaAsset,

    logo: {
      src: "/media/krakount/logo.svg",
      width: 512,
      height: 512,
      alt: {
        en: "Krakount circular emblem with Krakow Erasmus typography",
        es: "Emblema circular Krakount con tipografia Krakow Erasmus",
      },
    } satisfies MediaAsset,

    logo660: {
      src: "/media/krakount/logo-660.webp",
      width: 660,
      height: 660,
      alt: {
        en: "Krakount high-resolution logo emblem",
        es: "Emblema de logotipo Krakount en alta resolucion",
      },
    } satisfies MediaAsset,

    reel30s: {
      src: "/media/krakount/reel-30s.mp4",
      width: 608,
      height: 1080,
      poster: "/media/krakount/reel-poster.webp",
      alt: {
        en: "Krakount 30-second mobile showcase video reel",
        es: "Reel de video de 30 segundos mostrando la app Krakount",
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
          en: "Krakount home screen with group expenses in PLN and EUR",
          es: "Pantalla principal de Krakount con gastos de grupo en PLN y EUR",
        },
      } satisfies MediaAsset,

      currency: {
        src: "/media/krakount/shot-currency.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Krakount multicurrency selector synced with NBP Table A",
          es: "Selector multidivisa de Krakount sincronizado con la Tabla A del NBP",
        },
      } satisfies MediaAsset,

      itinerary: {
        src: "/media/krakount/shot-itinerary.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Krakount group trip timeline with flights, lodging, and activities",
          es: "Cronograma de viaje grupal en Krakount con vuelos, alojamiento y actividades",
        },
      } satisfies MediaAsset,

      flight: {
        src: "/media/krakount/shot-flight.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Krakount flight detail screen with gate, terminal, and departure countdown",
          es: "Pantalla de detalle de vuelo en Krakount con puerta, terminal y cuenta atras",
        },
      } satisfies MediaAsset,

      pass: {
        src: "/media/krakount/shot-pass.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Krakount offline boarding pass with high-contrast barcode and QR",
          es: "Pase de embarque sin conexion en Krakount con codigo de barras y QR de alto contraste",
        },
      } satisfies MediaAsset,

      expense: {
        src: "/media/krakount/shot-expense.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Krakount split expense modal with per-person share calculation",
          es: "Modal de division de gastos en Krakount con calculo por persona",
        },
      } satisfies MediaAsset,

      receipt: {
        src: "/media/krakount/shot-receipt.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Krakount receipt scanner splitting supermarket items in Polish zloty",
          es: "Escaner de tickets Krakount desglosando articulos en zlotys polacos",
        },
      } satisfies MediaAsset,

      balances: {
        src: "/media/krakount/shot-balances.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Krakount debt minimization matrix settling balances with minimum transactions",
          es: "Matriz de minimizacion de deuda en Krakount liquidando saldos con minimas transferencias",
        },
      } satisfies MediaAsset,

      settled: {
        src: "/media/krakount/shot-settled.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Krakount confirmed settlement screen with green checkmark and zero balance",
          es: "Pantalla de liquidacion confirmada en Krakount con marca de verificacion y saldo cero",
        },
      } satisfies MediaAsset,

      wrapped: {
        src: "/media/krakount/shot-wrapped.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "Krakount trip wrapped summary card with total spending and top spender",
          es: "Tarjeta de resumen Krakount Wrapped del viaje con gasto total y mayor pagador",
        },
      } satisfies MediaAsset,
    },

    pops: {
      balance: {
        src: "/media/krakount/pop-balance.webp",
        width: 700,
        height: 824,
        alt: {
          en: "Krakount balance popup card showing who owes whom",
          es: "Tarjeta emergente de saldos de Krakount mostrando quien debe a quien",
        },
      } satisfies MediaAsset,

      share: {
        src: "/media/krakount/pop-share.webp",
        width: 700,
        height: 304,
        alt: {
          en: "Krakount individual share popup preview",
          es: "Vista previa emergente de parte individual en Krakount",
        },
      } satisfies MediaAsset,

      flight: {
        src: "/media/krakount/pop-flight.webp",
        width: 484,
        height: 502,
        alt: {
          en: "Krakount flight card popup preview",
          es: "Vista previa emergente de tarjeta de vuelo en Krakount",
        },
      } satisfies MediaAsset,

      pass: {
        src: "/media/krakount/pop-pass.webp",
        width: 700,
        height: 496,
        alt: {
          en: "Krakount boarding pass ticket popup preview",
          es: "Vista previa emergente de billete de embarque en Krakount",
        },
      } satisfies MediaAsset,

      transfer: {
        src: "/media/krakount/pop-transfer.webp",
        width: 700,
        height: 424,
        alt: {
          en: "Krakount bank transfer instructions popup card",
          es: "Tarjeta emergente de instrucciones de transferencia en Krakount",
        },
      } satisfies MediaAsset,
    },
  },

  mycrohnie: {
    deck: {
      src: "/media/mycrohnie/MyCrohnie-deck.pdf",
      title: {
        en: "MyCrohnie HackYeah 2026 Presentation Deck",
        es: "Presentacion de MyCrohnie para HackYeah 2026",
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
        es: "Demo en video de 18 segundos de MyCrohnie mostrando el registro diario y reporte medico",
      },
    } satisfies MediaAsset,

    poster: {
      src: "/media/mycrohnie/poster.webp",
      width: 1280,
      height: 720,
      alt: {
        en: "Poster frame for MyCrohnie video demo",
        es: "Fotograma de portada para la demo en video de MyCrohnie",
      },
    } satisfies MediaAsset,

    shots: {
      home: {
        src: "/media/mycrohnie/shot-home.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "MyCrohnie mobile home dashboard with daily streak and symptom log",
          es: "Panel principal de MyCrohnie con racha diaria y registro de sintomas",
        },
      } satisfies MediaAsset,

      checkin: {
        src: "/media/mycrohnie/shot-checkin.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "MyCrohnie rapid daily check-in flow with medical symptom metrics",
          es: "Flujo de registro diario rapido en MyCrohnie con metricas de sintomas medicos",
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
          es: "Analisis de correlacion de brotes y graficos de detonantes dieteticos en MyCrohnie",
        },
      } satisfies MediaAsset,

      report: {
        src: "/media/mycrohnie/shot-report.webp",
        width: 780,
        height: 1688,
        alt: {
          en: "MyCrohnie single-page clinical report export for gastroenterologist consultations",
          es: "Exportacion de informe clinico en una pagina de MyCrohnie para consultas de gastroenterologia",
        },
      } satisfies MediaAsset,
    },
  },

  systems: {
    gargantua: {
      src: "/media/systems/gargantua-shader.webp",
      width: 1600,
      height: 900,
      alt: {
        en: "Raymarched Gargantua black hole GLSL shader running in realtime on Linux Hyprland",
        es: "Shader GLSL con raymarching del agujero negro Gargantua ejecutandose en tiempo real en Hyprland Linux",
      },
    } satisfies MediaAsset,

    celestial: {
      src: "/media/systems/celestial-desktop.webp",
      width: 1600,
      height: 900,
      alt: {
        en: "Hyprland desktop with Quickshell solar system widgets and live orbital telemetry",
        es: "Escritorio Hyprland con widgets Quickshell del sistema solar y telemetria orbital en vivo",
      },
    } satisfies MediaAsset,

    qmlTelemetry: {
      src: "/media/systems/qml-telemetry.webp",
      width: 1560,
      height: 1240,
      alt: {
        en: "Quickshell QML system health monitoring widgets with real-time CPU and GPU telemetry",
        es: "Widgets QML de Quickshell para monitorizacion del sistema con telemetria de CPU y GPU en tiempo real",
      },
    } satisfies MediaAsset,
  },

  closhare: {
    mockups: {
      src: "/media/closhare/mockups.webp",
      width: 1100,
      height: 939,
      alt: {
        en: "CloShare peer-to-peer wardrobe sharing design mockup and wireframes",
        es: "Diseno y wireframes de CloShare para compartir armario entre particulares",
      },
    } satisfies MediaAsset,

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
