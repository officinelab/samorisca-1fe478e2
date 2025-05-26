
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TranslationFieldInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  multiline?: boolean;
  fieldName: string;
  language: string;
  wide?: boolean;
  error?: string | null;
}

export const TranslationFieldInput: React.FC<TranslationFieldInputProps> = ({
  value,
  onChange,
  multiline = false,
  fieldName,
  language,
  wide = false,
  error
}) => {
  // Costruisco classi larghezza
  const baseWidthClass = wide ? "w-[32rem] max-w-full" : "w-full";
  
  // Regola speciale: per il campo "description" (tipicamente multiline), la textarea è molto più larga e alta.
  if (multiline) {
    return (
      <Textarea 
        value={value} 
        onChange={onChange}
        className={`${baseWidthClass} ${fieldName === "description" ? "min-h-[120px]" : ""} ${error ? 'border-red-300' : ''}`}
        rows={fieldName === "description" ? 6 : 3}
        placeholder={`Traduzione in ${language}...`}
      />
    );
  }

  return (
    <Input 
      value={value} 
      onChange={onChange}
      className={`${baseWidthClass} ${error ? 'border-red-300' : ''}`}
      placeholder={`Traduzione in ${language}...`}
    />
  );
};
