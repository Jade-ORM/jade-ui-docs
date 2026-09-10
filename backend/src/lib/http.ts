import type { Request } from "express";

export function clientIp(req: Request): string {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) {
    return fwd.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

/** Public origin of the docs frontend (post-OAuth redirect target). */
export function frontendOrigin(): string {
  const explicit =
    process.env.PUBLIC_SITE_URL ||
    process.env.FRONTEND_URL ||
    process.env.AUTH_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  return "http://localhost:5173";
}

/** Public origin of this API (OAuth redirect_uri base). */
export function apiOrigin(req: Request): string {
  const explicit = process.env.API_ORIGIN;
  if (explicit) return explicit.replace(/\/$/, "");
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto =
    (typeof req.headers["x-forwarded-proto"] === "string"
      ? req.headers["x-forwarded-proto"]
      : null) || (process.env.NODE_ENV === "production" ? "https" : "http");
  if (!host) return `http://localhost:${process.env.PORT || 8787}`;
  return `${proto}://${host}`;
}
