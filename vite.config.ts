import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { readFileSync } from "node:fs";

// Legge la versione corrente da public/version.json (generato da
// scripts/generate-version.mjs in fase di prebuild). Questa stringa viene
// iniettata come __BUILD_VERSION__ nel bundle e confrontata a runtime con
// /version.json per rilevare nuovi deploy (vedi src/hooks/useVersionCheck.ts).
let buildVersion = String(Date.now());
try {
  const v = JSON.parse(
    readFileSync(path.resolve(__dirname, "public/version.json"), "utf8")
  );
  if (v?.version) buildVersion = String(v.version);
} catch {
  // version.json non ancora generato: fallback al timestamp corrente.
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    __BUILD_VERSION__: JSON.stringify(buildVersion),
  },
}));
