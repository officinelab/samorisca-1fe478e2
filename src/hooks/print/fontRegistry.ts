
import { Font } from '@react-pdf/renderer';
import { PrintLayout } from '@/types/printLayout';
import { fontUrlMap, INTER_FONT_URLS } from './fontMappings';

// Set per tenere traccia dei font già registrati
const registeredFonts = new Set<string>();

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

// Registra il font Inter come fallback
const registerInterFont = async (): Promise<void> => {
  if (!registeredFonts.has('Inter')) {
    try {
      console.log('🔤 Registrazione font Inter...');
      
      Font.register({
        family: 'Inter',
        fonts: [
          { 
            src: INTER_FONT_URLS.normal,
            fontWeight: 'normal'
          },
          { 
            src: INTER_FONT_URLS.bold,
            fontWeight: 'bold'
          }
        ],
      });
      
      registeredFonts.add('Inter');
      console.log('✅ Font Inter registrato con successo');
    } catch (error) {
      console.error('❌ Errore registrazione font Inter:', error);
      throw new Error(`Errore durante la registrazione del font Inter: ${error}`);
    }
  }
};

// Registra un singolo font con tutte le sue varianti
const registerSingleFont = async (fontFamily: string): Promise<void> => {
  const cleanFontName = fontFamily.split(',')[0].trim();
  
  if (registeredFonts.has(cleanFontName)) {
    console.log(`✓ Font ${cleanFontName} già registrato`);
    return;
  }

  console.log(`🔤 Registrazione font: ${cleanFontName}`);
  
  try {
    // Controlla se abbiamo URL specifici per questo font
    const fontUrls = fontUrlMap[cleanFontName];
    
    if (!fontUrls) {
      console.warn(`⚠️ Font ${cleanFontName} non trovato nella mappa, uso Inter come fallback`);
      registeredFonts.add(cleanFontName); // Marca come "registrato" per evitare tentativi ripetuti
      return;
    }

    console.log(`📥 URL font ${cleanFontName}:`, fontUrls);

    Font.register({
      family: cleanFontName,
      fonts: [
        { 
          src: fontUrls.normal,
          fontWeight: 'normal'
        },
        { 
          src: fontUrls.bold,
          fontWeight: 'bold'
        }
      ],
    });
    
    registeredFonts.add(cleanFontName);
    console.log(`✅ Font ${cleanFontName} registrato con successo`);
  } catch (error) {
    console.error(`❌ Errore durante la registrazione del font ${cleanFontName}:`, error);
    throw new Error(`Errore durante la registrazione del font ${cleanFontName}: ${error}`);
  }
};

// Funzione principale per registrare dinamicamente i font
export const registerLayoutFonts = async (layout: PrintLayout): Promise<void> => {
  console.log('🎯 Inizio registrazione font per layout:', layout.name);
  
  try {
    const fonts = getUniqueFontsFromLayout(layout);
    console.log('🔤 Font rilevati dal layout:', Array.from(fonts));
    
    // Registra sempre Inter come font di fallback per primo
    await registerInterFont();
    
    // Registra tutti i font del layout in sequenza
    for (const fontFamily of fonts) {
      await registerSingleFont(fontFamily);
    }
    
    console.log('✅ Tutti i font sono stati registrati con successo');
  } catch (error) {
    console.error('❌ Errore durante la registrazione dei font:', error);
    throw error;
  }
};
