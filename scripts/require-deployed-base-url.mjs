const baseUrl = process.env.PLAYWRIGHT_BASE_URL?.trim();

if (!baseUrl) {
  console.error("Deployed evidence gate requires PLAYWRIGHT_BASE_URL (for example, https://preview.example.test/).");
  process.exit(1);
}

let parsed;
try {
  parsed = new URL(baseUrl);
} catch {
  console.error("PLAYWRIGHT_BASE_URL must be a valid absolute HTTP(S) URL.");
  process.exit(1);
}

if (!/^https?:$/.test(parsed.protocol)) {
  console.error("PLAYWRIGHT_BASE_URL must use HTTP or HTTPS.");
  process.exit(1);
}

console.log(`Deployed evidence target: ${parsed.origin}${parsed.pathname}`);
