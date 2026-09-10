import type { IncomingMessage, ServerResponse } from "node:http";
import { appOrigin, errorJson, redirect } from "../_lib/http";
import { createOAuthState, setOAuthStateCookie } from "../_lib/session";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET") {
    errorJson(res, 405, "J4001", "Method not allowed");
    return;
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    errorJson(
      res,
      503,
      "J5001",
      "GitHub OAuth is not configured on this deployment.",
    );
    return;
  }

  const origin = appOrigin(req);
  const redirectUri = `${origin}/api/auth/callback`;
  const state = createOAuthState();
  setOAuthStateCookie(res, state);

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "read:user");
  url.searchParams.set("state", state);

  redirect(res, url.toString());
}
