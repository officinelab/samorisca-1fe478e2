
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

      // If no data found, create with current limit from settings
      if (!tokensData) {
        // Recupera il limite mensile dalle impostazioni SOLO per nuovi record
        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'monthlyTokensLimit')
          .maybeSingle();

        let monthlyLimit = 300; // Default fallback
        if (!settingsError && settingsData?.value) {
          monthlyLimit = parseInt(settingsData.value.toString()) || 300;
        }

        setTokenUsage({
          tokensUsed: 0,
          tokensRemaining: monthlyLimit,
          tokensLimit: monthlyLimit,
          purchasedTokensTotal: 0,
          purchasedTokensUsed: 0,
          lastUpdated: new Date().toISOString(),
          month: monthData
        });
      } else {
        // Per record esistenti, usa il limite già presente nel record
        const effectiveLimit = tokensData.tokens_limit || 300;
        const tokensRemaining = effectiveLimit - tokensData.tokens_used;
        const purchasedTokensTotal = tokensData.purchased_tokens_total ?? 0;
        const purchasedTokensUsed = tokensData.purchased_tokens_used ?? 0;
        setTokenUsage({
          tokensUsed: tokensData.tokens_used || 0,
          tokensRemaining: tokensRemaining + (purchasedTokensTotal - purchasedTokensUsed),
          tokensLimit: effectiveLimit,
          purchasedTokensTotal,
          purchasedTokensUsed,
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

    // NON ascoltare più i cambiamenti delle impostazioni del sito
    // perché non devono influenzare il mese corrente

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
