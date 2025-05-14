
import { TranslationServiceType } from '@/types/translation';

/**
 * Restituisce il nome leggibile del servizio di traduzione
 */
export const getServiceName = (service: TranslationServiceType): string => {
  switch(service) {
    case 'perplexity':
      return 'Perplexity AI';
    case 'deepl':
      return 'DeepL API';
    case 'openai':
      return 'OpenAI API';
    default:
      return 'Servizio sconosciuto';
  }
};

/**
 * Restituisce l'abbreviazione del servizio di traduzione
 */
export const getServiceAbbreviation = (service: TranslationServiceType): string => {
  switch(service) {
    case 'perplexity':
      return 'AI';
    case 'deepl':
      return 'DeepL';
    case 'openai':
      return 'GPT';
    default:
      return 'API';
  }
};
