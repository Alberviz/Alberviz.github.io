import type {
  AcademicAward,
  ArchitectureNode,
  ExperienceEntry,
  LocalizedText,
  MetricItem,
  ProjectCaseStudy,
  SubProject,
} from "./types";

export const PROFILE = {
  fullName: "Alberto Vizcaíno Ponte",
  handle: "Alberviz",
  email: "albvizpon@gmail.com",
  githubUrl: "https://github.com/Alberviz",
  linkedinUrl: "https://www.linkedin.com/in/alberto-vizca%C3%ADno-ponte",
  cvPath: "/cv/Alberto_Vizcaino_Ponte_CV.pdf",
  currentLocation: {
    en: "Kraków, Poland · Murcia, Spain",
    es: "Cracovia, Polonia · Murcia, España",
  } satisfies LocalizedText,
  nav: {
    work: { en: "Work", es: "Proyectos" },
    systems: { en: "Home Lab & Wealth", es: "Home Lab y Finanzas" },
    krakount: { en: "Krakount", es: "Krakount" },
    experience: { en: "Background", es: "Trayectoria" },
    cta: { en: "Get in touch", es: "Contactar" },
    commandHint: { en: "Jump", es: "Ir a" },
  },
  hero: {
    eyebrow: {
      en: "MATHEMATICS & COMPUTER SCIENCE · FULL-STACK & SYSTEMS BUILDER",
      es: "MATEMÁTICAS E INFORMÁTICA · BUILDER FULL-STACK Y SISTEMAS",
    } satisfies LocalizedText,
    headline: {
      en: "Turning formal math into shipped software and hardware hacks.",
      es: "De las matemáticas formales al software real y hardware hacking.",
    } satisfies LocalizedText,
    subtext: {
      en: "Double degree student shipping daily-use PWAs, autonomous AI agents on self-hosted Linux, and reverse-engineered hardware protocols.",
      es: "Estudiante del Doble Grado creando PWAs de uso diario, agentes de IA en Linux propio y protocolos hardware.",
    } satisfies LocalizedText,
    primaryCta: {
      en: "Explore Krakount",
      es: "Explorar Krakount",
    } satisfies LocalizedText,
    secondaryCta: {
      en: "Download CV",
      es: "Descargar CV",
    } satisfies LocalizedText,
  },
  proofMetrics: [
    {
      value: "Double B.S.",
      label: {
        en: "Mathematics & CS (UMU · Erasmus at AGH Kraków)",
        es: "Matemáticas e Informática (UMU · Erasmus en AGH Cracovia)",
      },
    },
    {
      value: "15+",
      label: {
        en: "Docker services & AI daemons live 24/7 on Raspberry Pi 5",
        es: "Contenedores y agentes de IA activos 24/7 en Raspberry Pi 5",
      },
    },
    {
      value: "Highest Honors",
      label: {
        en: "Algorithms & Data Structures · 2x Top-7 Programming Olympiad",
        es: "Matrícula de Honor en Algoritmos · 2x Top-7 Olimpiada Programación",
      },
    },
    {
      value: "End-to-End",
      label: {
        en: "Cloud ERP POS shipped at STEL Order + 6 live products",
        es: "Módulo TPV en la nube entregado en STEL Order + 6 productos vivos",
      },
    },
  ] satisfies MetricItem[],
};

export const KRAKOUNT_SPOTLIGHT = {
  badge: {
    en: "Flagship Product · Active Beta (~20 users in Kraków)",
    es: "Producto Insignia · Beta activa (~20 usuarios en Cracovia)",
  } satisfies LocalizedText,
  title: "Krakount",
  headline: {
    en: "Shared expenses, Polish receipt OCR, and group trips in one thumb-driven app.",
    es: "Gastos compartidos, OCR de tickets polacos y viajes en grupo a una sola mano.",
  } satisfies LocalizedText,
  description: {
    en: "Built for our Erasmus group in Kraków because Splitwise only handles IOUs and Wanderlog only handles itineraries. Krakount unifies exact integer-cent multi-currency ledgers (32 NBP rates), live item-by-item supermarket receipt claiming, flight tracking, offline QR boarding passes, and a native Kotlin Android payment listener.",
    es: "Creada para nuestro grupo Erasmus en Cracovia porque Splitwise solo lleva cuentas y Wanderlog solo itinerarios. Krakount une contabilidad exacta en céntimos enteros (32 divisas NBP), reparto en vivo de tickets de supermercado, vuelos en directo, cartera QR offline y captura automática de pagos en Android nativo.",
  } satisfies LocalizedText,
  pillars: [
    {
      title: { en: "Integer-Exact Money", es: "Dinero Exacto en Enteros" },
      detail: {
        en: "Zero floating-point drift, minimal-transfer debt graph, and plain-language 'why do I owe this?' proofs.",
        es: "Cero errores de coma flotante, simplificación mínima de deudas y explicación clara de 'por qué debo esto'.",
      },
    },
    {
      title: { en: "Receipt OCR + Live Claiming", es: "OCR de Tickets en Vivo" },
      detail: {
        en: "Parses Polish Paragon Fiskalny receipts with Gemini + Tesseract fallback so friends tap what they bought.",
        es: "Lee tickets polacos con Gemini y respaldo Tesseract para que cada amigo marque lo suyo en tiempo real.",
      },
    },
    {
      title: { en: "Krakount Captura (Kotlin)", es: "Krakount Captura (Kotlin)" },
      detail: {
        en: "Companion Android NotificationListenerService that logs Revolut, Google Wallet, and Bizum payments instantly.",
        es: "App nativa Android que detecta pagos de Revolut, Google Wallet y Bizum al pagar con el móvil.",
      },
    },
  ],
  ctaPrimary: {
    en: "Open Krakount Showcase",
    es: "Ver Página de Krakount",
  } satisfies LocalizedText,
  ctaVideo: {
    en: "Watch 30s Demo",
    es: "Ver Vídeo 30s",
  } satisfies LocalizedText,
};

export const HOMELAB_WEALTH_SYSTEM = {
  heading: {
    en: "Self-Hosted AI & Interconnected Wealth Infrastructure",
    es: "Infraestructura Propia de IA y Patrimonio Interconectado",
  } satisfies LocalizedText,
  subheading: {
    en: "Running 24/7 on a dedicated Raspberry Pi 5 over an encrypted mesh: an autonomous personal agent, a multi-broker wealth stack, and a hardened AI financial gateway.",
    es: "Corriendo 24/7 en una Raspberry Pi 5 sobre red cifrada: mi agente ejecutivo autónomo, un motor patrimonial multibroker y una pasarela financiera segura para IA.",
  } satisfies LocalizedText,
  auroraHighlight: {
    title: "Aurora (Hermes Autonomous Agent)",
    badge: {
      en: "Private Repo · Running 24/7 on Raspberry Pi 5",
      es: "Repo Privado · Activo 24/7 en Raspberry Pi 5",
    } satisfies LocalizedText,
    summary: {
      en: "Proactive executive agent on Nous Research Hermes orchestrating 73 Google Workspace MCP tools, university IMAP mail, and Telegram voice workflows with strict human-in-the-loop security.",
      es: "Agente ejecutivo proactivo sobre Nous Research Hermes que orquesta 73 herramientas MCP de Google Workspace, correo IMAP universitario y notas de voz en Telegram con control humano.",
    } satisfies LocalizedText,
    wins: [
      {
        en: "Cut dynamic MCP tool-discovery latency from >400s down to ~15s across 73 Google Workspace tools.",
        es: "Reducción de latencia en búsqueda dinámica de herramientas MCP de >400s a ~15s sobre 73 endpoints.",
      },
      {
        en: "Prompt-injection isolation: external emails are parsed via IMAP BODY.PEEK as untrusted inert data; outbound actions require explicit Telegram confirmation.",
        es: "Defensa frente a prompt injection: los correos entran por IMAP BODY.PEEK como datos inertes y toda acción externa exige confirmación explícita.",
      },
      {
        en: "Multi-tier LLM routing (Gemini Flash Lite -> Flash -> Pro) paired with Groq Whisper v3 Turbo voice transcription.",
        es: "Enrutado adaptativo multinivel entre modelos Gemini junto a transcripción instantánea de voz con Groq Whisper v3 Turbo.",
      },
    ] satisfies LocalizedText[],
    stack: ["Python", "Hermes Agent", "MCP (73 tools)", "systemd", "IMAP", "Gemini API", "Groq Whisper", "Tailscale"],
  },
  wealthTitle: {
    en: "Ghostfolio Interconnected Wealth & Business Engine",
    es: "Motor Patrimonial y de Negocio Interconectado en Ghostfolio",
  } satisfies LocalizedText,
  wealthSummary: {
    en: "Instead of giving cloud aggregators bank credentials, I engineered an isolated PostgreSQL + Redis + Ghostfolio wealth engine uniting my investment brokers, live sales and net profit from my personal product-selling business, a read-only mobile PWA, and an audited AI write gateway.",
    es: "En lugar de entregar credenciales bancarias a agregadores externos, diseñé un motor patrimonial aislado con PostgreSQL, Redis y Ghostfolio que unifica mis brókers de inversión, las ventas, stock y profit en tiempo real de mi negocio personal de venta de productos, una PWA móvil de solo lectura y una pasarela auditada para IA.",
  } satisfies LocalizedText,
  connectedFeeds: [
    {
      id: "brokers",
      tag: {
        en: "01 · Multi-Broker Investments",
        es: "01 · Inversión Multibroker",
      } satisfies LocalizedText,
      title: {
        en: "Trade Republic, MyInvestor & Revolut",
        es: "Trade Republic, MyInvestor y Revolut",
      } satisfies LocalizedText,
      detail: {
        en: "Automated ingestion of ETFs, index funds, equities, and multi-currency cash with tolerant CSV parsers and idempotent deduplication.",
        es: "Ingesta automatizada de ETFs, fondos indexados, acciones y liquidez multidivisa con parsers tolerantes y deduplicación idempotente.",
      } satisfies LocalizedText,
    },
    {
      id: "business",
      featured: true,
      tag: {
        en: "02 · Personal Commerce ERP -> Ghostfolio",
        es: "02 · Negocio Personal -> Ghostfolio",
      } satisfies LocalizedText,
      title: {
        en: "Product Sales, Inventory & Live Net Profit",
        es: "Venta de Productos, Stock y Profit en Vivo",
      } satisfies LocalizedText,
      detail: {
        en: "Connected live to my personal product-selling business: a custom Supabase ERP tracks stock, supplier restocks, unit sales, margins, and real-time net profit, syncing my stake valuation (NAV) and profit payouts straight into Ghostfolio.",
        es: "Conectado en directo con mi negocio personal donde vendo productos: un ERP propio en Supabase controla inventario, reposiciones, ventas, márgenes y profit neto en tiempo real, sincronizando el valor de mi participación (NAV) y los beneficios en Ghostfolio.",
      } satisfies LocalizedText,
    },
    {
      id: "ai-pwa",
      tag: {
        en: "03 · AI Gateway & Mobile Wealth View",
        es: "03 · Pasarela IA y Panel Móvil",
      } satisfies LocalizedText,
      title: {
        en: "Least-Privilege Agent + Read-Only PWA",
        es: "Agente con Mínimo Privilegio + PWA",
      } satisfies LocalizedText,
      detail: {
        en: "Telegram AI logs cash and trades via a capped, reversible proxy (EUR limits + JSONL rollback), while a read-only mobile PWA unifies net worth.",
        es: "El agente IA registra saldos y compras mediante un proxy reversible con topes en euros, mientras una PWA móvil de solo lectura unifica todo el patrimonio.",
      } satisfies LocalizedText,
    },
  ],
  wealthNodes: [
    {
      id: "ingest",
      layer: "ingest",
      title: {
        en: "Brokers & Personal Business Sync",
        es: "Brókers y Sincronización con Negocio Personal",
      },
      subtitle: {
        en: "Trade Republic · MyInvestor · Revolut · Live Business Profit & Stock Bridge",
        es: "Trade Republic · MyInvestor · Revolut · Puente en Vivo de Ventas, Stock y Profit",
      },
      specs: [
        {
          en: "Multilingual CSV parsers (ES/EN/DE) with dry-run simulation, Xetra/LSE currency mismatch checks, and idempotent ref deduplication.",
          es: "Parsers CSV tolerantes (ES/EN/DE) con modo simulación, detección de desajustes de divisa Xetra/LSE y deduplicación idempotente.",
        },
        {
          en: "Live Supabase bridge to my personal product-selling business: separates inventory restocking capital from realized sales profit, computes real-time unit NAV (unsold stock at cost + cash + margins), and books partner profit payouts as dividends.",
          es: "Puente en vivo con la base de datos en Supabase de mi negocio personal de venta de productos: separa el capital de reposición de stock del profit neto por ventas, calcula el NAV en tiempo real (stock a coste + caja + margen) y registra los repartos de beneficio como dividendos.",
        },
      ],
    },
    {
      id: "core",
      layer: "core",
      title: {
        en: "Isolated Ghostfolio Core",
        es: "Núcleo Aislado Ghostfolio",
      },
      subtitle: {
        en: "Ghostfolio 3.89 · PostgreSQL 15 · Redis 7 · Automated Rotation Backups",
        es: "Ghostfolio 3.89 · PostgreSQL 15 · Redis 7 · Backups con Rotación",
      },
      specs: [
        {
          en: "Bound strictly to internal Docker bridge networking with zero direct public exposure.",
          es: "Confinado en una red Docker interna privada sin exposición pública directa a Internet.",
        },
        {
          en: "Automated nightly pg_dump + JSON snapshots with 14-day daily and 8-week weekly retention.",
          es: "Copias nocturnas automáticas con pg_dump y exportación JSON (retención de 14 días y 8 semanas).",
        },
      ],
    },
    {
      id: "security",
      layer: "security",
      title: {
        en: "Hardened AI Agent Gateway",
        es: "Pasarela Blindada para Agente IA",
      },
      subtitle: {
        en: "Least-Privilege Proxy · Quotas · Idempotency · Rollback Ledger",
        es: "Proxy de Mínimo Privilegio · Límites · Idempotencia · Diario Reversible",
      },
      specs: [
        {
          en: "Allows the AI agent to record BUY/SELL/DIVIDEND operations and cash balances without ever holding Ghostfolio admin tokens.",
          es: "Permite al agente registrar operaciones y saldos de efectivo sin poseer jamás credenciales de administrador.",
        },
        {
          en: "Enforces per-trade EUR caps, 50 writes/day, 30 req/min, HTTP 409 reference deduplication, and an append-only JSONL rollback journal.",
          es: "Aplica tope en euros por operación, límite diario y por minuto, claves de idempotencia 409 y diario JSONL para revertir cualquier escritura.",
        },
      ],
    },
    {
      id: "interface",
      layer: "interface",
      title: {
        en: "Read-Only Mobile Panel & Health Hub",
        es: "Panel Móvil Solo-Lectura y Ecosistema Pi",
      },
      subtitle: {
        en: "Impersonation-Id Read Token · Cross-Broker Grouping · OpenGym Fork",
        es: "Token de Solo Lectura Verificado · Agrupación de Activos · Fork OpenGym",
      },
      specs: [
        {
          en: "Mobile wealth view powered by a scoped DEMO token verified by automated tests to return HTTP 403 on every mutation.",
          es: "Panel móvil alimentado por un token restringido verificado automáticamente para devolver HTTP 403 ante cualquier intento de escritura.",
        },
        {
          en: "Shares the Pi 5 with Gym Hub + a custom CRDT-synced OpenGym fork ingesting smartwatch biometrics into Gemini weekly summaries.",
          es: "Convive en la Pi 5 con Gym Hub y un fork propio de OpenGym con hábitos sincronizados y resúmenes semanales con Gemini.",
        },
      ],
    },
  ] satisfies ArchitectureNode[],
};

export const SELECTED_CASE_STUDIES: ProjectCaseStudy[] = [
  {
    id: "mycrohnie",
    slug: "mycrohnie",
    title: "MyCrohnie",
    tagline: {
      en: "Zero-guilt pediatric Crohn's companion built in 24h at HackYeah 2026.",
      es: "Compañero pediátrico para enfermedad de Crohn creado en 24h en HackYeah 2026.",
    },
    category: "hackathon",
    repoStatus: "public",
    statusLabel: {
      en: "Public Repo · HackYeah 2026 (TAURON Arena Kraków)",
      es: "Repo Público · HackYeah 2026 (TAURON Arena Cracovia)",
    },
    year: "2026",
    context: {
      en: "Lead architect and primary developer at Europe's largest in-person hackathon (Sport & Healthcare track).",
      es: "Arquitecto de software y desarrollador principal en el mayor hackathon presencial de Europa (categoría Sport & Healthcare).",
    },
    problem: {
      en: "Children aged 8-12 with inflammatory bowel disease hate daily interrogation about pain, yet doctors need structured symptom and meal histories in a 15-minute appointment.",
      es: "Los niños de 8 a 12 años con enfermedad inflamatoria intestinal odian el interrogatorio diario sobre su dolor, pero el médico necesita datos claros en una consulta de 15 minutos.",
    },
    engineeringHighlights: [
      {
        en: "Dual-surface architecture: visual, text-light dragon companion for the child (no streaks or punishment) paired with a PIN-gated parent analytics dashboard.",
        es: "Doble interfaz: compañero dragón 100% visual para el niño (sin rachas punitivas) y panel analítico tras PIN para los padres.",
      },
      {
        en: "Zero-dependency 1-page Doctor Report compiled via native browser @media print CSS, plus read-only Google Health wearable metrics.",
        es: "Informe clínico de 1 página generado con CSS @media print nativo sin librerías pesadas, más lectura de métricas de Google Health.",
      },
      {
        en: "Strict local-first privacy: 100% on-device storage validated with Zod schemas and instant 90-day realistic seed loader for judges.",
        es: "Privacidad local-first estricta: datos validados con Zod en el dispositivo y carga instantánea de 90 días de demostración.",
      },
    ],
    stack: ["Next.js 16", "React 19", "TypeScript", "Zod", "Google Health API", "Serwist PWA", "Print CSS"],
    links: [
      { label: { en: "Live App", es: "Abrir Demo" }, href: "https://mycrohnie.vercel.app", kind: "live" },
      { label: { en: "GitHub", es: "GitHub" }, href: "https://github.com/Alberviz/JoseoKings-Hackyeah", kind: "github" },
      { label: { en: "Pitch Deck", es: "Pitch Deck" }, href: "/media/mycrohnie/MyCrohnie-deck.pdf", kind: "pdf" },
    ],
    featuredMediaKey: "mycrohnie",
  },
  {
    id: "low-level-systems",
    slug: "systems-and-hardware",
    title: "Linux HID Drivers, GLSL Gargantua & Watch Hacking",
    tagline: {
      en: "USB packet sniffing, raymarched black-hole shaders, and closed-RTOS smartwatch hijacking.",
      es: "Sniffing USB, shaders GLSL de agujeros negros y hacking de protocolo en smartwatch cerrado.",
    },
    category: "systems",
    repoStatus: "public",
    statusLabel: {
      en: "Public Repos · Hardware & Graphics Engineering",
      es: "Repos Públicos · Ingeniería Hardware y Gráficos",
    },
    year: "2026",
    context: {
      en: "When Linux lacked drivers for my wireless peripherals and my Amazfit watch had no SDK, I reverse-engineered the protocols from scratch.",
      es: "Cuando Linux no tenía drivers para mis periféricos inalámbricos ni mi reloj Amazfit ofrecía SDK, hice ingeniería inversa de sus protocolos.",
    },
    problem: {
      en: "Proprietary hardware ecosystems lock telemetry, RGB, and physical buttons behind Windows-only suites or closed RTOS firmware.",
      es: "Los ecosistemas cerrados bloquean la batería, iluminación y botones físicos tras programas exclusivos de Windows o firmwares propietarios.",
    },
    engineeringHighlights: [
      {
        en: "Sniffed raw USB frames and wrote native Linux /dev/hidraw drivers for Akko keyboards and MCHOSE 8K wireless mice (opcode 0x83/0x06 battery telemetry + XOR 0xFF checksums).",
        es: "Captura de tramas USB y drivers nativos /dev/hidraw en Linux para teclados Akko y ratones MCHOSE 8K (telemetría de batería y checksums XOR 0xFF).",
      },
      {
        en: "Authored a raymarched GLSL Gargantua black-hole shader with ACES filmic tone-mapping plus a QML gravitational desktop driven by live smartwatch biometrics.",
        es: "Shader GLSL raymarched del agujero negro Gargantua con mapeo tonal ACES y escritorio gravitatorio en QML reactivo a biometría real.",
      },
      {
        en: "Built gts2-mando (Kotlin): plays silent Android MediaSession audio to hijack Amazfit GTS 2 AVRCP wrist buttons into HTTP webhooks and records voice memos over Bluetooth SCO.",
        es: "App gts2-mando en Kotlin: usa una MediaSession silenciosa para convertir los botones físicos del reloj Amazfit GTS 2 en webhooks HTTP y grabadora por Bluetooth SCO.",
      },
      {
        en: "Conducted a 48-page hex memory & 3DES cryptographic audit on SALTO MIFARE Ultralight C dormitory cards (ISO/IEC 14443-3A) to prove Android HCE physical boundaries.",
        es: "Auditoría forense hexadecimal y criptográfica 3DES sobre tarjetas universitarias MIFARE Ultralight C (SALTO) demostrando los límites físicos de Android HCE.",
      },
    ],
    stack: ["C / GLSL", "Python (/dev/hidraw)", "Kotlin", "Bluetooth SCO / BLE", "QML / Hyprland", "ISO 14443-3A / 3DES"],
    links: [
      { label: { en: "LinuxRicing Repo", es: "Repo LinuxRicing" }, href: "https://github.com/Alberviz/LinuxRicing", kind: "github" },
      { label: { en: "gts2-mando Repo", es: "Repo gts2-mando" }, href: "https://github.com/Alberviz/gts2-mando", kind: "github" },
    ],
    featuredMediaKey: "gargantua",
  },
];

export const APPLIED_AI_PROJECTS: SubProject[] = [
  {
    id: "barber-bot",
    title: "Juan Barber Bot",
    badge: {
      en: "In Production · €0/mo Serverless",
      es: "En Producción · 0 €/mes Serverless",
    },
    summary: {
      en: "Multilingual Telegram booking assistant (Spanish, Polish, English) handling text and voice notes for a real barbershop in Poland.",
      es: "Asistente de reservas en Telegram (español, polaco e inglés) por texto y notas de voz en producción para una barbería real en Polonia.",
    },
    highlights: [
      {
        en: "5-layer resilience cascade (Regex UI -> Groq 120B -> Whisper v3 Turbo -> Gemini Flash -> 1-tap slot buttons) synced with Google Calendar.",
        es: "Cascada resiliente de 5 capas (botones -> Groq 120B -> Whisper v3 Turbo -> Gemini Flash -> fallback interactivo) conectada a Google Calendar.",
      },
    ],
    stack: ["TypeScript", "grammY", "Groq Whisper", "Gemini", "Turso libSQL", "Vercel"],
    links: [
      { label: { en: "Live Panel", es: "Panel Web" }, href: "https://barber-bot-zeta.vercel.app", kind: "live" },
    ],
  },
  {
    id: "closhare",
    title: "CloShare",
    badge: {
      en: "Live PWA · In-Browser WebGPU AI",
      es: "PWA Activa · IA WebGPU en Navegador",
    },
    summary: {
      en: "Peer-to-peer shared wardrobe PWA ('Tricount for clothes') built with Juan García Egea so friend groups lend outfits without losing items.",
      es: "Armario compartido entre amigas ('el Tricount de la ropa', junto a Juan García Egea) para prestar prendas en dos toques sin perder nada.",
    },
    highlights: [
      {
        en: "Runs AI background removal (@imgly/background-removal) locally in the browser via WebGPU/WASM at €0 server cost to turn garments into die-cut stickers.",
        es: "Ejecuta recorte de fondo por IA en el navegador vía WebGPU/WASM a coste 0 € de servidor para convertir cada prenda en pegatina.",
      },
    ],
    stack: ["Next.js 15", "React 19", "WebGPU / WASM", "Tailwind v4", "Supabase Realtime"],
    links: [
      { label: { en: "Live App", es: "Abrir App" }, href: "https://closhare-indol.vercel.app", kind: "live" },
    ],
  },
  {
    id: "zloty-euro",
    title: "Zloty-Euro & Erasmus Flights",
    badge: {
      en: "Native Android + Multimodal Scraper",
      es: "Android Nativo + Scraper Multimodal",
    },
    summary: {
      en: "Native Kotlin camera app translating Polish shelf prices live, paired with a weekend flight + rail cost optimizer across 5 Polish airports.",
      es: "App Android en Kotlin que convierte precios impresos en tienda con la cámara en vivo, junto a un optimizador de vuelos + trenes desde 5 aeropuertos polacos.",
    },
    highlights: [
      {
        en: "Jetpack Compose + ML Kit live camera OCR + Glance home widget + system-wide ACTION_PROCESS_TEXT Polish-Spanish translation.",
        es: "Jetpack Compose + cámara OCR con ML Kit + widget Glance + traductor integrado en el menú nativo de selección de texto de Android.",
      },
    ],
    stack: ["Kotlin", "Jetpack Compose", "ML Kit OCR", "Python", "Ryanair API"],
    links: [
      { label: { en: "Competitive C++ Repo", es: "Repo C++ Competitiva" }, href: "https://github.com/Alberviz/competitiva", kind: "github" },
    ],
  },
];

export const EXPERIENCE: ExperienceEntry[] = [
  {
    company: "STEL Order (STEL Solutions)",
    role: {
      en: "Full-Stack Software Engineer Intern",
      es: "Software Engineer Intern, Full-Stack",
    },
    location: {
      en: "Murcia, Spain",
      es: "Murcia, España",
    },
    period: {
      en: "Jun 2026 - Aug 2026",
      es: "Jun 2026 - Ago 2026",
    },
    summary: {
      en: "Owned and shipped the cloud Point-of-Sale (POS) module of STEL Order, a commercial ERP platform used by SMEs.",
      es: "Desarrollé de principio a fin el módulo de Terminal Punto de Venta (TPV) en la nube de STEL Order, ERP comercial para pymes.",
    },
    bullets: [
      {
        en: "Built the POS checkout end to end: responsive React catalogue, receipt generation, and server synchronization logic, delivered feature-complete.",
        es: "Implementación completa del TPV: catálogo ágil en React, generación de tickets y lógica de sincronización en servidor hasta entrega final en producción.",
      },
      {
        en: "Developed interactive React components for the STEL Order in-app AI assistant and integrated production REST APIs.",
        es: "Creación de componentes React para el asistente inteligente integrado dentro del ERP e integración con APIs REST en producción.",
      },
    ],
    stack: ["React", "TypeScript", "REST APIs", "Cloud ERP", "Git"],
  },
];

export const EDUCATION_AND_HONORS: {
  degree: LocalizedText;
  university: LocalizedText;
  exchange: LocalizedText;
  communityNote: LocalizedText;
  awards: AcademicAward[];
} = {
  degree: {
    en: "Double B.S. in Mathematics & Computer Science",
    es: "Doble Grado en Matemáticas e Ingeniería Informática",
  },
  university: {
    en: "Universidad de Murcia (Expected 2028)",
    es: "Universidad de Murcia (Graduación prevista: 2028)",
  },
  exchange: {
    en: "Erasmus+ Academic Year at AGH University of Kraków, Poland (2026-2027)",
    es: "Curso completo Erasmus+ en AGH University of Kraków, Polonia (2026-2027)",
  },
  communityNote: {
    en: "Creator of UmuCollab: automated Git + Obsidian + LaTeX pipeline translating Polish university coursework into typeset Spanish PDFs for fellow exchange students.",
    es: "Creador de UmuCollab: pipeline automatizado con Git, Obsidian y LaTeX que traduce apuntes universitarios del polaco al español maquetados en PDF para compañeros de intercambio.",
  },
  awards: [
    {
      title: {
        en: "Highest Honors (Matrícula de Honor)",
        es: "Matrícula de Honor",
      },
      detail: {
        en: "Algorithms and Data Structures · Competitive Programming specialization",
        es: "Algoritmos y Estructuras de Datos · Formación en Programación Competitiva en C++",
      },
      year: "UMU",
    },
    {
      title: {
        en: "2x 7th Place - Regional Programming Olympiad",
        es: "2x 7.º Puesto - Olimpiada de Programación de la Región de Murcia",
      },
      detail: {
        en: "Algorithmic problem solving in C++ under strict time and memory limits",
        es: "Resolución algorítmica en C++ bajo límites estrictos de tiempo y memoria",
      },
      year: "2x",
    },
    {
      title: {
        en: "Accésit - Regional Mathematics Olympiad",
        es: "Accésit - Olimpiada Matemática Regional",
      },
      detail: {
        en: "Awarded for formal proof construction and mathematical problem solving",
        es: "Reconocimiento en demostración formal y resolución de problemas matemáticos",
      },
      year: "Math",
    },
  ],
};
