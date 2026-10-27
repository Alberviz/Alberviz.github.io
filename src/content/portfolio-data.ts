import type {
  AcademicAward,
  ArchitectureNode,
  ExperienceEntry,
  LinuxDesktopShowcaseItem,
  LocalizedText,
  MetricItem,
  ProjectCaseStudy,
  SubProject,
  WealthFlowArchitecture,
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
    systems: { en: "Wealth & Health", es: "Patrimonio y Salud" },
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
        en: "Mathematics & CS · UMU + AGH Kraków",
        es: "Matemáticas e Informática · UMU + AGH Cracovia",
      },
    },
    {
      value: "15+",
      label: {
        en: "Services and AI agents live 24/7 on a Raspberry Pi 5",
        es: "Servicios y agentes de IA activos 24/7 en una Raspberry Pi 5",
      },
    },
    {
      value: "Highest Honors",
      label: {
        en: "Algorithms · 2x Top-7 Programming Olympiad",
        es: "Algoritmos · 2x Top-7 Olimpiada de Programación",
      },
    },
    {
      value: "End-to-End",
      label: {
        en: "POS module shipped at STEL Order + 6 live products",
        es: "Módulo TPV entregado en STEL Order + 6 productos en vivo",
      },
    },
  ] satisfies MetricItem[],
};

export const KRAKOUNT_SPOTLIGHT = {
  badge: {
    en: "Flagship product · In daily use by our Erasmus group",
    es: "Producto insignia · En uso diario en nuestro grupo Erasmus",
  } satisfies LocalizedText,
  title: "Krakount",
  headline: {
    en: "All your money and your group trips, in one app you use with one hand.",
    es: "Todo tu dinero y los viajes del grupo, en una app que se usa a una mano.",
  } satisfies LocalizedText,
  description: {
    en: "Built for our Erasmus group in Kraków because traditional split apps only cover basic lists and trip apps only cover trips. Krakount puts both in one installable PWA: automated card payments and Bizum auto-settling, exact minor units in 32 currencies, receipts split item by item, and the whole trip, from the vote on where to sleep to offline boarding passes at the gate.",
    es: "Creada para nuestro grupo Erasmus en Cracovia porque las apps tradicionales de gastos solo llevan listas básicas y las apps de viajes solo los viajes. Krakount junta las dos cosas en una PWA instalable: pagos automáticos de tarjeta y cobros por Bizum que se saldan solos, céntimos exactos en 32 monedas, tickets repartidos producto a producto y el viaje entero, desde votar dónde dormir hasta el billete offline en la puerta de embarque.",
  } satisfies LocalizedText,
  pillars: [
    {
      title: { en: "Every euro in one place", es: "Todos tus gastos en un mismo sitio" },
      detail: {
        en: "Mis gastos adds your share of every group to what you spend alone, against a monthly budget, fixed or a share of your income. On Android, Krakount Captura reads Revolut and Wallet payments and a received Bizum settles the debt by itself.",
        es: "Mis gastos suma tu parte de cada grupo a lo que gastas tú solo, frente a un presupuesto mensual, fijo o un porcentaje de lo que ingresas. En Android, Krakount Captura lee los pagos de Revolut y Wallet, y un Bizum recibido salda la deuda solo.",
      },
    },
    {
      title: { en: "Receipts split live", es: "Tickets repartidos en vivo" },
      detail: {
        en: "Snap the supermarket receipt, Gemini reads every Polish line (Tesseract as fallback), and each friend ticks what is theirs from their own phone, in real time. The photo is never stored.",
        es: "Foto al ticket del súper, Gemini lee cada línea en polaco (con Tesseract de respaldo) y cada amigo marca lo suyo desde su móvil, en tiempo real. La foto nunca se guarda.",
      },
    },
    {
      title: { en: "The whole trip, not just the bill", es: "El viaje entero, no solo la cuenta" },
      detail: {
        en: "Proposals the group votes on, live flight status, an itinerary with a drawn map, and a wallet of boarding passes whose QR codes are redrawn offline. When it ends, a Wrapped story.",
        es: "Propuestas que vota el grupo, vuelos en vivo, un itinerario con mapa dibujado y una cartera de billetes cuyos QR se redibujan sin conexión. Al terminar, una historia Wrapped.",
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
    en: "Two personal systems, one Raspberry Pi",
    es: "Dos sistemas personales, una Raspberry Pi",
  } satisfies LocalizedText,
  subheading: {
    en: "Running 24/7 at home: a wealth engine fed by my brokers, my personal product-selling business and Krakount, a health hub fed by my watch, my meals and my gym log, and Aurora, my autonomous agent.",
    es: "Activa 24/7 en casa: un motor patrimonial que une mis brókers, mi negocio personal de venta de productos y Krakount, un hub de salud que une mi reloj, mis comidas y mi registro del gimnasio, y Aurora, mi agente autónomo.",
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
        en: "Prompt-injection isolation: external emails (UMU + AGH Kraków) enter strictly via IMAP BODY.PEEK as inert text; outbound actions require explicit Telegram confirmation.",
        es: "Defensa frente a prompt injection: los correos entran por IMAP BODY.PEEK como datos inertes y toda acción externa exige confirmación explícita.",
      },
      {
        en: "Direct execution for Alberto's authenticated commands, multi-tier LLM routing with Gemini to DeepSeek fallback, and desktop Hermes API for Laura.",
        es: "Ejecución directa para comandos autenticados de Alberto, enrutado adaptable con respaldo de Gemini a DeepSeek y API local de Hermes para Laura.",
      },
    ] satisfies LocalizedText[],
    stack: ["Python", "Hermes Agent", "MCP (73 tools)", "systemd", "IMAP", "Gemini API", "DeepSeek", "Tailscale"],
  },
  wealthTitle: {
    en: "One net worth, four live feeds",
    es: "Un patrimonio, cuatro fuentes en vivo",
  } satisfies LocalizedText,
  wealthSummary: {
    en: "Brokers, my personal product-selling business, Krakount and Aurora write into one isolated Ghostfolio core. A read-only app and voice queries read from it.",
    es: "Brókers, mi negocio personal de venta de productos, Krakount y Aurora escriben en un único núcleo Ghostfolio aislado. Una app de solo lectura y la voz leen de él.",
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
        en: "Collected Cash & Realized Sales Profit",
        es: "Caja Cobrada y Beneficio Realizado",
      } satisfies LocalizedText,
      detail: {
        en: "Connected to my personal product-selling business (Supabase cron 03:15). Partner stake is valued strictly on collected cash and realized sales profit: unsold stock counts as 0 EUR until sold, restocks deduct from business cash, and monthly profit closures book dividends.",
        es: "Conectado a mi negocio personal donde vendo productos (cron Supabase 03:15). La participación se valora estrictamente sobre caja cobrada y beneficio realizado: el stock no vendido cuenta como 0 EUR hasta venderse, las reposiciones descuentan caja y los cierres mensuales registran dividendos.",
      } satisfies LocalizedText,
    },
    {
      id: "krakount",
      tag: {
        en: "03 · Krakount Capital Feed",
        es: "03 · Feed de Capital Krakount",
      } satisfies LocalizedText,
      title: {
        en: "Group Expense Shares & Debt Ledger",
        es: "Parte Personal de Gastos y Deudas",
      } satisfies LocalizedText,
      detail: {
        en: "GET /api/v1/me/capital runs every 10 minutes to sync personal share of group expenses, logged income, and net group balances per bank into Ghostfolio.",
        es: "GET /api/v1/me/capital corre cada 10 minutos para sincronizar en Ghostfolio la parte personal de gastos del grupo, ingresos y saldos netos por banco.",
      } satisfies LocalizedText,
    },
    {
      id: "ai-pwa",
      tag: {
        en: "04 · AI Gateway & Mobile Wealth View",
        es: "04 · Pasarela IA y Panel Móvil",
      } satisfies LocalizedText,
      title: {
        en: "Least-Privilege Agent + Read-Only PWA",
        es: "Agente con Mínimo Privilegio + PWA",
      } satisfies LocalizedText,
      detail: {
        en: "Telegram AI logs operations via a capped proxy (10k EUR transaction limit, 50 writes/day, JSONL rollback ledger), while a read-only PWA displays total net worth.",
        es: "El agente en Telegram registra operaciones mediante un proxy con tope (10k EUR por operación, 50 escrituras/día, diario JSONL reversible) y una PWA de solo lectura muestra el patrimonio.",
      } satisfies LocalizedText,
    },
  ],
  wealthNodes: [
    {
      id: "ingest",
      layer: "ingest",
      title: {
        en: "Brokers, Personal Business & Krakount Sync",
        es: "Brókers, Negocio Personal y Krakount",
      },
      subtitle: {
        en: "Trade Republic · MyInvestor · Revolut · Supabase Cron 03:15 · Krakount 10m Feed",
        es: "Trade Republic · MyInvestor · Revolut · Supabase Cron 03:15 · Feed Krakount 10m",
      },
      specs: [
        {
          en: "Multilingual CSV parsers (ES/EN/DE) with dry-run simulation, currency mismatch checks, and idempotent ref deduplication.",
          es: "Parsers CSV tolerantes (ES/EN/DE) con simulación, detección de desajustes de divisa y deduplicación idempotente.",
        },
        {
          en: "Supabase bridge to personal product-selling business: partner stake is valued strictly on collected cash and realized sales profit (unsold stock counts as 0 EUR until sold; restocks deduct from cash; monthly closures book dividends).",
          es: "Puente Supabase con negocio personal de venta de productos: la participación se valora estrictamente sobre caja cobrada y beneficio realizado (el stock no vendido cuenta como 0 EUR hasta venderse; las reposiciones descuentan caja; los cierres mensuales registran dividendos).",
        },
        {
          en: "Krakount capital feed polling /api/v1/me/capital every 10 min to keep personal group shares, debts, and income synced in Ghostfolio.",
          es: "Sondeo de /api/v1/me/capital cada 10 min para mantener al día en Ghostfolio la parte personal de gastos del grupo, deudas e ingresos.",
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
          es: "Confinado en red Docker interna privada sin exposición pública directa a Internet.",
        },
        {
          en: "Automated nightly pg_dump snapshots with 14-day daily and 8-week weekly retention.",
          es: "Copias nocturnas con pg_dump y retención de 14 días diarios y 8 semanas semanales.",
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
          en: "Allows the AI agent to record BUY/SELL/DIVIDEND operations and cash balances without holding Ghostfolio admin tokens.",
          es: "Permite al agente registrar operaciones y saldos de efectivo sin poseer credenciales de administrador.",
        },
        {
          en: "Enforces 10k EUR per-trade caps, 50 writes/day, 30 req/min, HTTP 409 reference deduplication, and an append-only JSONL rollback journal.",
          es: "Aplica tope de 10k EUR por operación, 50 escrituras/día, 30 req/min, claves de idempotencia 409 y diario JSONL para revertir escrituras.",
        },
      ],
    },
    {
      id: "interface",
      layer: "interface",
      title: {
        en: "Read-Only Mobile Panel & Laura Voice Queries",
        es: "Panel Móvil Solo-Lectura y Consultas Laura",
      },
      subtitle: {
        en: "Impersonation-Id Read Token · Cross-Broker Grouping · Local AI Voice",
        es: "Token de Solo Lectura Verificado · Agrupación de Activos · Voz IA Local",
      },
      specs: [
        {
          en: "Mobile wealth view powered by a scoped token verified by automated tests to return HTTP 403 on every mutation.",
          es: "Panel móvil alimentado por un token restringido verificado automáticamente para devolver HTTP 403 ante cualquier escritura.",
        },
        {
          en: "Connected to Laura and Aurora for instant natural-language balance, liquidity, and asset allocation queries.",
          es: "Conectado a Laura y Aurora para responder al instante consultas de saldo, liquidez y asignación de activos.",
        },
      ],
    },
  ] satisfies ArchitectureNode[],
  wealthFlow: {
    inputs: [
      {
        id: "brokers",
        title: { en: "Investment Brokers", es: "Brókers de Inversión" },
        source: "Trade Republic · MyInvestor · Revolut",
        protocol: "Validated CSV + ISIN dedup",
        detail: {
          en: "ETFs, index funds and cash imported from broker CSVs, validated and deduplicated by ISIN so no trade is ever counted twice.",
          es: "ETFs, fondos indexados y liquidez importados desde los CSV de cada bróker, validados y deduplicados por ISIN: ninguna operación cuenta dos veces.",
        },
      },
      {
        id: "business",
        title: { en: "Personal Business (Product Sales)", es: "Negocio Personal (Venta de Productos)" },
        source: "Supabase ERP · sync 03:15",
        protocol: "REST API -> Ghostfolio sync",
        detail: {
          en: "Sales, stock and real profit sync nightly. My stake counts only collected cash and realized profit: unsold stock is 0 EUR, restocks deduct cash, monthly closures book dividends.",
          es: "Ventas, stock y profit real se sincronizan cada noche. Mi parte cuenta solo caja cobrada y beneficio realizado: el stock sin vender vale 0 EUR, las reposiciones restan caja y los cierres mensuales generan dividendos.",
        },
      },
      {
        id: "krakount",
        title: { en: "Krakount Capital Feed", es: "Feed de Capital Krakount" },
        source: "Krakount /api/v1/me/capital",
        protocol: "GET · 10 min cadence",
        detail: {
          en: "Every 10 minutes Krakount reports my personal share of group expenses, logged income and net debts per bank.",
          es: "Cada 10 minutos Krakount envía mi parte personal de los gastos del grupo, los ingresos registrados y las deudas netas por banco.",
        },
      },
      {
        id: "aurora",
        title: { en: "Aurora AI Gateway", es: "Pasarela IA Aurora" },
        source: "Telegram · Capped Proxy",
        protocol: "HMAC · 10k EUR cap · 50/day",
        detail: {
          en: "I log trades and cash from Telegram through a capped proxy: 10k EUR per operation, 50 writes a day, every write reversible from a JSONL ledger.",
          es: "Registro operaciones y efectivo desde Telegram a través de un proxy con tope: 10k EUR por operación, 50 escrituras al día y cada escritura reversible desde un diario JSONL.",
        },
      },
    ],
    core: {
      title: { en: "Ghostfolio Wealth Core", es: "Núcleo Patrimonial Ghostfolio" },
      platform: "Ghostfolio 3.89 · PostgreSQL 15 · Redis 7",
      specs: [
        {
          en: "Self-hosted on Raspberry Pi 5 inside an isolated Docker bridge with zero direct internet exposure.",
          es: "Alojado en Raspberry Pi 5 dentro de red Docker aislada sin exposición directa a Internet.",
        },
        {
          en: "Nightly pg_dump snapshots with 14-day daily and 8-week weekly retention.",
          es: "Copias nocturnas con pg_dump y retención de 14 días diarios y 8 semanas semanales.",
        },
      ],
    },
    outputs: [
      {
        id: "mobile-app",
        title: { en: "Mobile Wealth App", es: "App Móvil de Patrimonio" },
        source: "iOS Stocks-style PWA",
        protocol: "Biometric PIN · Read-only HTTP 403 token",
        detail: {
          en: "Net worth curve, allocation and benchmark comparison behind a biometric PIN. Its token is read-only: every write returns HTTP 403.",
          es: "Curva de patrimonio, asignación y comparativa con índices tras un PIN biométrico. Su token es de solo lectura: toda escritura devuelve HTTP 403.",
        },
      },
      {
        id: "voice-queries",
        title: { en: "Voice & Chat Queries", es: "Consultas por Voz y Chat" },
        source: "Aurora + Laura",
        protocol: "Ollama Qwen3 / Nous Hermes",
        detail: {
          en: "Ask Aurora on Telegram or Laura by voice for balance, liquidity or allocation and get a plain-language answer in seconds.",
          es: "Pregunto a Aurora por Telegram o a Laura por voz por saldo, liquidez o asignación y responden en lenguaje natural en segundos.",
        },
      },
    ],
  } satisfies WealthFlowArchitecture,
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
    title: "Linux Desktop, GLSL Gargantua & Hardware Hacking",
    tagline: {
      en: "Quickshell Caelestia fork, raymarched black hole shader, and reverse-engineered hardware protocols.",
      es: "Fork de Quickshell Caelestia, shader de agujero negro con raymarching y protocolos hardware.",
    },
    category: "systems",
    repoStatus: "public",
    statusLabel: {
      en: "Public Repos · Hardware & Graphics Engineering",
      es: "Repos Públicos · Ingeniería Hardware y Gráficos",
    },
    year: "2026",
    context: {
      en: "Custom Hyprland desktop with Quickshell Caelestia 2.5, native /dev/hidraw peripheral drivers, and closed-RTOS smartwatch hacking.",
      es: "Escritorio Hyprland con Quickshell Caelestia 2.5, drivers /dev/hidraw propios y hacking de smartwatch sin SDK.",
    },
    problem: {
      en: "Proprietary peripherals lock telemetry and controls behind Windows-only suites or closed firmware.",
      es: "Los periféricos propietarios bloquean telemetría y controles tras programas exclusivos de Windows o firmwares cerrados.",
    },
    engineeringHighlights: [
      {
        en: "Authored raymarched GLSL Schwarzschild Gargantua black hole shader with Doppler beaming, ACES filmic tone-mapping, and live PipeWire audio spectrum reactivity.",
        es: "Shader GLSL con raymarching del agujero negro Gargantua, efecto Doppler, mapeo tonal fílmico ACES y reactividad sonora con PipeWire.",
      },
      {
        en: "Built Quickshell Caelestia 2.5 desktop: binary star canvas (Laura orbited by Claude Code and Antigravity moons), live MCHOSE battery rings, and Planeta Cuerpo health sync.",
        es: "Escritorio Quickshell Caelestia 2.5: lienzo de estrella binaria (Laura con lunas Claude Code y Antigravity), anillos de batería MCHOSE y Planeta Cuerpo.",
      },
      {
        en: "Sniffed USB packets and wrote native Linux /dev/hidraw drivers for Akko keyboards and MCHOSE 8K wireless mice (opcode 0x83/0x06 + XOR 0xFF checksums).",
        es: "Captura de tramas USB y drivers nativos /dev/hidraw en Linux para teclados Akko y ratones MCHOSE 8K (opcodes 0x83/0x06 y checksums XOR 0xFF).",
      },
      {
        en: "Developed gts2-mando (Kotlin): plays silent Android MediaSession audio to hijack Amazfit GTS 2 wrist buttons into HTTP webhooks and Bluetooth SCO voice logging for gym-bot.",
        es: "App gts2-mando en Kotlin: usa una MediaSession silenciosa para convertir los botones del Amazfit GTS 2 en webhooks HTTP y notas de voz Bluetooth SCO para gym-bot.",
      },
    ],
    stack: ["GLSL", "C", "Python (/dev/hidraw)", "Kotlin", "Bluetooth SCO", "QML / Hyprland"],
    links: [
      { label: { en: "LinuxRicing Repo", es: "Repo LinuxRicing" }, href: "https://github.com/Alberviz/LinuxRicing", kind: "github" },
      { label: { en: "gts2-mando Repo", es: "Repo gts2-mando" }, href: "https://github.com/Alberviz/gts2-mando", kind: "github" },
    ],
    featuredMediaKey: "gargantua",
  },
];

export const HEALTH_SYSTEM = {
  title: {
    en: "Personal Health Hub",
    es: "Hub Personal de Salud",
  } satisfies LocalizedText,
  summary: {
    en: "My watch, my meals, my gym log, and the buttons on my wrist all land in one service on the Pi. Gemini reads it, a Telegram coach talks back, and my desktop shows the result as a planet. No subscription app in the middle, every piece is mine.",
    es: "Mi reloj, mis comidas, mi registro del gimnasio y los botones de la muñeca acaban en un único servicio en la Pi. Gemini lo analiza, un coach en Telegram me responde y mi escritorio enseña el resultado como un planeta. Sin apps de suscripción en medio: cada pieza es mía.",
  } satisfies LocalizedText,
  flow: {
    inputs: [
      {
        id: "watch",
        title: { en: "Amazfit GTS 2", es: "Amazfit GTS 2" },
        source: "Google Health API · OAuth",
        protocol: "via Zepp + Health Connect",
        detail: {
          en: "Steps, sleep stages, and heart rate travel from the watch through Zepp and Health Connect into the Google Health API. The hub pulls them with OAuth, merges duplicate sources, and only trusts workouts the watch itself recorded, because Google Fit invents phantom walks.",
          es: "Pasos, fases de sueño y pulso viajan del reloj a Zepp, Health Connect y la Google Health API. El hub los recoge con OAuth, une fuentes duplicadas y solo se fía de los entrenos que grabó el propio reloj, porque Google Fit se inventa paseos fantasma.",
        },
      },
      {
        id: "meals",
        title: { en: "Meals by voice", es: "Comidas por voz" },
        source: "Telegram · Gemini Flash Lite",
        protocol: "voice or text",
        detail: {
          en: "I tell the Telegram bot what I ate, by voice note or text. Gemini turns it into foods and calories, and the hub balances it against what I burned that day.",
          es: "Le cuento al bot de Telegram lo que he comido, por nota de voz o texto. Gemini lo convierte en alimentos y calorías y el hub lo compara con lo que gasté ese día.",
        },
      },
      {
        id: "mando",
        title: { en: "Wrist buttons", es: "Botones del reloj" },
        source: "gts2-mando · Kotlin",
        protocol: "MediaSession -> HTTP",
        detail: {
          en: "The GTS 2 has no SDK, so gts2-mando fakes a silent music session on Android. Play logs my creatine, and previous opens a Bluetooth SCO call to record a meal with the watch microphone.",
          es: "El GTS 2 no tiene SDK, así que gts2-mando simula una sesión de música silenciosa en Android. Play apunta la creatina y anterior abre una llamada Bluetooth SCO para grabar una comida con el micrófono del reloj.",
        },
      },
      {
        id: "opengym",
        title: { en: "openGym fork", es: "Fork de openGym" },
        source: "Self-hosted PWA · Docker",
        protocol: "SQLite mirror",
        detail: {
          en: "Workouts, sets, and body weight live in my own openGym instance. I forked it to add daily habits, and the hub mirrors its database to compute volume, estimated 1RM, PRs, and adherence.",
          es: "Entrenos, series y peso corporal viven en mi propia instancia de openGym. Le hice un fork para añadir hábitos diarios y el hub replica su base de datos para calcular volumen, 1RM estimado, PRs y adherencia.",
        },
      },
    ],
    core: {
      title: { en: "gym-hub", es: "gym-hub" },
      platform: "Python · Docker · SQLite · Gemini",
      specs: [
        {
          en: "One Python service on the Raspberry Pi joins all four feeds per day, classifies activities (strength, volleyball, running, yoga), and estimates calorie burn with Mifflin plus steps plus watch workouts.",
          es: "Un único servicio Python en la Raspberry Pi une las cuatro fuentes por día, clasifica actividades (fuerza, vóley, carrera, yoga) y estima el gasto calórico con Mifflin más pasos más entrenos del reloj.",
        },
        {
          en: "It also tracks habit streaks, sleep against training performance, and vertical jump height measured from the frames of a slow-motion video.",
          es: "También sigue rachas de hábitos, sueño frente a rendimiento y la altura del salto vertical medida con los fotogramas de un vídeo a cámara lenta.",
        },
      ],
    },
    outputs: [
      {
        id: "coach",
        title: { en: "Telegram coach", es: "Coach en Telegram" },
        source: "/hoy · /semana · /salto · /habitos",
        protocol: "multi-user",
        detail: {
          en: "Reminders per habit, today and week views, and a weekly summary written by Gemini that reads training, sleep, food, and steps together.",
          es: "Recordatorios por hábito, vistas de hoy y de la semana y un resumen semanal redactado por Gemini que lee juntos entreno, sueño, comida y pasos.",
        },
      },
      {
        id: "report",
        title: { en: "Weekly web report", es: "Informe web semanal" },
        source: "gym-hub web · LAN + VPN",
        detail: {
          en: "A full weekly report served by the hub itself, reachable only inside my private network.",
          es: "Un informe semanal completo servido por el propio hub, accesible solo dentro de mi red privada.",
        },
      },
      {
        id: "planet",
        title: { en: "Planeta Cuerpo", es: "Planeta Cuerpo" },
        source: "read-only summary API",
        protocol: "every 20 min",
        detail: {
          en: "The desktop planet polls a read-only summary API backed by a database mounted read-only. Ten failed logins in fifteen minutes lock it, so the client never retries a rejected password.",
          es: "El planeta del escritorio consulta una API de resumen de solo lectura sobre una base de datos montada en solo lectura. Diez fallos de login en quince minutos la bloquean, así que el cliente nunca reintenta una contraseña rechazada.",
        },
      },
    ],
  } satisfies WealthFlowArchitecture,
};

export const LINUX_DESKTOP_SHOWCASE: LinuxDesktopShowcaseItem[] = [
  {
    id: "gargantua-shader",
    title: "Audio-Reactive Gargantua",
    badge: { en: "GLSL Raymarching · PipeWire Spectrum", es: "Raymarching GLSL · Espectro PipeWire" },
    tech: "GLSL · ACES Tonemapping · PipeWire · Hyprland",
    summary: {
      en: "A Schwarzschild black hole raymarched in real time as the wallpaper. The accretion disk breathes with whatever is playing, and the current track is written inside the event horizon.",
      es: "Un agujero negro de Schwarzschild calculado con raymarching en tiempo real como fondo. El disco de acreción respira con lo que suena y la canción actual aparece escrita dentro del horizonte de sucesos.",
    },
    details: [
      {
        en: "Analytic geodesic ray deflection with Doppler beaming and ACES filmic tone mapping, tuned against reference frames from Interstellar.",
        es: "Deflexión geodésica analítica con efecto Doppler y mapeo tonal fílmico ACES, ajustada contra fotogramas de referencia de Interstellar.",
      },
      {
        en: "PipeWire FFT bands drive disk luminosity and pulse, while MPRIS feeds title, artist, and progress into the horizon readout.",
        es: "Las bandas FFT de PipeWire mueven el brillo y el pulso del disco, y MPRIS manda título, artista y progreso al texto del horizonte.",
      },
    ],
    mediaKey: "celestial",
  },
  {
    id: "celestial-desktop",
    title: "Orbital Desktop",
    badge: { en: "Every service is a celestial body", es: "Cada servicio es un cuerpo celeste" },
    tech: "Quickshell Caelestia 2.5 · QML · Sim.js · GLSL",
    summary: {
      en: "The wallpaper is a live map of my machine: Laura is the star, every running agent is a planet, every wireless device is a satellite, and my tasks are a comet. Nothing is decoration, everything is real state.",
      es: "El fondo es un mapa vivo de mi máquina: Laura es la estrella, cada agente en marcha es un planeta, cada dispositivo inalámbrico es un satélite y mis tareas son un cometa. Nada es decoración, todo es estado real.",
    },
    details: [
      {
        en: "Claude Code and Antigravity sessions spawn and retire planets around Laura as they start and finish, positioned by a deterministic orbit simulator.",
        es: "Las sesiones de Claude Code y Antigravity crean y retiran planetas alrededor de Laura al empezar y terminar, colocados por un simulador de órbitas determinista.",
      },
      {
        en: "Mouse and headset satellites draw their battery as a ring, read straight from reverse-engineered HID reports (see 04).",
        es: "Los satélites del ratón y los cascos dibujan su batería como un anillo, leída directamente de informes HID obtenidos por ingeniería inversa (ver 04).",
      },
      {
        en: "The tasks comet and the TAREAS widget merge local git repos and Obsidian checklists into one live count.",
        es: "El cometa de tareas y el widget TAREAS unifican repos git locales y listas de Obsidian en un único recuento en vivo.",
      },
      {
        en: "The full background was profiled down from 15.1% to 4.7% of one CPU core.",
        es: "Todo el fondo se perfiló hasta bajar del 15,1% al 4,7% de un núcleo de CPU.",
      },
    ],
    mediaKey: "celestial",
  },
  {
    id: "health-planet",
    title: "Planeta Cuerpo: Health Tracking",
    badge: { en: "Amazfit GTS 2 -> Raspberry Pi -> desktop", es: "Amazfit GTS 2 -> Raspberry Pi -> escritorio" },
    tech: "Google Health API · Python · Docker · QML · Kotlin",
    summary: {
      en: "My watch data lands on the desktop as one more planet. A steps arc closes around it toward 10,000, the day and night terminator is last night's sleep, its moons are this week's gym sessions, and seven beads underneath show the streak.",
      es: "Los datos de mi reloj llegan al escritorio como un planeta más. Un arco de pasos se cierra a su alrededor hacia los 10.000, el terminador día y noche es el sueño de anoche, sus lunas son los entrenos de la semana y siete cuentas debajo muestran la racha.",
    },
    details: [
      {
        en: "The Amazfit GTS 2 syncs through Zepp and Health Connect into the Google Health API, which a gym-hub service on my Raspberry Pi ingests with OAuth and deduplicates against phantom walks.",
        es: "El Amazfit GTS 2 sincroniza por Zepp y Health Connect hasta la Google Health API, que un servicio gym-hub en mi Raspberry Pi ingiere con OAuth y depura de paseos fantasma.",
      },
      {
        en: "gym-hub mirrors my self-hosted openGym into SQLite and exposes a read-only summary API. The desktop polls it every 20 min, caches offline, and never retries a 401 so a bad password cannot lock everyone out.",
        es: "gym-hub replica mi openGym autoalojado en SQLite y expone una API de resumen de solo lectura. El escritorio la consulta cada 20 min, guarda caché offline y nunca reintenta un 401 para que una contraseña mala no bloquee a nadie.",
      },
      {
        en: "Missing data degrades with dignity: hollow beads, a grey arc, a ghost planet. Fragmented nights are labelled partial instead of faking a number.",
        es: "Los datos que faltan se degradan con dignidad: cuentas huecas, arco gris, planeta fantasma. Las noches fragmentadas se marcan como parciales en vez de inventar un número.",
      },
      {
        en: "The watch is also an input: gts2-mando plays a silent Android MediaSession so the three music buttons log creatine or record a meal through the watch microphone over Bluetooth SCO.",
        es: "El reloj también es entrada: gts2-mando reproduce una MediaSession silenciosa en Android para que los tres botones de música apunten la creatina o graben una comida con el micrófono del reloj por Bluetooth SCO.",
      },
    ],
    mediaKey: "celestial",
    links: [
      { label: { en: "gts2-mando Repo", es: "Repo gts2-mando" }, href: "https://github.com/Alberviz/gts2-mando", kind: "github" },
    ],
  },
  {
    id: "rgb-sync",
    title: "Reverse-Engineered RGB & Telemetry",
    badge: { en: "USB sniffing · raw /dev/hidraw", es: "Sniffing USB · /dev/hidraw directo" },
    tech: "tshark usbmon · Python HID · OpenRGB SDK · Matugen",
    summary: {
      en: "Change the wallpaper and the whole room follows. Matugen extracts a Material 3 palette and one script pushes it to keyboard, mouse base, RAM, case fans, and the LED strip. Most of those devices had no Linux support, so I wrote the protocols myself.",
      es: "Cambio el fondo y toda la habitación le sigue. Matugen extrae una paleta Material 3 y un único script la manda al teclado, la base del ratón, la RAM, los ventiladores y la tira LED. Casi ninguno tenía soporte en Linux, así que escribí los protocolos yo.",
    },
    details: [
      {
        en: "Captured the vendor WebHID configurator with tshark on usbmon and isolated the real SET_REPORT control transfers from the battery polling noise.",
        es: "Capturé el configurador WebHID del fabricante con tshark sobre usbmon y aislé las transferencias SET_REPORT reales del ruido de sondeo de batería.",
      },
      {
        en: "MCHOSE K7 Ultra base: Feature report 0x11 on interface 2 with a 20 byte payload XOR 0xFF, verified byte by byte against a real capture.",
        es: "Base del MCHOSE K7 Ultra: Feature report 0x11 en la interfaz 2 con carga de 20 bytes cifrada con XOR 0xFF, verificada byte a byte contra una captura real.",
      },
      {
        en: "Akko 5075B Plus over 2.4 GHz: Feature reports 0x07 and 0x08 for colour, opcode 0x83 for battery. The MCHOSE V9 Pro headset battery comes from its receiver reports.",
        es: "Akko 5075B Plus por 2,4 GHz: Feature reports 0x07 y 0x08 para el color y opcode 0x83 para la batería. La batería de los cascos MCHOSE V9 Pro sale de los informes de su receptor.",
      },
      {
        en: "OpenRGB drives RAM and 2 x 60 LED ARGB fan headers with palette gradients, and the Magic Home strip takes raw TCP on port 5577.",
        es: "OpenRGB lleva la RAM y dos cabezales ARGB de 60 LEDs con degradados de la paleta, y la tira Magic Home recibe TCP directo en el puerto 5577.",
      },
    ],
    mediaKey: "celestial",
  },
  {
    id: "laura-voice",
    title: "Local AI Laura (SUPER+A)",
    badge: { en: "100% Local RTX 4050 · Zero Cloud", es: "100% Local en RTX 4050 · Cero Nube" },
    tech: "Faster-Whisper · Qwen3 4B Ollama · Kokoro TTS · Python",
    summary: {
      en: "Voice executive assistant running entirely on the laptop RTX 4050 GPU: voice input, tool calling, Kokoro TTS, GLSL glowing screen edge, and a 20 min vigia daemon.",
      es: "Asistente ejecutivo por voz 100% local en la GPU RTX 4050: entrada de voz, tool calling, voz Kokoro, borde de pantalla resplandeciente y monitor vigía cada 20 minutos.",
    },
    details: [
      {
        en: "Sub-second voice transcription with Faster-Whisper, tool calling via Qwen3 4B, and natural Kokoro voice response.",
        es: "Transcripción de voz subsegundo con Faster-Whisper, llamada a herramientas con Qwen3 4B y síntesis de voz natural con Kokoro.",
      },
      {
        en: "GLSL edge shader animates along screen borders while inline cards preview unread emails and calendar events.",
        es: "Shader GLSL resplandeciente en los bordes de pantalla con tarjetas interactivas de correo y calendario.",
      },
    ],
    mediaKey: "desktopIcy",
  },
  {
    id: "laura-drawer",
    title: "Multi-Agent Panel (SUPER+I)",
    badge: { en: "Wayland Layer Shell · Multi-Agent Hub", es: "Wayland Layer Shell · Panel Multi-Agente" },
    tech: "Wayland Layer Shell · Quickshell QML · Crystal Orb",
    summary: {
      en: "Dedicated right-hand slide-out drawer tracking Laura, Gemini, Claude, and Aurora background jobs across workspaces with glowing Caelestia status pips.",
      es: "Cajón lateral derecho que monitoriza trabajos en segundo plano de Laura, Gemini, Claude y Aurora con indicadores luminosos en la barra Caelestia.",
    },
    details: [
      {
        en: "Unified human-in-the-loop confirmation center: review git diffs, approve draft replies, or inspect cron runs in one keypress.",
        es: "Centro de confirmación humana unificado: revisión de diffs de git, aprobación de correos y seguimiento de crons con una tecla.",
      },
      {
        en: "Integrated with Caelestia bar pips to display background agent activity without cluttering terminal workspaces.",
        es: "Integrado con la barra de Caelestia para mostrar actividad de agentes sin saturar las terminales de trabajo.",
      },
    ],
    mediaKey: "lauraDrawer",
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
      en: "Multilingual Telegram booking assistant handling text and voice notes with private client pricing synced with Google Calendar.",
      es: "Asistente de reservas en Telegram por texto y voz con tarifas privadas por cliente sincronizado con Google Calendar.",
    },
    highlights: [
      {
        en: "5-layer resilience cascade (Regex UI -> Groq 120B -> Whisper v3 Turbo -> Gemini Flash -> 1-tap slot buttons) synced with Google Calendar.",
        es: "Cascada resiliente de 5 capas (botones -> Groq 120B -> Whisper v3 Turbo -> Gemini Flash -> fallback interactivo) sincronizada con Google Calendar.",
      },
    ],
    stack: ["TypeScript", "grammY", "Groq Whisper", "Gemini", "Turso libSQL", "Google Calendar API"],
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
      en: "Peer-to-peer shared wardrobe PWA built with Juan Garcia Egea with local in-browser WebGPU background removal.",
      es: "Armario compartido entre particulares creado junto a Juan García Egea con recorte de prendas por IA local en navegador vía WebGPU.",
    },
    highlights: [
      {
        en: "Runs AI background removal locally in the browser via WebGPU at zero server cost to turn garment photos into die-cut wardrobe cards.",
        es: "Recorte de fondo por IA ejecutado localmente en el navegador mediante WebGPU a coste cero de servidor.",
      },
    ],
    stack: ["Next.js 15", "React 19", "WebGPU / WASM", "Tailwind v4", "Supabase Realtime"],
    links: [
      { label: { en: "Live App", es: "Abrir App" }, href: "https://closhare-indol.vercel.app", kind: "live" },
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
    en: "All my coursework lives in one GitHub repository as an interconnected Obsidian vault. My personal AI assistants can read it, and since classes at AGH are taught in Polish, they translate every lecture into Spanish and link it to the rest of my notes.",
    es: "Todos mis apuntes viven en un repositorio de GitHub como un vault de Obsidian interconectado. Mis asistentes de IA personales pueden consultarlo y, como en AGH las clases son en polaco, traducen cada clase al español y la enlazan con el resto de mis notas.",
  },
  awards: [
    {
      title: {
        en: "Highest Honors in Algorithms",
        es: "Matrícula de Honor en Algoritmos",
      },
      detail: {
        en: "Algorithms and Data Structures, Universidad de Murcia",
        es: "Algoritmos y Estructuras de Datos, Universidad de Murcia",
      },
      year: "UMU",
    },
    {
      title: {
        en: "2x 7th Place, Programming Olympiad",
        es: "2x 7.º Puesto, Olimpiada de Programación",
      },
      detail: {
        en: "Region of Murcia, C++ under strict time and memory limits",
        es: "Región de Murcia, C++ con límites estrictos de tiempo y memoria",
      },
      year: "2x",
    },
    {
      title: {
        en: "Accésit, Mathematics Olympiad",
        es: "Accésit en la Olimpiada Matemática",
      },
      detail: {
        en: "Regional round, formal proofs and problem solving",
        es: "Fase regional, demostración formal y resolución de problemas",
      },
      year: "Math",
    },
  ],
};
