# Product

<!-- impeccable:product-schema 1 -->

> Source of truth for Alberto Vizcaíno Ponte's permanent portfolio (`https://alberviz.github.io/`) and flagship product showcase (`https://alberviz.github.io/krakount/`). All facts, metrics, and media come from verified repositories and live Raspberry Pi 5 home-lab audits. Nothing may be fabricated.

## Platform

web (static export on GitHub Pages via Next.js App Router, desktop + mobile responsive)

## Users

1. **Primary high-signal audience:** Fellowship reviewers, startup founders, CTOs, and VCs evaluating Alberto's application to **The Exponential Fellowship / Go Exponential** (`goexponential.org`), as well as early-stage engineering teams in San Francisco, New York, Spain, and Europe.
2. **Secondary permanent audience:** Technical recruiters, hackathon teammates, collaborators, and visitors exploring **Krakount** (`/krakount`).

Visitors scan fast (15-30 seconds on desktop or phone). Within the first two scrolls they must immediately see: formal mathematical rigor + relentless habit of shipping complete, real-world systems end to end.

## Product Purpose

Prove through real artifacts, live architecture, video proof, and interactive software craft that **Alberto Vizcaíno Ponte** (Double B.S. Mathematics & Computer Science, Universidad de Murcia, Erasmus+ at AGH University of Kraków) is an outlier high-agency builder who operates across the full stack: from integer-exact financial engines, WebGPU PWAs, and cloud ERP POS modules down to autonomous 24/7 AI agents on self-hosted Linux, raymarched GLSL shaders, and raw USB/BLE/NFC hardware reverse engineering.

## Positioning

Two distinct, cohesive surfaces inside one fast static site:
1. **`/` (Portfolio - Mode: `Experience`):** Design-engineer & systems-builder showcase inspired by the craft standard of Rauno Freiberg, Emil Kowalski, Paco Coursey, and Dennis Snellenberg. Clean typographic hierarchy, real product videos and shader renders, live architecture topology of his Raspberry Pi 5 home lab + interconnected Ghostfolio wealth system, and instant `⌘K` keyboard navigation.
2. **`/krakount` (Flagship Product Landing - Mode: `Persuade`):** Dedicated product showcase in Krakount's authentic **«Kazimierz de noche»** design language (`#0E0F13` night paper, `#F5A524` streetlamp amber, `Schibsted Grotesk` + variable `Archivo`), featuring real mobile reels, 30+ real screenshots, Android `Krakount Captura` details, and a live interactive *Paragon Fiskalny* receipt-splitting + debt-simplification simulator.

## Operating Context

Bilingual (`EN` default for international founders/Go Exponential, instant `EN/ES` client toggle without reload). Hosted permanently at `https://alberviz.github.io` as a static export (`output: 'export'`). Zero backend servers required; interactive simulations run deterministically in the browser.

## Hard Content & Privacy Constraints

1. **Personal commerce venture anonymity:** When describing the live Ghostfolio business sync bridge (`Supabase -> Ghostfolio`), always describe it strictly as a **personal product-selling business** (*negocio personal de venta de productos* tracking stock, sales, margins, and real-time net profit), without naming internal store brands.
2. **Never expose private network endpoints or personal micro-apps:** Do NOT publish private mesh URLs, internal LAN IP addresses, internal port numbers, or private non-portfolio micro-apps.
3. **Public contact & CV:** Expose `albvizpon@gmail.com`, `https://github.com/Alberviz`, `https://www.linkedin.com/in/alberto-vizca%C3%ADno-ponte`, and verbatim downloadable CV `/cv/Alberto_Vizcaino_Ponte_CV.pdf`.
4. **Zero AI-slop copy & zero em-dashes:** The characters `—` (em-dash) and `–` (en-dash) are strictly banned across every string, caption, and comment. Use standard ASCII `-` only.

## Evidence on Hand

- Real MP4 videos and high-DPI WebP captures in `public/media/` (`krakount`, `mycrohnie`, `systems`, `closhare`, `aurora`) mapped with exact pixel dimensions in `src/content/assets.ts`.
- Verified bilingual copy in `src/content/portfolio-data.ts` and `src/content/krakount-data.ts`.
- Live public demos (`https://krakount.vercel.app`, `https://mycrohnie.vercel.app`, `https://closhare-indol.vercel.app`, `https://barber-bot-zeta.vercel.app`) and public GitHub repositories (`JoseoKings-Hackyeah`, `LinuxRicing`, `gts2-mando`, `competitiva`).

## Accessibility & Performance Floor

WCAG AA contrast minimum across all surfaces, `prefers-reduced-motion` respected on every animation, hover animations gated behind `@media (hover: hover) and (pointer: fine)`, `min-h-[100dvh]` viewport stability, `tabular-nums` on all numeric/financial figures, CLS < 0.05, LCP < 2.0s.
