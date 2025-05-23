
import { useTokenManager } from "@/hooks/useTokenManager";
import { Progress } from "@/components/ui/progress";

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
  const purchasedRemaining = Math.max(0, (tokenUsage.purchasedTokensTotal || 0) - (tokenUsage.purchasedTokensUsed || 0));
  const totalRemaining = monthlyRemaining + purchasedRemaining;
  const totalLimit = tokenUsage.tokensLimit + (tokenUsage.purchasedTokensTotal || 0);
  const percentage = totalLimit > 0 ? (totalRemaining / totalLimit) * 100 : 0;

  return (
    <div className="w-64">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">Token rimanenti:</span>
        <span className="text-sm font-medium">{totalRemaining} / {totalLimit}</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="flex justify-between text-xs mt-1">
        <span>Mensili: {monthlyRemaining}</span>
        <span>Acquistati: {purchasedRemaining}</span>
      </div>
    </div>
  );
};
