# personal-site

Single-page portfolio: dark, frosted “iOS materials” aesthetic (blur + depth, not glossy glass). Display name **bai**. Public contact is **GitHub**, **LinkedIn**, and **email** only — no job titles, employers, or address on the site.

## Stack

- **Bun** for installs and scripts (`bun.lock`).
- **Vite** + **React** + **TypeScript**.
- **Tailwind CSS** v4 (`@tailwindcss/vite`).
- **Motion** (`motion/react`) for entrance and scroll-linked animation; respect `prefers-reduced-motion` in components.
- Fonts: **Syne Variable** (display), **DM Sans Variable** (body) via `@fontsource-variable/*`.

## Commands

```bash
bun install
bun run dev      # Vite dev server
bun run build    # typecheck + production bundle to dist/
bun run preview  # local preview of dist/
bun run lint
```

## Where to edit content

- **`src/content/site.ts`** — display name, tagline, skill groups, links, and email. Keep this the single source of truth for copy that appears in the UI.

## Design reference

- Mood image: `design/portfolio-mood-dark-frosted-v1.png` (direction only; implementation uses CSS).

## Deployment notes

- Build output: **`dist/`**. Configure any static host (GitHub Pages, Cloudflare Pages, etc.) with build `bun run build` and publish `dist`. If the site is served from a subpath, set Vite `base` in `vite.config.ts`.
