
import { useState } from "react";
import { Allergen, Category } from "@/types/database";
import { PrintLayout } from "@/types/printLayout";
import { useMenuData } from "../useMenuData";
import { useMenuLayouts } from "../useMenuLayouts";
import { toast } from "@/components/ui/sonner";
import { generatePDF } from "./pdfGenerator";

interface PdfMenuExportProps {
  layoutId: string;
  language: string;
  printAllergens: boolean;
  selectedCategories: string[];
  restaurantLogo?: string | null;
}

export const usePdfMenuExport = ({
  layoutId,
  language,
  printAllergens,
  selectedCategories,
  restaurantLogo
}: PdfMenuExportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  
  // Importa menu data e layouts
  const { categories, products, allergens, isLoading } = useMenuData();
  const { layouts, isLoading: isLoadingLayouts } = useMenuLayouts();
  
  // Trova il layout attivo usando ID invece di type
  const findActiveLayout = (): PrintLayout | null => {
    if (!Array.isArray(layouts) || layouts.length === 0) {
      return null;
    }
    
    const layout = layouts.find(layout => layout.id === layoutId);
    console.log("Layout trovato:", layout);
    return layout || null;
  };
  
  const customLayout = findActiveLayout();
  
  // Gestore per l'esportazione PDF
  const handleExportToPdf = async () => {
    if (isExporting || isLoading || isLoadingLayouts) return;
    
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
      
      if (!customLayout) {
        toast.error("Layout non trovato. Seleziona un layout valido.");
        return;
      }
      
      console.log("Esportazione PDF con layout:", customLayout);
      console.log("Titolo menu:", customLayout.menu_title);
      console.log("Sottotitolo menu:", customLayout.menu_subtitle);
      
      // Genera il PDF basato sull'anteprima visualizzata
      const result = await generatePDF({
        categories: filteredCategories,
        products,
        selectedCategories,
        language,
        allergens: allergens as Allergen[],
        printAllergens,
        restaurantLogo,
        customLayout,
        layoutType: customLayout.type // Usiamo il tipo dal layout selezionato
      });
      
      if (result) {
        toast.success("PDF generato con successo");
        console.log("PDF generazione completata con successo");
      } else {
        toast.error("Errore nella generazione del PDF");
        console.error("Generazione PDF fallita");
      }
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
