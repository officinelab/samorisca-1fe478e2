
import { useState } from "react";
import { Allergen, Category } from "@/types/database";
import { PrintLayout } from "@/types/printLayout";
import { usePdfGenerator } from "../print/pdf/usePdfGenerator";
import { useMenuData } from "../useMenuData";
import { useMenuLayouts } from "../menu-layouts/useMenuLayouts";
import { toast } from "@/components/ui/sonner";

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
  
  // Importa menu data e layouts separatamente
  const { categories, products, allergens, isLoading } = useMenuData();
  const menuLayouts = useMenuLayouts();
  
  // Trova il layout attivo
  const findActiveLayout = (): PrintLayout | null => {
    if (!Array.isArray(menuLayouts.layouts) || menuLayouts.layouts.length === 0) {
      return null;
    }
    return menuLayouts.layouts.find(layout => layout.id === layoutType) || 
           menuLayouts.layouts.find(layout => layout.type === layoutType) ||
           null;
  };
  
  const customLayout = findActiveLayout();
  
  // Inizializza il generatore PDF
  const { 
    generateAndDownloadPdf,
    isGenerating
  } = usePdfGenerator({
    categories: categories as Category[],
    products,
    selectedCategories,
    language,
    allergens: allergens as Allergen[],
    printAllergens,
    restaurantLogo,
    customLayout
  });
  
  // Gestore per l'esportazione PDF
  const handleExportToPdf = async () => {
    if (isExporting || isGenerating || isLoading) return;
    
    if (selectedCategories.length === 0) {
      toast.error("Seleziona almeno una categoria per generare il PDF");
      return;
    }
    
    setIsExporting(true);
    try {
      await generateAndDownloadPdf();
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
    isExporting: isExporting || isGenerating
  };
};
