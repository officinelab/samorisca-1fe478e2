
import { useState } from 'react';
import { pdf, Font } from '@react-pdf/renderer';
import { toast } from '@/components/ui/sonner';
import { PrintLayout } from '@/types/printLayout';
import { Category, Product, Allergen } from '@/types/database';
import NewMenuPdfDocument from '@/components/menu-print/pdf/NewMenuPdfDocument';

// Register Google Fonts for PDF
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2' },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiA.woff2', fontWeight: 'bold' },
  ],
});

Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2' },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4AMP6lQ.woff2', fontWeight: 'bold' },
  ],
});

Font.register({
  family: 'Playfair Display',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtXK-F2qO0isEw.woff2' },
    { src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDYbtXK-F2qO0isEw.woff2', fontWeight: 'bold' },
  ],
});

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
    if (!currentLayout) {
      toast.error('Nessun layout disponibile per l\'esportazione');
      return;
    }

    setIsExporting(true);
    
    try {
      console.log('Inizio esportazione PDF...');
      
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

      const blob = await pdf(pdfDocument).toBlob();
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `menu-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('PDF esportato con successo!');
      console.log('PDF esportato con successo');
    } catch (error) {
      console.error('Errore durante l\'esportazione PDF:', error);
      toast.error('Errore durante l\'esportazione del PDF');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportToPdf,
    isExporting
  };
};
