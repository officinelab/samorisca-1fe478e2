
import React from "react";

interface TranslationFieldErrorProps {
  error: string | null;
}

export const TranslationFieldError: React.FC<TranslationFieldErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <p className="text-xs text-red-500">
      Errore: {error}
    </p>
  );
};
