
import React from "react";
import { SupportedLanguage } from "@/types/translation";
import { TranslationFieldInput } from "./TranslationFieldInput";
import { TranslationFieldActions } from "./TranslationFieldActions";
import { TranslationFieldError } from "./TranslationFieldError";
import { BadgeTranslationStatus } from "../BadgeTranslationStatus";

interface TranslationFieldContainerProps {
  translatedText: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
  wide?: boolean;
  fieldName: string;
  language: SupportedLanguage;
  error: string | null;
  entityId: string;
  entityType: "products" | "categories" | "allergens" | "product_features" | "product_labels";
  refreshKey: number;
  isTranslating: boolean;
  disabled: boolean;
  onTranslate: () => void;
  onRetry: () => void;
  tooltip: string;
  buttonLabel: React.ReactNode;
  isEdited: boolean;
  onSaveManual: () => void;
}

export const TranslationFieldContainer: React.FC<TranslationFieldContainerProps> = ({
  translatedText,
  onInputChange,
  multiline = false,
  wide = false,
  fieldName,
  language,
  error,
  entityId,
  entityType,
  refreshKey,
  isTranslating,
  disabled,
  onTranslate,
  onRetry,
  tooltip,
  buttonLabel,
  isEdited,
  onSaveManual,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex items-start gap-1 w-full">
          <TranslationFieldInput
            value={translatedText}
            onChange={onInputChange}
            multiline={multiline}
            fieldName={fieldName}
            language={language}
            wide={wide}
            error={error}
          />
          <BadgeTranslationStatus
            entityId={entityId}
            entityType={entityType}
            fieldName={fieldName}
            language={language}
            refreshKey={refreshKey}
          />
        </div>
        <TranslationFieldActions
          isTranslating={isTranslating}
          error={error}
          disabled={disabled}
          onTranslate={onTranslate}
          onRetry={onRetry}
          tooltip={tooltip}
          buttonLabel={buttonLabel}
          isEdited={isEdited}
          onSaveManual={onSaveManual}
          translatedText={translatedText}
        />
      </div>
      <TranslationFieldError error={error} />
    </div>
  );
};
