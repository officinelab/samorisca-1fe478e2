
import { TranslationResult } from '../types';
import { toast } from '@/components/ui/sonner';

/**
 * Gestisce gli errori durante il processo di traduzione
 */
export const handleTranslationError = (error: unknown): TranslationResult => {
  console.error('Errore del servizio di traduzione:', error);
  const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
  toast.error(`Errore del servizio di traduzione: ${errorMessage}`);

  return {
    success: false,
    translatedText: '',
    message: `Errore del servizio di traduzione: ${errorMessage}`
  };
};
