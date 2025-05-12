
import { useState } from "react";
import { Allergen, Category } from "@/types/database";
import { PrintLayout } from "@/types/printLayout";
import { useMenuData } from "../useMenuData";
import { useMenuLayouts } from "../useMenuLayouts";
import { toast } from "@/components/ui/sonner";
import { generatePDF } from "./pdfGenerator";

interface PdfMenuExportProps {
  layoutType: string;
  language: string;
  printAllergens: boolean;
  selectedCategories: string[];
  restaurantLogo?: string | null;
}

export const usePdfMenuExport = ({
  layoutType,
  language,
  printAllergens,
  selectedCategories,
  restaurantLogo
}: PdfMenuExportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  
  // Importa menu data e layouts
  const { categories, products, allergens, isLoading } = useMenuData();
  const { layouts } = useMenuLayouts();
  
  // Trova il layout attivo
  const findActiveLayout = (): PrintLayout | null => {
    if (!Array.isArray(layouts) || layouts.length === 0) {
      return null;
    }
    
    return layouts.find(layout => layout.id === layoutType) || null;
  };
  
  const customLayout = findActiveLayout();
  
  // Gestore per l'esportazione PDF
  const handleExportToPdf = async () => {
    if (isExporting || isLoading) return;
    
    if (selectedCategories.length === 0) {
      toast.error("Seleziona almeno una categoria per generare il PDF");
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Filtra le categorie selezionate
      const filteredCategories = categories.filter(cat => 
        selectedCategories.includes(cat.id)
      ) as Category[];
      
      // Genera il PDF basato sull'anteprima visualizzata
      await generatePDF({
        categories: filteredCategories,
        products,
        selectedCategories,
        language,
        allergens: allergens as Allergen[],
        printAllergens,
        restaurantLogo,
        customLayout,
        layoutType
      });
      
      toast.success("PDF generato con successo");
    } catch (error) {
      console.error("Errore durante la generazione del PDF:", error);
      toast.error("Si è verificato un errore durante la generazione del PDF");
    } finally {
      setIsExporting(false);
    }
  };
  
  return {
    handleExportToPdf,
    isExporting
  };
};
