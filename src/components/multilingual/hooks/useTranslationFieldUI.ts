
import { useCallback } from "react";
import { useTranslationService } from "@/hooks/translation";

export function useTranslationFieldUI() {
  const { getServiceName, currentService, isTranslating } = useTranslationService();

  const getTooltipText = useCallback(() => `Traduci con ${getServiceName()}`, [getServiceName]);
  
  const getServiceAbbreviation = useCallback(() => {
    switch(currentService) {
      case 'perplexity': return 'AI';
      case 'deepl': return 'DeepL';
      case 'openai': return 'GPT';
      default: return 'API';
    }
  }, [currentService]);

  const getButtonLabel = useCallback(() => {
    return isTranslating ? null : `Traduci (${getServiceAbbreviation()})`;
  }, [isTranslating, getServiceAbbreviation]);

  return {
    getTooltipText,
    getButtonLabel,
    isTranslating,
  };
}
