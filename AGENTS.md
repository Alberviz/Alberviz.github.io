# AGENTS.md - Portfolio & Krakount Showcase

Read `CLAUDE.md`, `PRODUCT.md`, and `DESIGN.md` before modifying any UI, copy, or configuration.

## Quick Architecture
- `src/content/portfolio-data.ts`: Bilingual (`en` / `es`) source of truth for `/`.
- `src/content/krakount-data.ts`: Bilingual (`en` / `es`) source of truth and receipt/debt simulator items for `/krakount`.
- `src/content/assets.ts`: Optimized WebP/MP4/SVG assets and verified pixel dimensions.
- `src/components/portfolio/*`: Root portfolio surface (`Obsidian + Emerald` theme).
- `src/components/krakount/*`: Krakount product showcase surface (`Kazimierz de noche` `#0E0F13` + `#F5A524` theme).

## Hard Rules
- Static export (`output: "export"`): `pnpm build` must always generate `./out` cleanly.
- Zero em-dashes (`—`) or en-dashes (`–`) anywhere in UI copy or metadata.
- Describe the Supabase -> Ghostfolio business sync strictly as a personal product-selling business (stock, sales, margins, and real-time profit) without naming internal store brands.
- Never publish private mesh URLs, internal IP addresses, or unlisted personal micro-apps.

## Tareas en Olimpo (única fuente, desde noviembre de 2026)

Las tareas, el roadmap y lo que hacen los agentes viven en **Olimpo** (la app de Alberto en la Pi). El vault de
Obsidian, las carpetas `Backlog/`, `vault/🎯 Hoy.md`, `tasks-index` y la «bitácora de sesiones» quedan **obsoletos**:
no crees notas de tarea ni escribas bitácoras ahí. Si encuentras una nota de tarea antigua, no la toques.

- **Proyecto:** `portfolio`. `olimpo` lo deduce del repo git; si no, `--proyecto portfolio`.
- **Antes de crear, busca:** `olimpo buscar "<palabras>"`. Para crear, sigue `olimpo plantillas`: elige el tipo
  (`error`, `funcionalidad`, `investigacion`, `recado`), escribe sus secciones y un resumen vivo:
  `olimpo tarea crear --tipo funcionalidad --resumen "…" --notas "…" "Título"`. Si responde con `parecidas`, díselo a Alberto.
- **Tarea = lo que Alberto pide** («apunta…», «añade una tarea…»). Lo que sea «para el futuro» va al Desván como idea
  (`olimpo idea --help`). No inventes tareas.
- **Al empezar:** `olimpo tarea empezar <id>`. **Al terminar:** `olimpo tarea hecha <id>`. Los hallazgos van como
  aportes (`olimpo tarea aportar <id> "…"`) y el resumen se reescribe con `olimpo tarea resumir`. Nunca borres tareas.
- **Lo que has hecho en la sesión:** un aporte en la tarea en la que trabajaste (qué hiciste, qué falta, commits). Es
  lo que Alberto lee al volver; sustituye a la bitácora.
- Roadmap: `olimpo roadmap`; versiones: `olimpo version`. Si Alberto menciona una tarea de OTRO proyecto, créala en
  el suyo con `--proyecto <slug>`.
