import type { IncomingMessage, ServerResponse } from "node:http";
import { errorJson, json } from "../_lib/http";
import { clearSessionCookie } from "../_lib/session";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    errorJson(res, 405, "J4001", "Method not allowed");
    return;
  }
  clearSessionCookie(res);
  json(res, 200, { ok: true });
}
