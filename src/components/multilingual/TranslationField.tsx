
import React, { useState, useEffect, useCallback } from "react";
import { useTranslationService } from "@/hooks/translation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SupportedLanguage } from "@/types/translation";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { toast } from "@/components/ui/sonner";
import { TranslationStatusBadge } from "./TranslationStatusBadge";

interface TranslationFieldProps {
  id: string;
  entityType: string;
  fieldName: string;
  originalText: string;
  language: SupportedLanguage;
  multiline?: boolean;
  onTranslationSaved?: (translated: string) => void;
}

type TranslationData = {
  translatedText: string;
  last_updated?: string;
};

export const TranslationField: React.FC<TranslationFieldProps> = ({
  id,
  entityType,
  fieldName,
  originalText,
  language,
  multiline = false,
  onTranslationSaved
}) => {
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
    getServiceName
  } = useTranslationService();

  // Fetch translation + original last_updated
  useEffect(() => {
    const fetchData = async () => {
      // Prende la traduzione (con last_updated)
      let translationObj: TranslationData | null = null;
      const existing = await getExistingTranslation(id, entityType, fieldName, language);
      if (existing && typeof existing === "object" && "translatedText" in existing) {
        translationObj = {
          translatedText: existing.translatedText,
          last_updated: existing.last_updated
        };
      } else if (typeof existing === "string") {
        translationObj = { translatedText: existing };
      } else {
        translationObj = null;
      }
      setTranslatedData(translationObj);

      // Prende il last_updated dell'originale (italiano)
      // fallback: prende dalla rispettiva tabella entity_type, il record per id
      let lastUpdatedIt = "";
      try {
        // Esegue query a Supabase
        // Notare: solo prendiamo il campo last_updated o updated_at per il record
        // Alcune tabelle hanno updated_at/last_updated, scegliamo quello esistente
        // Facciamo query dinamica via Supabase
        const { data } = await import("@/integrations/supabase/client").then(mod =>
          mod.supabase
            .from(entityType)
            .select("updated_at, last_updated") // Consideriamo entrambi
            .eq("id", id)
            .maybeSingle()
        );
        lastUpdatedIt = data?.last_updated ?? data?.updated_at ?? "";
      } catch (err) {
        // fallback: niente badge, nessun errore forzato
        lastUpdatedIt = "";
      }
      setOriginalLastUpdated(lastUpdatedIt);
      // Reset error state when language or service changes
      setError(null);
    };

    fetchData();
  }, [id, entityType, fieldName, language, getExistingTranslation, currentService]);

  // Restante logica del TranslationField invariata, cambiamo riferimenti stati
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
          last_updated: new Date().toISOString() // temporaneo in attesa reload
        });
        if (onTranslationSaved) {
          onTranslationSaved(result.translatedText);
        }
        setError(null);
        setRetryCount(0);
      } else {
        setError(result.message || 'Errore sconosciuto durante la traduzione');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMsg);
    }
  };

  const handleRetryWithFallback = async () => {
    setRetryCount(prev => prev + 1);
    if (retryCount > 0 && currentService === 'openai') {
      toast.info('Prova a cambiare il servizio di traduzione', {
        description: 'OpenAI potrebbe non essere disponibile. Prova Perplexity AI o DeepL come alternativa.'
      });
    }
    await handleTranslate();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTranslatedData({
      ...translatedData,
      translatedText: e.target.value
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

  const getTooltipText = useCallback(() => `Traduci con ${getServiceName()}`, [getServiceName]);

  const getServiceAbbreviation = useCallback(() => {
    switch (currentService) {
      case 'perplexity': return 'AI';
      case 'deepl': return 'DeepL';
      case 'openai': return 'GPT';
      default: return 'API';
    }
  }, [currentService]);

  const getButtonLabel = useCallback(() => {
    if (isTranslating) return <Loader2 className="h-4 w-4 animate-spin" />;
    return `Traduci (${getServiceAbbreviation()})`;
  }, [isTranslating, getServiceAbbreviation]);

  // Status badge logic
  let status: "missing" | "outdated" | "updated" = "missing";
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

  const InputComponent = multiline ? (
    <Textarea
      value={translatedData?.translatedText || ""}
      onChange={handleInputChange}
      className={`w-full ${error ? 'border-red-300' : ''}`}
      rows={3}
      placeholder={`Traduzione in ${language}...`}
    />
  ) : (
    <Input
      value={translatedData?.translatedText || ""}
      onChange={handleInputChange}
      className={`w-full ${error ? 'border-red-300' : ''}`}
      placeholder={`Traduzione in ${language}...`}
    />
  );

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <div className="w-full">{InputComponent}</div>
        <TranslationStatusBadge status={status} />
        <div className="flex flex-col gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={error ? handleRetryWithFallback : handleTranslate}
                  disabled={isTranslating || !originalText.trim()}
                  className={`whitespace-nowrap ${error ? 'border-amber-500 hover:bg-amber-100' : ''}`}
                >
                  {error ? (
                    <div className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      <span>Riprova</span>
                    </div>
                  ) : (
                    getButtonLabel()
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {error ? 'Riprova la traduzione' : getTooltipText()}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {isEdited && (
            <Button
              variant="default"
              size="sm"
              onClick={handleSaveManual}
              disabled={!translatedData?.translatedText?.trim()}
            >
              Salva
            </Button>
          )}
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-500">
          Errore: {error}
        </p>
      )}
    </div>
  );
};
