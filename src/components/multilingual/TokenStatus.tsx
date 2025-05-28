
import { useTokenManager } from "@/hooks/useTokenManager";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { getNextMonthFirstDay, formatDateInItalian } from "@/utils/dateUtils";

export const TokenStatus = () => {
  const { tokenUsage, isLoading, error } = useTokenManager();

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Caricamento token...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">Errore: {error}</div>;
  }

  if (!tokenUsage) {
    return <div className="text-sm text-muted-foreground">Informazioni sui token non disponibili</div>;
  }

  // Calcola token rimanenti: mensili + acquistati rimanenti
  const monthlyRemaining = Math.max(0, tokenUsage.tokensLimit - (tokenUsage.tokensUsed || 0));
  const purchasedRemaining = Math.max(0, (tokenUsage.purchasedTokensTotal ?? 0) - (tokenUsage.purchasedTokensUsed ?? 0));
  const totalRemaining = monthlyRemaining + purchasedRemaining;
  const totalLimit = tokenUsage.tokensLimit + (tokenUsage.purchasedTokensTotal ?? 0);
  const percentage = totalLimit > 0 ? (totalRemaining / totalLimit) * 100 : 0;

  // Calcola la data di rinnovo
  const nextRenewalDate = getNextMonthFirstDay();
  const formattedRenewalDate = formatDateInItalian(nextRenewalDate);

  return (
    <TooltipProvider>
      <div className="w-64">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Token rimanenti:</span>
          <span className="text-sm font-medium">{totalRemaining} / {totalLimit}</span>
        </div>
        <Progress value={percentage} className="h-2" />
        <div className="flex justify-between text-xs mt-1">
          <div className="flex items-center gap-1">
            <span>Mensili: {monthlyRemaining}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3 h-3 text-muted-foreground hover:text-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="text-center">
                  <div className="font-medium">Rinnovo automatico</div>
                  <div className="text-xs mt-1">
                    I tuoi token si rinnoveranno il {formattedRenewalDate}
                  </div>
                  <div className="text-xs">
                    Riceverai {tokenUsage.tokensLimit} token gratuiti
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <span>Acquistati: {purchasedRemaining}</span>
        </div>
      </div>
    </TooltipProvider>
  );
};
