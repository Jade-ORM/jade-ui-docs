import type { IncomingMessage, ServerResponse } from "node:http";
import { appOrigin, errorJson, redirect } from "../_lib/http";
import {
  clearOAuthStateCookie,
  consumeOAuthState,
  createSessionToken,
  setSessionCookie,
} from "../_lib/session";

interface GitHubTokenResponse {
  access_token?: string;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
}

interface GitHubUserResponse {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (req.method !== "GET") {
    errorJson(res, 405, "J4001", "Method not allowed");
    return;
  }

  const origin = appOrigin(req);
  const url = new URL(req.url || "/", origin);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const oauthError = url.searchParams.get("error");

  if (oauthError) {
    redirect(
      res,
      `${origin}/plugins?auth_error=${encodeURIComponent(oauthError)}`,
    );
    return;
  }

  const expectedState = consumeOAuthState(req);
  if (!code || !state || !expectedState || state !== expectedState) {
    clearOAuthStateCookie(res);
    redirect(res, `${origin}/plugins?auth_error=invalid_state`);
    return;
  }
  clearOAuthStateCookie(res);

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    errorJson(
      res,
      503,
      "J5001",
      "GitHub OAuth is not configured on this deployment.",
    );
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
      redirect_uri: `${origin}/api/auth/callback`,
    }),
  });

  const tokenData = (await tokenRes.json()) as GitHubTokenResponse;
  if (!tokenData.access_token) {
    redirect(res, `${origin}/plugins?auth_error=token_exchange_failed`);
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
    redirect(res, `${origin}/plugins?auth_error=user_fetch_failed`);
    return;
  }
  const ghUser = (await userRes.json()) as GitHubUserResponse;

  const token = createSessionToken({
    githubId: ghUser.id,
    login: ghUser.login,
    name: ghUser.name,
    avatarUrl: ghUser.avatar_url,
    accessToken: tokenData.access_token,
  });
  setSessionCookie(res, token);
  redirect(res, `${origin}/plugins?auth=ok`);
}
