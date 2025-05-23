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
import { Skeleton } from "@/components/ui/skeleton";
import { BuyTokensButton } from "./BuyTokensButton";

interface TranslationHeaderProps {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
}

export const TranslationHeader = ({ selectedLanguage, onLanguageChange }: TranslationHeaderProps) => {
  const { stats, isLoading: statsLoading } = useTranslationStats(selectedLanguage);
  const { currentService, setTranslationService, isLoading: serviceLoading } = useTranslationService();

  const handleServiceChange = (value: string) => {
    const serviceType = value as TranslationServiceType;
    console.log(`TranslationHeader: Cambio servizio di traduzione a: ${serviceType}`);
    setTranslationService(serviceType);
  };

  // Calcola la classe della barra
  const getProgressBarColor = () => {
    if (stats.percentage === 100) {
      return "bg-green-500";
    } else if (stats.percentage > 50) {
      return "bg-yellow-400";
    } else {
      return "bg-red-500";
    }
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
            {serviceLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
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
            )}
          </div>
        </div>
        {/* RIGA TOKEN & ACQUISTO: progress + bottone */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 w-full md:w-auto">
          <div>
            <TokenStatus />
          </div>
          <BuyTokensButton />
        </div>
        <div className="w-full md:w-64">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Progresso traduzione:</span>
            <span className="text-sm font-medium">
              {statsLoading ? '...' : `${stats.translated}/${stats.total}`}
            </span>
          </div>
          <Progress 
            value={statsLoading ? 0 : stats.percentage} 
            className="h-2"
            indicatorClassName={getProgressBarColor()}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {statsLoading
              ? 'Caricamento statistiche...'
              : (
                  stats.translated === stats.total
                    ? '100% completato'
                    : `${stats.percentage}% completato`
                )
            }
          </p>
        </div>
      </div>
    </div>
  );
};
