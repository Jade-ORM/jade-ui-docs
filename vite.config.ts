import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const apiTarget = process.env.VITE_API_PROXY || "http://localhost:8787";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Same-origin `/api` in dev so session cookies work without CORS.
      // The plugin-api service is a separate process (see ../plugin-api).
      "/api": {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
});
