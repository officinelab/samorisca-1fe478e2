
import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { toast } from '@/components/ui/sonner';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product, Allergen } from '@/types/database';
import NewMenuPdfDocument from '@/components/menu-print/pdf/NewMenuPdfDocument';
import { registerLayoutFonts } from './fontRegistry';

interface UsePdfExportProps {
  currentLayout?: PrintLayout;
  categories: Category[];
  products: Record<string, Product[]>;
  allergens: Allergen[];
  restaurantLogo?: string | null;
  language?: string;
  printAllergens?: boolean;
}

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
