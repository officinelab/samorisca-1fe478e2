
import { useState } from "react";
import { Allergen, Category, Product } from "@/types/database";
import { PrintLayout } from "@/types/printLayout";
import { MenuPdfDocument } from "./components";
import { createPdfStyles } from "./styles/pdfStyles";
import { pdf } from '@react-pdf/renderer';

interface PdfGeneratorProps {
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  allergens: Allergen[];
  printAllergens: boolean;
  restaurantLogo?: string | null;
  customLayout?: PrintLayout | null;
}

export const usePdfGenerator = ({
  categories,
  products,
  selectedCategories,
  language,
  allergens,
  printAllergens,
  restaurantLogo,
  customLayout
}: PdfGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Genera il PDF e lo fa scaricare
  const generateAndDownloadPdf = async () => {
    setIsGenerating(true);

    try {
      // Crea gli stili per il PDF basati sul layout personalizzato
      const styles = createPdfStyles(customLayout);

      // Filtra le categorie selezionate
      const filteredCategories = categories.filter(cat => selectedCategories.includes(cat.id));

      // Crea il documento PDF
      const documentElement = (
        <MenuPdfDocument 
          styles={styles}
          categories={filteredCategories}
          products={products}
          language={language}
          allergens={allergens}
          printAllergens={printAllergens}
          restaurantLogo={restaurantLogo}
          customLayout={customLayout}
        />
      );

      // Genera il blob PDF
      const blob = await pdf(documentElement).toBlob();
      
      // Crea un URL per il blob e scarica il file
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `menu_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error("Errore durante la generazione del PDF:", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateAndDownloadPdf
  };
};
