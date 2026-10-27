import type { LocalizedText } from "./types";

export const KRAKOUNT_PAGE = {
  liveDemoUrl: "https://krakount.vercel.app",
  youtubeShortUrl: "https://youtube.com/shorts/do_RM67hgeg",
  nav: {
    backToPortfolio: {
      en: "Alberto Vizcaíno",
      es: "Alberto Vizcaíno",
    } satisfies LocalizedText,
    ctaLive: {
      en: "Open Live App",
      es: "Abrir App en Vivo",
    } satisfies LocalizedText,
  },
  hero: {
    eyebrow: {
      en: "KAZIMIERZ AT NIGHT · MOBILE-FIRST PWA + ANDROID COMPANION",
      es: "KAZIMIERZ DE NOCHE · PWA MÓVIL + APP ANDROID NATIVA",
    } satisfies LocalizedText,
    headline: {
      en: "No manual entries. Automate payments, receipts and trips.",
      es: "Cero apuntar a mano. Automatiza pagos, tickets y viajes.",
    } satisfies LocalizedText,
    subtext: {
      en: "Engineered to eliminate the friction of traditional split apps. Krakount captures Revolut and Google Wallet payments on Android in 1 tap, automatically settles debts when incoming Bizums arrive, splits supermarket receipts item by item with on-device OCR, and stores boarding passes 100% offline.",
      es: "Diseñada para eliminar la fricción de las herramientas tradicionales de repartir gastos. Krakount captura pagos de Revolut y Google Wallet en Android en 1 toque, liquida deudas solo cuando te llega un Bizum, divide tickets del súper producto a producto con OCR en local y lleva tus pases de embarque 100% sin conexión.",
    } satisfies LocalizedText,
    primaryCta: {
      en: "Open Live App",
      es: "Abrir App en Vivo",
    } satisfies LocalizedText,
    secondaryCta: {
      en: "Explore Features",
      es: "Ver funciones",
    } satisfies LocalizedText,
  },
  stats: [
    {
      value: "0 s",
      label: {
        en: "Manual typing: 1 tap payment capture on Android from Revolut, Google Wallet and Bizum",
        es: "Escritura manual: captura de pagos en 1 toque en Android con Revolut, Google Wallet y Bizum",
      },
    },
    {
      value: "Auto",
      label: {
        en: "Debt settlement: incoming Bizums clear who owes you with zero manual taps",
        es: "Liquidación de deudas: los Bizum recibidos saldan las cuentas sin tocar nada",
      },
    },
    {
      value: "32",
      label: {
        en: "Currencies at live market and Revolut rates with optional +1% bank fee (NBP Table A fallback)",
        es: "Divisas a tipos de mercado y Revolut con +1% bancario opcional (respaldo Tabla A NBP)",
      },
    },
    {
      value: "0.00",
      label: {
        en: "Floating-point errors: 100% integer minor-unit arithmetic in cents and grosze",
        es: "Errores de coma flotante: aritmética pura en céntimos y grosze enteros",
      },
    },
  ],
  features: [
    {
      id: "android-capture",
      title: {
        en: "Zero-Friction Payment & Bizum Auto-Settlement",
        es: "Automatización al Pagar y Cobrar: Cero Fricción",
      },
      body: {
        en: "Traditional split apps make you open the app and type every number. Krakount Captura (Kotlin) listens to payments on Android: pay with Revolut or Google Wallet, and the expense is proposed in 1 tap. Even better: when a friend sends you a Bizum, Krakount detects the incoming alert and marks their debt as settled automatically.",
        es: "Las herramientas convencionales te obligan a abrir la aplicación y teclear cada número. Krakount Captura (Kotlin) escucha pagos en Android: pagas con Revolut o Google Wallet y el gasto se propone en 1 toque. Y aún mejor: cuando un amigo te envía un Bizum, Krakount detecta la alerta y salda su deuda de forma automática.",
      },
      shotKey: "shotCaptura",
      popKey: "popPass",
    },
    {
      id: "receipt-ocr",
      title: {
        en: "Real-Time AI + On-Device Receipt Splitting",
        es: "Tickets del Súper: OCR en Local y Reparto en Vivo",
      },
      body: {
        en: "No more mental arithmetic or typing 30 line items at the checkout till. Snap a photo of any supermarket receipt: Gemini and on-device Tesseract.js parse each item and price. Friends claim their own items concurrently in real time, and photos are never uploaded or stored on servers.",
        es: "Se acabó hacer cuentas mentales o teclear 30 productos en la caja del supermercado. Haz una foto al ticket: Gemini y Tesseract.js en local extraen cada línea y precio. Cada amigo marca sus productos a la vez en tiempo real y la foto nunca se guarda en ningún servidor.",
      },
      shotKey: "shotReceipt",
      popKey: "popShare",
    },
    {
      id: "honest-balances",
      title: {
        en: "Honest Balances, Real Rates & Instant Settle-Up",
        es: "Saldos Honestos, Cambio Real y Liquidación en Un Toque",
      },
      body: {
        en: "Every balance is computed in exact integer minor units, preventing penny rounding errors. When traveling, balances convert across 32 currencies with live market and Revolut rates, plus optional bank fee buffers. Friends copy Revolut, Bizum, BLIK, or IBAN directly where the debt is shown.",
        es: "Cada balance se calcula en unidades enteras exactas, eliminando descuadres de céntimos. Al viajar, convierte entre 32 divisas a tipos de mercado y Revolut en tiempo real con recargo bancario opcional, con copia directa de Revolut, Bizum, BLIK o IBAN junto a la deuda.",
      },
      shotKey: "shotBalances",
      popKey: "popBalance",
    },
    {
      id: "group-trips",
      title: {
        en: "All-in-One Trip Wallet & Offline Boarding Passes",
        es: "Cartera de Viaje Completa y Pases Offline",
      },
      body: {
        en: "Stop juggling separate apps for money, flights, boarding passes, and itineraries. Krakount organizes your trip timeline with interactive maps, tracks live flights via AeroDataBox, and renders high-contrast Aztec and QR boarding passes completely offline when there is no cellular signal at the gate.",
        es: "Deja de alternar entre cinco aplicaciones distintas para gastos, vuelos, billetes y planes. Krakount reúne el itinerario con mapas, monitoriza vuelos en vivo con AeroDataBox y muestra tarjetas de embarque QR y Aztec 100% sin conexión en la puerta de embarque sin cobertura.",
      },
      shotKey: "shotFlight",
      popKey: "popFlight",
    },
  ],
  designSystemNote: {
    title: {
      en: "Design Language: Kazimierz at Night",
      es: "Sistema Visual: Kazimierz de Noche",
    } satisfies LocalizedText,
    body: {
      en: "Inspired by walking through Kraków's Kazimierz district at night under warm sodium streetlamps: deep cold-tinted surfaces (#0E0F13 -> #17181E) where a single amber light (#F5A524) illuminates only what your thumb can act on, while semantic mint (#3DD68C) and coral (#FF6B5B) are reserved strictly for money.",
      es: "Inspirado en caminar de noche por el barrio de Kazimierz bajo farolas ámbar: superficies oscuras de matiz frío (#0E0F13 -> #17181E) donde una única luz ámbar (#F5A524) ilumina solo lo accionable con el pulgar, reservando el verde menta (#3DD68C) y el coral (#FF6B5B) en exclusiva para el dinero.",
    } satisfies LocalizedText,
  },
  techStack: [
    "Next.js 16 (App Router)",
    "React 19",
    "TypeScript Strict",
    "vanilla-extract",
    "Supabase Realtime & RLS",
    "Serwist Offline PWA",
    "Web Push (VAPID)",
    "Gemini + Tesseract.js OCR",
    "Kotlin (Android NotificationListener)",
    "Model Context Protocol (MCP)",
    "Vitest + Playwright E2E",
  ],
};
