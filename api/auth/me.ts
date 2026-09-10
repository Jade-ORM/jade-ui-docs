import type { IncomingMessage, ServerResponse } from "node:http";
import { errorJson, json } from "../_lib/http";
import { getSession, publicUser } from "../_lib/session";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "GET") {
    errorJson(res, 405, "J4001", "Method not allowed");
    return;
  }
  const session = getSession(req);
  json(res, 200, { user: session ? publicUser(session) : null });
}
