
import { useState, useEffect, useCallback, useMemo } from "react";
import { useMenuData } from "../useMenuData";
import { usePrintOperationsManager } from "../print/usePrintOperationsManager";
import { useMenuLayouts } from "../menu-layouts/useMenuLayouts";

export const useMenuPrintState = () => {
  // Constants for A4 paper size
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;
  
  // Import layout management
  const { layouts, activeLayout, forceRefresh } = useMenuLayouts();
  
  // State for layout options
  const [layoutId, setLayoutId] = useState<string>("");
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
  
  // Function to force layout refresh when needed
  const forceLayoutRefresh = useCallback(() => {
    console.log("Forzando refresh dei layout...");
    forceRefresh();
  }, [forceRefresh]);
  
  // Imposta il layout predefinito all'avvio
  useEffect(() => {
    if (layouts && layouts.length > 0 && !layoutId) {
      // Trova il layout predefinito o usa il primo disponibile
      const defaultLayout = layouts.find(l => l.isDefault) || layouts[0];
      if (defaultLayout) {
        console.log("Impostazione layout predefinito:", defaultLayout.id);
        setLayoutId(defaultLayout.id);
      }
    }
  }, [layouts, layoutId]);
  
  // Calcola il numero di pagine in base alle categorie e prodotti selezionati
  const pageCount = useMemo(() => {
    if (isLoadingMenu || !categories || !products) {
      return 1;
    }
    
    // Per semplificare, selezioniamo tutte le categorie automaticamente
    if (!selectedCategories || selectedCategories.length === 0) {
      const allCategoryIds = categories.map(cat => cat.id);
      setSelectedCategories(allCategoryIds);
    }
    
    // Calcola il numero di prodotti nelle categorie disponibili
    const totalProducts = categories.reduce((acc, cat) => {
      return acc + (products[cat.id]?.length || 0);
    }, 0);
    
    // Stima: pagina copertina + pagine prodotti + pagina allergeni
    return 1 + Math.ceil(totalProducts / 10) + (printAllergens && allergens.length > 0 ? 1 : 0);
  }, [categories, products, selectedCategories, allergens, printAllergens, isLoadingMenu, setSelectedCategories]);
  
  // Quando si carica la pagina, forza un aggiornamento dei layout
  useEffect(() => {
    forceLayoutRefresh();
  }, [forceLayoutRefresh]);
  
  // Seleziona tutte le categorie per default
  useEffect(() => {
    if (!isLoadingMenu && categories && categories.length > 0 && (!selectedCategories || selectedCategories.length === 0)) {
      const allCategoryIds = categories.map(cat => cat.id);
      setSelectedCategories(allCategoryIds);
    }
  }, [isLoadingMenu, categories, selectedCategories, setSelectedCategories]);
  
  return {
    // Layout and display options
    layoutId, // Cambiato da layoutType a layoutId
    setLayoutId, // Cambiato da setLayoutType a setLayoutId
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
