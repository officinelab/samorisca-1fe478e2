
import { useState, useEffect, useCallback } from "react";
import { useTranslationService } from "@/hooks/translation";
import { toast } from "@/components/ui/sonner";
import { SupportedLanguage } from "@/types/translation";

export type TranslationData = {
  translatedText: string;
  last_updated?: string;
};

export type TranslationStatus = "missing" | "outdated" | "updated";

export interface UseTranslationFieldStateProps {
  id: string;
  entityType: string;
  fieldName: string;
  originalText: string;
  language: SupportedLanguage;
  onTranslationSaved?: (translated: string) => void;
}

export function useTranslationFieldState({
  id,
  entityType,
  fieldName,
  originalText,
  language,
  onTranslationSaved,
}: UseTranslationFieldStateProps) {
  const [translatedData, setTranslatedData] = useState<TranslationData | null>(null);
  const [originalLastUpdated, setOriginalLastUpdated] = useState<string>("");
  const [isEdited, setIsEdited] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const {
    translateText,
    getExistingTranslation,
    saveTranslation,
    isTranslating,
    currentService,
    getServiceName,
  } = useTranslationService();

  const getTableName = useCallback((entityType: string) => {
    switch (entityType) {
      case "categories":
      case "products":
      case "allergens":
      case "product_features":
      case "product_labels":
        return entityType;
      default:
        return null;
    }
  }, []);

  // Fetch translation + original last_updated
  useEffect(() => {
    const fetchData = async () => {
      let translationObj: TranslationData | null = null;
      const existing = await getExistingTranslation(id, entityType, fieldName, language);

      if (
        existing !== null &&
        typeof existing === "object" &&
        "translatedText" in existing
      ) {
        translationObj = {
          translatedText: (existing as any).translatedText,
          last_updated: (existing as any).last_updated,
        };
      } else if (typeof existing === "string") {
        translationObj = { translatedText: existing };
      } else {
        translationObj = null;
      }
      setTranslatedData(translationObj);

      // Prende il last_updated dell'originale (italiano)
      let lastUpdatedIt = "";
      try {
        const tableName = getTableName(entityType);
        if (tableName) {
          const { data } = await import("@/integrations/supabase/client").then((mod) =>
            mod.supabase
              .from(tableName)
              .select("updated_at, last_updated")
              .eq("id", id)
              .maybeSingle()
          );
          if (data && typeof data === "object") {
            lastUpdatedIt = (data as any).last_updated ?? (data as any).updated_at ?? "";
          }
        }
      } catch (err) {
        lastUpdatedIt = "";
      }
      setOriginalLastUpdated(lastUpdatedIt);
      setError(null);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, entityType, fieldName, language, getExistingTranslation, currentService]);

  const handleTranslate = async () => {
    if (!originalText.trim()) return;
    setError(null);
    try {
      const result = await translateText(
        originalText,
        language,
        id,
        entityType,
        fieldName
      );

      if (result.success && result.translatedText) {
        setTranslatedData({
          translatedText: result.translatedText,
          last_updated: new Date().toISOString(),
        });
        if (onTranslationSaved) {
          onTranslationSaved(result.translatedText);
        }
        setError(null);
        setRetryCount(0);
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
    if (retryCount > 0 && currentService === "openai") {
      toast.info("Prova a cambiare il servizio di traduzione", {
        description: "OpenAI potrebbe non essere disponibile. Prova Perplexity AI o DeepL come alternativa.",
      });
    }
    await handleTranslate();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTranslatedData({
      ...translatedData,
      translatedText: e.target.value,
    });
    setIsEdited(true);
    setError(null);
  };

  const handleSaveManual = async () => {
    await saveTranslation(
      id,
      entityType,
      fieldName,
      originalText,
      translatedData?.translatedText || "",
      language
    );
    setIsEdited(false);
    if (onTranslationSaved) {
      onTranslationSaved(translatedData?.translatedText || "");
    }
  };

  // STATUS computation
  let status: TranslationStatus = "missing";
  if (!translatedData || !translatedData.translatedText) {
    status = "missing";
  } else if (
    translatedData?.last_updated &&
    originalLastUpdated &&
    new Date(translatedData.last_updated) < new Date(originalLastUpdated)
  ) {
    status = "outdated";
  } else if (translatedData?.translatedText) {
    status = "updated";
  }

  return {
    translatedData,
    isEdited,
    error,
    status,
    isTranslating,
    handleTranslate,
    handleRetryWithFallback,
    handleInputChange,
    handleSaveManual,
    getServiceName,
    currentService,
    setIsEdited,
  };
}
