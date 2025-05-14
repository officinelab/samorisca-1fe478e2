
import { LanguageSelector } from "./LanguageSelector";
import { TokenStatus } from "./TokenStatus";
import { SupportedLanguage, TranslationServiceType, translationServiceOptions } from "@/types/translation";
import { Progress } from "@/components/ui/progress";
import { useTranslationStats } from "@/hooks/useTranslationStats";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useTranslationService } from "@/hooks/translation";
import { useEffect } from "react";

interface TranslationHeaderProps {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
}

export const TranslationHeader = ({ selectedLanguage, onLanguageChange }: TranslationHeaderProps) => {
  const { stats, isLoading } = useTranslationStats(selectedLanguage);
  const { currentService, setTranslationService } = useTranslationService();

  const handleServiceChange = (value: string) => {
    const serviceType = value as TranslationServiceType;
    console.log(`TranslationHeader: Cambio servizio di traduzione a: ${serviceType}`);
    setTranslationService(serviceType);
  };

  // Debug dell'attuale servizio selezionato
  useEffect(() => {
    console.log(`TranslationHeader: Servizio di traduzione attuale: ${currentService}`);
  }, [currentService]);

  return (
    <div className="sticky top-0 z-10 bg-white border-b p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-6 justify-between">
        <div className="flex gap-4 items-center">
          <LanguageSelector 
            selectedLanguage={selectedLanguage} 
            onChange={onLanguageChange} 
          />
          
          <div className="w-48">
            <Select
              value={currentService}
              onValueChange={handleServiceChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleziona servizio" />
              </SelectTrigger>
              <SelectContent>
                {translationServiceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <TokenStatus />
        </div>
        
        <div className="w-full md:w-64">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Progresso traduzione:</span>
            <span className="text-sm font-medium">
              {isLoading ? '...' : `${stats.translated}/${stats.total}`}
            </span>
          </div>
          <Progress 
            value={isLoading ? 0 : stats.percentage} 
            className="h-2" 
          />
          <p className="text-xs text-muted-foreground mt-1">
            {isLoading ? 'Caricamento statistiche...' : `${stats.percentage}% completato`}
          </p>
        </div>
      </div>
    </div>
  );
};
