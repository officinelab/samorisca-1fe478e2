
import { useState, useEffect, useCallback, useMemo } from "react";
import { useMenuData } from "../useMenuData";
import { usePrintOperationsManager } from "../print/usePrintOperationsManager";
import { useMenuLayouts } from "../menu-layouts/useMenuLayouts";

export const useMenuPrintState = () => {
  // Constants for A4 paper size
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  
  // State for layout options
  const [layoutType, setLayoutType] = useState<string>("classic");
  const [language, setLanguage] = useState<string>("it");
  const [printAllergens, setPrintAllergens] = useState<boolean>(true);
  const [showPageBoundaries, setShowPageBoundaries] = useState<boolean>(true);
  
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
    printContentRef
  } = usePrintOperationsManager();
  
  // Import layout management to force layout refresh
  const { forceRefresh } = useMenuLayouts();
  
  // Function to force layout refresh when needed
  const forceLayoutRefresh = useCallback(() => {
    console.log("Forzando refresh dei layout...");
    forceRefresh();
    // Aggiorna anche il tipo di layout per forzare un re-render
    setLayoutType(prevType => {
      console.log("Re-impostazione del layout type:", prevType);
      return prevType;
    });
  }, [forceRefresh]);
  
  // Calcola il numero di pagine in base alle categorie e prodotti selezionati
  const pageCount = useMemo(() => {
    if (isLoadingMenu || !categories || !products || !selectedCategories) {
      return 1;
    }
    
    // Calcola il numero di prodotti nelle categorie selezionate
    const totalProducts = selectedCategories.reduce((acc, catId) => {
      return acc + (products[catId]?.length || 0);
    }, 0);
    
    // Stima: pagina copertina + pagine prodotti + pagina allergeni
    return 1 + Math.ceil(totalProducts / 10) + (printAllergens && allergens.length > 0 ? 1 : 0);
  }, [categories, products, selectedCategories, allergens, printAllergens, isLoadingMenu]);
  
  // Quando si carica la pagina, forza un aggiornamento dei layout
  useEffect(() => {
    forceLayoutRefresh();
  }, [forceLayoutRefresh]);
  
  // Seleziona tutte le categorie per default se non ce ne sono selezionate
  useEffect(() => {
    if (!isLoadingMenu && categories && categories.length > 0 && selectedCategories.length === 0) {
      const allCategoryIds = categories.map(cat => cat.id);
      setSelectedCategories(allCategoryIds);
    }
  }, [isLoadingMenu, categories, selectedCategories.length, setSelectedCategories]);
  
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
    
    // Constants
    A4_WIDTH_MM,
    A4_HEIGHT_MM,
    pageCount,
    
    // Refresh layout
    forceLayoutRefresh
  };
};
