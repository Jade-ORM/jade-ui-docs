# Jade Docs

Documentation website for [Jade ORM](https://github.com/AlehandroSV/Jade) - a modern Lua ORM for PostgreSQL, MySQL, and SQLite.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- React Router v7
- React Syntax Highlighter

This SPA is **UI only**. Auth and community plugin listings are served by the separate **[plugin-api](../plugin-api)** service.

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Community plugins UI

`/plugins` shows:

- **Official** — static snapshot of `Jade-ORM/plugins` → `registry.json`
- **Community** — fetched from the plugin API

Backend lives in `../plugin-api` (GitHub OAuth, validation, KV). Start it on `:8787` and this app proxies `/api` to it.

```bash
# terminal 1
cd ../plugin-api && npm install && npm run dev

# terminal 2
npm run dev
```

Configure `VITE_PLUGIN_API_URL` if the API is not same-origin (see `.env.example`). OAuth callback must point at the **API** host (`http://localhost:8787/api/auth/callback` in dev).

#### Plugin contract

Community repos must ship `jade-plugin.json` at the root (`name`, `version`, `description`, `jade`, `main`, `repository`) plus a Lua module with `name`, `version`, `setup`.

## Deployment

Deployed to Vercel. Push to `main` to trigger automatic deployment. Set `VITE_PLUGIN_API_URL` if the plugin API is on another origin, and ensure CORS on the API allows this site.

## Structure

```
src/
├── components/
│   ├── home/          # Home page sections (Hero, Features, etc.)
│   ├── layout/        # Layout, Header, Footer
│   ├── plugins/       # Marketplace cards + submit modal
│   └── ui/            # Reusable UI components (CodeBlock, DocRenderer)
├── contexts/          # React contexts (Theme, Language, Auth)
├── data/              # Documentation content + official plugins snapshot
├── lib/               # HTTP client for the plugin API
├── pages/             # Page components (Home, Docs, API, Examples, Plugins)
└── index.css          # Tailwind imports + base styles
```

## Content

Documentation content is defined in `src/data/` as TypeScript data files:

- `docs.ts` - All documentation sections
- `api.ts` - API reference (methods, operators)
- `examples.ts` - Code examples
- `navigation.ts` - Sidebar and navigation structure
- `official-plugins.ts` - Official plugin registry snapshot

To add or update documentation, edit the corresponding data file.
