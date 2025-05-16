
import { useMemo } from "react";
import { menuUiTranslations, MenuUiLocale } from "@/locales/menuUI";

// Restituisce una funzione t("key") per la lingua richiesta
export function useMenuUiTranslation(language: string) {
  const t = useMemo(() => {
    const dictionary = menuUiTranslations[(language as MenuUiLocale) || "it"] || menuUiTranslations.it;
    return (key: string) => dictionary[key] ?? key;
  }, [language]);
  return { t };
}
