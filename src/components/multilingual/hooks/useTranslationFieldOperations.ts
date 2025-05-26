
import { useTranslationService } from "@/hooks/translation";
import { SupportedLanguage } from "@/types/translation";
import { toast } from "@/components/ui/sonner";

interface UseTranslationFieldOperationsProps {
  id: string;
  entityType: string;
  fieldName: string;
  originalText: string;
  language: SupportedLanguage;
  onTranslationSaved?: (translated: string) => void;
  translatedText: string;
  retryCount: number;
  setError: (error: string | null) => void;
  setTranslatedText: (text: string) => void;
  setIsEdited: (edited: boolean) => void;
  incrementRefreshKey: () => void;
  incrementRetryCount: () => void;
  resetRetryCount: () => void;
}

export function useTranslationFieldOperations({
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
}: UseTranslationFieldOperationsProps) {
  const { translateText, saveTranslation, currentService } = useTranslationService();

  const emitTranslationRefreshEvent = () => {
    if (typeof window !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("refresh-translation-status"));
    }
  };

  const handleTranslate = async () => {
    if (!originalText.trim()) return;
    setError(null);
    
    try {
      const result = await translateText(originalText, language, id, entityType, fieldName);
      if (result.success && result.translatedText) {
        setTranslatedText(result.translatedText);
        if (onTranslationSaved) onTranslationSaved(result.translatedText);
        setError(null);
        resetRetryCount();
        incrementRefreshKey();
        emitTranslationRefreshEvent();
      } else {
        setError(result.message || "Errore sconosciuto durante la traduzione");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Errore sconosciuto";
      setError(errorMsg);
    }
  };

  const handleRetryWithFallback = async () => {
    incrementRetryCount();
    if (retryCount > 0 && currentService === 'openai') {
      toast.info('Prova a cambiare il servizio di traduzione', {
        description: 'OpenAI potrebbe non essere disponibile. Prova Perplexity AI o DeepL come alternativa.'
      });
    }
    await handleTranslate();
  };

  const handleSaveManual = async () => {
    await saveTranslation(id, entityType, fieldName, originalText, translatedText, language);
    setIsEdited(false);
    if (onTranslationSaved) onTranslationSaved(translatedText);
    incrementRefreshKey();
    emitTranslationRefreshEvent();
  };

  return {
    handleTranslate,
    handleRetryWithFallback,
    handleSaveManual,
  };
}
