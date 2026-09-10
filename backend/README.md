# Jade Docs Backend

API do portal de plugins community (auth GitHub + listings).

## Rotas

| Method | Path                        | Auth    | Descrição                                        |
| ------ | --------------------------- | ------- | ------------------------------------------------ |
| GET    | `/api/health`               | —       | Health check                                     |
| GET    | `/api/auth/login`           | —       | Redireciona para GitHub OAuth                    |
| GET    | `/api/auth/callback`        | —       | Callback OAuth → cookie de sessão → front        |
| GET    | `/api/auth/me`              | cookie  | Usuário atual                                    |
| POST   | `/api/auth/logout`          | cookie  | Limpa sessão                                     |
| GET    | `/api/plugins`              | —       | Lista community                                  |
| POST   | `/api/plugins`              | session | Publica/atualiza listing a partir da URL do repo |
| GET    | `/api/plugins/:owner/:repo` | —       | Um listing                                       |
| PATCH  | `/api/plugins/:owner/:repo` | owner   | Re-fetch `jade-plugin.json`                      |
| DELETE | `/api/plugins/:owner/:repo` | owner   | Remove listing                                   |

## Rodar local

```bash
cd backend
npm install
cp .env.example .env   # preencha GitHub OAuth
npm run dev            # http://localhost:8787
```

O front (Vite em :5173) faz proxy de `/api` → `:8787` (ver `vite.config.ts`).

## Env

| Variável                                | Obrigatória | Descrição                                            |
| --------------------------------------- | ----------- | ---------------------------------------------------- |
| `GITHUB_CLIENT_ID`                      | sim         | OAuth App                                            |
| `GITHUB_CLIENT_SECRET`                  | sim         | OAuth App                                            |
| `SESSION_SECRET`                        | sim em prod | Criptografa o cookie                                 |
| `PORT`                                  | não         | default `8787`                                       |
| `PUBLIC_SITE_URL` / `FRONTEND_URL`      | não         | Redirect pós-login (default `http://localhost:5173`) |
| `API_ORIGIN`                            | não         | Origin pública da API (redirect_uri OAuth)           |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` | em prod     | Upstash / Vercel KV                                  |

Callback do OAuth App: `http://localhost:8787/api/auth/callback` (dev) e `https://<dominio>/api/auth/callback` (prod).

## Persistência

- Com KV: Redis via REST (`jade:plugins:community`)
- Sem KV: `backend/.data/community-plugins.json` (apenas demo local)
