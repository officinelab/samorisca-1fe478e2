
import { useState, useEffect } from "react";
import { useMenuData } from "../useMenuData";
import { usePrintOperationsManager } from "../print/usePrintOperationsManager";

export const useMenuPrintState = () => {
  // Constants for A4 paper size
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  
  // State for layout options
  const [layoutType, setLayoutType] = useState<string>("classic");
  const [language, setLanguage] = useState<string>("it");
  const [printAllergens, setPrintAllergens] = useState<boolean>(true);
  const [showPageBoundaries, setShowPageBoundaries] = useState<boolean>(true);
  const [pageCount, setPageCount] = useState<number>(0); // Stima del numero di pagine
  
  // Import menu data
  const {
    categories,
    products,
    allergens,
    labels,
    features,
    restaurantLogo,
    updateRestaurantLogo,
    isLoading: isLoadingMenu,
    error,
    retryLoading,
    selectedCategories,
    setSelectedCategories,
    handleCategoryToggle,
    handleToggleAllCategories
  } = useMenuData();
  
  // Import print operations
  const {
    printContentRef,
    handlePrint,
    handleDownloadPDF
  } = usePrintOperationsManager();
  
  // Stima del numero di pagine in base al numero di categorie e prodotti selezionati
  useEffect(() => {
    if (!isLoadingMenu && categories && products && selectedCategories) {
      // Calcola il numero di prodotti totali nelle categorie selezionate
      const totalProducts = selectedCategories.reduce((acc, catId) => {
        return acc + (products[catId]?.length || 0);
      }, 0);
      
      // Stima grossolana: una pagina di copertina + una pagina ogni ~10 prodotti + allergeni
      const estimatedPages = 1 + Math.ceil(totalProducts / 10) + (printAllergens && allergens.length > 0 ? 1 : 0);
      setPageCount(estimatedPages);
    }
  }, [categories, products, selectedCategories, allergens, printAllergens, isLoadingMenu]);
  
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
    categories,
    products,
    allergens,
    labels,
    features,
    isLoadingMenu,
    error,
    retryLoading,
    selectedCategories,
    setSelectedCategories,
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
