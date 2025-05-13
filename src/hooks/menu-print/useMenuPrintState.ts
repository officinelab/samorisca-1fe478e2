
import { useEffect, useRef, useState } from "react";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { useAllergens } from "@/hooks/useAllergens";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// Dimensioni standard foglio A4 in millimetri
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

export const useMenuPrintState = () => {
  const { siteSettings, updateSetting } = useSiteSettings();
  const { layouts, activeLayout, forceRefresh, isLoading: isLayoutsLoading } = useMenuLayouts();
  
  // Stato del contenuto del menu
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { allergens, isLoading: isLoadingAllergens } = useAllergens();
  
  // Layout e opzioni di visualizzazione
  const [layoutId, setLayoutId] = useState<string>("");
  const [language, setLanguage] = useState<string>("it");
  const [printAllergens, setPrintAllergens] = useState(true);
  const [showPageBoundaries, setShowPageBoundaries] = useState(true);
  
  // Categorie selezionate per la stampa
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Logo del ristorante
  const [restaurantLogo, setRestaurantLogo] = useState<string | null>(null);
  
  // Margini di sicurezza personalizzabili
  const [safetyMargin, setSafetyMargin] = useState<{
    vertical: number;
    horizontal: number;
  }>({ vertical: 8, horizontal: 3 });
  
  // Riferimento al contenuto da stampare
  const printContentRef = useRef<HTMLDivElement>(null);
  
  // Contatore pagine
  const [pageCount, setPageCount] = useState(1);
  
  // Quando le categorie sono caricate, imposta tutte come selezionate
  useEffect(() => {
    if (!isLoadingCategories && categories.length > 0) {
      setSelectedCategories(categories.map(cat => cat.id));
    }
  }, [categories, isLoadingCategories]);
  
  // Imposta il layout attivo quando i layout sono caricati
  useEffect(() => {
    if (!isLayoutsLoading && layouts.length > 0 && activeLayout) {
      setLayoutId(activeLayout.id);
    }
  }, [activeLayout, layouts, isLayoutsLoading]);
  
  // Carica il logo del ristorante dalle impostazioni
  useEffect(() => {
    if (siteSettings?.restaurant_logo) {
      setRestaurantLogo(siteSettings.restaurant_logo);
    }
  }, [siteSettings?.restaurant_logo]);
  
  // Funzione per aggiornare il logo del ristorante
  const updateRestaurantLogo = async (logoUrl: string) => {
    setRestaurantLogo(logoUrl);
    await updateSetting('restaurant_logo', logoUrl);
  };
  
  // Funzione per forzare l'aggiornamento del layout
  const forceLayoutRefresh = () => {
    if (forceRefresh) {
      forceRefresh();
    }
  };
  
  // Aggiorna il conteggio delle pagine quando necessario
  useEffect(() => {
    // In una implementazione più complessa, potremmo calcolare il numero effettivo di pagine
    // Per ora utilizziamo un valore costante
    setPageCount(4);
  }, [selectedCategories, layoutId]);
  
  // Funzione per gestire il cambio dei margini di sicurezza
  const handleSafetyMarginChange = (type: 'vertical' | 'horizontal', value: number) => {
    setSafetyMargin(prev => ({
      ...prev,
      [type]: value
    }));
  };
  
  const isLoadingMenu = isLoadingCategories || isLoadingProducts || isLoadingAllergens || isLayoutsLoading;

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
    
    // Menu data
    categories,
    products,
    allergens,
    isLoadingMenu,
    selectedCategories,
    setSelectedCategories,
    
    // Logo del ristorante
    restaurantLogo,
    updateRestaurantLogo,
    
    // Margini di sicurezza
    safetyMargin,
    handleSafetyMarginChange,
    
    // Print operations
    printContentRef,
    
    // Constants
    A4_WIDTH_MM,
    A4_HEIGHT_MM,
    pageCount,
    
    // Force layout refresh if needed
    forceLayoutRefresh
  };
};
