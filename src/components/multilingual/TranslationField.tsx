
import React, { useState, useEffect, useCallback } from "react";
import { useTranslationService } from "@/hooks/translation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SupportedLanguage } from "@/types/translation";
import { Loader2 } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";

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
      if (existing) {
        setTranslatedText(existing);
      } else {
        setTranslatedText("");
      }
    };

    fetchExistingTranslation();
  }, [id, entityType, fieldName, language, getExistingTranslation, currentService]);

  // Gestione traduzione
  const handleTranslate = async () => {
    if (!originalText.trim()) return;

    console.log(`TranslationField (${fieldName}): Avvio traduzione con servizio: ${currentService}`);

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
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTranslatedText(e.target.value);
    setIsEdited(true);
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
      className="w-full"
      rows={3}
      placeholder={`Traduzione in ${language}...`}
    />
  ) : (
    <Input 
      value={translatedText} 
      onChange={handleInputChange}
      className="w-full"
      placeholder={`Traduzione in ${language}...`}
    />
  );

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {InputComponent}
        <div className="flex flex-col gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleTranslate}
                  disabled={isTranslating || !originalText.trim()}
                  className="whitespace-nowrap"
                >
                  {getButtonLabel()}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {getTooltipText()}
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
    </div>
  );
};
