# Master Prompt & Playbook for Claude Design Agent

Copy and paste the prompt below when opening **Claude Code** inside `/home/alberviz/proyectos/portfolio` to unleash all your installed design and motion skills on top of the deployed foundation:

---

```markdown
Lee primero `CLAUDE.md`, `PRODUCT.md` y `DESIGN.md`.

Actúa como Director de Design Engineering y Motion. Quiero que uses tus skills instaladas (`impeccable`, `design-taste-frontend`, `emil-design-eng`, `animate`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `mobile-native`, `review-animations` y `break-ui`) para llevar las dos superficies de este proyecto (`/` y `/krakount`) a un nivel visual y de animación digno de Rauno Freiberg, Emil Kowalski, Linear y Godly.website, manteniendo intactos los contratos de contenido en `src/content/*` y el export estático (`pnpm build` -> `./out`).

Ejecuta el trabajo en este orden:

1. **Contexto y Auditoría Inicial (`impeccable` + `design-taste-frontend`):**
   - Revisa `src/app/page.tsx`, `src/app/krakount/page.tsx`, `src/components/portfolio/*` y `src/components/krakount/*`.
   - Verifica el cumplimiento estricto de los 3 diales (`DESIGN_VARIANCE: 8`, `MOTION_INTENSITY: 7`, `VISUAL_DENSITY: 4`), el bloqueo cromático de cada superficie (`#090A0D` + `#10B981` en `/`; `#0E0F13` + `#F5A524` «Kazimierz de noche» en `/krakount`) y cero AI-tells (cero guiones largos `—`/`–`, límite estricto de eyebrows `<= ceil(secciones/3)`).

2. **Elevación Visual y Coreografía en `/` (Modo `Experience`):**
   - **Hero Asimétrico:** Refina la composición tipográfica y la escena interactiva derecha (combinando vídeo real de Krakount + shader Gargantua + telemetría de sistemas) con entrada escalonada suave (`clip-path` + `cubic-bezier(0.23, 1, 0.32, 1)`), encajando perfectamente en `100dvh` sin scroll forzado.
   - **Spotlight de Krakount:** Añade física magnética sutil o inclinación con `useMotionValue` + `useSpring` (fuera del ciclo de render de React) y transición fluida hacia `/krakount`.
   - **Diagrama Interactivo Home Lab & Ghostfolio Wealth Engine:** Convierte los 4 nodos (`Ingest`, `Core`, `Hardened AI Gateway`, `Read-Only Mobile Panel`) + `Aurora` en un mapa arquitectónico vivo con trazos SVG animados / flujo de datos sutil al seleccionar cada capa, mostrando cómo el negocio personal en Supabase, los brokers y el agente IA se conectan sin exponer credenciales.
   - **Selected Work (MyCrohnie + Hardware/GLSL/GTS2 + Applied AI):** Aplica layouts diferenciados por sección (prohibido repetir familias de layout), revelados por `clip-path: inset(...)` al entrar en viewport y micro-interacciones táctiles (`scale(0.97)` en `:active`, hover protegido tras `@media (hover: hover) and (pointer: fine)`).

3. **Elevación Visual y Coreografía en `/krakount` (Modo `Persuade` - «Kazimierz de noche»):**
   - Haz que la atmósfera nocturna ámbar (`#F5A524` sobre `#0E0F13` y `#17181E`) se sienta como una app nativa de primer nivel (referencias: Linear, Family, Amie).
   - Usa `gsap` + `ScrollTrigger` (aislado con `useGSAP` y cleanup completo) en una escena de recorrido del flujo móvil (Ticket OCR -> Saldos en 32 monedas -> Vuelos y Pases QR -> Captura Android en Kotlin).
   - Pule al máximo la micro-física del **Simulador Interactivo de Ticket Biedronka y Simplificación de Deudas**: transiciones numéricas con `tabular-nums`, chips táctiles con respuesta inmediata (<160ms) y desglose visual cristalino.

4. **Auditoría Final Rigurosa (`review-animations` + `break-ui` + Pre-Flight):**
   - Pasa el checklist de `review-animations` (cero `ease-in`, cero `scale(0)`, cero `transition: all`, `⌘K` instantáneo a `0ms`, `prefers-reduced-motion` en todo).
   - Comprueba responsive móvil (`375px`) y escritorio (`1440px`), contraste WCAG AA, anonimato estricto del negocio personal (sin marcas internas) y cero guiones largos `—`/`–`.
   - Ejecuta `pnpm typecheck && pnpm build` hasta que compile con 0 errores y deja el commit listo para `git push`.
```
