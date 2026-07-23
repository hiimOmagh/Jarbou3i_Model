import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const output = path.join(root, "build", "pages");
const files = [
  "index.html",
  "manifest.webmanifest",
  ".nojekyll",
  "assets/apple-touch-icon.png",
  "assets/favicon-32.png",
  "assets/jarbou3i-mascot-192.png",
  "assets/jarbou3i-mascot-512.png",
];
const directories = ["src"];

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const file of files) {
  const source = path.join(root, file);
  if (!fs.existsSync(source)) {
    throw new Error(`Deployment source is missing: ${file}`);
  }
  const destination = path.join(output, file);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

for (const directory of directories) {
  const source = path.join(root, directory);
  if (!fs.existsSync(source)) {
    throw new Error(`Deployment source directory is missing: ${directory}`);
  }
  fs.cpSync(source, path.join(output, directory), { recursive: true });
}

const forbidden = [".git", ".github", "docs", "node_modules", "tests"];
for (const name of forbidden) {
  if (fs.existsSync(path.join(output, name))) {
    throw new Error(`Forbidden deployment path was copied: ${name}`);
  }
}

console.log(`GitHub Pages artifact built at ${path.relative(root, output)}`);
