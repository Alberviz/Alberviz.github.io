import type { KrakountFriend, LocalizedText, ReceiptSimItem } from "./types";

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
      en: "Shared money and group trips, engineered for one hand.",
      es: "Gastos compartidos y viajes en grupo, diseñados a una mano.",
    } satisfies LocalizedText,
    subtext: {
      en: "Split Polish supermarket receipts item by item, settle 32 currencies at live market and Revolut rates with optional +1% bank fee (NBP fallback), and carry every flight and boarding pass offline.",
      es: "Divide tickets del súper ítem por ítem, liquida 32 divisas a cambio de mercado y Revolut con +1% bancario opcional (respaldo NBP) y lleva tus vuelos y pases QR sin conexión.",
    } satisfies LocalizedText,
    primaryCta: {
      en: "Open Live App",
      es: "Abrir App en Vivo",
    } satisfies LocalizedText,
    secondaryCta: {
      en: "Try Interactive Split",
      es: "Probar Simulador",
    } satisfies LocalizedText,
  },
  stats: [
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
        en: "Floating-point errors: 100% integer minor-unit arithmetic",
        es: "Errores de coma flotante: aritmética pura en céntimos y grosze enteros",
      },
    },
    {
      value: "0",
      label: {
        en: "Receipt photos stored: read in the moment, never uploaded",
        es: "Fotos de tickets guardadas: se leen al momento y nunca se suben",
      },
    },
    {
      value: "1 tap",
      label: {
        en: "Android payment capture from Revolut, Google Wallet, and Bizum",
        es: "Captura automática en Android al pagar con Revolut, Google Wallet o Bizum",
      },
    },
  ],
  simulator: {
    heading: {
      en: "Touch the engine: Live Paragon Fiskalny & Debt Graph",
      es: "Toca el motor: Ticket Polaco en Vivo y Simplificación de Deudas",
    } satisfies LocalizedText,
    subheading: {
      en: "Tap friends on any Biedronka receipt line below. Krakount computes exact integer shares in grosze (PLN) and converts to EUR without rounding drift. The app uses the market rate of the day; this demo uses a fixed one.",
      es: "Pulsa los amigos en cada línea de este ticket real de Biedronka. Krakount reparte cada céntimo exacto en grosze (PLN) y calcula la liquidación mínima en EUR sin errores de redondeo.",
    } satisfies LocalizedText,
    receiptHeader: "BIEDRONKA · UL. KRAKOWSKA 41 · PARAGON FISKALNY",
    paidByLabel: {
      en: "Paid at checkout by Alberto",
      es: "Pagado en caja por Alberto",
    } satisfies LocalizedText,
    currencyToggleLabel: {
      en: "Flip PLN / EUR (demo rate 1 EUR = 4.28 PLN)",
      es: "Cambiar PLN / EUR (tipo de demo 1 EUR = 4,28 PLN)",
    } satisfies LocalizedText,
    whyLabel: {
      en: "Why do I owe this? Integer cent breakdown:",
      es: "¿Por qué debo esto? Desglose exacto al céntimo:",
    } satisfies LocalizedText,
  },
  friends: [
    { id: "alberto", name: "Alberto", initials: "AV", colorHex: "#F5A524" },
    { id: "lucia", name: "Lucía", initials: "LM", colorHex: "#3DD68C" },
    { id: "pablo", name: "Pablo", initials: "PR", colorHex: "#3550C4" },
    { id: "marta", name: "Marta", initials: "MG", colorHex: "#CF3F72" },
  ] satisfies KrakountFriend[],
  receiptItems: [
    {
      id: "pierogi",
      polishName: "PIEROGI RUSKIE 2X500G",
      translatedName: { en: "Pierogi Ruskie (2 packs)", es: "Pierogi Ruskie (2 paquetes)" },
      priceGrosze: 1898,
      defaultClaimants: ["alberto", "lucia", "pablo", "marta"],
    },
    {
      id: "ser",
      polishName: "SER GOUDA KROJONY 400G",
      translatedName: { en: "Sliced Gouda Cheese", es: "Queso Gouda en lonchas" },
      priceGrosze: 1349,
      defaultClaimants: ["alberto", "pablo"],
    },
    {
      id: "zubrowka",
      polishName: "NAPOJ CHMIELOWY 4PAK",
      translatedName: { en: "Craft Lager 4-Pack", es: "Pack 4 cervezas polacas" },
      priceGrosze: 1996,
      defaultClaimants: ["lucia", "pablo", "marta"],
    },
    {
      id: "kawa",
      polishName: "KAWA ZIARNISTA 500G",
      translatedName: { en: "Whole Bean Coffee 500g", es: "Café en grano 500g" },
      priceGrosze: 2799,
      defaultClaimants: ["alberto", "lucia"],
    },
    {
      id: "maliny",
      polishName: "MALINY SWIEZE 250G",
      translatedName: { en: "Fresh Raspberries", es: "Frambuesas frescas" },
      priceGrosze: 1149,
      defaultClaimants: ["marta"],
    },
  ] satisfies ReceiptSimItem[],
  features: [
    {
      id: "receipt-ocr",
      title: {
        en: "AI + On-Device Receipt Splitting",
        es: "Lectura de Tickets con IA + OCR Local",
      },
      body: {
        en: "Snap a photo at the supermarket till. Gemini structures Polish lines with a browser-side Tesseract.js fallback, while Supabase Realtime lets everyone claim items concurrently. Photos are never stored on servers.",
        es: "Haz una foto en la caja del súper. Gemini estructura las líneas con respaldo local en Tesseract.js, y Supabase Realtime permite reclamar productos a la vez sin guardar la foto en servidores.",
      },
      shotKey: "shotReceipt",
      popKey: "popShare",
    },
    {
      id: "honest-balances",
      title: {
        en: "Honest Balances & Instant Settle-Up",
        es: "Saldos Honestos y Liquidación en Un Toque",
      },
      body: {
        en: "Every balance displays exact minor units, live 32-currency market and Revolut conversion with optional +1% bank fee (NBP fallback), and inline Revolut, Bizum, BLIK, or IBAN copy actions right where the debt lives.",
        es: "Cada saldo muestra céntimos exactos, conversión en 32 divisas a tipos de mercado y Revolut con +1% bancario opcional (respaldo NBP) y copia directa de Revolut, Bizum, BLIK o IBAN donde aparece la deuda.",
      },
      shotKey: "shotBalances",
      popKey: "popBalance",
    },
    {
      id: "group-trips",
      title: {
        en: "Trips, Live Flights & Offline Passes Wallet",
        es: "Viajes, Vuelos en Vivo y Cartera QR Offline",
      },
      body: {
        en: "Vote on destination proposals, track live flight status via AeroDataBox, render scannable QR and Aztec boarding passes offline with BWIP-JS, and subscribe to live webcal itineraries.",
        es: "Vota destinos en grupo, sigue vuelos en directo con AeroDataBox, muestra tarjetas de embarque QR sin cobertura y sincroniza el itinerario por webcal.",
      },
      shotKey: "shotFlight",
      popKey: "popFlight",
    },
    {
      id: "android-capture",
      title: {
        en: "Everything You Spend, in One Place",
        es: "Todos tus Gastos en un Mismo Sitio",
      },
      body: {
        en: "Mis gastos adds your share of every group to what you spend alone, with income, savings, and a monthly budget. Krakount Captura (Kotlin) reads Revolut and Wallet payments on Android and proposes the expense, and a received Bizum settles the debt by itself.",
        es: "Mis gastos suma tu parte de cada grupo a lo que gastas tú solo, con ingresos, ahorro y presupuesto mensual. Krakount Captura (Kotlin) lee los pagos de Revolut y Wallet en Android y propone el gasto, y un Bizum recibido salda la deuda solo.",
      },
      shotKey: "shotCaptura",
      popKey: "popPass",
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
