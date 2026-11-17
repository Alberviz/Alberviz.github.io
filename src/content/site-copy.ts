import type { LocalizedText } from "./types";

/** Copy for the shell of the page (nav, hero, Wari portal, contact). EN/ES. */

export const NAV = {
  home: { en: "Home", es: "Inicio" },
  projects: { en: "Work", es: "Trabajo" },
  contact: { en: "Contact", es: "Contacto" },
  menu: { en: "More", es: "Más" },
  menuTitle: { en: "Pages and sections", es: "Páginas y secciones" },
  close: { en: "Close", es: "Cerrar" },
  search: { en: "Search", es: "Buscar" },
  palette: { en: "Open command palette", es: "Abrir paleta de comandos" },
} satisfies Record<string, LocalizedText>;

export const HERO = {
  headline: {
    en: "I build whole systems, from the proof to the hardware.",
    es: "Construyo sistemas enteros, de la demostración al hardware.",
  },
  sub: {
    en: "Maths and CS student. I'm taking my own app from beta to the stores, and my life runs on a Raspberry Pi I set up myself.",
    es: "Estudio Matemáticas e Informática. Estoy llevando mi propia app de la beta a las tiendas, y mi vida corre en una Raspberry Pi que monté yo.",
  },
  casesLabel: { en: "Two things I'm proudest of", es: "Las dos cosas de las que más orgulloso estoy" },
  cases: [
    {
      id: "wari",
      n: "01",
      name: "Wari",
      line: {
        en: "Group expenses, receipts and trips. My product, in beta on its way to the stores.",
        es: "Gastos de grupo, tickets y viajes. Mi producto, en beta camino de las tiendas.",
      },
    },
    {
      id: "olimpo",
      n: "02",
      name: "Olimpo + Warp",
      line: {
        en: "The operating system of my life, self-hosted on a Raspberry Pi 5.",
        es: "El sistema operativo de mi vida, autoalojado en una Raspberry Pi 5.",
      },
    },
  ],
  legendLive: {
    en: "Live: the black hole from my desktop, rendered in your browser",
    es: "En vivo: el agujero negro de mi escritorio, renderizado en tu navegador",
  },
  legendStill: {
    en: "The black hole from my desktop (still image)",
    es: "El agujero negro de mi escritorio (imagen fija)",
  },
  posterAlt: {
    en: "A black hole with a glowing accretion disk on a field of stars",
    es: "Un agujero negro con un disco de acreción brillante sobre un campo de estrellas",
  },
} satisfies Record<string, unknown>;

export const WARI = {
  eyebrow: { en: "01 · My product, in beta", es: "01 · Mi producto, en beta" },
  title: {
    en: "Money and plans for groups, in one app.",
    es: "El dinero y los planes del grupo, en una sola app.",
  },
  lead: {
    en: "Wari splits group expenses, reads supermarket receipts product by product and keeps the trip in the same place. It also does the boring part by itself: your card payments turn into expenses, and paying back takes one tap. It's my product: I design it, build it and run it, and it's in beta now on its way to Google Play and the App Store.",
    es: "Wari reparte los gastos del grupo, lee los tickets del súper producto a producto y guarda el viaje en el mismo sitio. Y hace sola la parte aburrida: tus pagos con tarjeta se convierten en gastos y devolver el dinero es un toque. Es mi producto: lo diseño, lo programo y lo mantengo, y ahora está en beta camino de Google Play y la App Store.",
  },
  status: { en: "In beta", es: "En beta" },
  statusNext: { en: "Next: Google Play and the App Store", es: "Lo siguiente: Google Play y App Store" },
  name: {
    en: "The name comes from 割り勘 (warikan), Japanese for splitting the bill evenly.",
    es: "El nombre viene de 割り勘 (warikan), pagar a partes iguales en japonés.",
  },
  /** Three things Wari does without being asked (each one is a chapter of the story below). */
  auto: [
    { en: "Card payments become expenses", es: "Los pagos con tarjeta se vuelven gastos" },
    { en: "A Bizum received settles the debt", es: "Un Bizum recibido salda la deuda" },
    { en: "Revolut opens with the amount typed", es: "Revolut se abre con el importe puesto" },
  ] satisfies LocalizedText[],
  autoLabel: { en: "What it does by itself", es: "Lo que hace sola" },
  cta: { en: "Open the Wari website", es: "Abrir la web de Wari" },
  caption: { en: "Real screens from the beta, with demo data", es: "Pantallas reales de la beta, con datos de demo" },
  storyLabel: { en: "How Wari works", es: "Cómo funciona Wari" },
  swipeHint: { en: "Swipe", es: "Desliza" },
  chapters: [
    {
      id: "inicio",
      title: { en: "Everything you owe, in one number.", es: "Todo lo que debes, en un número." },
      body: {
        en: "Home adds up every group: what they owe you, what you owe, and who to settle with first. If you owe each other in two groups, one tap evens it out.",
        es: "Inicio suma todos los grupos: lo que te deben, lo que debes y con quién saldar primero. Si os debéis en dos grupos, un toque lo compensa.",
      },
    },
    {
      id: "captura",
      title: { en: "Pay with your card. The expense writes itself.", es: "Pagas con tarjeta. El gasto se apunta solo." },
      body: {
        en: "Wari Captura, a tiny Android app I wrote in Kotlin, reads the payment notifications from Revolut and Google Wallet. The payment shows up in Wari with the amount and the shop filled in and the group suggested; two alerts for the same payment merge into one. It's optional, and it only listens to the apps you pick.",
        es: "Wari Captura, una app pequeña de Android que escribí en Kotlin, lee los avisos de pago de Revolut y Google Wallet. El pago aparece en Wari con el importe y la tienda puestos y el grupo sugerido; dos avisos del mismo pago se juntan en uno. Es opcional y solo escucha las apps que tú eliges.",
      },
    },
    {
      id: "ticket",
      title: { en: "The receipt, product by product.", es: "El ticket, producto a producto." },
      body: {
        en: "Take a photo of the receipt and an AI reads it, Polish supermarkets included. Everyone ticks what's theirs in real time. The photo is only read, never stored.",
        es: "Haces una foto del ticket y una IA lo lee, también los de supermercados polacos. Cada uno marca lo suyo en tiempo real. La foto solo se lee, no se guarda.",
      },
    },
    {
      id: "pagar",
      title: { en: "Settle up in one tap.", es: "Saldar, en un toque." },
      body: {
        en: "Tap what you owe and Wari opens Revolut with the amount, the currency and a note already filled in; for Bizum it copies the number. When a friend's Bizum reaches you, the debt settles by itself. A reminder goes out at most once a day, and if you both switch it on, debts across groups offset themselves every week or month.",
        es: "Tocas lo que debes y Wari abre Revolut con el importe, la moneda y un concepto ya puestos; para Bizum copia el número. Cuando te llega el Bizum de un amigo, la deuda se salda sola. Un recordatorio sale como mucho una vez al día y, si los dos lo activáis, las deudas entre grupos se compensan solas cada semana o cada mes.",
      },
    },
    {
      id: "viaje",
      title: { en: "And the trip, in the same app.", es: "Y el viaje, en la misma app." },
      body: {
        en: "Stops, times and tickets for each day, with the next step always on top. Other apps only do the money; Wari keeps both together.",
        es: "Paradas, horas y billetes de cada día, con el siguiente paso siempre arriba. Las demás apps solo llevan el dinero; Wari junta las dos cosas.",
      },
    },
  ] satisfies { id: string; title: LocalizedText; body: LocalizedText }[],
} satisfies Record<string, unknown>;

export const CONTACT = {
  heading: {
    en: "Let's build something whole.",
    es: "Construyamos algo entero.",
  },
  sub: {
    en: "Open to fellowships and early teams. Email is the fastest way.",
    es: "Abierto a fellowships y equipos en fase temprana. El email es lo más rápido.",
  },
  copy: { en: "Copy email", es: "Copiar email" },
  copied: { en: "Copied", es: "Copiado" },
  cv: { en: "CV (PDF)", es: "CV (PDF)" },
  signature: { en: "Made by hand by Alberto", es: "Hecho a mano por Alberto" },
  signatureLink: { en: "See Wari", es: "Ver Wari" },
} satisfies Record<string, LocalizedText>;
