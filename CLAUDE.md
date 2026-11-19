# CLAUDE.md: guía del portfolio de Alberto Vizcaíno Ponte

Portfolio estático (`/`) de Alberto en `https://alberviz.github.io`, rediseñado en noviembre de 2026 con el lenguaje
"precisión cósmica": espacio profundo, un único acento ámbar y un agujero negro real calculado en WebGL. La tercera
vuelta (rama `rediseno/paginas`) parte la página única en una home de avances y una página por caso (Wari, Olimpo con
Warp y los sistemas, Laura y el escritorio), más MyCrohnie y el laboratorio en la home. El repo es
**público**: nada de datos privados en código, copy, comentarios ni commits.

## 1. Leer primero

1. `PRODUCT.md`: audiencia, tono, reglas de contenido y privacidad.
2. `DESIGN.md`: tokens (color, tipografía, forma), movimiento y reglas de composición.

## 2. Estructura: una home y una página por caso (rama `rediseno/paginas`, noviembre de 2026)

El layout (`src/app/layout.tsx`) pone en todas las páginas la barra (`PortfolioNavbar`, que deduce la página de la ruta),
el pie (`PortfolioFooter`, `#contacto`) y la paleta (`CommandPalette`). Así el idioma y la barra persisten al navegar.

| Ruta | Contenido | Archivo |
| --- | --- | --- |
| `/` | Hero (Gargantua WebGL, solo aquí), `#casos` con un avance vivo de cada caso (`CaseReel` + `CaseVisuals`), `#proyectos`, `#trayectoria` | `src/app/page.tsx` |
| `/wari/` | `WariPortal` (portal en niebla, `#wari-historia`, automatizaciones, CTA a `WARI_URL`) | `src/app/wari/page.tsx` |
| `/olimpo/` | `OlimpoSection` (Firmamento, móvil, `#warp` con la demo y Cast) y `SystemsSection` (`#sistemas`) | `src/app/olimpo/page.tsx` |
| `/laura/` | `LauraSection` completa (`#laura-demo`, capacidades, pipeline, red de seguridad) | `src/app/laura/page.tsx` |
| `/escritorio/` | `DesktopSection` (explorador y momentos) y la historia del hardware (`#hardware`) | `src/app/escritorio/page.tsx` |

- Mapa del sitio, orden de los casos, metadatos, secciones por página y anclas viejas: `src/content/pages.ts`.
  Metadatos y OG de cada caso: `src/app/case-metadata.ts` (imágenes en `public/media/og/`, capturas de la cabecera de cada página a 1200x630).
- Cada página de caso se lee en tres capas, para quien mira las imágenes, quien hojea los títulos y el técnico: lo
  esencial y una línea por bloque a la vista, y el detalle completo tras `Detail` (`src/components/portfolio/Detail.tsx`).
  `Detail` plega solo por debajo de 1024 px (con clase `max-lg:hidden`, no el atributo `hidden`, que Tailwind fuerza a
  `display: none`); desde 1024 px el detalle se ve siempre y no hay botón. El texto de la tarjeta de la home (`lines` en
  `pages.ts`) es un gancho, no una copia del arranque de la página.
- Cada caso termina con `NextCase` (Wari → Olimpo → Laura → Escritorio → home), con un avance quieto (sin WebGL).
- Anclas viejas (`/#wari`, `/#olimpo`, `/#warp`, `/#sistemas`, `/#laura`, `/#escritorio`): un script en línea de la home
  hace `location.replace` a su página antes de pintar.
- El avance de Olimpo en la home carga `warp-engine` en su propio chunk solo cuando se acerca a la pantalla.
- Barra: los cuatro casos y Trabajo (`/#proyectos`); en móvil, barra del pulgar con los cuatro casos y "Más" (hoja con
  páginas y secciones de la página actual). La paleta lista páginas y secciones; un ancla en otra página navega con documento.

## 3. Contenido (`src/content/`)

Todo el copy es bilingüe (`en` por defecto, `es`) y se elige con `useLocale()` de `src/lib/i18n-context.tsx`.

- `pages.ts`: páginas, avances de cada caso (titular y dos líneas), secciones, metadatos y anclas viejas.
- `site-copy.ts`: nav, hero, portal de Wari (con los capítulos de la historia), contacto.
- `olimpo.ts`: caso Olimpo, sus pilares y cifras, los datos INVENTADOS de la recreación y Warp.
- `systems.ts`: planetas del mapa orbital (Patrimonio, Aurora, Salud, Laura).
- `laura.ts`: toda la sección Laura: cifras verificadas, frases y datos INVENTADOS de la demo de hologramas, capacidades, pipeline y red de seguridad.
- `desktop.ts`: momentos del escritorio y la historia de ingeniería inversa (`HARDWARE_STORY`).
- `projects.ts`: MyCrohnie (destacado), laboratorio y menciones (enlaces solo si están verificados como públicos).
- `portfolio-data.ts`: perfil, experiencia, estudios y reconocimientos.
- `links.ts`, `assets.ts`, `wari-shots.ts`: enlaces públicos, medios con dimensiones exactas, capturas de Wari.

Una cifra solo se publica si está verificada contra el código o la configuración del proyecto. Si no, se quita.
Wari es el producto de Alberto, en beta camino de Google Play y la App Store: nunca "la app de mis amigos" ni "ya en
las tiendas". Olimpo nunca se enseña con datos reales: solo la recreación de `olimpo/Firmamento` y `olimpo/SkyPhone`.

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
   - Para la preferencia de movimiento usa `useReducedMotionSafe()` de `src/lib/motion.ts` (evita errores de hidratación); los lienzos WebGL que se reutilizan no se recrean sobre el mismo `<canvas>`.
   - Secciones fijas (hero, Sistemas en ancho, historia del hardware en ancho) solo con WebGL o en escritorio; con reduced motion vuelven a scroll normal.
   - Máximo 3 eyebrows por página (hoy: Wari en `/wari/`, Olimpo en `/olimpo/`, MyCrohnie en la home).
4. **Verificación visual:** capturas desde el build estático (`out/`), nunca desde `pnpm dev`, de cada página a 1280x800, 390x844 y 360x780. Sin scroll horizontal a 360.
5. **Rutas:** `pnpm build` debe generar las cinco (`/`, `/wari/`, `/olimpo/`, `/laura/`, `/escritorio/`). Cada página carga solo lo suyo.

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
