# jade-ui-docs — agent rules

## Branding

- **Never mention Prisma** (or any other ORM brand) in public-facing copy: docs content, SEO/meta, README, marketing, home/features, issue templates aimed at users.
- Prisma-style ideas are **internal product language only** (`ALINHAMENTO.md`, private design notes). They are not branding.
- Prefer neutral phrasing: “Data Mapper ORM for Lua”, “declarative schema”, “automatic migrations”, “fluent query builder”.

## Stack / scope

- SPA is docs + plugins UI only. No backend, auth, or OAuth server in this repo.
- Community plugin API lives in `Jade-ORM/plugin-api` (`VITE_PLUGIN_API_URL`).
- Site i18n (EN/PT) is UI-only. **Do not document runtime i18n as a Jade feature.**
- Official plugins: registry snapshot + live fetch from `Jade-ORM/plugins` `registry.json`.
