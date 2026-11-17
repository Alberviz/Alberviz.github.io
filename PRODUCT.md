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

Demostrar con artefactos reales que Alberto (Doble Grado en Matemáticas e Ingeniería Informática, Universidad de Murcia; Erasmus+ en AGH Kraków 2026-2027) construye sistemas enteros: de la demostración al driver USB, de su propio producto en beta (Wari) al sistema operativo de su vida (Olimpo) que corre en su Raspberry Pi.

## Positioning

Una sola página (`/`), modo `Experience`, con jerarquía en tres niveles:

1. **Casos estrella:** Wari (su producto, en beta camino de Google Play y la App Store; nunca "ya en las tiendas" ni "la app de mis amigos") y Olimpo con Warp (el sistema operativo de su vida, autoalojado en la Raspberry Pi 5).
2. **Trabajo notable:** Sistemas (lo que corre detrás de Olimpo: Patrimonio, Aurora, Salud, Laura), Escritorio Linux y MyCrohnie contado a través de HackYeah 2026 (24 horas).
3. **Laboratorio:** Barber Bot, CloShare y el vault de la universidad, compactos. Choppy solo como mención de una línea; gts2-mando como enlace en la ficha de Salud.

Secciones: Nav, Hero, Wari, Olimpo (con Warp), Sistemas, Escritorio, Trabajo, Trayectoria y Contacto. La ruta `/krakount` es un stub que apunta a la web de Wari (nombre antiguo; no aparece en la página principal). El nombre viene de 割り勘 (warikan).

## Voice

Primera persona, directo, humano, sin humo. Se explica qué hace cada cosa y qué dato lo prueba. Bilingüe: EN por defecto, ES con cambio instantáneo sin recargar.

## Hard Content & Privacy Constraints

1. **Negocio personal:** se describe solo como *personal product-selling business* / *negocio personal de venta de productos*, sin marca ni detalles comerciales.
2. **Nada privado:** ni IPs, puertos, rutas de API, URLs de red privada, nombres de la tailnet ni políticas de seguridad explotables (umbrales de bloqueo, límites). Sin nombres reales de amigos o terceros. Olimpo solo se muestra recreado con datos inventados.
3. **Fuera del portfolio:** auditorías de hardware ajeno, proyectos personales de pareja, servidores de juego y repos de terceros.
4. **Enlaces:** solo los verificados como públicos. Un repo privado no se enlaza.
5. **Contacto y CV públicos:** `albvizpon@gmail.com`, `https://github.com/Alberviz`, LinkedIn y el CV en `/cv/`.
6. **Cero rayas largas y medias** en todo texto, alt y metadato. Solo `-` ASCII.
7. **Cifras robustas:** se publican redondeadas hacia abajo cuando cambian a menudo. En Wari no se publican cifras de monedas, tests ni migraciones: se enseña lo que hace (captura de pagos opcional desde las notificaciones de Revolut y Google Wallet, Bizum recibido que salda la deuda, Revolut con importe, moneda y concepto puestos, Bizum que copia el número, recordatorio como mucho una vez al día, compensación automática si los dos la activan). Google Wallet (pases) está en demo y Transitous apagado: no se venden.
8. **Warp en el PC:** Super+Espacio manda lo seleccionado o el portapapeles; saltar de portal con Espacio y sumar con Shift están diseñados y en la demo, y se dice que en el escritorio aún se están conectando. Soltar entre dos portales ya los funde.
9. **Hardware:** se cuenta la ingeniería inversa, no los aparatos. Solo bytes de protocolo (opcodes, payloads, checksums); nada de números de serie, MACs, direcciones ni puertos. Las baterías de la simulación son de ejemplo.

## Evidence on Hand

- Capturas reales de Wari (tema Cristal) en `public/media/wari/`, medios de MyCrohnie y CloShare, y capturas del escritorio en `public/media/systems/`, con dimensiones exactas en `src/content/`.
- Demos públicas: Wari, MyCrohnie, CloShare, Barber Bot. Repos públicos: LinuxRicing, gts2-mando, MyCrohnie.

## Accessibility & Performance Floor

Contraste AA, `prefers-reduced-motion` respetado (el mapa orbital se para), hover solo en puntero fino, teclado completo en el mapa orbital y la paleta, `tabular-nums` en cifras, sin scroll horizontal a 390 px.
