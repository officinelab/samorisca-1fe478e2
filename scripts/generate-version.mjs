// Genera/aggiorna public/version.json a ogni build.
// Il file viene servito senza cache dall'hosting Lovable e usato dal frontend
// (src/hooks/useVersionCheck.ts) per rilevare nuovi deploy a runtime.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../public/version.json");

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const version = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(
  now.getUTCDate()
)}-${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(
  now.getUTCSeconds()
)}`;

const payload = {
  version,
  buildTime: now.toISOString(),
};

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, JSON.stringify(payload, null, 2) + "\n", "utf8");

console.log(`[generate-version] wrote ${outPath} -> ${version}`);