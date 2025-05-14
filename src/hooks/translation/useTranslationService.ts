
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

      // Call the appropriate Edge Function for translation based on current service
      const result = await translateTextViaEdgeFunction(
        text,
        targetLanguage,
        entityId,
        entityType,
        fieldName,
        currentService
      );

      if (result.success) {
        // Save translation to database
        await saveTranslationToDb(
          entityId,
          entityType,
          fieldName,
          text,
          result.translatedText,
          targetLanguage
        );

        toast.success('Traduzione completata con successo');
      }
      
      return result;
    } catch (error) {
      console.error('Translation service error:', error);
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
