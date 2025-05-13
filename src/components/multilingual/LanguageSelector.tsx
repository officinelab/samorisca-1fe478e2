
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SupportedLanguage, LanguageOption } from "@/types/translation";

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onChange: (language: SupportedLanguage) => void;
}

export const languageOptions: LanguageOption[] = [
  { value: 'en', label: 'Inglese' },
  { value: 'fr', label: 'Francese' },
  { value: 'de', label: 'Tedesco' },
  { value: 'es', label: 'Spagnolo' },
];

export const LanguageSelector = ({ selectedLanguage, onChange }: LanguageSelectorProps) => {
  return (
    <div className="w-48">
      <Select
        value={selectedLanguage}
        onValueChange={(value) => onChange(value as SupportedLanguage)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleziona lingua" />
        </SelectTrigger>
        <SelectContent>
          {languageOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
