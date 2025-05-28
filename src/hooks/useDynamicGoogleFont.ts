
import { useEffect } from "react";

// Cache globale per i font già caricati
const loadedFonts = new Set<string>();
const loadingFonts = new Set<string>();

/**
 * Hook ottimizzato per iniettare dinamicamente Google Font nel <head>
 * Previene caricamenti multipli dello stesso font e gestisce il loading
 */
export function useDynamicGoogleFont(fontFamily?: string | null) {
  useEffect(() => {
    if (!fontFamily) return;
    
    // Normalizza il nome del font
    const normalizedFont = fontFamily.trim();
    const fontKey = normalizedFont.replace(/ /g, "+");
    
    // Se il font è già caricato o in caricamento, non fare nulla
    if (loadedFonts.has(fontKey) || loadingFonts.has(fontKey)) {
      return;
    }

    // Controlla se esiste già un link per questo font
    const existingLink = document.querySelector(`link[data-font="${fontKey}"]`);
    if (existingLink) {
      loadedFonts.add(fontKey);
      return;
    }

    // Marca il font come in caricamento
    loadingFonts.add(fontKey);
    
    console.log(`🔤 Loading Google Font: ${normalizedFont}`);

    // Crea il link per il font
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontKey}:wght@400;500;600;700&display=swap`;
    link.setAttribute("data-font", fontKey);
    
    // Gestisci il completamento del caricamento
    link.onload = () => {
      console.log(`✅ Google Font loaded: ${normalizedFont}`);
      loadedFonts.add(fontKey);
      loadingFonts.delete(fontKey);
    };
    
    link.onerror = () => {
      console.error(`❌ Failed to load Google Font: ${normalizedFont}`);
      loadingFonts.delete(fontKey);
    };
    
    // Aggiungi al head
    document.head.appendChild(link);
    
    // Cleanup function - non rimuoviamo i font per performance
    return () => {
      // I font vengono mantenuti in cache per tutta la sessione
      // per evitare ricaricamenti inutili
    };
  }, [fontFamily]);
}

/**
 * Precarica font comuni per migliorare le performance
 */
export function preloadCommonFonts() {
  const commonFonts = ['Poppins', 'Open Sans', 'Roboto', 'Inter'];
  
  commonFonts.forEach(font => {
    const fontKey = font.replace(/ /g, "+");
    
    if (!loadedFonts.has(fontKey) && !loadingFonts.has(fontKey)) {
      // Usa un link preload per i font comuni
      const preloadLink = document.createElement("link");
      preloadLink.rel = "preload";
      preloadLink.as = "style";
      preloadLink.href = `https://fonts.googleapis.com/css2?family=${fontKey}:wght@400;500;600;700&display=swap`;
      preloadLink.setAttribute("data-font-preload", fontKey);
      
      preloadLink.onload = () => {
        // Converti il preload in stylesheet
        const styleLink = document.createElement("link");
        styleLink.rel = "stylesheet";
        styleLink.href = preloadLink.href;
        styleLink.setAttribute("data-font", fontKey);
        document.head.appendChild(styleLink);
        
        loadedFonts.add(fontKey);
        console.log(`🚀 Preloaded font: ${font}`);
      };
      
      document.head.appendChild(preloadLink);
      loadingFonts.add(fontKey);
    }
  });
}

/**
 * Pulisce la cache dei font (utile per development)
 */
export function clearFontCache() {
  loadedFonts.clear();
  loadingFonts.clear();
  
  // Rimuovi tutti i link dei font
  document.querySelectorAll('link[data-font], link[data-font-preload]').forEach(link => {
    link.remove();
  });
  
  console.log('🧹 Font cache cleared');
}
