import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const rootArgIndex = args.indexOf("--root");
const portArgIndex = args.indexOf("--port");
const root = rootArgIndex !== -1 ? args[rootArgIndex + 1] : ".";
const port = portArgIndex !== -1 ? Number(args[portArgIndex + 1]) : 5173;

const rootDir = path.resolve(projectRoot, root);

const contentTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
};

const server = http.createServer(async (req, res) => {
  try {
    const urlPath = req.url?.split("?")[0] ?? "/";
    const safePath = path.normalize(decodeURIComponent(urlPath)).replace(/^\/+/, "");
    const filePath = path.join(rootDir, safePath || "index.html");
    const resolvedPath = path.resolve(filePath);

    if (!resolvedPath.startsWith(rootDir)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    const data = await readFile(resolvedPath);
    const ext = path.extname(resolvedPath);
    res.writeHead(200, { "Content-Type": contentTypes[ext] || "application/octet-stream" });
    res.end(data);
  } catch (error) {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(port, () => {
  console.log(`Dev server running at http://localhost:${port}`);
});
