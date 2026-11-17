# CLAUDE.md: guía del portfolio de Alberto Vizcaíno Ponte

Portfolio estático (`/`) de Alberto en `https://alberviz.github.io`, rediseñado en noviembre de 2026 con el lenguaje
"precisión cósmica": espacio profundo, un único acento ámbar y un agujero negro real calculado en WebGL. El repo es
**público**: nada de datos privados en código, copy, comentarios ni commits.

## 1. Leer primero

1. `PRODUCT.md`: audiencia, tono, reglas de contenido y privacidad.
2. `DESIGN.md`: tokens (color, tipografía, forma), movimiento y reglas de composición.

## 2. Estructura de `/`

Orden en `src/app/page.tsx`: Nav, Hero, Wari, Sistemas, Escritorio, Proyectos, Trayectoria, Pie (con `CommandPalette`).

| Sección | Id | Componente |
| --- | --- | --- |
| Hero (Gargantua WebGL en vivo, poster como LCP) | `#hero` | `HeroSection` + `desktop/live/gargantua-*` |
| Wari (portal en niebla azul, única ruptura de tema) | `#wari` | `WariPortal` |
| Sistemas (mapa orbital interactivo) | `#sistemas` | `SystemsSection` |
| Escritorio (LinuxRicing: explorador + hardware) | `#escritorio` | `DesktopSection`, `desktop/DesktopExplorer`, `desktop/live/*` |
| Proyectos (índice tipográfico con reveal) | `#proyectos` | `ProjectsSection` |
| Trayectoria | `#trayectoria` | `BackgroundSection` |
| Contacto y pie | `#contacto` | `PortfolioFooter` |

`/krakount` es solo un stub estático que apunta a Wari (la app se llamaba Krakount).

## 3. Contenido (`src/content/`)

Todo el copy es bilingüe (`en` por defecto, `es`) y se elige con `useLocale()` de `src/lib/i18n-context.tsx`.

- `site-copy.ts`: nav, hero, portal de Wari, contacto.
- `systems.ts`: planetas del mapa orbital (Olimpo, Patrimonio, Aurora, Salud, Laura).
- `desktop.ts`: momentos del escritorio y piezas de hardware.
- `projects.ts`: índice de proyectos (enlaces solo si están verificados como públicos).
- `portfolio-data.ts`: perfil, experiencia, estudios y reconocimientos.
- `links.ts`, `assets.ts`, `wari-shots.ts`: enlaces públicos, medios con dimensiones exactas, capturas de Wari.

Una cifra solo se publica si está verificada contra el código o la configuración del proyecto. Si no, se quita.

## 4. Reglas duras

1. **Export estático:** `pnpm build` debe emitir `./out` sin errores. Sin server actions, sin rutas dinámicas, sin cabeceras de runtime.
2. **Privacidad y contenido:**
   - El negocio personal se describe solo como *personal product-selling business* / *negocio personal de venta de productos*, sin marca.
   - Nunca IPs, puertos, rutas de API, URLs privadas ni apps personales no listadas.
   - Sin nombres reales de amigos ni de terceros.
   - **Cero rayas largas o medias** (em-dash, en-dash) en copy, alt, metadatos o comentarios. Usa `-`, `:` o `,`.
3. **Diseño y movimiento:**
   - Un solo acento (`--accent`, ámbar). Nada de esmeralda ni de otros colores de marca fuera del portal de Wari.
   - Anima `transform`, `opacity` y `clip-path`. Nunca `transition: all`, `ease-in` ni `scale(0)`.
   - Hover tras `@media (hover: hover) and (pointer: fine)` y `useReducedMotion()` en todo lo que se mueve.
   - La paleta de comandos (`⌘K`) abre y cierra sin animación (0 ms).
   - Máximo 3 eyebrows en toda la página (hoy hay 0).
4. **Verificación visual:** capturas desde el build estático (`out/`), nunca desde `pnpm dev`, a 1280x800 y 390x844. Sin scroll horizontal a 390.

## 5. Comandos

```bash
pnpm dev          # servidor local (http://localhost:3000)
pnpm typecheck    # TypeScript estricto
pnpm build        # export estático en ./out (debe pasar sin errores)
git push          # el workflow de .github/workflows/deploy.yml publica en https://alberviz.github.io
```

## Tareas en Olimpo (única fuente, desde noviembre de 2026)

Las tareas, el roadmap y lo que hacen los agentes viven en **Olimpo** (la app de Alberto en la Pi). El vault de
Obsidian, las carpetas `Backlog/`, `vault/🎯 Hoy.md`, `tasks-index`, el widget de tareas y la «bitácora de sesiones»
quedan **obsoletos**: no crees notas de tarea ni escribas bitácoras ahí. Si encuentras una nota de tarea antigua, no la toques.

- **Proyecto:** `portfolio`. Pásalo siempre (`olimpo --proyecto portfolio …`) si la CLI no lo deduce del repo git.
- **Antes de crear, busca:** `olimpo buscar "<palabras>"`. Para crear, sigue `olimpo plantillas`: elige el tipo
  (`error`, `funcionalidad`, `investigacion`, `recado`), escribe sus secciones y un resumen vivo:
  `olimpo tarea crear --tipo funcionalidad --resumen "…" --notas "…" "Título"`. Si responde con `parecidas`, díselo a Alberto.
- **Tarea = lo que Alberto pide** («apunta…», «añade una tarea…»). Lo que sea «para el futuro» va al Desván como idea
  (`olimpo idea --help`). No inventes tareas.
- **Al empezar:** `olimpo tarea empezar <id>`. **Al terminar:** `olimpo tarea hecha <id>`. Los hallazgos van como
  aportes (`olimpo tarea aportar <id> "…"`) y el resumen se reescribe con `olimpo tarea resumir`. Nunca borres tareas.
- **«Al foco» / «para hoy»:** el foco del día son las tareas que Alberto ve primero en Inicio. La tarea debe existir ya
  en Olimpo. `olimpo foco` lo muestra y `olimpo foco --fijar <id> <id>…` lo **reemplaza entero**: léelo antes y pasa los
  ids que ya había más el nuevo. No lo confundas con `olimpo tarea empezar`, que solo cambia el estado a `en_curso`.
- **Lo que has hecho en la sesión:** un aporte en la tarea en la que trabajaste (qué hiciste, qué falta, commits). Es
  lo que Alberto lee al volver; sustituye a la bitácora.
- Roadmap: `olimpo roadmap`; versiones: `olimpo version`. Si Alberto menciona una tarea de OTRO proyecto, créala en
  el suyo con `--proyecto <slug>`.
