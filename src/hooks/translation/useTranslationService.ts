
import { useState, useEffect } from 'react';
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

// Costante per il localStorage
const TRANSLATION_SERVICE_KEY = 'preferred_translation_service';

export const useTranslationService = (): TranslationService => {
  // Recuperiamo il servizio salvato nel localStorage o usiamo perplexity come default
  const getSavedService = (): TranslationServiceType => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(TRANSLATION_SERVICE_KEY);
      return (saved === 'deepl' ? 'deepl' : 'perplexity') as TranslationServiceType;
    }
    return 'perplexity';
  };

  const [isTranslating, setIsTranslating] = useState(false);
  const [currentService, setCurrentService] = useState<TranslationServiceType>(getSavedService());

  // Aggiorniamo il localStorage quando cambia il servizio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TRANSLATION_SERVICE_KEY, currentService);
      console.log(`Servizio di traduzione salvato in localStorage: ${currentService}`);
    }
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

        const serviceName = currentService === 'perplexity' ? 'Perplexity AI' : 'DeepL API';
        toast.success(`Traduzione completata con successo usando ${serviceName}`);
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

  const setTranslationService = (service: TranslationServiceType) => {
    console.log(`useTranslationService: Cambio servizio da ${currentService} a ${service}`);
    setCurrentService(service);
    const serviceName = service === 'perplexity' ? 'Perplexity AI' : 'DeepL API';
    toast.success(`Servizio di traduzione impostato a: ${serviceName}`);
  };

  return {
    translateText,
    saveTranslation: saveTranslationToDb,
    getExistingTranslation: getExistingTranslationFromDb,
    isTranslating,
    currentService,
    setTranslationService
  };
};
