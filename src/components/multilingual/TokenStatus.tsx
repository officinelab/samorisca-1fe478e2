
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

  const percentage = (tokenUsage.tokensRemaining / tokenUsage.tokensLimit) * 100;

  return (
    <div className="w-64">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">Token rimanenti:</span>
        <span className="text-sm font-medium">{tokenUsage.tokensRemaining} / {tokenUsage.tokensLimit}</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};
