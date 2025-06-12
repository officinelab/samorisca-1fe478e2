
import { useState } from 'react';
import { pdf, Font } from '@react-pdf/renderer';
import { toast } from '@/components/ui/sonner';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product, Allergen } from '@/types/database';
import NewMenuPdfDocument from '@/components/menu-print/pdf/NewMenuPdfDocument';

interface UsePdfExportProps {
  currentLayout?: PrintLayout;
  categories: Category[];
  products: Record<string, Product[]>;
  allergens: Allergen[];
  restaurantLogo?: string | null;
  language?: string;
  printAllergens?: boolean;
}

// Set per tenere traccia dei font già registrati
const registeredFonts = new Set<string>();

// Funzione per ottenere i font unici dal layout
const getUniqueFontsFromLayout = (layout: PrintLayout): Set<string> => {
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

// Funzione per normalizzare il nome del font per Google Fonts
const normalizeGoogleFontName = (fontFamily: string): string => {
  // Rimuovi virgole e tutto quello che segue (es. "Playfair Display, serif" -> "Playfair Display")
  const cleanName = fontFamily.split(',')[0].trim();
  // Sostituisci spazi con +
  return cleanName.replace(/\s+/g, '+');
};

// Funzione per registrare dinamicamente i font
const registerLayoutFonts = async (layout: PrintLayout) => {
  const fonts = getUniqueFontsFromLayout(layout);
  console.log('🔤 Font rilevati dal layout:', Array.from(fonts));
  
  // Registra sempre Inter come font di fallback
  if (!registeredFonts.has('Inter')) {
    try {
      Font.register({
        family: 'Inter',
        fonts: [
          { 
            src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
            fontWeight: 'normal'
          },
          { 
            src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2',
            fontWeight: 'bold'
          },
          { 
            src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
            fontWeight: 'normal',
            fontStyle: 'italic'
          },
          { 
            src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2',
            fontWeight: 'bold',
            fontStyle: 'italic'
          },
        ],
      });
      registeredFonts.add('Inter');
      console.log('✅ Font Inter registrato come fallback');
    } catch (error) {
      console.warn('⚠️ Errore registrazione font Inter:', error);
    }
  }
  
  for (const fontFamily of fonts) {
    // Controlla se il font è già stato registrato usando il nostro Set
    if (!registeredFonts.has(fontFamily)) {
      console.log(`📝 Registrazione font: ${fontFamily}`);
      try {
        // Normalizza il nome del font per Google Fonts
        const normalizedName = normalizeGoogleFontName(fontFamily);
        
        // Registra il font con Google Fonts con tutte le varianti
        Font.register({
          family: fontFamily,
          fonts: [
            { 
              src: `https://fonts.gstatic.com/s/${normalizedName.toLowerCase()}/v30/${normalizedName}-Regular.ttf`,
              fontWeight: 'normal'
            },
            { 
              src: `https://fonts.gstatic.com/s/${normalizedName.toLowerCase()}/v30/${normalizedName}-Bold.ttf`,
              fontWeight: 'bold'
            },
            { 
              src: `https://fonts.gstatic.com/s/${normalizedName.toLowerCase()}/v30/${normalizedName}-Italic.ttf`,
              fontWeight: 'normal',
              fontStyle: 'italic'
            },
            { 
              src: `https://fonts.gstatic.com/s/${normalizedName.toLowerCase()}/v30/${normalizedName}-BoldItalic.ttf`,
              fontWeight: 'bold',
              fontStyle: 'italic'
            },
          ],
        });
        // Aggiungi il font al Set dei font registrati
        registeredFonts.add(fontFamily);
        console.log(`✅ Font ${fontFamily} registrato con successo`);
      } catch (error) {
        console.warn(`⚠️ Impossibile registrare il font ${fontFamily}, uso fallback Inter:`, error);
        // Non registriamo un fallback qui, useremo Inter che è già registrato
        registeredFonts.add(fontFamily);
      }
    }
  }
};

export const usePdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPdf = async ({
    currentLayout,
    categories,
    products,
    allergens,
    restaurantLogo,
    language = 'it',
    printAllergens = true
  }: UsePdfExportProps) => {
    console.log('🔍 Inizio processo esportazione PDF...');
    console.log('📊 Dati ricevuti:', {
      hasLayout: !!currentLayout,
      categoriesCount: categories?.length || 0,
      productsCount: Object.keys(products || {}).length,
      allergensCount: allergens?.length || 0,
      hasLogo: !!restaurantLogo,
      language,
      printAllergens
    });

    if (!currentLayout) {
      console.error('❌ Errore: Nessun layout disponibile');
      toast.error('Nessun layout disponibile per l\'esportazione');
      return;
    }

    if (!categories || categories.length === 0) {
      console.error('❌ Errore: Nessuna categoria disponibile');
      toast.error('Nessuna categoria disponibile per l\'esportazione');
      return;
    }

    setIsExporting(true);
    
    try {
      console.log('🔤 Registrazione font dal layout...');
      await registerLayoutFonts(currentLayout);
      
      console.log('📄 Creazione documento PDF...');
      
      const pdfDocument = (
        <NewMenuPdfDocument
          currentLayout={currentLayout}
          categories={categories}
          products={products}
          allergens={allergens}
          restaurantLogo={restaurantLogo}
          language={language}
          printAllergens={printAllergens}
        />
      );

      console.log('🔄 Generazione blob PDF...');
      const blob = await pdf(pdfDocument).toBlob();
      console.log('✅ Blob generato, dimensione:', blob.size, 'bytes');
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `menu-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      
      console.log('📥 Avvio download...');
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('✅ PDF esportato con successo');
      toast.success('PDF esportato con successo!');
    } catch (error) {
      console.error('❌ Errore durante l\'esportazione PDF:', error);
      toast.error(`Errore durante l'esportazione del PDF: ${error instanceof Error ? error.message : 'Errore sconosciuto'}`);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportToPdf,
    isExporting
  };
};
