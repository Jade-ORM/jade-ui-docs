import { Router } from "express";
import {
  clearOAuthStateCookie,
  clearSessionCookie,
  createOAuthState,
  createSessionToken,
  getSessionUser,
  publicUser,
  readOAuthState,
  setOAuthStateCookie,
  setSessionCookie,
} from "../lib/session.js";
import { apiOrigin, frontendOrigin } from "../lib/http.js";

export const authRouter = Router();

authRouter.get("/login", (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.status(503).json({
      error: {
        code: "J5001",
        message: "GitHub OAuth is not configured on this deployment.",
      },
    });
    return;
  }

  const origin = apiOrigin(req);
  const redirectUri = `${origin}/api/auth/callback`;
  const state = createOAuthState();
  setOAuthStateCookie(res, state);

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "read:user");
  url.searchParams.set("state", state);

  res.redirect(url.toString());
});

authRouter.get("/callback", async (req, res) => {
  const api = apiOrigin(req);
  const front = frontendOrigin();
  const code = typeof req.query.code === "string" ? req.query.code : null;
  const state = typeof req.query.state === "string" ? req.query.state : null;
  const oauthError =
    typeof req.query.error === "string" ? req.query.error : null;

  if (oauthError) {
    res.redirect(
      `${front}/plugins?auth_error=${encodeURIComponent(oauthError)}`,
    );
    return;
  }

  const expectedState = readOAuthState(req);
  if (!code || !state || !expectedState || state !== expectedState) {
    clearOAuthStateCookie(res);
    res.redirect(`${front}/plugins?auth_error=invalid_state`);
    return;
  }
  clearOAuthStateCookie(res);

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    res.status(503).json({
      error: {
        code: "J5001",
        message: "GitHub OAuth is not configured on this deployment.",
      },
    });
    return;
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${api}/api/auth/callback`,
    }),
  });

  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    error?: string;
  };
  if (!tokenData.access_token) {
    res.redirect(`${front}/plugins?auth_error=token_exchange_failed`);
    return;
  }

  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "jade-docs-plugin-portal",
    },
  });
  if (!userRes.ok) {
    res.redirect(`${front}/plugins?auth_error=user_fetch_failed`);
    return;
  }
  const ghUser = (await userRes.json()) as {
    id: number;
    login: string;
    name: string | null;
    avatar_url: string;
  };

  const token = createSessionToken({
    githubId: ghUser.id,
    login: ghUser.login,
    name: ghUser.name,
    avatarUrl: ghUser.avatar_url,
    accessToken: tokenData.access_token,
  });
  setSessionCookie(res, token);
  res.redirect(`${front}/plugins?auth=ok`);
});

authRouter.get("/me", (req, res) => {
  const session = getSessionUser(req);
  res.json({ user: session ? publicUser(session) : null });
});

authRouter.post("/logout", (_req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});
