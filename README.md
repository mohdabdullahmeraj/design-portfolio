# Mohd. Abdullah Meraj — design portfolio

Personal portfolio of a product & visual designer from New Delhi.
Built with Next.js 16 (App Router), React 19, plain JavaScript and plain CSS. No animation libraries; sounds are synthesised with the Web Audio API.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 (add `?intro` to replay the intro). Production build: `npx next build`.

## Where things live

- `content/site.js` — text, links, experience, brands, archive pieces
- `content/projects.js` — the featured case studies
- `components/` — page sections (hero, project rail, archive wall, contact chat, footer…)
- `app/globals.css` — all styles
- `scripts/` — image tools (lettering trace, archive builder, icons and share image)

## Settings

- `NEXT_PUBLIC_SITE_URL` — the public address (e.g. `https://example.com`), used for the sitemap and link previews. On Vercel the production URL is used automatically.
- `site.formspree` in `content/site.js` — Formspree form ID; when set, the contact form sends messages directly.
