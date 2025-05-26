
import { useState, useEffect } from "react";
import { SupportedLanguage } from "@/types/translation";
import { useTranslationService } from "@/hooks/translation";
import { supabase } from "@/integrations/supabase/client";

export const useMultilingualPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>("en");
  const [activeTab, setActiveTab] = useState("general");
  const { currentService, isLoading } = useTranslationService();
  
  // Verifica la disponibilità dell'API key di OpenAI
  useEffect(() => {
    const checkOpenAIKey = async () => {
      try {
        // Invoca una funzione edge personalizzata per verificare la disponibilità dell'API key
        const { error } = await supabase.functions.invoke('translate-openai', {
          body: { checkApiKeyOnly: true }
        });
        
        if (error) {
          console.warn('OpenAI API non configurata correttamente:', error);
        }
      } catch (error) {
        console.error('Errore nella verifica dell\'API OpenAI:', error);
      }
    };
    
    // Verifica solo se il servizio attuale è OpenAI
    if (currentService === 'openai' && !isLoading) {
      checkOpenAIKey();
    }
  }, [currentService, isLoading]);
  
  // Debug per verificare il servizio attualmente selezionato
  useEffect(() => {
    if (!isLoading) {
      console.log(`MultilingualPage: Servizio di traduzione attuale: ${currentService}`);
    }
  }, [currentService, isLoading]);

  return {
    selectedLanguage,
    setSelectedLanguage,
    activeTab,
    setActiveTab,
    currentService,
    isLoading
  };
};
