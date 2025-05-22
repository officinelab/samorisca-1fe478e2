import { useState, useEffect, useCallback } from "react";
import { useTranslationService } from "@/hooks/translation";
import { SupportedLanguage } from "@/types/translation";
import { toast } from "@/components/ui/sonner";

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
  const [translatedText, setTranslatedText] = useState<string>("");
  const [isEdited, setIsEdited] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    translateText,
    getExistingTranslation,
    saveTranslation,
    isTranslating,
    currentService,
    getServiceName,
  } = useTranslationService();

  useEffect(() => {
    const fetchExistingTranslation = async () => {
      const existing = await getExistingTranslation(id, entityType, fieldName, language);
      if (existing) setTranslatedText(existing);
      else setTranslatedText("");
      setError(null);
    };
    fetchExistingTranslation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, entityType, fieldName, language, getExistingTranslation, currentService]);

  const handleTranslate = async () => {
    if (!originalText.trim()) return;
    setError(null);
    try {
      const result = await translateText(originalText, language, id, entityType, fieldName);
      if (result.success && result.translatedText) {
        setTranslatedText(result.translatedText);
        if (onTranslationSaved) onTranslationSaved(result.translatedText);
        setError(null);
        setRetryCount(0);
        setRefreshKey((k) => k + 1);
        // 🔴 EMETTI EVENTO DOPO TRADUZIONE AUTOMATICA
        if (typeof window !== "undefined" && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent("refresh-translation-status"));
        }
      } else {
        setError(result.message || "Errore sconosciuto durante la traduzione");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Errore sconosciuto";
      setError(errorMsg);
    }
  };

  const handleRetryWithFallback = async () => {
    setRetryCount((prev) => prev + 1);
    if (retryCount > 0 && currentService === 'openai') {
      toast.info('Prova a cambiare il servizio di traduzione', {
        description: 'OpenAI potrebbe non essere disponibile. Prova Perplexity AI o DeepL come alternativa.'
      });
    }
    await handleTranslate();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTranslatedText(e.target.value);
    setIsEdited(true);
    setError(null);
  };

  const handleSaveManual = async () => {
    await saveTranslation(id, entityType, fieldName, originalText, translatedText, language);
    setIsEdited(false);
    if (onTranslationSaved) onTranslationSaved(translatedText);
    setRefreshKey((k) => k + 1);
    // 🔴 EMETTI EVENTO DOPO SALVATAGGIO MANUALE
    if (typeof window !== "undefined" && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent("refresh-translation-status"));
    }
  };

  const getTooltipText = useCallback(() => `Traduci con ${getServiceName()}`, [getServiceName]);
  
  const getServiceAbbreviation = useCallback(() => {
    switch(currentService) {
      case 'perplexity': return 'AI';
      case 'deepl': return 'DeepL';
      case 'openai': return 'GPT';
      default: return 'API';
    }
  }, [currentService]);

  const getButtonLabel = useCallback(() => {
    return isTranslating ? null : `Traduci (${getServiceAbbreviation()})`;
  }, [isTranslating, getServiceAbbreviation]);

  return {
    translatedText,
    setTranslatedText,
    isEdited,
    setIsEdited,
    error,
    setError,
    retryCount,
    setRetryCount,
    refreshKey,
    setRefreshKey,
    handleTranslate,
    handleRetryWithFallback,
    handleInputChange,
    handleSaveManual,
    isTranslating,
    currentService,
    getServiceName,
    getTooltipText,
    getButtonLabel,
  };
}
