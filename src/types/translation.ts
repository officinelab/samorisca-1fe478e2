
export type SupportedLanguage = 'en' | 'fr' | 'de' | 'es';

export interface LanguageOption {
  value: SupportedLanguage;
  label: string;
  flag?: string;
}

export interface TokenUsage {
  tokensUsed: number;
  tokensRemaining: number;
  tokensLimit: number;
  lastUpdated: string;
  month: string;
}

export interface TranslationStats {
  total: number;
  translated: number;
  untranslated: number;
  percentage: number;
}

export interface TranslatableField {
  id: string;
  originalField: string;
  originalText: string;
  translatedText: string | null;
  entityType: string;
  isTranslated: boolean;
}

export interface TranslationCategory {
  id: string;
  name: string;
  items: TranslatableField[];
}

export interface TranslationResult {
  success: boolean;
  translatedText: string;
  message?: string;
}
