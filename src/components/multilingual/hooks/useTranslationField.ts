
import { SupportedLanguage } from "@/types/translation";
import { useTranslationFieldState } from "./useTranslationFieldState";
import { useTranslationFieldOperations } from "./useTranslationFieldOperations";
import { useTranslationFieldUI } from "./useTranslationFieldUI";

interface UseTranslationFieldProps {
  id: string;
  entityType: string;
  fieldName: string;
  originalText: string;
  language: SupportedLanguage;
  onTranslationSaved?: (translated: string) => void;
}

export function useTranslationField({
  id,
  entityType,
  fieldName,
  originalText,
  language,
  onTranslationSaved,
}: UseTranslationFieldProps) {
  // Gestione dello stato
  const {
    translatedText,
    setTranslatedText,
    isEdited,
    setIsEdited,
    error,
    setError,
    retryCount,
    refreshKey,
    handleInputChange,
    incrementRefreshKey,
    incrementRetryCount,
    resetRetryCount,
  } = useTranslationFieldState({ id, entityType, fieldName, language });

  // Operazioni di traduzione
  const {
    handleTranslate,
    handleRetryWithFallback,
    handleSaveManual,
  } = useTranslationFieldOperations({
    id,
    entityType,
    fieldName,
    originalText,
    language,
    onTranslationSaved,
    translatedText,
    retryCount,
    setError,
    setTranslatedText,
    setIsEdited,
    incrementRefreshKey,
    incrementRetryCount,
    resetRetryCount,
  });

  // Logica di UI
  const {
    getTooltipText,
    getButtonLabel,
    isTranslating,
  } = useTranslationFieldUI();

  return {
    translatedText,
    setTranslatedText,
    isEdited,
    setIsEdited,
    error,
    setError,
    retryCount,
    setRetryCount: incrementRetryCount,
    refreshKey,
    setRefreshKey: incrementRefreshKey,
    handleTranslate,
    handleRetryWithFallback,
    handleInputChange,
    handleSaveManual,
    isTranslating,
    getTooltipText,
    getButtonLabel,
  };
}
