# CLAUDE.md — Design Engineering & Animation Handoff Guide

Welcome! The Lead Orchestrator and Gemini Flash engineering team have built, typed, verified, and deployed the complete structural, data, and media foundation of **Alberto Vizcaíno Ponte's portfolio** (`/` and `/krakount`) for static export on GitHub Pages (`https://alberviz.github.io`).

Your mission as the **Lead Design & Motion Engineer (Claude)** is to elevate the visual craft, spatial layout, micro-physics, and scroll choreography of `/` and `/krakount` to an **Awwwards / Godly / Rauno Freiberg / Linear** caliber using your installed design skills.

---

## 1. Read First (Source of Truth)

1. `PRODUCT.md` — Audience (Go Exponential founders/fellowship + global startups), surface modes (`/` = `Experience`, `/krakount` = `Persuade`), and strict privacy/content rules.
2. `DESIGN.md` — Locked color palettes (`Obsidian + Emerald` on `/`, authentic `Kazimierz de noche` `#0E0F13` + `#F5A524` on `/krakount`), typography variables, shape scale, and Emil Kowalski motion tokens.
3. `docs/CLAUDE_DESIGN_PROMPT.md` — Step-by-step creative & animation roadmap tailored to your exact `~/.claude/skills/`.

---

## 2. Clean Architecture Separation (Do Not Break Data Contracts)

- **Content & Verified Facts (`src/content/`):**
  - `src/content/portfolio-data.ts` — Bilingual (`en` / `es`) copy, metrics, Aurora + Ghostfolio interconnected wealth architecture, HackYeah MyCrohnie, Linux HID/GLSL/GTS2 hardware hacks, Applied AI apps, STEL Order experience, and Olympiad honors.
  - `src/content/krakount-data.ts` — Bilingual `/krakount` product story, NBP/integer stats, feature bento data, and realistic Polish *Biedronka Paragon Fiskalny* receipt items for the live simulator.
  - `src/content/assets.ts` — Verified real WebP screenshots, SVG marks, H.264 faststart MP4 loops, and exact pixel `width`/`height` dimensions.
- **Visual Surfaces & Client Motion Islands (`src/components/`):**
  - `src/components/portfolio/*` — Sections and interactive client islands for `/`.
  - `src/components/krakount/*` — Sections and interactive receipt/debt simulator for `/krakount`.
  - `src/lib/motion.ts` & `src/lib/i18n-context.tsx` — Shared motion curves, springs, and instant `EN/ES` state.

---

## 3. Hard Non-Negotiable Constraints

1. **Static Export Compatibility (`output: "export"`):**
   - `pnpm build` MUST succeed and emit static HTML/CSS/JS into `./out`. Do NOT add Next.js server actions, dynamic API routes, or runtime headers that break static export.
2. **Privacy & Content Locks:**
   - **Personal business anonymity:** Always describe the Supabase -> Ghostfolio business sync strictly as a *personal product-selling business* / *negocio personal de venta de productos* (stock, sales, margins, and real-time net profit) without naming internal store brands.
   - **NEVER** expose private mesh URLs, internal IPs, or unlisted personal apps.
   - **ZERO em-dashes (`—`) or en-dashes (`–`)** anywhere in visible copy, alt text, or metadata (`design-taste-frontend` Section 9.G). Use `-` only.
3. **Performance & Craft Gates (`emil-design-eng` + `animate` + `design-taste-frontend`):**
   - Animate `transform`, `opacity`, and `clip-path` only.
   - Never use `transition: all`, `ease-in`, or `scale(0)` entrances.
   - Never animate `⌘K` Command Menu open/close (`0ms` instant response).
   - Gate all hover transforms with `@media (hover: hover) and (pointer: fine)` and honor `useReducedMotion()`.
   - Eyebrow count per page `<= ceil(sectionCount / 3)`.

---

## 4. Commands

```bash
pnpm dev          # Local dev server (http://localhost:3000)
pnpm typecheck    # Strict TypeScript check
pnpm build        # Production static export into ./out (must pass with 0 errors)
git push          # Triggers .github/workflows/deploy.yml -> https://alberviz.github.io
```
