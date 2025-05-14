
import { useState, useEffect, useCallback } from 'react';
import { SupportedLanguage, TranslationServiceType } from '@/types/translation';
import { toast } from '@/components/ui/sonner';
import { TranslationResult, TranslationService } from './types';
import { supabase } from '@/integrations/supabase/client';
import { translateText } from './service/translationService';
import { saveTranslation, getExistingTranslation } from './translationStorage';
import { getServiceName } from './service/serviceUtils';
import { loadServicePreference, saveServicePreference } from './service/servicePreference';

export const useTranslationService = (): TranslationService => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentService, setCurrentService] = useState<TranslationServiceType>('perplexity');
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

  // Wrapper per il metodo di traduzione
  const handleTranslateText = async (
    text: string,
    targetLanguage: SupportedLanguage,
    entityId: string,
    entityType: string,
    fieldName: string
  ): Promise<TranslationResult> => {
    setIsTranslating(true);
    try {
      return await translateText(
        text, 
        targetLanguage, 
        entityId, 
        entityType, 
        fieldName, 
        currentService
      );
    } finally {
      setIsTranslating(false);
    }
  };

  // Funzione per cambiare il servizio di traduzione
  const setTranslationService = async (service: TranslationServiceType) => {
    console.log(`useTranslationService: Cambio servizio da ${currentService} a ${service}`);
    
    // Salva su Supabase e aggiorna lo state locale
    const success = await saveServicePreference(service);
    
    if (success) {
      setCurrentService(service);
      const serviceName = getServiceName(service);
      toast.success(`Servizio di traduzione impostato a: ${serviceName}`);
      
      // Forza il ricaricamento della pagina per aggiornare tutti i componenti
      window.location.reload();
    } else {
      toast.error('Errore nel salvataggio della preferenza del servizio di traduzione');
    }
  };

  // Wrapper per getServiceName per mantenere compatibilità API
  const getServiceNameCallback = useCallback(() => {
    return getServiceName(currentService);
  }, [currentService]);

  // Verifica la disponibilità dell'API key di OpenAI
  useEffect(() => {
    const checkOpenAIKey = async () => {
      try {
        // Invoca una funzione edge personalizzata per verificare la disponibilità dell'API key
        const { error } = await supabase.functions.invoke('translate-openai', {
          body: { checkApiKeyOnly: true }
        });
        
        if (error) {
          console.warn('OpenAI API non configurata correttamente:', error);
        }
      } catch (error) {
        console.error('Errore nella verifica dell\'API OpenAI:', error);
      }
    };
    
    // Verifica solo se il servizio attuale è OpenAI
    if (currentService === 'openai' && !isLoading) {
      checkOpenAIKey();
    }
  }, [currentService, isLoading]);

  return {
    translateText: handleTranslateText,
    saveTranslation,
    getExistingTranslation,
    isTranslating,
    currentService,
    setTranslationService,
    getServiceName: getServiceNameCallback,
    isLoading
  };
};
