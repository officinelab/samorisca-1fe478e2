
import { useState } from "react";
import { Allergen, Category } from "@/types/database";
import { PrintLayout } from "@/types/printLayout";
import { usePdfGenerator } from "../print/pdf/usePdfGenerator";
import { useMenuData } from "../useMenuData";

export const usePdfMenuExport = ({
  layoutType,
  language,
  printAllergens,
  selectedCategories,
  restaurantLogo
}: {
  layoutType: string;
  language: string;
  printAllergens: boolean;
  selectedCategories: string[];
  restaurantLogo?: string | null;
}) => {
  const [isExporting, setIsExporting] = useState(false);
  
  // Import menu data
  const { categories, products, allergens, layouts, isLoading } = useMenuData();
  
  // Find the active layout
  const findActiveLayout = (): PrintLayout | null => {
    if (!Array.isArray(layouts) || layouts.length === 0) {
      return null;
    }
    return layouts.find(layout => layout.id === layoutType) || 
           layouts.find(layout => layout.type === layoutType) ||
           null;
  };
  
  const customLayout = findActiveLayout();
  
  // Initialize PDF generator
  const { 
    generateAndDownloadPdf,
    generateAndPrintPdf,
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
  
  // Download PDF handler
  const handleExportToPdf = async () => {
    if (isExporting || isGenerating || isLoading) return;
    
    setIsExporting(true);
    try {
      await generateAndDownloadPdf();
    } finally {
      setIsExporting(false);
    }
  };
  
  // Print PDF handler
  const handlePrintAsPdf = async () => {
    if (isExporting || isGenerating || isLoading) return;
    
    setIsExporting(true);
    try {
      await generateAndPrintPdf();
    } finally {
      setIsExporting(false);
    }
  };
  
  return {
    handleExportToPdf,
    handlePrintAsPdf,
    isExporting: isExporting || isGenerating
  };
};
