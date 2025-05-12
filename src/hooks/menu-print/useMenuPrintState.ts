
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { useMenuData } from "@/hooks/useMenuData";
import { usePrintOperations } from "@/hooks/usePrintOperations";
import { usePrintConstants } from "./usePrintConstants";

export const useMenuPrintState = () => {
  // Paper dimensions
  const { A4_WIDTH_MM, A4_HEIGHT_MM } = usePrintConstants();
  
  // UI state
  const [layoutType, setLayoutType] = useState("classic");
  const [language, setLanguage] = useState("it");
  const [printAllergens, setPrintAllergens] = useState(true);
  const [showPageBoundaries, setShowPageBoundaries] = useState(true);
  
  // Menu data and operations
  const { 
    categories, 
    products, 
    allergens, 
    isLoading: isLoadingMenu, 
    selectedCategories, 
    handleCategoryToggle, 
    handleToggleAllCategories,
    restaurantLogo,
    updateRestaurantLogo
  } = useMenuData();
  
  const { printContentRef, handlePrint, handleDownloadPDF } = usePrintOperations();

  // Calculate approximate page count
  const pageCount = Math.max(1, Math.ceil(selectedCategories.length / 3) + (printAllergens ? 1 : 0) + 1);

  // Error handling
  useEffect(() => {
    if (!isLoadingMenu && (!categories || !Array.isArray(categories) || categories.length === 0)) {
      toast.error("Errore nel caricamento delle categorie");
    }
  }, [isLoadingMenu, categories]);

  return {
    // Layout and display options
    layoutType,
    setLayoutType,
    language,
    setLanguage,
    printAllergens,
    setPrintAllergens,
    showPageBoundaries,
    setShowPageBoundaries,
    
    // Menu data
    categories: categories || [],
    products: products || {},
    allergens: allergens || [],
    isLoadingMenu,
    selectedCategories,
    handleCategoryToggle,
    handleToggleAllCategories,
    restaurantLogo,
    updateRestaurantLogo,
    
    // Print operations
    printContentRef,
    handlePrint,
    handleDownloadPDF,
    
    // Constants
    A4_WIDTH_MM,
    A4_HEIGHT_MM,
    pageCount
  };
};
