
import React, { useState, useEffect } from "react";
import { useTranslationService } from "@/hooks/translation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SupportedLanguage } from "@/types/translation";
import { Loader2 } from "lucide-react";

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
  const { translateText, getExistingTranslation, saveTranslation, isTranslating, currentService } = useTranslationService();

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
  }, [id, entityType, fieldName, language]);

  const handleTranslate = async () => {
    if (!originalText.trim()) return;

    console.log(`TranslationField: Translating with ${currentService}`);

    const result = await translateText(
      originalText,
      language,
      id,
      entityType,
      fieldName
    );

    if (result.success && result.translatedText) {
      console.log(`Translation result: "${result.translatedText}"`);
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

  const getButtonLabel = () => {
    if (isTranslating) return <Loader2 className="h-4 w-4 animate-spin" />;
    return `Traduci (${currentService === 'perplexity' ? 'AI' : 'DeepL'})`;
  };

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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleTranslate}
            disabled={isTranslating || !originalText.trim()}
            title={`Traduci con ${currentService === 'perplexity' ? 'Perplexity AI' : 'DeepL API'}`}
            className="whitespace-nowrap"
          >
            {getButtonLabel()}
          </Button>
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
