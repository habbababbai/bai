# bai

Single-page portfolio website built with React, TypeScript, and Vite.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- Motion (`motion/react`)
- Bun (scripts + package manager)

## Development

```bash
bun install
bun run dev
```

App runs locally with Vite at `http://localhost:5173`.

## Scripts

```bash
bun run dev       # start dev server
bun run build     # typecheck + production build
bun run preview   # preview dist locally
bun run lint      # run ESLint
```

## Content source

Most public copy (name, about text, links, email) is managed in:

- `src/content/site.ts`
