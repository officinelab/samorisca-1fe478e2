
import { useState } from 'react';
import { SupportedLanguage } from '@/types/translation';
import { TranslationResult } from './types';
import { translateText as translateTextService } from './service/translationService';

export const useTranslationOperations = (currentService: string) => {
  const [isTranslating, setIsTranslating] = useState(false);

  // Wrapper per il metodo di traduzione
  const handleTranslateText = async (
    text: string,
    targetLanguage: SupportedLanguage,
    entityId: string,
    entityType: string,
    fieldName: string
  ): Promise<TranslationResult> => {
    setIsTranslating(true);
    try {
      return await translateTextService(
        text, 
        targetLanguage, 
        entityId, 
        entityType, 
        fieldName, 
        currentService as any
      );
    } finally {
      setIsTranslating(false);
    }
  };

  return {
    isTranslating,
    translateText: handleTranslateText
  };
};
