
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BadgeTranslationStatus } from "./BadgeTranslationStatus";
import { TranslationFieldButtons } from "./TranslationFieldButtons";
import { useTranslationField } from "./hooks/useTranslationField";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SupportedLanguage } from "@/types/translation";

interface TranslationFieldProps {
  id: string;
  entityType: "products" | "categories" | "allergens" | "product_features" | "product_labels";
  fieldName: string;
  originalText: string;
  language: SupportedLanguage;
  multiline?: boolean;
  wide?: boolean; // <-- aggiunto per larghezza forzata
  onTranslationSaved?: (translated: string) => void;
}

export const TranslationField: React.FC<TranslationFieldProps> = ({
  id,
  entityType,
  fieldName,
  originalText,
  language,
  multiline = false,
  wide = false,
  onTranslationSaved
}) => {
  const {
    translatedText,
    setTranslatedText,
    isEdited,
    error,
    retryCount,
    refreshKey,
    handleTranslate,
    handleRetryWithFallback,
    handleInputChange,
    handleSaveManual,
    isTranslating,
    getTooltipText,
    getButtonLabel,
  } = useTranslationField({
    id,
    entityType,
    fieldName,
    originalText,
    language,
    onTranslationSaved,
  });

  // Costruisco classi larghezza
  const baseWidthClass = wide ? "w-[32rem] max-w-full" : "w-full";
  // Regola speciale: per il campo "description" (tipicamente multiline), la textarea è molto più larga e alta.
  const InputComponent = multiline ? (
    <Textarea 
      value={translatedText} 
      onChange={handleInputChange}
      className={`${baseWidthClass} ${fieldName === "description" ? "min-h-[120px]" : ""} ${error ? 'border-red-300' : ''}`}
      rows={fieldName === "description" ? 6 : 3}
      placeholder={`Traduzione in ${language}...`}
    />
  ) : (
    <Input 
      value={translatedText} 
      onChange={handleInputChange}
      className={`${baseWidthClass} ${error ? 'border-red-300' : ''}`}
      placeholder={`Traduzione in ${language}...`}
    />
  );

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {/* Wrapper che mostra la traduzione + stato badge */}
        <div className="flex items-start gap-1 w-full">
          {InputComponent}
          <BadgeTranslationStatus
            entityId={id}
            entityType={entityType}
            fieldName={fieldName}
            language={language}
            refreshKey={refreshKey}
          />
        </div>
        <div className="flex flex-col gap-2">
          <TranslationFieldButtons
            isTranslating={isTranslating}
            error={error}
            disabled={!originalText.trim()}
            onTranslate={handleTranslate}
            onRetry={handleRetryWithFallback}
            tooltip={getTooltipText()}
            buttonLabel={isTranslating ? <Loader2 className="h-4 w-4 animate-spin" /> : getButtonLabel()}
          />
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
