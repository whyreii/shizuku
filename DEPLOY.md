# Deploying

Shizuku is a static single-page app: no backend, no accounts, no environment
variables. `npm run build` writes everything that needs to be served into `dist/`.

```
npm ci
npm run build      # tsc -b && vite build  ->  dist/
```

Serve `dist/` as-is. The app keeps its whole save in `localStorage`, so a host
with no persistence beyond static files is enough. There is no client-side
router, so no rewrite/fallback rule is needed.

## Verified build

`npx vite preview --port 4173` was loaded after a production build: the app
renders, the roster and image map load from `dist/`, fonts resolve, and the
empty album shows the card-back drawing. `dist/` is roughly 1.1 MB, most of it
`roster-extra.json`.

## Options

| Host | How | Notes |
|---|---|---|
| **Netlify** (drag and drop) | open app.netlify.com/drop, drop `dist/` | fastest; gives a URL immediately |
| **Vercel** | `npx vercel --prod` in the repo | detects Vite; build command and output dir are already correct |
| **GitHub Pages** | push `dist/` to a `gh-pages` branch and enable Pages | works, but Pages on a **private** repo needs a paid plan; the repo is private today |
| **Any static host** | upload `dist/` over SFTP/S3/nginx | no config beyond serving `index.html` at `/` |

## After the first deploy

- Re-check the album count against the old local save — the saves are per-origin,
  so a new host starts empty. Export from **Settings → export save** on the old
  origin and import it on the new one.
- The roster is fetched from `/roster-extra.json` and `/roster-images.json` at
  boot. If the host rewrites or blocks those paths the pool silently falls back
  to the 1,000 hand-ranked cards; check that the album shows more than 1,000
  possible entries after import.
