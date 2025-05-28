
import { TranslationResult } from '../types';

/**
 * Valida l'input del testo per la traduzione
 */
export const validateTranslationInput = (text: string): TranslationResult | null => {
  if (!text || text.trim() === '') {
    return {
      success: false,
      translatedText: '',
      message: 'Il testo da tradurre non può essere vuoto'
    };
  }
  return null;
};
