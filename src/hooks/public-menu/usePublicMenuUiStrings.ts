
import uiStrings, { PublicMenuUiLang, PublicMenuUiStringKey } from "@/locales/publicMenuUiStrings";

export function usePublicMenuUiStrings(lang: string = "it") {
  // Normalizza il codice lingua per sicurezza
  const langCode = lang.split("-")[0] as PublicMenuUiLang;
  const t = (key: PublicMenuUiStringKey): string => {
    return uiStrings[langCode]?.[key] || uiStrings['it'][key] || key;
  };
  return { t };
}
