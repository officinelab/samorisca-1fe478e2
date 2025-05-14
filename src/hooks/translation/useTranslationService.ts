
import { useState } from 'react';
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

export const useTranslationService = (): TranslationService => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentService, setCurrentService] = useState<TranslationServiceType>('perplexity');

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
    console.log(`Usando il servizio di traduzione: ${currentService}`); // Debug log per il servizio selezionato

    try {
      // Check remaining tokens before translation
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

      // Chiamiamo la edge function appropriata in base al servizio selezionato
      const result = await translateTextViaEdgeFunction(
        text,
        targetLanguage,
        entityId,
        entityType,
        fieldName,
        currentService // Passiamo il servizio corrente alla funzione di traduzione
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
    setCurrentService(service);
    toast.success(`Servizio di traduzione impostato a: ${service === 'perplexity' ? 'Perplexity AI' : 'DeepL API'}`);
    console.log(`Servizio di traduzione cambiato a: ${service}`); // Debug log per il cambio di servizio
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
