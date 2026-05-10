/**
 * VersionCheckContext
 * Provider singleton attorno all'app: esegue un solo polling di /version.json
 * (vedi src/hooks/useVersionCheck.ts) e condivide il risultato sia con il
 * banner di aggiornamento sia con la logica di auto-reload del menu pubblico.
 */
import { createContext, useContext, ReactNode } from "react";
import { useVersionCheck, UseVersionCheckResult } from "@/hooks/useVersionCheck";

const VersionCheckContext = createContext<UseVersionCheckResult | null>(null);

export const VersionCheckProvider = ({ children }: { children: ReactNode }) => {
  const value = useVersionCheck();
  return (
    <VersionCheckContext.Provider value={value}>
      {children}
    </VersionCheckContext.Provider>
  );
};

export const useVersionCheckContext = (): UseVersionCheckResult => {
  const ctx = useContext(VersionCheckContext);
  if (!ctx) {
    return {
      updateAvailable: false,
      remoteVersion: null,
      localVersion: "dev",
      reload: () => window.location.reload(),
    };
  }
  return ctx;
};