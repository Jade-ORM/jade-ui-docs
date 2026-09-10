# Jade Docs — self-host stack (Docker)

Single-PC bring-up for **docs SPA + community plugin API**.  
Prepared for coordination with **Coord deployment-docs** (`Jade-ORM/deployment-docs`, private).

## Stack (real)

| Service | Image/build                | Port (host)         | Role                                    |
| ------- | -------------------------- | ------------------- | --------------------------------------- |
| `front` | multi-stage Vite → nginx   | **8080**            | Docs site + reverse-proxy `/api` → back |
| `back`  | Node 20 + tsx Express      | **8787** (optional) | GitHub OAuth + community listings       |
| store   | named volume `plugin-data` | —                   | `.data/community-plugins.json`          |

**There is no PostgreSQL.** `plugin-api` persists to a local file volume or Upstash/Vercel KV (HTTP REST). A vanilla Redis/Postgres container is not a drop-in.

## Layout expected on the deploy PC

```
<parent>/
├── jade-ui-docs/     # this repo (contains deploy/)
└── plugin-api/       # https://github.com/Jade-ORM/plugin-api (private)
```

## Bring-up

```bash
cd jade-ui-docs/deploy
cp .env.example .env
# fill GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET / SESSION_SECRET
docker compose up -d --build
```

Open `http://localhost:8080`.

Health:

- front: `GET http://localhost:8080/healthz`
- back: `GET http://localhost:8787/api/health` or via front `GET http://localhost:8080/api/health`

## Required env

| Variable                                | Required    | Notes                                                                                     |
| --------------------------------------- | ----------- | ----------------------------------------------------------------------------------------- |
| `GITHUB_CLIENT_ID`                      | yes (login) | GitHub OAuth App                                                                          |
| `GITHUB_CLIENT_SECRET`                  | yes (login) |                                                                                           |
| `SESSION_SECRET`                        | yes (prod)  | `openssl rand -hex 32`                                                                    |
| `ALLOWED_ORIGINS`                       | yes         | Browser origin, e.g. `http://<host>:8080`                                                 |
| `FRONTEND_URL`                          | yes         | Post-login redirect                                                                       |
| `API_ORIGIN`                            | yes         | Public origin of the site (OAuth `redirect_uri` uses `/api/auth/callback` on this origin) |
| `FRONT_PORT` / `BACK_PORT`              | no          | defaults 8080 / 8787                                                                      |
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | no          | Optional; empty → file volume                                                             |
| `PLUGIN_API_CONTEXT`                    | no          | default `../../plugin-api`                                                                |

### GitHub OAuth App

1. Create OAuth App on the GitHub org/user that owns the portal.
2. **Authorization callback URL:** `http://localhost:8080/api/auth/callback` (or `https://<front-host>/api/auth/callback` in prod).
3. Scope requested by the app: `read:user`.

Same-origin `/api` is the supported path: nginx proxies to `back:8787`, so session cookies (`SameSite=Lax`) work without CORS.

## Data / seed

- Listings seed automatically as authors submit via the portal.
- Backup: Docker volume `jade-docs_plugin-data` (`/app/.data/community-plugins.json`).
- No SQL migrations.

```bash
docker compose exec back cat /app/.data/community-plugins.json
docker run --rm -v jade-docs_plugin-data:/data -v "$PWD":/backup alpine \
  tar czf /backup/plugin-data.tgz -C /data .
```

## What belongs where (for deployment-docs)

| Artefact                        | Source of truth                                   | Lives in                       |
| ------------------------------- | ------------------------------------------------- | ------------------------------ |
| Front Dockerfile + nginx        | this repo                                         | `jade-ui-docs/deploy/front/`   |
| Compose + .env.example + README | this repo (then copied/pinned in deployment-docs) | `jade-ui-docs/deploy/`         |
| Back Dockerfile                 | `plugin-api`                                      | `plugin-api/Dockerfile`        |
| Runtime secrets                 | deploy host only                                  | `deploy/.env` (gitignored)     |
| Org compose versioning          | **private** `Jade-ORM/deployment-docs`            | owned by Coord deployment-docs |

## Out of scope here

- Public exposure of `deployment-docs`
- TLS/reverse-proxy termination (put Caddy/Traefik/nginx in front of 8080 if needed)
- Postgres / SQL (not used by plugin-api)
