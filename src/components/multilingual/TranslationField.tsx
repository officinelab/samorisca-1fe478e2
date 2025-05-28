
import React from "react";
import { BadgeTranslationStatus } from "./BadgeTranslationStatus";
import { useTranslationField } from "./hooks/useTranslationField";
import { SupportedLanguage } from "@/types/translation";
import { TranslationFieldInput } from "./translation-field/TranslationFieldInput";
import { TranslationFieldActions } from "./translation-field/TranslationFieldActions";
import { TranslationFieldError } from "./translation-field/TranslationFieldError";

interface TranslationFieldProps {
  id: string;
  entityType: "products" | "categories" | "allergens" | "product_features" | "product_labels" | "category_notes";
  fieldName: string;
  originalText: string;
  language: SupportedLanguage;
  multiline?: boolean;
  wide?: boolean;
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

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {/* Wrapper che mostra la traduzione + stato badge */}
        <div className="flex items-start gap-1 w-full">
          <TranslationFieldInput
            value={translatedText}
            onChange={handleInputChange}
            multiline={multiline}
            fieldName={fieldName}
            language={language}
            wide={wide}
            error={error}
          />
          <BadgeTranslationStatus
            entityId={id}
            entityType={entityType}
            fieldName={fieldName}
            language={language}
            refreshKey={refreshKey}
          />
        </div>
        <TranslationFieldActions
          isTranslating={isTranslating}
          error={error}
          disabled={!originalText.trim()}
          onTranslate={handleTranslate}
          onRetry={handleRetryWithFallback}
          tooltip={getTooltipText()}
          buttonLabel={getButtonLabel()}
          isEdited={isEdited}
          onSaveManual={handleSaveManual}
          translatedText={translatedText}
        />
      </div>
      <TranslationFieldError error={error} />
    </div>
  );
};
