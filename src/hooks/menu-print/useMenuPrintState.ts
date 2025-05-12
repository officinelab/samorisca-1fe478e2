import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLayoutEffect } from "react";
import { useMenuCategories } from "@/hooks/useMenuCategories";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import { useMenuData } from "@/hooks/useMenuData";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export type MenuPrintStateProps = {
  restaurantLogo: string | null;
  updateRestaurantLogo: (newLogo: string | null) => void;
  menuTitle: string;
  updateMenuTitle: (title: string) => void;
  menuSubtitle: string;
  updateMenuSubtitle: (subtitle: string) => void;
};

// Costanti per il formato A4 in millimetri
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

/**
 * Hook per gestire lo stato globale della pagina di stampa menu
 */
export const useMenuPrintState = () => {
  // Stato del layout e delle opzioni di visualizzazione
  const [layoutId, setLayoutId] = useState("1"); // ID del layout selezionato
  const [language, setLanguage] = useState("it"); // Lingua selezionata
  const [printAllergens, setPrintAllergens] = useState(true); // Mostra pagina allergeni
  const [showPageBoundaries, setShowPageBoundaries] = useState(true); // Mostra bordi pagina
  const [forceRefresh, setForceRefresh] = useState(0); // Forza refresh del layout
  
  // Riferimento al contenuto da stampare
  const printContentRef = useRef<HTMLDivElement | null>(null);
  
  // Ottieni i dati del menu
  const { categories, getAllergensForProduct } = useMenuCategories();
  const { products } = useMenuData();
  const { layouts, isLoading: isLoadingLayouts } = useMenuLayouts();
  const { siteSettings, updateMenuLogo, isLoading: isLoadingSettings } = useSiteSettings();
  
  // Stato delle categorie selezionate
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Ottieni gli allergeni
  const { data: allergens = [], isLoading: isLoadingAllergens } = useQuery({
    queryKey: ["allergens"],
    queryFn: async () => {
      const allergensData = await getAllergensForProduct();
      return allergensData;
    },
  });
  
  // Ottieni menu title e subtitle dalle impostazioni del sito
  const menuTitle = siteSettings?.menuTitle || "Menu";
  const menuSubtitle = siteSettings?.menuSubtitle || "Ristorante";
  
  // Imposta tutte le categorie come selezionate all'avvio
  useEffect(() => {
    if (categories && categories.length > 0 && selectedCategories.length === 0) {
      const categoryIds = categories.map((cat) => cat.id);
      setSelectedCategories(categoryIds);
    }
  }, [categories, selectedCategories]);
  
  // Ottieni il numero di pagine basato sul contenuto attuale
  const calculatePageCount = (): number => {
    if (!printContentRef.current) return 1;
    
    const content = printContentRef.current;
    const pages = content.querySelectorAll(".page");
    
    return pages ? pages.length : 1;
  };
  
  // Calcola il numero di pagine
  const [pageCount, setPageCount] = useState(1);
  useLayoutEffect(() => {
    setPageCount(calculatePageCount());
  }, [printContentRef.current, selectedCategories, layoutId, printAllergens, forceRefresh]);
  
  // Gestori per la modifica delle categorie selezionate
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const handleToggleAllCategories = (selected: boolean) => {
    if (selected) {
      const allCategoryIds = categories.map((cat) => cat.id);
      setSelectedCategories(allCategoryIds);
    } else {
      setSelectedCategories([]);
    }
  };
  
  // Forza aggiornamento del layout
  const forceLayoutRefresh = () => {
    setForceRefresh((prev) => prev + 1);
  };
  
  // Recupera il logo del ristorante dalle impostazioni del sito
  const restaurantLogo = siteSettings?.menuLogo || null;
  
  // Aggiorna il logo del ristorante
  const updateRestaurantLogo = (newLogo: string | null) => {
    updateMenuLogo(newLogo || '');
  };
  
  // Aggiorna il titolo del menu
  const updateMenuTitle = (title: string) => {
    // Implementato nel hook useSiteSettings
  };
  
  // Aggiorna il sottotitolo del menu
  const updateMenuSubtitle = (subtitle: string) => {
    // Implementato nel hook useSiteSettings
  };
  
  return {
    // Layout e opzioni di visualizzazione
    layoutId,
    setLayoutId,
    language,
    setLanguage,
    printAllergens,
    setPrintAllergens,
    showPageBoundaries,
    setShowPageBoundaries,
    
    // Dati del menu
    categories,
    products,
    allergens,
    isLoadingMenu: isLoadingAllergens || isLoadingLayouts || isLoadingSettings,
    selectedCategories,
    handleCategoryToggle,
    handleToggleAllCategories,
    getAllergensForProduct,
    restaurantLogo,
    updateRestaurantLogo,
    menuTitle,
    menuSubtitle,
    updateMenuTitle,
    updateMenuSubtitle,
    
    // Operazioni di stampa
    printContentRef,
    
    // Costanti
    A4_WIDTH_MM,
    A4_HEIGHT_MM,
    pageCount,
    
    // Force layout refresh se necessario
    forceLayoutRefresh
  };
};
