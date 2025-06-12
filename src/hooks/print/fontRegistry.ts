
import { Font } from '@react-pdf/renderer';
import { PrintLayout } from '@/types/printLayout';
import { fontUrlMap, GOOGLE_FONTS_BASE_URL, INTER_FONT_URLS } from './fontMappings';

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
      console.log('✅ Font Inter registrato come fallback');
    } catch (error) {
      console.warn('⚠️ Errore registrazione font Inter:', error);
    }
  }
};

// Registra un singolo font con tutte le sue varianti
const registerSingleFont = async (fontFamily: string): Promise<void> => {
  const cleanFontName = fontFamily.split(',')[0].trim();
  
  if (registeredFonts.has(cleanFontName)) {
    return;
  }

  console.log(`📝 Registrazione font: ${cleanFontName}`);
  
  try {
    const fontSlug = fontUrlMap[cleanFontName] || cleanFontName.toLowerCase().replace(/\s+/g, '');
    
    // Costruisci gli URL per le varianti del font
    const baseUrl = `${GOOGLE_FONTS_BASE_URL}/${fontSlug}`;
    const normalUrl = `${baseUrl}/v30/${fontSlug.replace(/\s+/g, '')}-Regular.woff2`;
    const boldUrl = `${baseUrl}/v30/${fontSlug.replace(/\s+/g, '')}-Bold.woff2`;

    Font.register({
      family: cleanFontName,
      fonts: [
        { 
          src: normalUrl,
          fontWeight: 'normal'
        },
        { 
          src: boldUrl,
          fontWeight: 'bold'
        }
      ],
    });
    
    registeredFonts.add(cleanFontName);
    console.log(`✅ Font ${cleanFontName} registrato con successo`);
  } catch (error) {
    console.warn(`⚠️ Impossibile registrare il font ${cleanFontName}, uso Inter come fallback:`, error);
    registeredFonts.add(cleanFontName);
  }
};

// Funzione principale per registrare dinamicamente i font
export const registerLayoutFonts = async (layout: PrintLayout): Promise<void> => {
  const fonts = getUniqueFontsFromLayout(layout);
  console.log('🔤 Font rilevati dal layout:', Array.from(fonts));
  
  // Registra sempre Inter come font di fallback
  await registerInterFont();
  
  // Registra tutti i font del layout
  const registrationPromises = Array.from(fonts).map(fontFamily => 
    registerSingleFont(fontFamily)
  );
  
  await Promise.all(registrationPromises);
};
