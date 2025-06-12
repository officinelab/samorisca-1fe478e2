
import { Font } from '@react-pdf/renderer';
import { PrintLayout } from '@/types/printLayout';

// Set per tenere traccia dei font già registrati
const registeredFonts = new Set<string>();

// Font di sistema sicuri per il fallback
const SYSTEM_FONTS = ['Helvetica', 'Times-Roman', 'Courier'];

// Mapping dei font personalizzati a font di sistema
const fontFallbackMap: Record<string, string> = {
  'Playfair Display': 'Times-Roman',
  'Open Sans': 'Helvetica',
  'Roboto': 'Helvetica',
  'Lato': 'Helvetica',
  'Montserrat': 'Helvetica',
  'Poppins': 'Helvetica',
  'Source Sans Pro': 'Helvetica',
  'Oswald': 'Helvetica',
  'Raleway': 'Helvetica',
  'PT Sans': 'Helvetica',
  'Lora': 'Times-Roman',
  'Nunito': 'Helvetica',
  'Merriweather': 'Times-Roman',
  'Ubuntu': 'Helvetica',
  'Crimson Text': 'Times-Roman',
  'Inter': 'Helvetica'
};

// Funzione per ottenere i font unici dal layout
export const getUniqueFontsFromLayout = (layout: PrintLayout): Set<string> => {
  const fonts = new Set<string>();
  
  // Font dalla copertina
  if (layout.cover?.title?.fontFamily) {
    fonts.add(layout.cover.title.fontFamily);
  }
  if (layout.cover?.subtitle?.fontFamily) {
    fonts.add(layout.cover.subtitle.fontFamily);
  }
  
  // Font dagli elementi del menu
  if (layout.elements) {
    Object.values(layout.elements).forEach(element => {
      if (element && typeof element === 'object' && 'fontFamily' in element) {
        fonts.add(element.fontFamily);
      }
    });
  }
  
  // Font dagli allergeni
  if (layout.allergens?.title?.fontFamily) {
    fonts.add(layout.allergens.title.fontFamily);
  }
  if (layout.allergens?.item?.number?.fontFamily) {
    fonts.add(layout.allergens.item.number.fontFamily);
  }
  if (layout.allergens?.item?.title?.fontFamily) {
    fonts.add(layout.allergens.item.title.fontFamily);
  }
  
  return fonts;
};

// Funzione per ottenere un font sicuro
export const getSafeFont = (fontFamily?: string): string => {
  if (!fontFamily) return 'Helvetica';
  
  // Rimuovi parti dopo la virgola (es. "Playfair Display, serif" -> "Playfair Display")
  const cleanFont = fontFamily.split(',')[0].trim();
  
  // Se è già un font di sistema, usalo direttamente
  if (SYSTEM_FONTS.includes(cleanFont)) {
    return cleanFont;
  }
  
  // Altrimenti usa il fallback mappato
  return fontFallbackMap[cleanFont] || 'Helvetica';
};

// Funzione principale per registrare dinamicamente i font
export const registerLayoutFonts = async (layout: PrintLayout): Promise<void> => {
  console.log('🎯 Inizio registrazione font per layout:', layout.name);
  
  try {
    const fonts = getUniqueFontsFromLayout(layout);
    console.log('🔤 Font rilevati dal layout:', Array.from(fonts));
    
    // Per ora usiamo solo font di sistema, nessuna registrazione necessaria
    console.log('✅ Utilizzo font di sistema sicuri - nessuna registrazione necessaria');
  } catch (error) {
    console.error('❌ Errore durante la registrazione dei font:', error);
    // Non lanciare l'errore, continua con i font di sistema
    console.log('⚠️ Continuo con font di sistema di default');
  }
};
