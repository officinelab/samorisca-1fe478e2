
import { useState, useEffect } from "react";
import { useTranslationService } from "@/hooks/translation";
import { SupportedLanguage } from "@/types/translation";

interface UseTranslationFieldStateProps {
  id: string;
  entityType: string;
  fieldName: string;
  language: SupportedLanguage;
}

export function useTranslationFieldState({
  id,
  entityType,
  fieldName,
  language,
}: UseTranslationFieldStateProps) {
  const [translatedText, setTranslatedText] = useState<string>("");
  const [isEdited, setIsEdited] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const { getExistingTranslation, currentService } = useTranslationService();

  // Carica la traduzione esistente quando cambiano i parametri
  useEffect(() => {
    const fetchExistingTranslation = async () => {
      const existing = await getExistingTranslation(id, entityType, fieldName, language);
      if (existing) setTranslatedText(existing);
      else setTranslatedText("");
      setError(null);
    };
    fetchExistingTranslation();
  }, [id, entityType, fieldName, language, getExistingTranslation, currentService]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTranslatedText(e.target.value);
    setIsEdited(true);
    setError(null);
  };

  const incrementRefreshKey = () => setRefreshKey((k) => k + 1);
  const incrementRetryCount = () => setRetryCount((prev) => prev + 1);
  const resetRetryCount = () => setRetryCount(0);

  return {
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
  };
}
