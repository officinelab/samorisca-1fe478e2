
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useServiceCharge = () => {
  const [serviceChargeValue, setServiceChargeValue] = useState<string>('0.00');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadServiceCharge = async () => {
    try {
      setIsLoading(true);
      
      const { data, error: dbError } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'serviceCoverCharge')
        .single();

      if (dbError) {
        console.warn('Service charge non trovato, uso valore di default');
        setServiceChargeValue('0.00');
      } else {
        const value = typeof data.value === 'string' ? data.value : String(data.value || '0.00');
        setServiceChargeValue(value);
      }
      
      setError(null);
    } catch (err) {
      console.error('Errore caricamento service charge:', err);
      setServiceChargeValue('0.00');
      setError('Errore nel caricamento del prezzo del servizio');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadServiceCharge();
  }, []);

  return {
    serviceChargeValue,
    isLoading,
    error,
    refetch: loadServiceCharge
  };
};
