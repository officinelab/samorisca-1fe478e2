
import { useEffect } from "react";

/**
 * Hook per iniettare dinamicamente Google Font nel <head> dato un fontFamily
 * Usa solo il nome del font come su Google Fonts, es: "Oswald", "Poppins"
 */
export function useDynamicGoogleFont(fontFamily?: string | null) {
  useEffect(() => {
    if (!fontFamily) return;
    const fontKey = fontFamily.replace(/ /g, "+");
    // Cerca se è già presente
    if (document.querySelector(`link[data-font="${fontKey}"]`)) return;
    // Crea link dinamicamente
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css?family=${fontKey}:400,700,400italic,700italic&display=swap`;
    link.setAttribute("data-font", fontKey);
    document.head.appendChild(link);
    // Clean up opzionale: rimuovi font se fontFamily cambia - non più necessario in questo caso
  }, [fontFamily]);
}

