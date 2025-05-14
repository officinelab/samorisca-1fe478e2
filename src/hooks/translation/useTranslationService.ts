
import { useState, useEffect, useCallback } from 'react';
import { SupportedLanguage, TranslationServiceType } from '@/types/translation';
import { toast } from '@/components/ui/sonner';
import { TranslationResult, TranslationService } from './types';
import { 
  checkRemainingTokens,
  translateTextViaEdgeFunction
} from './translationApi';
import {
  saveTranslation as saveTranslationToDb,
  getExistingTranslation as getExistingTranslationFromDb
} from './translationStorage';
import { supabase } from '@/integrations/supabase/client';

// Chiave per il localStorage (usata solo come fallback temporaneo)
const TRANSLATION_SERVICE_KEY = 'preferred_translation_service';

export const useTranslationService = (): TranslationService => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentService, setCurrentService] = useState<TranslationServiceType>('perplexity');
  const [isLoading, setIsLoading] = useState(true);

  // Carica la preferenza del servizio da Supabase
  useEffect(() => {
    const loadTranslationServicePreference = async () => {
      try {
        // Prima prova a caricare da Supabase
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'translation_service')
          .single();
        
        if (error || !data) {
          // Fallback: carica da localStorage
          const savedService = localStorage.getItem(TRANSLATION_SERVICE_KEY);
          if (savedService && (savedService === 'deepl' || savedService === 'perplexity')) {
            setCurrentService(savedService as TranslationServiceType);
            // Migra il valore da localStorage a Supabase
            await saveServicePreference(savedService as TranslationServiceType);
          }
        } else {
          // Usa il valore da Supabase
          const serviceType = data.value as TranslationServiceType;
          setCurrentService(serviceType);
          // Aggiorna anche localStorage per compatibilità
          localStorage.setItem(TRANSLATION_SERVICE_KEY, serviceType);
        }
      } catch (error) {
        console.error('Errore nel caricamento delle preferenze del servizio di traduzione:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslationServicePreference();
  }, []);

  // Funzione per salvare la preferenza del servizio su Supabase
  const saveServicePreference = async (service: TranslationServiceType): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', 'translation_service')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Errore nella verifica delle impostazioni esistenti:', error);
        return false;
      }

      if (data) {
        // Aggiorna l'impostazione esistente
        await supabase
          .from('site_settings')
          .update({ value: service })
          .eq('key', 'translation_service');
      } else {
        // Crea una nuova impostazione
        await supabase
          .from('site_settings')
          .insert([{ key: 'translation_service', value: service }]);
      }

      // Aggiorna localStorage per compatibilità
      localStorage.setItem(TRANSLATION_SERVICE_KEY, service);
      return true;
    } catch (error) {
      console.error('Errore nel salvataggio della preferenza del servizio:', error);
      return false;
    }
  };

  // Funzione per ottenere il nome del servizio di traduzione
  const getServiceName = useCallback(() => {
    return currentService === 'perplexity' ? 'Perplexity AI' : 'DeepL API';
  }, [currentService]);

  const translateText = async (
    text: string,
    targetLanguage: SupportedLanguage,
    entityId: string,
    entityType: string,
    fieldName: string
  ): Promise<TranslationResult> => {
    if (!text || text.trim() === '') {
      return {
        success: false,
        translatedText: '',
        message: 'Il testo da tradurre non può essere vuoto'
      };
    }

    setIsTranslating(true);
    console.log(`useTranslationService: Avvio traduzione con servizio: ${currentService}`);

    try {
      // Verifica token rimanenti prima della traduzione
      const tokensData = await checkRemainingTokens();
      
      if (tokensData === null) {
        return {
          success: false,
          translatedText: '',
          message: 'Errore durante la verifica dei token disponibili'
        };
      }

      if (tokensData <= 0) {
        toast.error('Token mensili esauriti. Riprova il prossimo mese.');
        return {
          success: false,
          translatedText: '',
          message: 'Token mensili esauriti. Riprova il prossimo mese.'
        };
      }

      // Passiamo esplicitamente il servizio corrente alla funzione di traduzione
      const result = await translateTextViaEdgeFunction(
        text,
        targetLanguage,
        entityId,
        entityType,
        fieldName,
        currentService // Passiamo esplicitamente il servizio attuale
      );

      if (result.success) {
        // Salviamo la traduzione nel database
        await saveTranslationToDb(
          entityId,
          entityType,
          fieldName,
          text,
          result.translatedText,
          targetLanguage
        );

        toast.success(`Traduzione completata con successo usando ${getServiceName()}`);
      }
      
      return result;
    } catch (error) {
      console.error('Errore del servizio di traduzione:', error);
      const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
      toast.error(`Errore del servizio di traduzione: ${errorMessage}`);
      
      return {
        success: false,
        translatedText: '',
        message: `Errore del servizio di traduzione: ${errorMessage}`
      };
    } finally {
      setIsTranslating(false);
    }
  };

  const setTranslationService = async (service: TranslationServiceType) => {
    console.log(`useTranslationService: Cambio servizio da ${currentService} a ${service}`);
    
    // Salva su Supabase e aggiorna lo state locale
    const success = await saveServicePreference(service);
    
    if (success) {
      setCurrentService(service);
      const serviceName = service === 'perplexity' ? 'Perplexity AI' : 'DeepL API';
      toast.success(`Servizio di traduzione impostato a: ${serviceName}`);
      
      // Forza il ricaricamento della pagina per aggiornare tutti i componenti
      window.location.reload();
    } else {
      toast.error('Errore nel salvataggio della preferenza del servizio di traduzione');
    }
  };

  return {
    translateText,
    saveTranslation: saveTranslationToDb,
    getExistingTranslation: getExistingTranslationFromDb,
    isTranslating,
    currentService,
    setTranslationService,
    getServiceName,
    isLoading
  };
};
