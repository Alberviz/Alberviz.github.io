# Master Prompt & Playbook for Claude Design Agent

Copy and paste the prompt below when opening **Claude Code** inside `/home/alberviz/proyectos/portfolio` to unleash all your installed design and motion skills on top of the deployed foundation:

---

```markdown
Lee primero `CLAUDE.md`, `PRODUCT.md` y `DESIGN.md`.

Actua como Director de Design Engineering y Motion. Quiero que uses tus skills instaladas (`impeccable`, `design-taste-frontend`, `emil-design-eng`, `animate`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `mobile-native`, `review-animations` y `break-ui`) para llevar las dos superficies de este proyecto (`/` y `/krakount`) a un nivel visual y de animacion digno de Rauno Freiberg, Emil Kowalski, Linear y Godly.website, manteniendo intactos los contratos de contenido en `src/content/*` y el export estatico (`pnpm build` -> `./out`).

Ejecuta el trabajo en este orden:

1. **Contexto y Auditoria Inicial (`impeccable` + `design-taste-frontend`):**
   - Revisa `src/app/page.tsx`, `src/app/krakount/page.tsx`, `src/components/portfolio/*` y `src/components/krakount/*`.
   - Verifica el cumplimiento estricto de los 3 diales (`DESIGN_VARIANCE: 8`, `MOTION_INTENSITY: 7`, `VISUAL_DENSITY: 4`), el bloqueo cromatico de cada superficie (`#090A0D` + `#10B981` en `/`; `#0E0F13` + `#F5A524` «Kazimierz de noche» en `/krakount`) y cero AI-tells (cero guiones largos em-dash o en-dash, limite estricto de eyebrows `<= ceil(secciones/3)`).

2. **Elevacion Visual y Coreografia en `/` (Modo `Experience`):**
   - **Hero Asimetrico:** Refina la composicion tipografica y la escena interactiva derecha (combinando video real de Krakount + shader Gargantua + telemetria de sistemas) con entrada escalonada suave (`clip-path` + `cubic-bezier(0.23, 1, 0.32, 1)`), encajando perfectamente en `100dvh` sin scroll forzado.
   - **Spotlight de Krakount:** Anade fisica magnetica sutil o inclinacion con `useMotionValue` + `useSpring` (fuera del ciclo de render de React) y transicion fluida hacia `/krakount`.
   - **Diagrama Grafico de Arquitectura Patrimonial (`wealthFlow` en `HOMELAB_WEALTH_SYSTEM`):**
     - Sustituye la sopa de tarjetas por un diagrama arquitectonico interactivo con 3 columnas claras:
       1. `Inputs` (4 fuentes: Brokers con CSV/ISIN, Negocio Personal con Supabase cron 03:15, Krakount con feed 10m `/api/v1/me/capital`, Aurora con Telegram proxy 10k EUR cap).
       2. `Core` (Ghostfolio 3.89 + PostgreSQL 15 + Redis 7 en Raspberry Pi 5 con Docker aislado y copias nocturnas pg_dump).
       3. `Outputs` (PWA movil con PIN biometrico y token 403 de solo lectura, Consultas por voz con Aurora y Laura).
     - Anade trazos SVG animados y flujo de pulsos sutiles al seleccionar cada nodo.
   - **Selected Work & Linux Desktop Showcase (`LINUX_DESKTOP_SHOWCASE`):**
     - Presenta los 5 elementos del escritorio real Hyprland + Quickshell Caelestia 2.5:
       1. Audio-Reactive Gargantua (`ASSETS.systems.gargantua` 1024x1024).
       2. Orbital Desktop & Health Planet (`ASSETS.systems.celestial` 1920x1080).
       3. Local AI Laura con RTX 4050 local (`ASSETS.systems.desktopIcy` 1920x1080).
       4. Multi-Agent Panel SUPER+I (`ASSETS.systems.lauraDrawer` 1280x720).
       5. Tasks Widget & Hardware Drivers (TAREAS, Akko/MCHOSE HID drivers, gts2-mando).
     - Aplica layouts diferenciados por seccion (prohibido repetir familias de layout), revelados por `clip-path: inset(...)` al entrar en viewport y micro-interacciones tactiles (`scale(0.97)` en `:active`, hover protegido tras `@media (hover: hover) and (pointer: fine)`).

3. **Elevacion Visual y Coreografia en `/krakount` (Modo `Persuade` - «Kazimierz de noche»):**
   - Haz que la atmosfera nocturna ambar (`#F5A524` sobre `#0E0F13` y `#17181E`) se sienta como una app nativa de primer nivel (referencias: Linear, Family, Amie).
   - Usa `gsap` + `ScrollTrigger` (aislado con `useGSAP` y cleanup completo) en una escena de recorrido del flujo movil (Ticket OCR -> Saldos en 32 monedas -> Vuelos y Pases QR -> Captura Android en Kotlin con Bizum automatico).
   - Pule al maximo la micro-fisica del **Simulador Interactivo de Ticket Biedronka y Simplificacion de Deudas**: transiciones numericas con `tabular-nums`, chips tactiles con respuesta inmediata (<160ms) y desglose visual cristalino.

4. **Auditoria Final Rigurosa (`review-animations` + `break-ui` + Pre-Flight):**
   - Pasa el checklist de `review-animations` (cero `ease-in`, cero `scale(0)`, cero `transition: all`, `CMD+K` instantaneo a `0ms`, `prefers-reduced-motion` en todo).
   - Comprueba responsive movil (`375px`) y escritorio (`1440px`), contraste WCAG AA, anonimato estricto del negocio personal (sin marcas internas) y cero guiones largos em-dash o en-dash.
   - Ejecuta `pnpm typecheck && pnpm build` hasta que compile con 0 errores y deja el commit listo para `git push`.
```
