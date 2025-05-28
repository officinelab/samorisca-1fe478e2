
import { SupportedLanguage, TranslationServiceType } from '@/types/translation';
import { TranslationResult } from '../types';
import { validateTranslationInput } from './inputValidation';
import { validateTokenAvailability } from './tokenValidation';
import { executeTranslation } from './translationExecution';
import { handleTranslationError } from './errorHandling';

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
  // Validazione input
  const inputValidation = validateTranslationInput(text);
  if (inputValidation) {
    return inputValidation;
  }

  console.log(`translateText: Avvio traduzione con servizio: ${currentService}`);
  
  try {
    // Validazione token
    const { isValid, tokensData } = await validateTokenAvailability();
    if (!isValid) {
      return {
        success: false,
        translatedText: '',
        message: tokensData === null 
          ? 'Errore durante la verifica dei token disponibili'
          : 'Token esauriti. Acquista altri token oppure riprova il prossimo mese.'
      };
    }

    // Esecuzione traduzione
    return await executeTranslation(
      text,
      targetLanguage,
      entityId,
      entityType,
      fieldName,
      currentService
    );
  } catch (error) {
    return handleTranslationError(error);
  }
};
