# Faraaz's Blog

A personal Astro blog using the notebook-inspired
[Patrika](https://github.com/thelocalhoststudio/patrika) theme. It contains
the articles and media migrated from the previous blog.

See [AGENTS.md](AGENTS.md) for the full design philosophy and current
implementation reference.

## Features

- **Content collections** for essays, notes, and standalone pages, plus a
  config-as-content `siteConfig` collection.
- **Obsidian-flavored markdown** — wikilinks (`[[Page]]`, `[[Page#Heading]]`),
  image embeds, `%%comments%%`, `==highlights==`, and `:::aside`/`:::annotation`
  directives, powered by a native [Sätteri](https://www.npmjs.com/package/satteri)
  markdown pipeline (not remark/unified).
- **Backlinks** between notes, computed from wikilinks.
- **Inline image galleries** with a lightbox (GLightbox) for consecutive
  images in a post or note.
- **A generic browse system** (`/browse`) driven entirely by an optional
  `meta` object in frontmatter and a `browse` config block — no hardcoded
  metadata keys.
- **Search** via [Pagefind](https://pagefind.app)'s native Component UI.
- **RSS and sitemap** out of the box.

## Quickstart

```sh
npm install
npm run dev
```

The site is configured for `https://faraazahmad.github.io/blog` and deploys
from the `master` branch with GitHub Pages.

## Commands

| Command        | Action                                                                 |
| :------------- | :---------------------------------------------------------------------|
| `npm install`     | Install dependencies                                                  |
| `npm run dev`     | Start the dev server at `localhost:4321`                              |
| `npm run build`   | Build to `./dist/`, then build the Pagefind search index              |
| `npm run preview` | Preview the production build locally                                  |
| `npm run astro -- …` | Run any Astro CLI command (`astro check`, `astro add`, …)          |

## Customization

- **Fonts** — the `fonts` array in `astro.config.mjs`.
- **Colors and typography** — `src/styles/`.
- **Browse dimensions** (e.g. places, trips) — the `browse` key in
  `config.yaml`; each entry turns a `meta.<key>` frontmatter field into a
  browsable index at `/browse/<slug>`.

## Learn more

[Astro documentation](https://docs.astro.build)
