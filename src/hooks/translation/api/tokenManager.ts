
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

/**
 * Restituisce la somma di token disponibili (mensili + acquistati) come numero intero.
 * Se non disponibili, ritorna null.
 */
export const checkRemainingTokens = async (): Promise<number | null> => {
  try {
    // Prende il mese corrente
    const { data: monthData, error: monthError } = await supabase
      .rpc('get_current_month');
    if (monthError || !monthData) {
      console.error('Errore recupero mese corrente:', monthError);
      return null;
    }

    // Prende il record dei token del mese
    const { data: tokensData, error: tokensError } = await supabase
      .from('translation_tokens')
      .select('*')
      .eq('month', monthData)
      .maybeSingle();

    if (tokensError) {
      console.error('Errore recupero dati token:', tokensError);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Errore durante la verifica dei token disponibili"
      });
      return null;
    }

    if (!tokensData) {
      // Nessun record trovato → default 300 token mensili disponibili
      return 300;
    }

    // Calcola token disponibili
    const monthlyRemaining = Math.max(0, (tokensData.tokens_limit ?? 300) - (tokensData.tokens_used ?? 0));
    const purchasedRemaining = Math.max(0, (tokensData.purchased_tokens_total ?? 0) - (tokensData.purchased_tokens_used ?? 0));
    const totalRemaining = monthlyRemaining + purchasedRemaining;
    return totalRemaining;
  } catch (error) {
    console.error('Error checking tokens:', error);
    return null;
  }
};
