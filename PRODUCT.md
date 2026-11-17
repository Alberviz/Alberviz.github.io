# Product

<!-- impeccable:product-schema 1 -->

> Fuente de verdad del portfolio de Alberto Vizcaíno Ponte (`https://alberviz.github.io/`). Hechos, cifras y medios salen de repositorios y de la configuración real de sus sistemas. Nada puede inventarse.

## Platform

Web estática (Next.js App Router, `output: "export"`, GitHub Pages), responsive de escritorio a móvil.

## Users

1. **Audiencia principal:** revisores de fellowships (Go Exponential), founders, CTOs y equipos tempranos en Europa y Estados Unidos.
2. **Secundaria:** reclutadores técnicos, compañeros de hackathon y quien llega desde la web de Wari.

Escanean rápido (15-30 s). En dos scrolls tienen que ver rigor matemático y el hábito de entregar sistemas completos de principio a fin.

## Product Purpose

Demostrar con artefactos reales que Alberto (Doble Grado en Matemáticas e Ingeniería Informática, Universidad de Murcia; Erasmus+ en AGH Kraków 2026-2027) construye sistemas enteros: de la demostración al driver USB, de la app que su grupo usa a diario a la IA que corre en su propia Raspberry Pi.

## Positioning

Una sola página (`/`), modo `Experience`, con ocho secciones: Nav, Hero (agujero negro Gargantua en vivo), Wari (la app que mantiene y usan sus amigos), Sistemas (mapa orbital de su infraestructura personal), Escritorio (Linux hecho a medida), Proyectos (índice tipográfico), Trayectoria y Contacto.

Wari es el producto principal. Antes se llamaba Krakount; la ruta `/krakount` es un stub que apunta a la web de Wari. El nombre viene de 割り勘 (warikan).

## Voice

Primera persona, directo, humano, sin humo. Se explica qué hace cada cosa y qué dato lo prueba. Bilingüe: EN por defecto, ES con cambio instantáneo sin recargar.

## Hard Content & Privacy Constraints

1. **Negocio personal:** se describe solo como *personal product-selling business* / *negocio personal de venta de productos*, sin marca ni detalles comerciales.
2. **Nada privado:** ni IPs, puertos, rutas de API, URLs de red privada ni apps personales no listadas. Sin nombres reales de amigos o terceros.
3. **Fuera del portfolio:** auditorías de hardware ajeno, proyectos personales de pareja, servidores de juego y repos de terceros.
4. **Enlaces:** solo los verificados como públicos. Un repo privado no se enlaza.
5. **Contacto y CV públicos:** `albvizpon@gmail.com`, `https://github.com/Alberviz`, LinkedIn y el CV en `/cv/`.
6. **Cero rayas largas y medias** en todo texto, alt y metadato. Solo `-` ASCII.
7. **Cifras robustas:** se publican redondeadas hacia abajo cuando cambian a menudo (por ejemplo "2,700+ tests", "80+ migraciones").

## Evidence on Hand

- Capturas reales de Wari (tema Cristal) en `public/media/wari/`, medios de MyCrohnie y CloShare, y capturas del escritorio en `public/media/systems/`, con dimensiones exactas en `src/content/`.
- Demos públicas: Wari, MyCrohnie, CloShare, Barber Bot. Repos públicos: LinuxRicing, gts2-mando, MyCrohnie.

## Accessibility & Performance Floor

Contraste AA, `prefers-reduced-motion` respetado (el mapa orbital se para), hover solo en puntero fino, teclado completo en el mapa orbital y la paleta, `tabular-nums` en cifras, sin scroll horizontal a 390 px.
