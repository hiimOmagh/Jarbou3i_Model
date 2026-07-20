import { spawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";

const root = process.cwd();
const host = "127.0.0.1";
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL?.trim();
const playwrightCli = path.join(
  root,
  "node_modules",
  "@playwright",
  "test",
  "cli.js",
);

if (!fs.existsSync(playwrightCli)) {
  console.error("Playwright is not installed. Run npm ci before browser tests.");
  process.exit(1);
}

function childExit(child) {
  return new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", (code, signal) => resolve({ code, signal }));
  });
}

async function availablePort() {
  const probe = net.createServer();
  await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, host, resolve);
  });
  const address = probe.address();
  const port = typeof address === "object" && address ? address.port : 0;
  await new Promise((resolve, reject) =>
    probe.close((error) => error ? reject(error) : resolve()),
  );
  if (!port) throw new Error("Could not allocate a local browser-test port.");
  return port;
}

async function waitForServer(url, server) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Local test server exited before becoming ready (${server.exitCode}).`);
    }
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for the local test server at ${url}.`);
}

async function stopServer(server) {
  if (!server || server.exitCode !== null || server.signalCode) return;
  const exited = childExit(server);
  server.kill("SIGTERM");
  const graceful = await Promise.race([
    exited.then(() => true),
    new Promise((resolve) => setTimeout(() => resolve(false), 2_000)),
  ]);
  if (!graceful && server.exitCode === null) {
    server.kill("SIGKILL");
    await Promise.race([
      exited,
      new Promise((resolve) => setTimeout(resolve, 1_000)),
    ]).catch(() => {});
  }
}

let server = null;
let testProcess = null;

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => {
    testProcess?.kill(signal);
    server?.kill("SIGTERM");
    process.exitCode = signal === "SIGINT" ? 130 : 143;
  });
}

try {
  let baseURL = externalBaseURL;
  if (!baseURL) {
    const port = await availablePort();
    baseURL = `http://${host}:${port}`;
    server = spawn(process.execPath, ["scripts/static-server.mjs"], {
      cwd: root,
      env: { ...process.env, HOST: host, PORT: String(port) },
      stdio: ["ignore", "inherit", "inherit"],
      windowsHide: true,
    });
    await waitForServer(baseURL, server);
  }

  const environment = externalBaseURL
    ? { ...process.env }
    : { ...process.env, PLAYWRIGHT_MANAGED_BASE_URL: baseURL };
  testProcess = spawn(
    process.execPath,
    [playwrightCli, "test", ...process.argv.slice(2)],
    {
      cwd: root,
      env: environment,
      stdio: "inherit",
      windowsHide: true,
    },
  );
  const result = await childExit(testProcess);
  process.exitCode = result.code ?? (result.signal ? 1 : 0);
} catch (error) {
  console.error(`Managed Playwright run failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await stopServer(server);
}
