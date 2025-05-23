
import React from "react";
import { SupportedLanguage } from "@/types/translation";
import { useTranslationField } from "./hooks/useTranslationField";
import { TranslationFieldContainer } from "./translation-field/TranslationFieldContainer";

interface TranslationFieldProps {
  id: string;
  entityType: "products" | "categories" | "allergens" | "product_features" | "product_labels";
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
    isEdited,
    error,
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
    <TranslationFieldContainer
      translatedText={translatedText}
      onInputChange={handleInputChange}
      multiline={multiline}
      wide={wide}
      fieldName={fieldName}
      language={language}
      error={error}
      entityId={id}
      entityType={entityType}
      refreshKey={refreshKey}
      isTranslating={isTranslating}
      disabled={!originalText.trim()}
      onTranslate={handleTranslate}
      onRetry={handleRetryWithFallback}
      tooltip={getTooltipText()}
      buttonLabel={getButtonLabel()}
      isEdited={isEdited}
      onSaveManual={handleSaveManual}
    />
  );
};
