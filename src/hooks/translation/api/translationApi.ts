
import { SupportedLanguage, TranslationServiceType } from '@/types/translation';
import { TranslationResult } from '../types';
import { checkRemainingTokens } from './tokenManager';
import { callTranslationEdgeFunction } from './edgeFunctionCaller';
import { handleGeneralError } from './errorHandler';

export const translateTextViaEdgeFunction = async (
  text: string,
  targetLanguage: SupportedLanguage,
  entityId: string,
  entityType: string,
  fieldName: string,
  serviceType: TranslationServiceType = 'perplexity'
): Promise<TranslationResult> => {
  try {
    return await callTranslationEdgeFunction(
      text,
      targetLanguage,
      entityId,
      entityType,
      fieldName,
      serviceType
    );
  } catch (error) {
    return handleGeneralError(error, serviceType);
  }
};

// Re-export per compatibilità
export { checkRemainingTokens };
