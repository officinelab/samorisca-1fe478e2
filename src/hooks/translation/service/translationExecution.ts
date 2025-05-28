
import { SupportedLanguage, TranslationServiceType } from '@/types/translation';
import { TranslationResult } from '../types';
import { translateTextViaEdgeFunction } from '../translationApi';
import { saveTranslation } from '../translationStorage';
import { toast } from '@/components/ui/sonner';
import { getServiceName } from './serviceUtils';

/**
 * Esegue la traduzione e salva il risultato
 */
export const executeTranslation = async (
  text: string,
  targetLanguage: SupportedLanguage,
  entityId: string,
  entityType: string,
  fieldName: string,
  currentService: TranslationServiceType
): Promise<TranslationResult> => {
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

    toast.success(`Traduzione completata con successo usando ${getServiceName(currentService)}`, {
      duration: 2000 // Mostra il toast solo per 2 secondi
    });

    // Forza il refresh dei token (se disponibile)
    if (typeof window !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("refresh-tokens"));
    }
  }

  return result;
};
