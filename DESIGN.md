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
- Composición distinta por sección: hero a sangre con índice de casos y caída con scroll; Wari en niebla con láminas e historia con móvil fijo; Olimpo como cielo profundo con nebulosa, ventana y móvil superpuestos en profundidad, y Warp como demo a lo ancho; Sistemas como diagrama de flujo; Laura como cielo oscuro con la demo de hologramas a lo ancho, un mapa de capacidades de pesos distintos, un pipeline que se llena con el scroll y una banda de seguridad; Trabajo como tarjeta de hackathon con horizonte cálido y un laboratorio compacto; contacto con un horizonte de acreción.
- Textura: `.grain` (ruido SVG estático, nunca fijo) solo en Olimpo y en el pie.
- Una sola etiqueta de contacto: "Contacto" en nav y pie.

## 4. Momentos firma

1. **Hero, "caer en el agujero":** Gargantua en WebGL en vivo (`desktop/live/gargantua-renderer.ts`) con poster como LCP. El hero es una pista de 180vh (150vh en móvil) con la primera pantalla fija: el scroll acerca la cámara (zoom exponencial en el pase final, `Camera` del renderer), lleva el agujero al centro, gira, deja que el agujero curve las estrellas, acelera el disco, añade desenfoque radial y funde a negro, donde empieza el amanecer de Wari. El texto se aparta con opacidad y desplazamiento. Reduced motion, sin WebGL2 o dispositivo flojo: poster y scroll normal, sin pista. Si el guardián de fotogramas congela el lienzo, la caída sigue como zoom CSS.
2. **Wari:** historia con scroll en cinco capítulos (Inicio, captura de pagos, ticket, saldar con Revolut o Bizum, viaje) con pantallas reales en modo demo. En ancho, móvil fijo; en estrecho, carrusel con scroll-snap.
3. **Warp:** demo jugable. Una pantalla de portátil recreada (Canvas 2D, `olimpo/warp-desktop.ts`) es la textura que curva la lente; los portales son los shaders reales de Olimpo v2.19 (AE1 negro y blanco, BINARIO) con la lente del PC de LinuxRicing, portados a WebGL1 (`olimpo/warp-shaders.ts`, `warp-engine.ts`). Arrastrar un archivo abre Móvil y Tablet arriba y la Tele a la derecha, con la placa HUD; soltar lo traga y un agujero blanco lo escupe en el dispositivo. Shift sobre dos portales los funde. Táctil: tocar archivo y portal; tocar fuera o el mismo archivo cancela. Teclado: Enter, 1/2/3, Esc. Máquina de estados de dos estados (reposo o eligiendo): un envío no bloquea, su vuelo corre aparte y siempre se puede coger otro archivo; soltar fuera, Esc, perder la ventana o un `pointercancel` cierran los portales y devuelven el archivo. Un archivo real solo se lee en local (nombre y tamaño). El bucle solo corre si algo se mueve y está en pantalla. Reduced motion: fotogramas quietos. Sin WebGL: agujeros CSS. Encima, una ruta portátil → dispositivos que se dibuja con el scroll.
4. **Sistemas:** diagrama de flujo de datos (fuentes → Raspberry Pi → salidas) que sustituye al mapa orbital. Las aristas se dibujan con el scroll en tres fases y luego las recorren paquetes (un rAF que solo escribe transform). En ancho la pista está fija; en móvil el diagrama es vertical y no se fija. Pasar, enfocar o tocar un nodo ilumina sus conexiones. Debajo, las fichas de cada sistema.
5. **Laura:** demo jugable de los hologramas de su asistente de voz (`laura/HoloDemo.tsx`), con datos inventados y los tiempos reales de HoloGeo (110, 180, 280, 420, 520, 330 y 620 ms; 85 ms entre paneles, 26 ms entre filas, tope de 340). Una píldora cuyo borde brilla con la voz lanza un rayo de nacimiento y los paneles vuelan tras él con el chasis holográfico (cristal oscuro, borde doble en ámbar, líneas de escaneo, trama de puntos, barrido de luz y esquinas HUD). Lista numerada con filas en cascada, visores con el hilo punteado que se dibuja desde su fila, agenda semanal y confirmación con cuenta atrás que tiembla en sus últimos segundos (el reloj va al doble de velocidad en la demo); al confirmar, el panel se desintegra hacia la papelera con "Deshacer". "Manda esa al móvil" sube el visor al portal de agujero negro: el motor de Warp en modo superpuesto (`WarpEngine.setBare`, sin pantalla ni lente). Todo con la API de animaciones web (transform, opacity, clip-path); reduced motion: aparece sin vuelo. En ancho, un escenario de 1120x640 escalado; en estrecho, paneles apilados sobre la píldora y las frases en una tira desplazable. Debajo, el mapa de capacidades, el pipeline (activación, Whisper, Qwen3, Kokoro) con sus detalles y la red de seguridad.
6. **Escritorio:** explorador del escritorio en vivo y la historia de ingeniería inversa en cuatro pasos (escuchar, decodificar, driver, escritorio): captura USB en hex, bytes que se nombran y el XOR que se deshace, el driver real y un setup cuyas luces reaccionan a una notificación simulada y a la carga. En ancho, visual fijo y raíl que se llena con el scroll.

## 5. Movimiento

- Curvas: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` (entradas y recuperaciones), `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`, `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`. Nunca `ease-in`.
- Duraciones: pulsación 140 ms, microinteracciones 180 ms, transiciones de UI 220-320 ms, reveals de sección 700 ms.
- Solo `transform`, `opacity` y `clip-path`. Nunca `transition: all`, nunca entradas desde `scale(0)` (se usa `0.96`).
- Todo hover vive tras `@media (hover: hover) and (pointer: fine)`; todo componente con movimiento respeta `useReducedMotion()`.
- La paleta de comandos y el cambio EN/ES son instantáneos.
- Nada de listeners de `scroll`; se usa `useScroll`/`useInView` de Motion o `IntersectionObserver`.
- Opacidad ligada al scroll con `useTransform` de función (no de rangos): Motion delega los rangos de opacidad en un ScrollTimeline nativo que mide la página entera.

## 6. Accesibilidad y rendimiento

Contraste AA en todo, foco visible con `--focus-ring`, objetivos táctiles de 40 px o más (44 en la barra del pulgar), sin scroll horizontal a 360 px, `min-h-[100dvh]` en el hero, CLS cercano a 0 (medios con dimensiones exactas), LCP con el poster del hero.

## 7. Móvil

- Navegación con el pulgar: barra flotante abajo (Wari, Olimpo, Trabajo, Contacto y "Más"), con `env(safe-area-inset-bottom)` y `viewport-fit=cover`. Se esconde mientras el hero ocupa la pantalla.
- "Más" abre una hoja inferior (curva drawer, 320 ms de entrada, bloqueo de scroll, Escape, foco atrapado y devuelto) con todas las secciones, el idioma y la búsqueda.
- Nada depende del hover: los planetas tienen además una fila de chips, la historia de Wari es un carrusel con puntos pulsables y Warp se lanza con un botón.
