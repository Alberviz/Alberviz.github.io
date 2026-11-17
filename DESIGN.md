# DESIGN: portfolio de Alberto Vizcaíno Ponte

> **Lectura de diseño:** portfolio de ingeniero y design engineer para founders, fellowships y equipos tempranos. Lenguaje "precisión cósmica" sacado de su propio escritorio: espacio profundo, un agujero negro calculado a mano y una Raspberry Pi como estrella. Sobre Next.js 15, Tailwind v4, Motion y WebGL real.

Diales: `DESIGN_VARIANCE 8`, `MOTION_INTENSITY 6`, `VISUAL_DENSITY 3`. Sin tarjetas por defecto: se agrupa con espacio y líneas finas.

## 1. Color (tokens en `src/app/globals.css`)

| Token | Valor | Uso |
| --- | --- | --- |
| `--bg` | `#07080B` | Fondo espacio |
| `--surface` | `#0E1015` | Superficie |
| `--elevated` | `#151820` | Chips, controles |
| `--line` | `#1F232D` | Hairlines de 1px |
| `--ink` | `#ECEDF0` | Texto principal |
| `--muted` | `#8A8F9C` | Texto secundario (AA sobre bg y surface) |
| `--accent` | `#F2B36F` | Único acento, "disco de acreción" |
| `--accent-pressed` | `#E39F55` | Estado pulsado |
| `--on-accent` | `#1A1208` | Texto sobre el acento |

El acento se reserva para el CTA primario, el foco, el elemento activo y detalles mínimos. Nada de esmeralda ni de morado neón.

**Excepción documentada:** la sección Wari (`[data-surface="wari"]`) usa la paleta "Cristal" de Wari (niebla clara `#EEF2F8 -> #D9E1EE -> #B4C3DC`, tinta `#13213B`, acción `#27467A`) como único bloque de color de la página. El espacio se disuelve en la niebla al entrar y vuelve a oscuro al salir.

## 2. Tipografía

- Display: **Bricolage Grotesque** (`--font-display`), peso 600, tracking `-0.035em`, `opsz` alto en titulares.
- Texto: **Geist** (`--font-sans`).
- Datos y metadatos: **Geist Mono** (`--font-mono`).
- Solo en el portal de Wari: **Inter Tight / Inter** (`--font-wari-display`, `--font-wari`), para que se sienta otro mundo.
- Cifras siempre con `tabular-nums`. El énfasis se hace con peso o color de la misma familia.

## 3. Forma y composición

- Botones, filtros y chips: píldora (`999px`). Medios y marcos: `20px`.
- Iconos: Phosphor, trazo uniforme.
- Secciones separadas por `border-t border-line` y el espaciado `--spacing-section`; cabecera de sección = titular display a la izquierda y entradilla a la derecha.
- Eyebrows: máximo 3 en toda la página y ya están todos usados: "01 · Mi producto, en beta" (Wari), "02 · Autoalojado, en uso diario" (Olimpo) y "HackYeah 2026 · 24 horas" (MyCrohnie). Las etiquetas de columna son titulares, no eyebrows.
- Composición distinta por sección: hero a sangre con índice de casos; Wari en niebla con láminas e historia con móvil fijo; Olimpo como cielo profundo con nebulosa, ventana y móvil superpuestos en profundidad; Sistemas como mapa orbital; Trabajo como tarjeta de hackathon con horizonte cálido y un laboratorio compacto; contacto con un horizonte de acreción.
- Textura: `.grain` (ruido SVG estático, nunca fijo) solo en Olimpo y en el pie.
- Una sola etiqueta de contacto: "Contacto" en nav y pie.

## 4. Momentos firma

1. **Hero:** Gargantua en WebGL en vivo (renderer en `desktop/live/gargantua-renderer.ts`), con poster como LCP y fallback para reduced motion, sin WebGL y móviles flojos. Se pausa fuera de viewport.
2. **Sistemas:** mapa orbital. La Raspberry Pi 5 es la estrella y cada sistema es un planeta (un `<button>` real) en su órbita. Hover, foco o toque abren su ficha. Las órbitas se escriben al DOM desde un único `requestAnimationFrame` (sin estado por fotograma) y se paran con reduced motion, fuera de viewport, con el ratón encima, con foco dentro y unos segundos tras un toque.
3. **Olimpo:** recreación a tamaño fijo (1200x740 escritorio, 390x844 móvil) escalada con `ScaledStage` (solo `transform`). Datos inventados; Marcellus (`--font-olimpo`) solo dentro de la recreación. En pantallas estrechas un control segmentado elige Móvil o Escritorio.
4. **Warp:** el shader GLSL real del portal (`olimpo/warp-shaders.ts`) en un lienzo WebGL1, DPR limitado a 1,5, pausado fuera de pantalla; los archivos vuelan al agujero con transform y opacidad. Reduced motion: un fotograma quieto y fundidos. Sin WebGL: un agujero en CSS.
5. **Wari:** historia con scroll. En ancho, móvil fijo que cambia de pantalla según el capítulo (IntersectionObserver); en estrecho, carrusel con scroll-snap nativo y puntos que lo siguen.

## 5. Movimiento

- Curvas: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` (entradas y recuperaciones), `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`, `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`. Nunca `ease-in`.
- Duraciones: pulsación 140 ms, microinteracciones 180 ms, transiciones de UI 220-320 ms, reveals de sección 700 ms.
- Solo `transform`, `opacity` y `clip-path`. Nunca `transition: all`, nunca entradas desde `scale(0)` (se usa `0.96`).
- Todo hover vive tras `@media (hover: hover) and (pointer: fine)`; todo componente con movimiento respeta `useReducedMotion()`.
- La paleta de comandos y el cambio EN/ES son instantáneos.
- Nada de listeners de `scroll`; se usa `useScroll`/`useInView` de Motion o `IntersectionObserver`.

## 6. Accesibilidad y rendimiento

Contraste AA en todo, foco visible con `--focus-ring`, objetivos táctiles de 40 px o más (44 en la barra del pulgar), sin scroll horizontal a 360 px, `min-h-[100dvh]` en el hero, CLS cercano a 0 (medios con dimensiones exactas), LCP con el poster del hero.

## 7. Móvil

- Navegación con el pulgar: barra flotante abajo (Wari, Olimpo, Trabajo, Contacto y "Más"), con `env(safe-area-inset-bottom)` y `viewport-fit=cover`. Se esconde mientras el hero ocupa la pantalla.
- "Más" abre una hoja inferior (curva drawer, 320 ms de entrada, bloqueo de scroll, Escape, foco atrapado y devuelto) con todas las secciones, el idioma y la búsqueda.
- Nada depende del hover: los planetas tienen además una fila de chips, la historia de Wari es un carrusel con puntos pulsables y Warp se lanza con un botón.
