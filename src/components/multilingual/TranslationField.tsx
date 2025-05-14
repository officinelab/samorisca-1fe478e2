
import React, { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SupportedLanguage } from "@/types/translation";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { TranslationStatusBadge } from "./TranslationStatusBadge";
import { useTranslationFieldState } from "./useTranslationFieldState";

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
  onTranslationSaved,
}) => {
  const {
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
  } = useTranslationFieldState({
    id,
    entityType,
    fieldName,
    originalText,
    language,
    onTranslationSaved,
  });

  const getServiceAbbreviation = useCallback(() => {
    switch (currentService) {
      case "perplexity":
        return "AI";
      case "deepl":
        return "DeepL";
      case "openai":
        return "GPT";
      default:
        return "API";
    }
  }, [currentService]);

  const getButtonLabel = useCallback(() => {
    if (isTranslating) return <Loader2 className="h-4 w-4 animate-spin" />;
    return `Traduci (${getServiceAbbreviation()})`;
  }, [isTranslating, getServiceAbbreviation]);

  const getTooltipText = useCallback(() => `Traduci con ${getServiceName()}`, [getServiceName]);

  const InputComponent = multiline ? (
    <Textarea
      value={translatedData?.translatedText || ""}
      onChange={handleInputChange}
      className={`w-full ${error ? "border-red-300" : ""}`}
      rows={3}
      placeholder={`Traduzione in ${language}...`}
    />
  ) : (
    <Input
      value={translatedData?.translatedText || ""}
      onChange={handleInputChange}
      className={`w-full ${error ? "border-red-300" : ""}`}
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
                  className={`whitespace-nowrap ${
                    error ? "border-amber-500 hover:bg-amber-100" : ""
                  }`}
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
                {error ? "Riprova la traduzione" : getTooltipText()}
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
      {error && <p className="text-xs text-red-500">Errore: {error}</p>}
    </div>
  );
};
