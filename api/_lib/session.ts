import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

export interface SessionUser {
  githubId: number;
  login: string;
  name: string | null;
  avatarUrl: string;
  /** GitHub OAuth access token — encrypted in the cookie, never stored plaintext. */
  accessToken: string;
}

interface SessionPayload extends SessionUser {
  exp: number;
}

const COOKIE_NAME = "jade_session";
const STATE_COOKIE = "jade_oauth_state";
const SESSION_TTL_SEC = 60 * 60 * 24 * 7;
const STATE_TTL_SEC = 600;

function getSecret(): string {
  const secret = process.env.SESSION_SECRET || process.env.GITHUB_CLIENT_SECRET;
  if (!secret) {
    if (process.env.VERCEL) {
      throw new Error("SESSION_SECRET is required in production");
    }
    return "jade-local-dev-secret-do-not-use-in-prod";
  }
  return secret;
}

function key(): Buffer {
  return createHash("sha256").update(getSecret()).digest();
}

function encrypt(payload: SessionPayload): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const plaintext = Buffer.from(JSON.stringify(payload), "utf8");
  const enc = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

function decrypt(token: string): SessionPayload | null {
  try {
    const raw = Buffer.from(token, "base64url");
    if (raw.length < 29) return null;
    const iv = raw.subarray(0, 12);
    const tag = raw.subarray(12, 28);
    const data = raw.subarray(28);
    const decipher = createDecipheriv("aes-256-gcm", key(), iv);
    decipher.setAuthTag(tag);
    const dec = Buffer.concat([decipher.update(data), decipher.final()]);
    return JSON.parse(dec.toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }
}

export function createSessionToken(user: SessionUser): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SEC;
  return encrypt({ ...user, exp });
}

export function parseCookies(
  header: string | undefined,
): Record<string, string> {
  if (!header) return {};
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
}

export function getSession(req: IncomingMessage): SessionUser | null {
  const cookies = parseCookies(req.headers.cookie);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  const payload = decrypt(token);
  if (!payload) return null;
  if (payload.exp < Date.now() / 1000) return null;
  return {
    githubId: payload.githubId,
    login: payload.login,
    name: payload.name,
    avatarUrl: payload.avatarUrl,
    accessToken: payload.accessToken,
  };
}

function cookie(
  name: string,
  value: string,
  maxAge: number,
  httpOnly = true,
): string {
  const parts = [
    `${name}=${value}`,
    "Path=/",
    `Max-Age=${maxAge}`,
    "SameSite=Lax",
  ];
  if (httpOnly) parts.push("HttpOnly");
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function setSessionCookie(res: ServerResponse, token: string): void {
  res.setHeader("Set-Cookie", cookie(COOKIE_NAME, token, SESSION_TTL_SEC));
}

export function clearSessionCookie(res: ServerResponse): void {
  res.setHeader("Set-Cookie", cookie(COOKIE_NAME, "", 0));
}

export function createOAuthState(): string {
  return randomBytes(16).toString("base64url");
}

export function setOAuthStateCookie(res: ServerResponse, state: string): void {
  res.setHeader("Set-Cookie", cookie(STATE_COOKIE, state, STATE_TTL_SEC));
}

export function consumeOAuthState(req: IncomingMessage): string | null {
  const cookies = parseCookies(req.headers.cookie);
  return cookies[STATE_COOKIE] ?? null;
}

export function clearOAuthStateCookie(res: ServerResponse): void {
  res.setHeader("Set-Cookie", cookie(STATE_COOKIE, "", 0));
}

export function publicUser(user: SessionUser) {
  return {
    githubId: user.githubId,
    login: user.login,
    name: user.name,
    avatarUrl: user.avatarUrl,
  };
}
