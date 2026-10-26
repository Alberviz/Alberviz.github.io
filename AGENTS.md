# AGENTS.md - Portfolio & Krakount Showcase

Read `CLAUDE.md`, `PRODUCT.md`, and `DESIGN.md` before modifying any UI, copy, or configuration.

## Quick Architecture
- `src/content/portfolio-data.ts`: Bilingual (`en` / `es`) source of truth for `/`.
- `src/content/krakount-data.ts`: Bilingual (`en` / `es`) source of truth and receipt/debt simulator items for `/krakount`.
- `src/content/assets.ts`: Optimized WebP/MP4/SVG assets and verified pixel dimensions.
- `src/components/portfolio/*`: Root portfolio surface (`Obsidian + Emerald` theme).
- `src/components/krakount/*`: Krakount product showcase surface (`Kazimierz de noche` `#0E0F13` + `#F5A524` theme).

## Hard Rules
- Static export (`output: "export"`): `pnpm build` must always generate `./out` cleanly.
- Zero em-dashes (`—`) or en-dashes (`–`) anywhere in UI copy or metadata.
- Describe the Supabase -> Ghostfolio business sync strictly as a personal product-selling business (stock, sales, margins, and real-time profit) without naming internal store brands.
- Never publish private mesh URLs, internal IP addresses, or unlisted personal micro-apps.
