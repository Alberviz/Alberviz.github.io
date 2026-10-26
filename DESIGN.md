# DESIGN SYSTEM — Alberviz Portfolio & Krakount Showcase

> **Design Read (`/`):** Solo design-engineer & systems-builder portfolio for startup founders, fellowship reviewers, and technical leaders, with an architectural dark-precision language (`Obsidian + Emerald Signal`), high-craft typography, real media artifacts, and purposeful spring/scroll choreography.
> **Design Read (`/krakount`):** Mobile fintech & group-travel product showcase in Krakount's authentic **«Kazimierz de noche»** language (`#0E0F13` night paper + `#F5A524` streetlamp amber + `Schibsted Grotesk` & `Archivo`).

---

## 1. The Three Dials (`design-taste-frontend` Calibration)

* **`DESIGN_VARIANCE: 8`** - Asymmetric hero splits, varied editorial/architectural bento ratios, zero 3-equal-card rows, zero repeated consecutive layout families.
* **`MOTION_INTENSITY: 7`** - Crisp hardware-accelerated `transform`/`opacity`/`clip-path` choreography, tactile `:active` press (`scale(0.97)`), spring physics for interactive elements, GSAP ScrollTrigger reserved strictly for motivated pinned storytelling, and instant `0ms` keyboard command palette (`⌘K`).
* **`VISUAL_DENSITY: 4`** - Generous gallery breathing room around real videos and shader renders, balanced with crisp 1px hairline technical diagrams for systems/wealth architecture.

---

## 2. Surface Tokens & Color Consistency Lock

> **Strict Bans:** Never use pure `#000000` or pure `#FFFFFF`. Never use AI-purple/violet neon glows. Never invert themes mid-page (Page Theme Lock).

### Surface A: `/` — Root Portfolio («Obsidian Precision + Emerald Signal»)
- `--bg-canvas`: `#090A0D` (Deep cool obsidian canvas)
- `--bg-surface`: `#111318` (Primary elevated sheet/tile)
- `--bg-elevated`: `#171A21` (Interactive chip, input, code/spec surface)
- `--border-hairline`: `#232732` (1px structural grid & divider rules)
- `--text-primary`: `#ECEEF2` (Crisp off-white primary ink)
- `--text-muted`: `#8E95A5` (Secondary metadata & body prose)
- `--accent`: `#10B981` (Locked singular Emerald signal across the entire `/` surface)
- `--accent-pressed`: `#059669`
- `--on-accent`: `#04130D` (High-contrast dark label on emerald primary CTA, ratio > 8:1)

### Surface B: `/krakount` — Product Showcase («Kazimierz de noche»)
Scoped via `[data-surface="krakount"]` to honor `/home/alberviz/proyectos/krakount/DESIGN.md` verbatim:
- `--kk-paper`: `#0E0F13` (Cold night street background)
- `--kk-sheet`: `#17181E` (Continuous single-sheet surface)
- `--kk-sheet-alt`: `#1F2027` (Segmented tracks, chips, controls)
- `--kk-rule`: `#26272F` (1px list hairlines)
- `--kk-ink`: `#EDEDEF`
- `--kk-ink-muted`: `#8B8D98`
- `--kk-amber`: `#F5A524` (Streetlamp amber - the ONLY accent on `/krakount`)
- `--kk-amber-press`: `#E0951A`
- `--kk-on-amber`: `#16130A` (9:1 contrast text on amber pill CTAs)
- `--kk-owed`: `#3DD68C` (Mint - strictly positive money balances)
- `--kk-owe`: `#FF6B5B` (Coral - strictly negative money balances)

---

## 3. Typography & Numeric Discipline

- **Root `/` Display Headlines:** `Space Grotesk` (`var(--font-display)`), tight tracking (`-0.03em`), `leading-[1.05]`.
- **Root `/` Body & UI:** `Plus Jakarta Sans` (`var(--font-sans)`), `max-w-[65ch]`, relaxed reading rhythm.
- **Technical Metadata / Architecture Specs:** `JetBrains Mono` (`var(--font-mono)`).
- **`/krakount` Brand Wordmark:** `Archivo` (`var(--font-krakount-brand)`), weight `800-900`, exclusively for brand wordmarks/stamps.
- **`/krakount` UI & Copy:** `Schibsted Grotesk` (`var(--font-krakount-ui)`).
- **Mandatory `tabular-nums`:** Every monetary amount, counter, metric, and receipt figure MUST apply `font-variant-numeric: tabular-nums`.
- **Emphasis Rule:** Never inject a random serif word inside a sans headline. Use bold/color/italic of the same family (respecting descender clearance `leading-[1.1]` + `pb-1`).

---

## 4. Shape, Icons & Layout Rules

- **Shape Consistency Lock:**
  - Interactive buttons, language switch, and filter chips: `rounded-full` (`999px` pill).
  - Structural containers, video frames, and sheets: `rounded-2xl` (`16px`).
  - Nested inner controls / code blocks: `rounded-xl` (`12px`).
- **Icons:** Exclusively `@phosphor-icons/react` (regular weight `1.5`/default, `fill` for active states). Zero hand-rolled SVG icons, zero emojis in UI chrome.
- **Hero Discipline:** Fits `min-h-[100dvh]`, top padding `<= pt-24`, max 4 text stack elements (1 eyebrow, 2-line max headline, `<= 20`-word subtext, 2 CTAs), real visual artifact on the right.
- **Eyebrow Restraint:** Maximum `ceil(sectionCount / 3)` uppercase tracking eyebrows per page. Most sections lead directly with a strong display heading.
- **No Duplicate CTA Intent:** Primary contact CTA uses `"Get in touch"` / `"Contactar"` consistently across nav and footer.

---

## 5. Motion Engineering Rules (`emil-design-eng` + `animate` + `gsap-*`)

1. **Custom Curves Only (never CSS built-in `ease-in`):**
   - `--ease-out`: `cubic-bezier(0.23, 1, 0.32, 1)` (entrances, press recovery, popovers)
   - `--ease-in-out`: `cubic-bezier(0.77, 0, 0.175, 1)` (on-screen morphs & layout shifts)
   - `--ease-drawer`: `cubic-bezier(0.32, 0.72, 0, 1)` (sheets & modals)
2. **Frequency Gate:**
   - `⌘K` Command Menu & `EN/ES` switch: **0ms / instant** (or crisp 120ms opacity blur crossfade on copy, zero sluggish modal zoom).
   - Buttons & interactive pills: `140ms var(--ease-out)` with `:active { transform: scale(0.97) }`.
   - Scroll reveals & showcase choreography: GPU-only `transform`, `opacity`, and `clip-path: inset(...)`. Never animate `width`, `height`, `top`, `left`, or `margin`. Never start from `scale(0)` (use `scale(0.96)` + `opacity: 0`).
3. **Library Isolation:**
   - Never mix GSAP `ScrollTrigger` and `motion/react` on the same DOM node. Isolate GSAP scroll scenes in dedicated `'use client'` leaf components using `useGSAP()` / `gsap.context()` with full revert cleanup.
   - Never attach `window.addEventListener("scroll", ...)`.
4. **Mandatory Gating:**
   - Every hover transform lives inside `@media (hover: hover) and (pointer: fine)`.
   - Every non-trivial motion component checks `useReducedMotion()` and degrades to calm opacity transitions.
