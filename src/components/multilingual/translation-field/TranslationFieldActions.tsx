
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { TranslationFieldButtons } from "../TranslationFieldButtons";

interface TranslationFieldActionsProps {
  isTranslating: boolean;
  error: string | null;
  disabled: boolean;
  onTranslate: () => void;
  onRetry: () => void;
  tooltip: string;
  buttonLabel: React.ReactNode;
  isEdited: boolean;
  onSaveManual: () => void;
  translatedText: string;
}

export const TranslationFieldActions: React.FC<TranslationFieldActionsProps> = ({
  isTranslating,
  error,
  disabled,
  onTranslate,
  onRetry,
  tooltip,
  buttonLabel,
  isEdited,
  onSaveManual,
  translatedText
}) => {
  return (
    <div className="flex flex-col gap-2">
      <TranslationFieldButtons
        isTranslating={isTranslating}
        error={error}
        disabled={disabled}
        onTranslate={onTranslate}
        onRetry={onRetry}
        tooltip={tooltip}
        buttonLabel={isTranslating ? <Loader2 className="h-4 w-4 animate-spin" /> : buttonLabel}
      />
      {isEdited && (
        <Button 
          variant="default"
          size="sm"
          onClick={onSaveManual}
          disabled={!translatedText.trim()}
        >
          Salva
        </Button>
      )}
    </div>
  );
};
