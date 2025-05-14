
import { SupportedLanguage, TranslationServiceType } from '@/types/translation';

export interface TranslationResult {
  success: boolean;
  translatedText: string;
  message?: string;
}

export interface TranslationService {
  translateText: (
    text: string,
    targetLanguage: SupportedLanguage,
    entityId: string,
    entityType: string,
    fieldName: string
  ) => Promise<TranslationResult>;
  saveTranslation: (
    entityId: string,
    entityType: string,
    field: string,
    originalText: string,
    translatedText: string,
    language: SupportedLanguage
  ) => Promise<boolean>;
  getExistingTranslation: (
    entityId: string,
    entityType: string,
    field: string,
    language: SupportedLanguage
  ) => Promise<string | null>;
  isTranslating: boolean;
  currentService: TranslationServiceType;
  setTranslationService: (service: TranslationServiceType) => void;
}
