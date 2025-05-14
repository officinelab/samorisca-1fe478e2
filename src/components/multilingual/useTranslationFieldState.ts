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

      // Recupera oggetto traduzione con controllo null
      if (
        existing !== null &&
        typeof existing === "object" &&
        "translatedText" in existing &&
        "last_updated" in existing
      ) {
        translationObj = {
          translatedText: (existing as any).translatedText,
          last_updated: (existing as any).last_updated // dalla tabella translations
        };
      } else if (typeof existing === "string") {
        translationObj = { translatedText: existing };
      } else {
        translationObj = null;
      }
      setTranslatedData(translationObj);

      // Recupera campo updated_at dal prodotto
      let updatedAtProd = "";
      try {
        const tableName = getTableName(entityType);
        if (tableName) {
          const { data } = await import("@/integrations/supabase/client").then((mod) =>
            mod.supabase
              .from(tableName)
              .select("updated_at")
              .eq("id", id)
              .maybeSingle()
          );
          if (data && typeof data === "object") {
            updatedAtProd = (data as any).updated_at ?? "";
          }
        }
      } catch (err) {
        updatedAtProd = "";
      }
      setOriginalLastUpdated(updatedAtProd);
      setError(null);

      // DEBUG: mostra i valori confrontati
      if (updatedAtProd) {
        console.log(
          `[DEBUG] useTranslationFieldState: Prodotto updated_at = ${updatedAtProd}, Traduzione last_updated = ${translationObj?.last_updated}`
        );
      }
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

  // STATUS computation aggiornata: confronta solo updated_at prodotto VS last_updated traduzione (translationObj)
  let status: TranslationStatus = "missing";
  const prodottoUpdatedAt = originalLastUpdated;
  const traduzioneLastUpdated = translatedData?.last_updated;

  // Logica aggiornata con debug!
  if (!translatedData || !translatedData.translatedText) {
    status = "missing";
  } else if (
    traduzioneLastUpdated &&
    prodottoUpdatedAt &&
    new Date(traduzioneLastUpdated).getTime() < new Date(prodottoUpdatedAt).getTime()
  ) {
    status = "outdated";
    console.log(
      `[DEBUG] Stato TRADUZIONE OUTDATED: prodotto.updated_at = ${prodottoUpdatedAt} > traduzione.last_updated = ${traduzioneLastUpdated}`
    );
  } else if (translatedData?.translatedText) {
    status = "updated";
    console.log(
      `[DEBUG] Stato TRADUZIONE UPDATED: traduzione.last_updated = ${traduzioneLastUpdated}, prodotto.updated_at = ${prodottoUpdatedAt}`
    );
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
