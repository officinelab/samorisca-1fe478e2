
import { useState, useEffect } from "react";

// Constante per la chiave di localStorage
const LANGUAGE_STORAGE_KEY = "menu_language";

interface LanguageState {
  language: string;
  setLanguage: (lang: string) => void;
}

export const useLanguageStore = (): LanguageState => {
  // Carica la lingua dal localStorage o usa italiano come predefinito
  const [language, setLanguageState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      return savedLanguage || "it";
    }
    return "it";
  });

  // Salva la lingua in localStorage quando cambia
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }
  }, [language]);

  // Funzione per cambiare la lingua
  const setLanguage = (lang: string) => {
    setLanguageState(lang);
  };

  return {
    language,
    setLanguage,
  };
};

export default useLanguageStore;
