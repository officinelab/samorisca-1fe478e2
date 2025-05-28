
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export const checkRemainingTokens = async (): Promise<number | null> => {
  try {
    console.log('=== DEBUG: Inizio checkRemainingTokens ===');
    
    // FALLBACK: Se get_current_month non esiste, usa la data corrente
    let currentMonth: string;
    try {
      const { data: monthData, error: monthError } = await supabase.rpc('get_current_month');
      if (monthError) {
        console.warn('get_current_month failed, using fallback:', monthError);
        // Fallback: genera il mese corrente manualmente
        const now = new Date();
        currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      } else {
        currentMonth = monthData;
      }
    } catch (error) {
      console.warn('get_current_month not available, using fallback');
      const now = new Date();
      currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
    
    console.log('Current month:', currentMonth);

    // Ottieni i dati completi dei token
    const { data: tokenData, error } = await supabase
      .from('translation_tokens')
      .select('tokens_used, tokens_limit, purchased_tokens_total, purchased_tokens_used')
      .eq('month', currentMonth)
      .single();
    
    console.log('Token data query result:', { tokenData, error });
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking remaining tokens:', error);
      toast({
        variant: "destructive",
        title: "Errore",
        description: "Errore durante la verifica dei token disponibili"
      });
      // FALLBACK: usa la funzione originale
      console.log('Falling back to original get_remaining_tokens');
      const { data: fallbackData, error: fallbackError } = await supabase.rpc('get_remaining_tokens');
      return fallbackError ? null : fallbackData;
    }

    // Se non ci sono dati, usa valori di default
    const tokenInfo = tokenData || {
      tokens_used: 0,
      tokens_limit: 300,
      purchased_tokens_total: 0,
      purchased_tokens_used: 0
    };

    // Calcola token rimanenti mensili e acquistati
    const monthlyRemaining = Math.max(0, (tokenInfo.tokens_limit || 300) - (tokenInfo.tokens_used || 0));
    const purchasedRemaining = Math.max(0, (tokenInfo.purchased_tokens_total || 0) - (tokenInfo.purchased_tokens_used || 0));
    
    // Restituisci il totale
    const totalRemaining = monthlyRemaining + purchasedRemaining;
    
    console.log(`=== TOKEN CALCULATION ===`);
    console.log(`Mensili: ${monthlyRemaining} (limit: ${tokenInfo.tokens_limit}, used: ${tokenInfo.tokens_used})`);
    console.log(`Acquistati: ${purchasedRemaining} (total: ${tokenInfo.purchased_tokens_total}, used: ${tokenInfo.purchased_tokens_used})`);
    console.log(`Totale: ${totalRemaining}`);
    console.log('=== END DEBUG ===');
    
    return totalRemaining;
  } catch (error) {
    console.error('Critical error in checkRemainingTokens:', error);
    
    // FALLBACK COMPLETO: usa la funzione originale
    console.log('Using complete fallback to original function');
    try {
      const { data: fallbackData, error: fallbackError } = await supabase.rpc('get_remaining_tokens');
      if (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        return null;
      }
      console.log('Fallback successful, returning:', fallbackData);
      return fallbackData;
    } catch (fallbackError) {
      console.error('Complete fallback failed:', fallbackError);
      return null;
    }
  }
};
