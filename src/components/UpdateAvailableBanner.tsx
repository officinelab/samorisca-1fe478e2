/**
 * Banner non invasivo mostrato quando useVersionCheck rileva una nuova
 * versione del bundle pubblicata (mismatch fra __BUILD_VERSION__ e
 * /version.json). Si trova in basso, sopra la safe area iOS.
 */
import { useVersionCheckContext } from "@/contexts/VersionCheckContext";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export const UpdateAvailableBanner = () => {
  const { updateAvailable, reload } = useVersionCheckContext();

  if (!updateAvailable) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[100] flex justify-center px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 pointer-events-none"
    >
      <div className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-lg border border-border bg-card text-card-foreground shadow-lg px-4 py-3">
        <RefreshCw className="h-4 w-4 shrink-0 text-primary" aria-hidden />
        <p className="flex-1 text-sm leading-snug">
          È disponibile una nuova versione del menu. Aggiorna la pagina.
        </p>
        <Button size="sm" onClick={reload}>
          Aggiorna
        </Button>
      </div>
    </div>
  );
};