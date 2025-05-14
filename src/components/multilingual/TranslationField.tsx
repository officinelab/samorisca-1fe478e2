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
import TranslationStatusBadge, { statusTitles } from "./TranslationStatusBadge";

interface TranslationFieldProps {
  id: string;
  entityType: string;
  fieldName: string;
  originalText: string;
  language: SupportedLanguage;
  multiline?: boolean;
  onTranslationSaved?: (translated: string) => void;
  updatedAt: string | undefined; // data dell'ultima modifica del record originale (es. prodotto)
}

export const TranslationField: React.FC<TranslationFieldProps> = ({
  id,
  entityType,
  fieldName,
  originalText,
  language,
  multiline = false,
  onTranslationSaved,
  updatedAt
}) => {
  const [translatedText, setTranslatedText] = useState<string>("");
  const [isEdited, setIsEdited] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [translationLastUpdated, setTranslationLastUpdated] = useState<string | null>(null);
  
  const { 
    translateText, 
    getExistingTranslation, 
    saveTranslation, 
    isTranslating, 
    currentService,
    getServiceName 
  } = useTranslationService();

  // Effetto per ricaricare la traduzione esistente E la data aggiornamento della traduzione
  useEffect(() => {
    const fetchExistingTranslation = async () => {
      const existing = await getExistingTranslation(id, entityType, fieldName, language);
      let translationDate: string | null = null;
      if (existing) {
        setTranslatedText(existing.translatedText ?? ""); // Modifica: assumiamo che getExistingTranslation ora ritorni oggetto con translatedText & last_updated
        translationDate = existing.last_updated ?? null;
      } else {
        setTranslatedText("");
      }
      setTranslationLastUpdated(translationDate);
      setError(null);
    };

    fetchExistingTranslation();
  }, [id, entityType, fieldName, language, getExistingTranslation, currentService]);

  // Gestione traduzione
  const handleTranslate = async () => {
    if (!originalText.trim()) return;
    
    // Reset error state
    setError(null);

    console.log(`TranslationField (${fieldName}): Avvio traduzione con servizio: ${currentService}`);

    if (originalText === "GAMBERO CRUDO") {
      console.log(`[DEBUG-SPECIAL] Rilevato testo speciale "GAMBERO CRUDO" per traduzione`);
      console.log(`[DEBUG-SPECIAL] Parametri: ID=${id}, entityType=${entityType}, fieldName=${fieldName}, language=${language}`);
    }

    try {
      const result = await translateText(
        originalText,
        language,
        id,
        entityType,
        fieldName
      );

      if (result.success && result.translatedText) {
        console.log(`Risultato traduzione per ${fieldName}: "${result.translatedText}" usando ${currentService}`);
        setTranslatedText(result.translatedText);
        if (onTranslationSaved) {
          onTranslationSaved(result.translatedText);
        }
        // Reset error and retry count on success
        setError(null);
        setRetryCount(0);
      } else {
        setError(result.message || 'Errore sconosciuto durante la traduzione');
        console.error(`Errore traduzione per ${fieldName}:`, result.message);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Errore sconosciuto';
      setError(errorMsg);
      console.error(`Eccezione durante traduzione per ${fieldName}:`, errorMsg);
    }
  };

  const handleRetryWithFallback = async () => {
    setRetryCount(prev => prev + 1);
    
    // Se abbiamo già fatto un tentativo con OpenAI, suggerisci di cambiare servizio
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
    // Clear error state when user edits manually
    setError(null);
  };

  const handleSaveManual = async () => {
    await saveTranslation(
      id,
      entityType,
      fieldName,
      originalText,
      translatedText,
      language
    );
    
    setIsEdited(false);
    if (onTranslationSaved) {
      onTranslationSaved(translatedText);
    }
  };

  // Ottieni il testo per il tooltip
  const getTooltipText = useCallback(() => `Traduci con ${getServiceName()}`, [getServiceName]);

  // Mostra l'abbreviazione corretta in base al servizio selezionato
  const getServiceAbbreviation = useCallback(() => {
    switch(currentService) {
      case 'perplexity':
        return 'AI';
      case 'deepl':
        return 'DeepL';
      case 'openai':
        return 'GPT';
      default:
        return 'API';
    }
  }, [currentService]);

  // Mostra il nome del servizio corretto in base alla selezione
  const getButtonLabel = useCallback(() => {
    if (isTranslating) return <Loader2 className="h-4 w-4 animate-spin" />;
    return `Traduci (${getServiceAbbreviation()})`;
  }, [isTranslating, getServiceAbbreviation]);

  const InputComponent = multiline ? (
    <Textarea 
      value={translatedText} 
      onChange={handleInputChange}
      className={`w-full ${error ? 'border-red-300' : ''}`}
      rows={3}
      placeholder={`Traduzione in ${language}...`}
    />
  ) : (
    <Input 
      value={translatedText} 
      onChange={handleInputChange}
      className={`w-full ${error ? 'border-red-300' : ''}`}
      placeholder={`Traduzione in ${language}...`}
    />
  );

  // Calcolo status badge usando updatedAt(record originale) e translationLastUpdated (traduzione)
  // Nota: updatedAt è la data del record italiano (prodotto originale, ecc)
  // translationLastUpdated è la data dell’ultima modifica della traduzione

  type StatusType = "missing" | "outdated" | "updated";
  let translationStatus: StatusType = "missing";
  if (translationLastUpdated) {
    if (!updatedAt || new Date(translationLastUpdated) >= new Date(updatedAt)) {
      translationStatus = "updated";
    } else {
      translationStatus = "outdated";
    }
  } else {
    translationStatus = translatedText.trim() ? "updated" : "missing"; // fallback
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {/* BADGE stato aggiornamento */}
        <TranslationStatusBadge status={translationStatus} />
        {InputComponent}
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
              disabled={!translatedText.trim()}
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
