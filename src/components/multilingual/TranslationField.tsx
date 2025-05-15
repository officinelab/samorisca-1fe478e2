
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslationService } from "@/hooks/translation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SupportedLanguage } from "@/types/translation";
import { Loader2, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/sonner";
import { BadgeTranslationStatus } from "./BadgeTranslationStatus";

interface TranslationFieldProps {
  id: string;
  entityType: string;
  fieldName: string;
  originalText: string;
  language: SupportedLanguage;
  multiline?: boolean;
  onTranslationSaved?: (translated: string) => void;
}

export const TranslationField: React.FC<TranslationFieldProps> = ({
  id,
  entityType,
  fieldName,
  originalText,
  language,
  multiline = false,
  onTranslationSaved
}) => {
  const [translatedText, setTranslatedText] = useState<string>("");
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

  // Effetto per ricaricare la traduzione esistente
  useEffect(() => {
    const fetchExistingTranslation = async () => {
      const existing = await getExistingTranslation(id, entityType, fieldName, language);
      setTranslatedText(existing || "");
      setError(null);
    };
    fetchExistingTranslation();
    // eslint-disable-next-line
  }, [id, entityType, fieldName, language, getExistingTranslation, currentService]);

  // Gestione traduzione
  const handleTranslate = useCallback(async () => {
    if (!originalText.trim()) return;
    setError(null);

    console.log(`TranslationField (${fieldName}): Avvio traduzione con servizio: ${currentService}`);

    if (originalText === "GAMBERO CRUDO") {
      console.log(`[DEBUG-SPECIAL] Rilevato testo speciale "GAMBERO CRUDO" per traduzione`);
      console.log(`[DEBUG-SPECIAL] Parametri: ID=${id}, entityType=${entityType}, fieldName=${fieldName}, language=${language}`);
    }

    try {
      const result = await translateText(originalText, language, id, entityType, fieldName);

      if (result.success && result.translatedText) {
        console.log(`Risultato traduzione per ${fieldName}: "${result.translatedText}" usando ${currentService}`);
        setTranslatedText(result.translatedText);
        onTranslationSaved?.(result.translatedText);
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
  }, [originalText, language, id, entityType, fieldName, translateText, currentService, onTranslationSaved]);

  const handleRetryWithFallback = useCallback(async () => {
    setRetryCount(prev => prev + 1);

    if (retryCount > 0 && currentService === 'openai') {
      toast.info('Prova a cambiare il servizio di traduzione', {
        description: 'OpenAI potrebbe non essere disponibile. Prova Perplexity AI o DeepL come alternativa.'
      });
    }

    await handleTranslate();
  }, [retryCount, currentService, handleTranslate]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTranslatedText(e.target.value);
    setIsEdited(true);
    setError(null);
  }, []);

  const handleSaveManual = useCallback(async () => {
    await saveTranslation(id, entityType, fieldName, originalText, translatedText, language);
    setIsEdited(false);
    onTranslationSaved?.(translatedText);
  }, [id, entityType, fieldName, originalText, translatedText, language, saveTranslation, onTranslationSaved]);

  // Tooltip e label
  const getTooltipText = useCallback(
    () => `Traduci con ${getServiceName()}`, 
    [getServiceName]
  );

  const getServiceAbbreviation = useCallback(() => {
    switch(currentService) {
      case 'perplexity': return 'AI';
      case 'deepl':      return 'DeepL';
      case 'openai':     return 'GPT';
      default:           return 'API';
    }
  }, [currentService]);

  const getButtonLabel = useCallback(() => {
    if (isTranslating) return <Loader2 className="h-4 w-4 animate-spin" />;
    return `Traduci (${getServiceAbbreviation()})`;
  }, [isTranslating, getServiceAbbreviation]);

  const InputComponent = useMemo(() => (
    multiline ? (
      <Textarea
        value={translatedText}
        onChange={handleInputChange}
        className={`w-full${error ? ' border-red-300' : ''}`}
        rows={3}
        placeholder={`Traduzione in ${language}...`}
      />
    ) : (
      <Input
        value={translatedText}
        onChange={handleInputChange}
        className={`w-full${error ? ' border-red-300' : ''}`}
        placeholder={`Traduzione in ${language}...`}
      />
    )
  ), [multiline, translatedText, handleInputChange, error, language]);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex items-start gap-1 w-full">
          {InputComponent}
          <BadgeTranslationStatus
            entityId={id}
            entityType={entityType}
            fieldName={fieldName}
            language={language}
          />
        </div>
        <div className="flex flex-col gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={error ? handleRetryWithFallback : handleTranslate}
                  disabled={isTranslating || !originalText.trim()}
                  className={`whitespace-nowrap${error ? ' border-amber-500 hover:bg-amber-100' : ''}`}
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
