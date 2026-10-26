# CLAUDE.md: Design Engineering & Animation Handoff Guide

Welcome! The Lead Orchestrator and Gemini Flash engineering team have built, typed, verified, and deployed the complete structural, data, and media foundation of **Alberto Vizcaíno Ponte's portfolio** (`/` and `/krakount`) for static export on GitHub Pages (`https://alberviz.github.io`).

Your mission as the **Lead Design & Motion Engineer (Claude)** is to elevate the visual craft, spatial layout, micro-physics, and scroll choreography of `/` and `/krakount` to an **Awwwards / Godly / Rauno Freiberg / Linear** caliber using your installed design skills.

---

## 1. Read First (Source of Truth)

1. `PRODUCT.md`: Audience (Go Exponential founders/fellowship + global startups), surface modes (`/` = `Experience`, `/krakount` = `Persuade`), and strict privacy/content rules.
2. `DESIGN.md`: Locked color palettes (`Obsidian + Emerald` on `/`, authentic `Kazimierz de noche` `#0E0F13` + `#F5A524` on `/krakount`), typography variables, shape scale, and Emil Kowalski motion tokens.
3. `docs/CLAUDE_DESIGN_PROMPT.md`: Step-by-step creative & animation roadmap tailored to your exact `~/.claude/skills/`.

---

## 2. Clean Architecture Separation (Do Not Break Data Contracts)

- **Content & Verified Facts (`src/content/`):**
  - `src/content/portfolio-data.ts`: Bilingual (`en` / `es`) copy, metrics, Aurora + Ghostfolio interconnected wealth architecture with `wealthFlow`, `LINUX_DESKTOP_SHOWCASE`, HackYeah MyCrohnie, Linux HID/GLSL/GTS2 hardware hacks, Applied AI apps, STEL Order experience, and Olympiad honors.
  - `src/content/krakount-data.ts`: Bilingual `/krakount` product story, NBP/integer stats, feature bento data with `shotCaptura` / `shotMisGastos`, and realistic Polish *Biedronka Paragon Fiskalny* receipt items for the live simulator.
  - `src/content/assets.ts`: Verified real WebP screenshots, SVG marks, H.264 faststart MP4 loops, and exact pixel `width`/`height` dimensions.
- **Visual Surfaces & Client Motion Islands (`src/components/`):**
  - `src/components/portfolio/*`: Sections and interactive client islands for `/`.
  - `src/components/krakount/*`: Sections and interactive receipt/debt simulator for `/krakount`.
  - `src/lib/motion.ts` & `src/lib/i18n-context.tsx`: Shared motion curves, springs, and instant `EN/ES` state.

---

## 3. Core Architectural Highlights (October 2026 Ground Truth)

1. **Interconnected Wealth Flow (`wealthFlow` on `HOMELAB_WEALTH_SYSTEM`):**
   - Built for a graphical architecture diagram (replacing card-soup):
     - **Inputs (4 sources)**:
       1. `Brokers`: Trade Republic · MyInvestor · Revolut (validated CSV + ISIN dedup)
       2. `Personal Business`: Supabase cron 03:15 (partner stake valued strictly on collected cash and realized sales profit: unsold stock counts as 0 EUR until sold, restocks deduct from cash, and monthly profit closures book dividends)
       3. `Krakount`: GET /api/v1/me/capital every 10 min (personal share of group expenses, logged income, net debts per bank)
       4. `Aurora AI Gateway`: Telegram capped proxy (10k EUR cap, 50 writes/day, reversible JSONL rollback ledger)
     - **Core**: Ghostfolio 3.89 + PostgreSQL 15 + Redis 7 on Raspberry Pi 5 (isolated Docker bridge, nightly pg_dump)
     - **Outputs (2 interfaces)**:
       1. `Mobile Wealth App`: iOS Stocks-style PWA with biometric PIN lock and read-only HTTP 403 token
       2. `Voice & Chat Queries`: Aurora + Laura natural-language balance, liquidity, and allocation answers
2. **Real Linux Desktop Showcase (`LINUX_DESKTOP_SHOWCASE`):**
   - Final Hyprland + Quickshell Caelestia 2.5 desktop:
     1. `Audio-Reactive Gargantua`: GLSL Schwarzschild raymarched shader (1024x1024) reacting live to PipeWire audio spectrum with track readout inside event horizon. Asset: `ASSETS.systems.gargantua`.
     2. `Orbital Desktop & Health Planet`: Binary star canvas with Laura orbited by Claude Code & Antigravity moons, MCHOSE wireless gear battery rings (/dev/hidraw), Tasks Comet, and Planeta Cuerpo (Amazfit GTS 2 steps, sleep, workouts). Asset: `ASSETS.systems.celestial`.
     3. `Local AI Laura (SUPER+A)`: 100% local RTX 4050 voice assistant (Faster-Whisper + Qwen3 4B Ollama + Kokoro TTS, GLSL glowing border, 20-min vigia daemon). Asset: `ASSETS.systems.desktopIcy`.
     4. `Multi-Agent Panel (SUPER+I)`: Wayland drawer + crystal orb tracking Laura, Gemini, Claude, and Aurora background jobs across workspaces with glowing Caelestia bar pips. Asset: `ASSETS.systems.lauraDrawer`.
     5. `Tasks Widget & Hardware Drivers`: TAREAS multi-repo desktop widget, 144Hz Honor MagicPad 2 streaming, Akko/MCHOSE USB HID drivers, and gts2-mando Kotlin app.

---

## 4. Hard Non-Negotiable Constraints

1. **Static Export Compatibility (`output: "export"`):**
   - `pnpm build` MUST succeed and emit static HTML/CSS/JS into `./out`. Do NOT add Next.js server actions, dynamic API routes, or runtime headers that break static export.
2. **Privacy & Content Locks:**
   - **Personal business anonymity:** Always describe that venture strictly as a *personal product-selling business* / *negocio personal de venta de productos* (stock, sales, margins, and realized profit) without naming internal store brands.
   - **NEVER** expose private mesh URLs, internal IPs, or unlisted personal apps.
   - **ZERO em-dashes or en-dashes** anywhere in visible copy, alt text, or metadata (`design-taste-frontend` Section 9.G). Use ASCII hyphens `-`, colons `:`, or commas `,` only.
3. **Performance & Craft Gates (`emil-design-eng` + `animate` + `design-taste-frontend`):**
   - Animate `transform`, `opacity`, and `clip-path` only.
   - Never use `transition: all`, `ease-in`, or `scale(0)` entrances.
   - Never animate `CMD+K` Command Menu open/close (`0ms` instant response).
   - Gate all hover transforms with `@media (hover: hover) and (pointer: fine)` and honor `useReducedMotion()`.
   - Eyebrow count per page `<= ceil(sectionCount / 3)`.

---

## 5. Commands

```bash
pnpm dev          # Local dev server (http://localhost:3000)
pnpm typecheck    # Strict TypeScript check
pnpm build        # Production static export into ./out (must pass with 0 errors)
git push          # Triggers .github/workflows/deploy.yml -> https://alberviz.github.io
```
