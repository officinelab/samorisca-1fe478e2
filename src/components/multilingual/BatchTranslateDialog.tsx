import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertTriangle } from "lucide-react";

export type BatchPhase = "confirm" | "running" | "done";

export interface BatchProgress {
  done: number;
  ok: number;
  skipped: number;
  failed: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phase: BatchPhase;
  totalJobs: number;
  tokensRemaining: number | null;
  progress: BatchProgress;
  label?: string;
  onConfirm: () => void;
  onAbort: () => void;
  onClose: () => void;
}

export const BatchTranslateDialog = ({
  open,
  onOpenChange,
  phase,
  totalJobs,
  tokensRemaining,
  progress,
  label = "campi",
  onConfirm,
  onAbort,
  onClose,
}: Props) => {
  const estimatedTokens = totalJobs;
  const insufficientTokens =
    tokensRemaining !== null && estimatedTokens > tokensRemaining;
  const percent =
    totalJobs > 0 ? Math.round((progress.done / totalJobs) * 100) : 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        // Impedisci chiusura accidentale durante il running
        if (phase === "running") return;
        onOpenChange(o);
      }}
    >
      <DialogContent className="sm:max-w-md">
        {phase === "confirm" && (
          <>
            <DialogHeader>
              <DialogTitle>Traduci tutto</DialogTitle>
              <DialogDescription>
                Stai per tradurre automaticamente tutti i {label} elencati.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{label} da tradurre</span>
                <span className="font-medium">{totalJobs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Token stimati</span>
                <span className="font-medium">≈ {estimatedTokens}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Token disponibili</span>
                <span className="font-medium">
                  {tokensRemaining === null ? "—" : tokensRemaining}
                </span>
              </div>
              {insufficientTokens && (
                <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-2 text-destructive">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>
                    Token insufficienti per completare l'operazione. Acquista
                    altri token o riduci il numero di voci.
                  </span>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Annulla
              </Button>
              <Button
                onClick={onConfirm}
                disabled={insufficientTokens || totalJobs === 0}
              >
                Conferma e traduci
              </Button>
            </DialogFooter>
          </>
        )}

        {phase === "running" && (
          <>
            <DialogHeader>
              <DialogTitle>Traduzione in corso</DialogTitle>
              <DialogDescription>
                Attendi il completamento. Puoi interrompere in qualsiasi momento.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <Progress value={percent} />
              <div className="flex justify-between text-sm">
                <span>
                  {progress.done} di {totalJobs} ({percent}%)
                </span>
                <span className="text-muted-foreground">
                  ok {progress.ok} · saltati {progress.skipped} · falliti{" "}
                  {progress.failed}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onAbort}>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Interrompi
              </Button>
            </DialogFooter>
          </>
        )}

        {phase === "done" && (
          <>
            <DialogHeader>
              <DialogTitle>Traduzione completata</DialogTitle>
              <DialogDescription>
                Riepilogo dell'operazione.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 py-2 text-sm">
              <Progress value={percent} />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tradotti</span>
                <span className="font-medium">{progress.ok}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saltati</span>
                <span className="font-medium">{progress.skipped}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Falliti</span>
                <span className="font-medium">{progress.failed}</span>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={onClose}>Chiudi</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};