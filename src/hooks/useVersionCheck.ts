/**
 * useVersionCheck
 * --------------------------------------------------------------------------
 * Rileva nuovi deploy a runtime confrontando la versione iniettata nel bundle
 * (`__BUILD_VERSION__`, definita in vite.config.ts a partire da
 * public/version.json generato da scripts/generate-version.mjs) con quella
 * remota servita su /version.json.
 *
 * Trigger del controllo:
 *   - una volta al mount (dopo 3s, per non rallentare il first paint)
 *   - quando il documento torna `visible` (utente ritorna sul tab)
 *   - quando la connessione torna `online`
 *   - in polling ogni 5 minuti
 *
 * Il fetch usa `cache: "no-store"` + query string timestamp per evitare che
 * proxy/browser servano una version.json stantia. Errori di rete sono
 * silenziati (utente offline).
 */
import { useEffect, useRef, useState, useCallback } from "react";

declare const __BUILD_VERSION__: string;

const LOCAL_VERSION: string =
  typeof __BUILD_VERSION__ !== "undefined" ? __BUILD_VERSION__ : "dev";

const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minuti
const INITIAL_DELAY_MS = 3000;

export interface UseVersionCheckResult {
  updateAvailable: boolean;
  remoteVersion: string | null;
  localVersion: string;
  reload: () => void;
}

export const useVersionCheck = (): UseVersionCheckResult => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [remoteVersion, setRemoteVersion] = useState<string | null>(null);
  const stoppedRef = useRef(false);

  const checkVersion = useCallback(async () => {
    if (stoppedRef.current) return;
    try {
      const res = await fetch(`/version.json?t=${Date.now()}`, {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (!res.ok) return;
      const data = (await res.json()) as { version?: string };
      if (!data?.version) return;
      setRemoteVersion(data.version);
      if (data.version !== LOCAL_VERSION && LOCAL_VERSION !== "dev") {
        setUpdateAvailable(true);
        stoppedRef.current = true; // smetti di fare polling: l'utente deve ricaricare
      }
    } catch {
      // offline o errore di rete: ignora
    }
  }, []);

  useEffect(() => {
    // Disabilitato in dev e dentro l'iframe di preview Lovable per evitare
    // falsi positivi durante l'editing.
    if (import.meta.env.DEV) return;

    const initialTimer = window.setTimeout(checkVersion, INITIAL_DELAY_MS);
    const interval = window.setInterval(checkVersion, POLL_INTERVAL_MS);

    const onVisibility = () => {
      if (document.visibilityState === "visible") checkVersion();
    };
    const onOnline = () => checkVersion();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("online", onOnline);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("online", onOnline);
    };
  }, [checkVersion]);

  const reload = useCallback(() => {
    window.location.reload();
  }, []);

  return { updateAvailable, remoteVersion, localVersion: LOCAL_VERSION, reload };
};