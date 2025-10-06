// vite.ts
import { Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function startViteServer(app: Express) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res) => {
    try {
      const htmlPath = path.resolve(__dirname, "..", "src", "index.html");
      let html = await fs.promises.readFile(htmlPath, "utf-8");
      html = await vite.transformIndexHtml(req.originalUrl, html);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      console.error(e);
      res.status(500).end("Internal server error");
    }
  });
}
