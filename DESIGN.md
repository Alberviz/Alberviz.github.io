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
- Eyebrows: máximo 3 por página; hoy hay uno por página: "01 · Mi producto, en beta" (Wari), "02 · Autoalojado, en uso diario" (Olimpo) y "HackYeah 2026 · 24 horas" (MyCrohnie). Las etiquetas de columna son titulares, no eyebrows.
- Composición distinta por sección: hero a sangre con índice de casos y caída con scroll; Wari en niebla con láminas e historia con móvil fijo; Olimpo como cielo profundo con nebulosa, ventana y móvil superpuestos en profundidad, y Warp como demo a lo ancho; Sistemas como diagrama de flujo; Laura como cielo oscuro con la demo de hologramas a lo ancho, un mapa de capacidades de pesos distintos, un pipeline que se llena con el scroll y una banda de seguridad; Trabajo como tarjeta de hackathon con horizonte cálido y un laboratorio compacto; contacto con un horizonte de acreción.
- Textura: `.grain` (ruido SVG estático, nunca fijo) solo en Olimpo y en el pie.
- Una sola etiqueta de contacto: "Contacto" en nav y pie.

## 4. Páginas y momentos firma

**Home, `#casos`:** un avance por caso, cada uno con su composición y un fragmento real, no una tarjeta plana: Wari en su niebla (la única ruptura de tema, `[data-surface="wari"]`) con dos pantallas reales; Olimpo como ventana del Firmamento con un portal de Warp en vivo (el motor real en modo superpuesto, cargado en diferido al acercarse; puntero encima lo despierta; sin WebGL, agujero CSS); Laura con un holograma de Descargas que nace de su píldora por un rayo; el escritorio con el setup y los bytes HID decodificándose al entrar. El visual se abre con `clip-path` al entrar y deriva contra el texto con el scroll; el CTA "Ver el caso" es la parada de teclado. Cada caso entra a su manera, ligado al scroll: en Wari las dos pantallas llegan como una y se separan (warikan, la cuenta que se divide); la ventana de Olimpo llega tumbada como un cielo y se levanta hacia ti; el titular de Laura se transcribe palabra a palabra, como Whisper; el del escritorio llega en bytes hex y se decodifica letra a letra; en Trabajo, la línea de 24 horas de MyCrohnie se dibuja y enciende cada hito. Con reduced motion todo aparece en su sitio. **Final de cada caso:** `NextCase`, el siguiente caso con su avance quieto (nada corre ni carga WebGL). Las View Transitions entre home y casos quedan fuera por ahora (Next 15.5 las tiene tras un flag experimental).



1. **Hero, "el agujero se lo traga todo":** Gargantua en WebGL en vivo (`desktop/live/gargantua-renderer.ts`) con poster como LCP. El hero es una pista de 220vh (200vh en móvil) con la primera pantalla fija. Con el scroll, cada pieza de texto (la nota, los casos, la entradilla y por último el titular) cae en espiral al agujero, encogiéndose al cruzar el anillo de fotones, como un archivo soltado en un portal de Warp; el disco acelera y el agujero se hincha un poco. Después el agujero colapsa a un punto ardiendo más brillante (`flare` del renderer), suelta un destello cálido y una única onda de choque que barre la pantalla, y las estrellas se apagan. Desde el 62% de la pista `#casos` ya sube sobre el cielo fijo (margen negativo) y su titular nace del punto del colapso (`hero/singularity.ts`), como un archivo que sale de Warp por un agujero blanco: nunca una pantalla vacía. Reduced motion, sin WebGL2 o dispositivo flojo: poster y scroll normal, sin pista. Si el guardián de fotogramas congela el lienzo, el texto cae igual y el escenario se hincha y se funde. La barra del pulgar se esconde mientras la pantalla fija del hero llena la vista. En móvil, los dos casos del hero son dos losetas lado a lado.

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
- **Salto entre páginas (`WarpTransition`):** al pulsar un enlace a otra página se abre un agujero negro bajo el dedo (borde ámbar y halo) que se traga la pantalla en 440 ms; la página nueva aparece cuando el agujero se cierra en el centro (720 ms, curva drawer). Solo `clip-path` con la API de animaciones web. Sin él con reduced motion, teclas modificadoras, pestañas nuevas, descargas, anclas de la misma página y enlaces externos.
- Nada de listeners de `scroll`; se usa `useScroll`/`useInView` de Motion o `IntersectionObserver`.
- Opacidad ligada al scroll con `useTransform` de función (no de rangos): Motion delega los rangos de opacidad en un ScrollTimeline nativo que mide la página entera.

## 6. Accesibilidad y rendimiento

Contraste AA en todo, foco visible con `--focus-ring`, objetivos táctiles de 40 px o más (44 en la barra del pulgar), sin scroll horizontal a 360 px, `min-h-[100dvh]` en el hero, CLS cercano a 0 (medios con dimensiones exactas), LCP con el poster del hero.

## 7. Móvil

- Navegación con el pulgar: barra flotante abajo (Wari, Olimpo, Laura, Escritorio y "Más"), con `env(safe-area-inset-bottom)` y `viewport-fit=cover`; marca la página actual. En la home se esconde mientras el hero ocupa la pantalla.
- "Más" abre una hoja inferior (curva drawer, 320 ms de entrada, bloqueo de scroll, Escape, foco atrapado y devuelto) con las páginas, las secciones de la página actual, el idioma y la búsqueda.
- Nada depende del hover: los planetas tienen además una fila de chips, la historia de Wari es un carrusel con puntos pulsables y Warp se lanza con un botón.
