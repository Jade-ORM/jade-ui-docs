/**
 * Vercel catch-all adapter — mounts the Express app from `backend/`.
 * Local dev uses `npm run dev:api` (port 8787) + Vite proxy for `/api`.
 */
import app from "../backend/src/app";

export default app;
