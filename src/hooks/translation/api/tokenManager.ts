
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const checkRemainingTokens = async (): Promise<number | null> => {
  try {
    // Ottieni il mese corrente
    const { data: currentMonth, error: monthError } = await supabase.rpc('get_current_month');
    if (monthError) {
      console.error('Error getting current month:', monthError);
      return null;
    }

    // Ottieni i dati completi dei token
    const { data: tokenData, error } = await supabase
      .from('translation_tokens')
      .select('tokens_used, tokens_limit, purchased_tokens_total, purchased_tokens_used')
      .eq('month', currentMonth)
      .single();
    
    if (error) {
      console.error('Error checking remaining tokens:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Errore durante la verifica dei token disponibili"
      });
      return null;
    }

    // Calcola token rimanenti mensili e acquistati
    const monthlyRemaining = Math.max(0, (tokenData?.tokens_limit || 300) - (tokenData?.tokens_used || 0));
    const purchasedRemaining = Math.max(0, (tokenData?.purchased_tokens_total || 0) - (tokenData?.purchased_tokens_used || 0));
    
    // Restituisci il totale
    const totalRemaining = monthlyRemaining + purchasedRemaining;
    
    console.log(`Token rimanenti: Mensili=${monthlyRemaining}, Acquistati=${purchasedRemaining}, Totale=${totalRemaining}`);
    
    return totalRemaining;
  } catch (error) {
    console.error('Error checking tokens:', error);
    return null;
  }
};
