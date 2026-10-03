import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 4173);
const parentPid = process.ppid;
// Serve the production `/*` response headers so local and CI browser runs enforce the deployed CSP.
// COOP is omitted: under Playwright's Firefox driver it intermittently stalls page.reload() before "load".
const productionHeaders = Object.fromEntries(
  (await fs.readFile(path.join(root, "_headers"), "utf8"))
    .split(/\r?\n/)
    .filter((line) => /^\s+\S/.test(line) && !/^\s*Cross-Origin-Opener-Policy:/i.test(line))
    .map((line) => {
      const separator = line.indexOf(":");
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
    }),
);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webmanifest": "application/manifest+json; charset=utf-8",
};

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${host}:${port}`);
    const pathname = decodeURIComponent(url.pathname);
    const relative = pathname === "/" ? "index.html" : pathname.slice(1);
    const target = path.resolve(root, relative);
    if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    const body = await fs.readFile(target);
    response.writeHead(200, {
      ...productionHeaders,
      "content-type": types[path.extname(target).toLowerCase()] || "application/octet-stream",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    });
    response.end(body);
  } catch (error) {
    const status = error?.code === "ENOENT" ? 404 : 500;
    response.writeHead(status, { "content-type": "text/plain; charset=utf-8" });
    response.end(status === 404 ? "Not found" : "Server error");
  }
});

server.listen(port, host, () => {
  console.log(`Jarbou3i Model available at http://${host}:${port}`);
});

let closing = false;
function shutdown() {
  if (closing) return;
  closing = true;
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 1_500).unref();
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);

const parentWatch = setInterval(() => {
  try {
    process.kill(parentPid, 0);
  } catch {
    shutdown();
  }
}, 1_000);
parentWatch.unref();
