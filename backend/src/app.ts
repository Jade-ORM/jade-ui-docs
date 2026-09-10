import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.js";
import { pluginsRouter } from "./routes/plugins.js";
import { frontendOrigin } from "./lib/http.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: [
        frontendOrigin(),
        "http://localhost:5173",
        "http://127.0.0.1:5173",
      ],
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "32kb" }));
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "jade-docs-api" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/plugins", pluginsRouter);

  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      console.error(err);
      res.status(500).json({
        error: { code: "J5000", message: "Internal server error." },
      });
    },
  );

  return app;
}

const app = createApp();
export default app;
