
import { useCallback, useEffect } from 'react';
import { TranslationServiceType } from '@/types/translation';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { getServiceName } from './service/serviceUtils';
import { saveServicePreference } from './service/servicePreference';

export const useServiceManagement = (currentService: TranslationServiceType, setCurrentService: (service: TranslationServiceType) => void, isLoading: boolean) => {
  // Funzione per cambiare il servizio di traduzione
  const setTranslationService = async (service: TranslationServiceType) => {
    console.log(`useServiceManagement: Cambio servizio da ${currentService} a ${service}`);
    
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
    setTranslationService,
    getServiceName: getServiceNameCallback
  };
};
