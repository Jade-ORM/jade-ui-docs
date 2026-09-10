import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import type { Request, Response } from "express";
import type { PublicUser, SessionUser } from "./types.js";

export const SESSION_COOKIE = "jade_session";
export const STATE_COOKIE = "jade_oauth_state";
const SESSION_TTL_SEC = 60 * 60 * 24 * 7;
const STATE_TTL_SEC = 600;

interface SessionPayload extends SessionUser {
  exp: number;
}

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

function cookieOpts(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure:
      process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL),
    maxAge: maxAge * 1000,
    path: "/",
  };
}

export function setSessionCookie(res: Response, token: string): void {
  res.cookie(SESSION_COOKIE, token, cookieOpts(SESSION_TTL_SEC));
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
}

export function createOAuthState(): string {
  return randomBytes(16).toString("base64url");
}

export function setOAuthStateCookie(res: Response, state: string): void {
  res.cookie(STATE_COOKIE, state, cookieOpts(STATE_TTL_SEC));
}

export function readOAuthState(req: Request): string | null {
  return req.cookies?.[STATE_COOKIE] ?? null;
}

export function clearOAuthStateCookie(res: Response): void {
  res.clearCookie(STATE_COOKIE, { path: "/" });
}

export function getSessionUser(req: Request): SessionUser | null {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
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

export function publicUser(user: SessionUser): PublicUser {
  return {
    githubId: user.githubId,
    login: user.login,
    name: user.name,
    avatarUrl: user.avatarUrl,
  };
}
