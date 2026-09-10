import type { IncomingMessage, ServerResponse } from "node:http";

export function json(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export function errorJson(
  res: ServerResponse,
  status: number,
  code: string,
  message: string,
): void {
  json(res, status, { error: { code, message } });
}

export function redirect(res: ServerResponse, location: string): void {
  res.statusCode = 302;
  res.setHeader("Location", location);
  res.end();
}

export function noContent(res: ServerResponse): void {
  res.statusCode = 204;
  res.end();
}

export async function readJsonBody<T>(req: IncomingMessage): Promise<T | null> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) return null;
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as T;
  } catch {
    return null;
  }
}

export function clientIp(req: IncomingMessage): string {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) {
    return fwd.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

export function appOrigin(req: IncomingMessage): string {
  const explicit = process.env.PUBLIC_SITE_URL || process.env.AUTH_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto =
    (typeof req.headers["x-forwarded-proto"] === "string"
      ? req.headers["x-forwarded-proto"]
      : "https") || "https";
  if (!host) return "http://localhost:5173";
  return `${proto}://${host}`;
}

export function onlyGet(req: IncomingMessage, res: ServerResponse): boolean {
  if (req.method !== "GET") {
    errorJson(res, 405, "J4001", "Method not allowed");
    return false;
  }
  return true;
}
