
import { TranslationServiceType } from '@/types/translation';

export const getServiceFunctionName = (serviceType: TranslationServiceType): string => {
  switch (serviceType) {
    case 'deepl':
      return 'translate-deepl';
    case 'openai':
      return 'translate-openai';
    case 'perplexity':
    default:
      return 'translate';
  }
};
