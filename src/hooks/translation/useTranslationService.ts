
import { TranslationService } from './types';
import { saveTranslation, getExistingTranslation } from './translationStorage';
import { useTranslationServiceState } from './useTranslationServiceState';
import { useTranslationOperations } from './useTranslationOperations';
import { useServiceManagement } from './useServiceManagement';

export const useTranslationService = (): TranslationService => {
  const { currentService, setCurrentService, isLoading } = useTranslationServiceState();
  const { isTranslating, translateText } = useTranslationOperations(currentService);
  const { setTranslationService, getServiceName } = useServiceManagement(currentService, setCurrentService, isLoading);

  return {
    translateText,
    saveTranslation,
    getExistingTranslation,
    isTranslating,
    currentService,
    setTranslationService,
    getServiceName,
    isLoading
  };
};
