import { useEffect } from "react";
import { SiteSettings } from "@/hooks/site-settings/types";
import { useDynamicGoogleFont, preloadSpecificFonts } from "@/hooks/useDynamicGoogleFont";
import { debugLog } from "@/utils/logger";

interface FontConfigItem {
  fontFamily: string;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  desktop: { fontSize: number };
  mobile: { fontSize: number };
  detail: { fontSize: number };
}

interface FontConfig {
  title: FontConfigItem;
  description: FontConfigItem;
  price: FontConfigItem;
}

export const useFontSettings = (siteSettings: SiteSettings | null, layoutType: string) => {
  const defaultFontSettings = {
    title: { fontFamily: "Poppins", fontWeight: "bold", fontStyle: "normal", desktop: { fontSize: 18 }, mobile: { fontSize: 18 }, detail: { fontSize: 18 } },
    description: { fontFamily: "Open Sans", fontWeight: "normal", fontStyle: "normal", desktop: { fontSize: 14 }, mobile: { fontSize: 14 }, detail: { fontSize: 16 } },
    price: { fontFamily: "Poppins", fontWeight: "bold", fontStyle: "normal", desktop: { fontSize: 16 }, mobile: { fontSize: 16 }, detail: { fontSize: 18 } }
  } as FontConfig;

  const publicMenuFontSettings = siteSettings?.publicMenuFontSettings || {};
  const fontSettingsConfig = publicMenuFontSettings?.[layoutType] || {};

  const fontSettings = {
    title: {
      fontFamily: fontSettingsConfig?.title?.fontFamily || defaultFontSettings.title.fontFamily,
      fontWeight: fontSettingsConfig?.title?.fontWeight || defaultFontSettings.title.fontWeight,
      fontStyle: fontSettingsConfig?.title?.fontStyle || defaultFontSettings.title.fontStyle,
      desktop: { fontSize: fontSettingsConfig?.title?.desktop?.fontSize || defaultFontSettings.title.desktop.fontSize },
      mobile: { fontSize: fontSettingsConfig?.title?.mobile?.fontSize || defaultFontSettings.title.mobile.fontSize },
      detail: { fontSize: fontSettingsConfig?.title?.detail?.fontSize || defaultFontSettings.title.detail.fontSize }
    },
    description: {
      fontFamily: fontSettingsConfig?.description?.fontFamily || defaultFontSettings.description.fontFamily,
      fontWeight: fontSettingsConfig?.description?.fontWeight || defaultFontSettings.description.fontWeight,
      fontStyle: fontSettingsConfig?.description?.fontStyle || defaultFontSettings.description.fontStyle,
      desktop: { fontSize: fontSettingsConfig?.description?.desktop?.fontSize || defaultFontSettings.description.desktop.fontSize },
      mobile: { fontSize: fontSettingsConfig?.description?.mobile?.fontSize || defaultFontSettings.description.mobile.fontSize },
      detail: { fontSize: fontSettingsConfig?.description?.detail?.fontSize || defaultFontSettings.description.detail.fontSize }
    },
    price: {
      fontFamily: fontSettingsConfig?.price?.fontFamily || defaultFontSettings.price.fontFamily,
      fontWeight: fontSettingsConfig?.price?.fontWeight || defaultFontSettings.price.fontWeight,
      fontStyle: fontSettingsConfig?.price?.fontStyle || defaultFontSettings.price.fontStyle,
      desktop: { fontSize: fontSettingsConfig?.price?.desktop?.fontSize || defaultFontSettings.price.desktop.fontSize },
      mobile: { fontSize: fontSettingsConfig?.price?.mobile?.fontSize || defaultFontSettings.price.mobile.fontSize },
      detail: { fontSize: fontSettingsConfig?.price?.detail?.fontSize || defaultFontSettings.price.detail.fontSize }
    }
  };

  // Precarica i font configurati per il layout corrente
  useEffect(() => {
    const uniqueFonts = new Set([
      fontSettings.title.fontFamily,
      fontSettings.description.fontFamily,
      fontSettings.price.fontFamily
    ]);
    
    const fontsArray = Array.from(uniqueFonts).filter(Boolean);
    
    if (fontsArray.length > 0) {
      debugLog(`🎨 Preloading fonts for layout ${layoutType}:`, fontsArray);
      preloadSpecificFonts(fontsArray);
    }
  }, [siteSettings, layoutType, fontSettings.title.fontFamily, fontSettings.description.fontFamily, fontSettings.price.fontFamily]);

  // Carica dinamicamente i font individuali
  useDynamicGoogleFont(fontSettings.title.fontFamily);
  useDynamicGoogleFont(fontSettings.description.fontFamily);
  useDynamicGoogleFont(fontSettings.price.fontFamily);

  const getCardFontSettings = (view: 'mobile' | 'desktop') => ({
    title: {
      fontFamily: fontSettings.title.fontFamily,
      fontWeight: fontSettings.title.fontWeight,
      fontStyle: fontSettings.title.fontStyle,
      fontSize: fontSettings.title?.[view]?.fontSize || fontSettings.title.desktop.fontSize
    },
    description: {
      fontFamily: fontSettings.description.fontFamily,
      fontWeight: fontSettings.description.fontWeight,
      fontStyle: fontSettings.description.fontStyle,
      fontSize: fontSettings.description?.[view]?.fontSize || fontSettings.description.desktop.fontSize
    },
    price: {
      fontFamily: fontSettings.price.fontFamily,
      fontWeight: fontSettings.price.fontWeight,
      fontStyle: fontSettings.price.fontStyle,
      fontSize: fontSettings.price?.[view]?.fontSize || fontSettings.price.desktop.fontSize
    }
  });

  const getDetailFontSettings = () => ({
    title: {
      fontFamily: fontSettings.title.fontFamily,
      fontWeight: fontSettings.title.fontWeight,
      fontStyle: fontSettings.title.fontStyle,
      fontSize: fontSettings.title?.detail?.fontSize || fontSettings.title.desktop.fontSize
    },
    description: {
      fontFamily: fontSettings.description.fontFamily,
      fontWeight: fontSettings.description.fontWeight,
      fontStyle: fontSettings.description.fontStyle,
      fontSize: fontSettings.description?.detail?.fontSize || fontSettings.description.desktop.fontSize
    },
    price: {
      fontFamily: fontSettings.price.fontFamily,
      fontWeight: fontSettings.price.fontWeight,
      fontStyle: fontSettings.price.fontStyle,
      fontSize: fontSettings.price?.detail?.fontSize || fontSettings.price.desktop.fontSize
    }
  });

  return {
    getCardFontSettings,
    getDetailFontSettings
  };
};
// Aggiungi questa funzione nel file useDynamicGoogleFont.ts o dove gestisci i font

export const preloadCriticalFonts = (fonts: string[]) => {
  // Crea link di preconnect per Google Fonts
  const preconnectLink = document.createElement('link');
  preconnectLink.rel = 'preconnect';
  preconnectLink.href = 'https://fonts.googleapis.com';
  preconnectLink.crossOrigin = 'anonymous';
  
  const preconnectGstatic = document.createElement('link');
  preconnectGstatic.rel = 'preconnect';
  preconnectGstatic.href = 'https://fonts.gstatic.com';
  preconnectGstatic.crossOrigin = 'anonymous';
  
  // Aggiungi solo se non esistono già
  if (!document.querySelector('link[href="https://fonts.googleapis.com"]')) {
    document.head.appendChild(preconnectLink);
  }
  if (!document.querySelector('link[href="https://fonts.gstatic.com"]')) {
    document.head.appendChild(preconnectGstatic);
  }
  
  // Precarica i font critici
  fonts.forEach(font => {
    const fontUrl = `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@400;700&display=swap`;
    
    // Crea link di preload
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'style';
    preloadLink.href = fontUrl;
    
    // Crea link di stylesheet
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = fontUrl;
    
    // Aggiungi solo se non esiste già
    if (!document.querySelector(`link[href="${fontUrl}"]`)) {
      document.head.appendChild(preloadLink);
      document.head.appendChild(styleLink);
    }
  });
};