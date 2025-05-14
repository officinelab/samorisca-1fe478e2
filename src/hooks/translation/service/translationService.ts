
import { SupportedLanguage, TranslationServiceType } from '@/types/translation';
import { toast } from '@/components/ui/sonner';
import { TranslationResult } from '../types';
import { checkRemainingTokens, translateTextViaEdgeFunction } from '../translationApi';
import { saveTranslation, getExistingTranslation } from '../translationStorage';
import { getServiceName } from './serviceUtils';

/**
 * Gestisce la traduzione del testo utilizzando il servizio specificato
 */
export const translateText = async (
  text: string,
  targetLanguage: SupportedLanguage,
  entityId: string,
  entityType: string,
  fieldName: string,
  currentService: TranslationServiceType
): Promise<TranslationResult> => {
  if (!text || text.trim() === '') {
    return {
      success: false,
      translatedText: '',
      message: 'Il testo da tradurre non può essere vuoto'
    };
  }

  console.log(`translateText: Avvio traduzione con servizio: ${currentService}`);

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
      currentService
    );

    if (result.success) {
      // Salviamo la traduzione nel database
      await saveTranslation(
        entityId,
        entityType,
        fieldName,
        text,
        result.translatedText,
        targetLanguage
      );

      toast.success(`Traduzione completata con successo usando ${getServiceName(currentService)}`);
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
  }
};
