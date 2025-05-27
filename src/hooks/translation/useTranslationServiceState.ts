
import { useState, useEffect } from 'react';
import { TranslationServiceType } from '@/types/translation';
import { loadServicePreference } from './service/servicePreference';

export const useTranslationServiceState = () => {
  const [currentService, setCurrentService] = useState<TranslationServiceType>('openai');
  const [isLoading, setIsLoading] = useState(true);

  // Carica la preferenza del servizio
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const preferred = await loadServicePreference();
        setCurrentService(preferred);
      } catch (error) {
        console.error('Errore nel caricamento delle preferenze:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreference();
  }, []);

  return {
    currentService,
    setCurrentService,
    isLoading
  };
};
