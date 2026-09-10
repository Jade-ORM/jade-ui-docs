# Jade Docs

Documentation website for [Jade ORM](https://github.com/AlehandroSV/Jade) - a modern Lua ORM for PostgreSQL, MySQL, and SQLite.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- React Router v7
- React Syntax Highlighter
- Vercel Serverless Functions (`api/`) for GitHub OAuth + community plugin listings

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

### Community plugins (auth + API)

The `/plugins` marketplace lists:

- **Official** — static snapshot of `Jade-ORM/plugins` → `registry.json`
- **Community** — self-published listings (GitHub login + repo URL)

API routes live in `api/` and run on Vercel. For full local auth/publish flow:

```bash
npm i -g vercel
vercel dev
```

Vite (`npm run dev`) still serves the UI; API calls need `vercel dev` (or a deployed preview).

#### Environment

Copy `.env.example` and set:

| Variable                                    | Purpose                   |
| ------------------------------------------- | ------------------------- |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth App          |
| `SESSION_SECRET`                            | Encrypts session cookies  |
| `PUBLIC_SITE_URL`                           | Optional canonical origin |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN`     | Vercel KV / Upstash Redis |

OAuth App callback URL: `https://<domain>/api/auth/callback`  
Scope requested: `read:user`.

Without KV credentials, listings are stored in `api/.data/community-plugins.json` (local demo only).

#### Plugin contract

Community repos must ship `jade-plugin.json` at the root (`name`, `version`, `description`, `jade`, `main`, `repository`) plus a Lua module with `name`, `version`, `setup`.

## Deployment

This project is deployed to Vercel. Push to `main` to trigger automatic deployment.

## Structure

```
api/                   # Vercel serverless functions (OAuth + plugins API)
src/
├── components/
│   ├── home/          # Home page sections (Hero, Features, etc.)
│   ├── layout/        # Layout, Header, Footer
│   ├── plugins/       # Marketplace cards + submit modal
│   └── ui/            # Reusable UI components (CodeBlock, DocRenderer)
├── contexts/          # React contexts (Theme, Language, Auth)
├── data/              # Documentation content + official plugins snapshot
├── lib/               # Client API helpers
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
