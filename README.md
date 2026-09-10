# Jade Docs

Documentation website for [Jade ORM](https://github.com/AlehandroSV/Jade) - a modern Lua ORM for PostgreSQL, MySQL, and SQLite.

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS v4
- React Router v7
- React Syntax Highlighter
- **Backend** (`backend/`) — Express API: GitHub OAuth + community plugin listings
- Vercel catch-all (`api/[[...path]].ts`) mounts the same Express app in production

## Development

```bash
# Install dependencies (root + backend)
npm install
npm --prefix backend install

# Terminal 1 — API (http://localhost:8787)
npm run dev:api

# Terminal 2 — frontend (http://localhost:5173, proxies /api → :8787)
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

Login and listings are handled by the **backend** (`backend/`). See [backend/README.md](backend/README.md) for routes and env vars.

#### Environment

Copy `backend/.env.example` (and/or root `.env.example`) and set:

| Variable                                    | Purpose                                 |
| ------------------------------------------- | --------------------------------------- |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth App                        |
| `SESSION_SECRET`                            | Encrypts session cookies                |
| `PUBLIC_SITE_URL`                           | Frontend origin for post-login redirect |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN`     | Vercel KV / Upstash Redis               |

OAuth App callback URL:

- **Dev (via Vite proxy):** `http://localhost:5173/api/auth/callback`
- **Prod:** `https://<domain>/api/auth/callback`

Scope requested: `read:user`.

Without KV credentials, listings are stored in `backend/.data/community-plugins.json` (local demo only).

#### Plugin contract

Community repos must ship `jade-plugin.json` at the root (`name`, `version`, `description`, `jade`, `main`, `repository`) plus a Lua module with `name`, `version`, `setup`.

## Deployment

This project is deployed to Vercel. Push to `main` to trigger automatic deployment. Set the env vars above in the Vercel project.

## Structure

```
api/                   # Vercel adapter (mounts backend Express app)
backend/               # Express API (auth GitHub + plugins)
├── src/
│   ├── app.ts         # Express app
│   ├── index.ts       # Local server entry
│   ├── lib/           # session, store, github, http
│   └── routes/        # auth, plugins
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
