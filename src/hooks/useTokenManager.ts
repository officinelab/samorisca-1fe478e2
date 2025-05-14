
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { TokenUsage } from '@/types/translation';

export const useTokenManager = () => {
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenUsage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: remaining, error: remainingError } = await supabase
        .rpc('get_remaining_tokens');
      
      if (remainingError) {
        throw new Error(`Errore nel recupero dei token rimanenti: ${remainingError.message}`);
      }

      const { data: monthData, error: monthError } = await supabase
        .rpc('get_current_month');
      
      if (monthError) {
        throw new Error(`Errore nel recupero del mese corrente: ${monthError.message}`);
      }

      const { data: tokensData, error: tokensDataError } = await supabase
        .from('translation_tokens')
        .select('*')
        .eq('month', monthData)
        .single();
      
      if (tokensDataError && tokensDataError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw new Error(`Errore nel recupero dei dati sui token: ${tokensDataError.message}`);
      }

      // If no data found, it means this is the first time using the system this month
      if (!tokensData) {
        // Default values
        setTokenUsage({
          tokensUsed: 0,
          tokensRemaining: 300,
          tokensLimit: 300,
          lastUpdated: new Date().toISOString(),
          month: monthData
        });
      } else {
        setTokenUsage({
          tokensUsed: tokensData.tokens_used || 0,
          tokensRemaining: tokensData.tokens_limit - tokensData.tokens_used,
          tokensLimit: tokensData.tokens_limit,
          lastUpdated: tokensData.last_updated,
          month: tokensData.month
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMessage);
      console.error('Error fetching token usage:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenUsage();

    // Set up a subscription to token changes
    const channel = supabase
      .channel('translation_tokens_changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'translation_tokens' },
        () => {
          fetchTokenUsage();
        }
      )
      .subscribe();

    // Ascolta l'evento custom per refresh forzato, es: dopo traduzione
    const onRefresh = () => {
      fetchTokenUsage();
    };
    window.addEventListener("refresh-tokens", onRefresh);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("refresh-tokens", onRefresh);
    };
  }, []);

  return {
    tokenUsage,
    isLoading,
    error,
    refreshTokenUsage: fetchTokenUsage
  };
};
