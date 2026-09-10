import app from "./app.js";

const port = Number(process.env.PORT || 8787);

app.listen(port, () => {
  console.log(`[jade-docs-api] listening on http://localhost:${port}`);
  console.log(`[jade-docs-api] health:  http://localhost:${port}/api/health`);
});
