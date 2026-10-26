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
    en: "Flagship Product · Active Beta (~20 users in Kraków)",
    es: "Producto Insignia · Beta activa (~20 usuarios en Cracovia)",
  } satisfies LocalizedText,
  title: "Krakount",
  headline: {
    en: "Shared expenses, Polish receipt OCR, and group trips in one thumb-driven app.",
    es: "Gastos compartidos, OCR de tickets polacos y viajes en grupo a una sola mano.",
  } satisfies LocalizedText,
  description: {
    en: "Built for our Erasmus group in Kraków. Krakount unifies integer-cent ledgers across 32 currencies at live market and Revolut rates with optional +1% bank fee (NBP fallback), Polish receipt OCR, the /camara shelf price scanner, personal Mis gastos and income budgeting, offline QR passes, and Krakount Captura (Kotlin) with automatic Bizum debt settlement.",
    es: "Creada para nuestro grupo Erasmus en Cracovia. Krakount une contabilidad exacta en céntimos enteros en 32 divisas a tipos de mercado y Revolut con +1% bancario opcional (respaldo NBP), OCR de tickets polacos, lector de estantería /camara, control personal de Mis gastos e ingresos, pases QR offline y Krakount Captura (Kotlin) con liquidación automática por Bizum.",
  } satisfies LocalizedText,
  pillars: [
    {
      title: { en: "Integer-Exact Multi-Currency", es: "Multidivisa Exacta en Enteros" },
      detail: {
        en: "32 currencies at live market and Revolut rates with +1% bank fee offset, minimal debt graph, and plain audit proofs.",
        es: "32 divisas a tipos de mercado y Revolut con ajuste de +1% bancario, grafo de deuda mínima y justificación clara.",
      },
    },
    {
      title: { en: "Receipt OCR & Price Camera", es: "OCR de Tickets y Cámara" },
      detail: {
        en: "Parses Polish Paragon Fiskalny receipts with Gemini + Tesseract fallback, plus the live /camara shelf price converter.",
        es: "Lee tickets polacos Paragon Fiskalny con Gemini y Tesseract, más el conversor /camara para precios en estantería.",
      },
    },
    {
      title: { en: "Krakount Captura (Kotlin)", es: "Krakount Captura (Kotlin)" },
      detail: {
        en: "Android service auto-settling incoming Bizum debts from notifications, logging tap-to-pay, and feeding /api/v1/me/capital.",
        es: "Servicio Android que liquida deudas con notificaciones Bizum, registra pagos contactless y nutre /api/v1/me/capital.",
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
    en: "One Raspberry Pi 5, running 24/7: a wealth engine fed by my brokers, my personal product-selling business and Krakount, plus Aurora, my autonomous agent.",
    es: "Una Raspberry Pi 5 activa 24/7: un motor patrimonial que une mis brókers, mi negocio personal de venta de productos y Krakount, y Aurora, mi agente autónomo.",
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

export const LINUX_DESKTOP_SHOWCASE: LinuxDesktopShowcaseItem[] = [
  {
    id: "gargantua-shader",
    title: "Audio-Reactive Gargantua",
    badge: { en: "GLSL Raymarching · PipeWire Spectrum", es: "Raymarching GLSL · Espectro PipeWire" },
    tech: "GLSL · ACES Tonemapping · PipeWire C API · Hyprland",
    summary: {
      en: "Real-time Schwarzschild raymarched black hole shader with Doppler beaming, reacting live to audio spectrum with track readout inside the event horizon.",
      es: "Shader de agujero negro de Schwarzschild con raymarching y efecto Doppler en tiempo real, reactivo al espectro de audio y con título en el horizonte de sucesos.",
    },
    details: [
      {
        en: "Analytic geodesic ray-deflection equations rendered in real time with ACES filmic tone-mapping.",
        es: "Ecuaciones geodésicas de deflexión de rayos calculadas en tiempo real con mapeo tonal fílmico ACES.",
      },
      {
        en: "PipeWire spectrum FFT frequency bands drive accretion disk luminosity and pulse rate to active music.",
        es: "Bandas FFT de PipeWire modulan la luminosidad y pulso del disco de acreción según la música activa.",
      },
    ],
    mediaKey: "gargantua",
  },
  {
    id: "celestial-desktop",
    title: "Orbital Desktop & Health Planet",
    badge: { en: "Binary Star Canvas · Live Hardware Rings", es: "Lienzo de Estrella Binaria · Batería en Vivo" },
    tech: "Quickshell Caelestia 2.5 · QML · /dev/hidraw · BLE",
    summary: {
      en: "Desktop orbital canvas where the Laura binary star is orbited by Claude Code and Antigravity moons, wireless peripherals show battery rings, and Planeta Cuerpo displays health metrics.",
      es: "Lienzo orbital de escritorio donde la estrella Laura es orbitada por lunas de Claude Code y Antigravity, los periféricos muestran anillos de batería y Planeta Cuerpo refleja métricas de salud.",
    },
    details: [
      {
        en: "Active agent moons orbit Laura while MCHOSE wireless gear displays battery percentage via reverse-engineered /dev/hidraw rings.",
        es: "Lunas de agentes activos orbitan Laura mientras los periféricos MCHOSE muestran batería mediante anillos /dev/hidraw propios.",
      },
      {
        en: "Tasks Comet tracks sprint progress, and Planeta Cuerpo ingests Amazfit GTS 2 sleep stages, step counts, and gym sessions.",
        es: "El cometa de tareas refleja el ritmo de sprints y Planeta Cuerpo sincroniza sueño, pasos y entrenamientos del Amazfit GTS 2.",
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
      en: "Voice executive assistant running entirely on the laptop RTX 4050 GPU: voice input, tool-calling, Kokoro TTS, GLSL glowing screen edge, and a 20-min vigia daemon.",
      es: "Asistente ejecutivo por voz 100% local en la GPU RTX 4050: entrada de voz, tool-calling, voz Kokoro, borde de pantalla resplandeciente y monitor vigía cada 20 minutos.",
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
  {
    id: "tasks-and-drivers",
    title: "Tasks Widget & Hardware Drivers",
    badge: { en: "Multi-Repo Tasks · 144Hz Streaming", es: "Tareas Multi-Repo · Streaming 144Hz" },
    tech: "Python · Obsidian · Wayland · Kotlin · Bluetooth SCO",
    summary: {
      en: "Desktop TAREAS widget aggregating local git repos and Obsidian tasks, 1-click Honor MagicPad 2 144Hz screen streaming, and gts2-mando voice meal logging for gym-bot.",
      es: "Widget de escritorio TAREAS que unifica repos git locales y notas de Obsidian, streaming a 144Hz hacia Honor MagicPad 2 y registro por voz en gym-bot vía gts2-mando.",
    },
    details: [
      {
        en: "TAREAS widget parses markdown tasks and active branches into a real-time desktop overview.",
        es: "Widget TAREAS procesa tareas markdown y ramas activas en un panel de escritorio en tiempo real.",
      },
      {
        en: "gts2-mando hijacks Amazfit GTS 2 physical buttons and Bluetooth SCO microphone for meal logging directly to gym-bot.",
        es: "gts2-mando aprovecha los botones del Amazfit GTS 2 y micrófono Bluetooth SCO para registrar comidas en gym-bot.",
      },
    ],
    mediaKey: "celestial",
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
  {
    id: "zloty-euro",
    title: "Zloty-Euro & Erasmus Flights",
    badge: {
      en: "Native Android + Multimodal Scraper",
      es: "Android Nativo + Scraper Multimodal",
    },
    summary: {
      en: "Kotlin ML Kit live price lens converting Polish store prices, paired with a 5-airport flight and rail optimizer.",
      es: "Lente de precios en Kotlin con ML Kit en vivo para tiendas polacas, junto a un optimizador de vuelos y trenes desde 5 aeropuertos.",
    },
    highlights: [
      {
        en: "Jetpack Compose + ML Kit live camera OCR, Glance home widget, and ACTION_PROCESS_TEXT integration.",
        es: "Jetpack Compose con OCR en cámara con ML Kit, widget Glance e integración en el menú ACTION_PROCESS_TEXT.",
      },
    ],
    stack: ["Kotlin", "Jetpack Compose", "ML Kit OCR", "Python", "Flight APIs"],
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
    en: "Built UmuCollab, a Git + Obsidian + LaTeX pipeline that turns Polish coursework into typeset Spanish PDFs for fellow exchange students.",
    es: "Creé UmuCollab, un pipeline con Git, Obsidian y LaTeX que convierte apuntes en polaco en PDFs maquetados en español para compañeros de intercambio.",
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
