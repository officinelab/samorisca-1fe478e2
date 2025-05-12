
import { useState, useEffect, useRef } from "react";
import { useMenuData } from "@/hooks/useMenuData";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import { usePrintLogoStorage } from './usePrintLogoStorage';

// Definiamo le costanti qui invece di importarle
const A4_WIDTH = 210; // mm
const A4_HEIGHT = 297; // mm

export const useMenuPrintState = () => {
  // Layout and display options
  const [layoutId, setLayoutId] = useState<string>("");
  const [language, setLanguage] = useState<string>("it");
  const [printAllergens, setPrintAllergens] = useState<boolean>(false);
  const [showPageBoundaries, setShowPageBoundaries] = useState<boolean>(false);
  
  // Menu data
  const {
    categories,
    products,
    allergens,
    isLoading: isLoadingMenu,
    error: menuError,
  } = useMenuData();
  
  // Print operations
  const printContentRef = useRef<HTMLDivElement>(null);
  
  // Layouts
  const { layouts, isLoading: isLoadingLayouts } = useMenuLayouts();
  
  // Utilizziamo il nuovo hook per il logo di stampa
  const { printLogo, updatePrintLogo, isLoading: isLoadingLogo } = usePrintLogoStorage();
  
  // Constants
  const A4_WIDTH_MM = A4_WIDTH;
  const A4_HEIGHT_MM = A4_HEIGHT;
  
  // Page count
  const [pageCount, setPageCount] = useState<number>(0);
  
  // Force layout refresh
  const [forceUpdate, setForceUpdate] = useState(0);
  const forceLayoutRefresh = () => {
    setForceUpdate(prev => prev + 1);
  };
  
  // Selected categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  useEffect(() => {
    if (categories && categories.length > 0) {
      setSelectedCategories(categories.map((cat) => cat.id));
    }
  }, [categories]);
  
  useEffect(() => {
    if (layouts && layouts.length > 0) {
      setLayoutId(layouts[0].id);
    }
  }, [layouts]);

  return {
    // Layout and display options
    layoutId,
    setLayoutId,
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
    isLoadingMenu,
    menuError,
    selectedCategories,
    setSelectedCategories,
    
    // Print operations
    printContentRef,
    
    // Constants
    A4_WIDTH_MM,
    A4_HEIGHT_MM,
    pageCount,
    setPageCount,
    
    // Force layout refresh if needed
    forceUpdate,
    forceLayoutRefresh,

    // Restituiamo il logo di stampa invece del logo del ristorante
    restaurantLogo: printLogo,
    updateRestaurantLogo: updatePrintLogo,
    isLoadingLogo
  };
};
