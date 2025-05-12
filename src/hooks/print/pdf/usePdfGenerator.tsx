
import { useState } from "react";
import { Allergen, Category, Product } from "@/types/database";
import { PrintLayout } from "@/types/printLayout";
import { toast } from "@/components/ui/sonner";
import MenuPdfDocument from "./components/MenuPdfDocument";
import { createPdfStyles } from "./styles/pdfStyles";
import { downloadPdf, printPdf } from "./utils/pdfUtils";

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
    if (selectedCategories.length === 0) {
      toast.error("Seleziona almeno una categoria per generare il PDF");
      return;
    }

    setIsGenerating(true);

    try {
      // Crea gli stili per il PDF
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
        />
      );

      await downloadPdf(documentElement);
    } finally {
      setIsGenerating(false);
    }
  };

  // Genera il PDF e lo apre in una nuova finestra per la stampa
  const generateAndPrintPdf = async () => {
    if (selectedCategories.length === 0) {
      toast.error("Seleziona almeno una categoria per stampare il PDF");
      return;
    }

    setIsGenerating(true);

    try {
      // Crea gli stili per il PDF
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
        />
      );

      await printPdf(documentElement);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateAndDownloadPdf,
    generateAndPrintPdf
  };
};
