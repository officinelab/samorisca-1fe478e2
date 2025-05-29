
import { useState, useEffect } from "react";
import { preloadCommonFonts } from "@/hooks/useDynamicGoogleFont";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { usePublicMenuUiStrings } from "@/hooks/public-menu/usePublicMenuUiStrings";
import { usePublicMenuData } from "@/hooks/public-menu/usePublicMenuData";
import { useMenuNavigation } from "@/hooks/public-menu/useMenuNavigation";
import { useProductDetails } from "@/hooks/public-menu/useProductDetails";
import { useCart } from "@/hooks/useCart";
import { useFontSettings } from "@/hooks/useFontSettings";

interface UsePublicMenuProps {
  isPreview?: boolean;
  previewLanguage?: string;
}

export const usePublicMenu = ({ isPreview = false, previewLanguage = 'it' }: UsePublicMenuProps) => {
  const [showAllergensInfo, setShowAllergensInfo] = useState(false);

  // Precarica font comuni al mount per migliorare le performance
  useEffect(() => {
    preloadCommonFonts();
  }, []);

  const { 
    categories, 
    products, 
    allergens,
    categoryNotes,
    isLoading, 
    error,
    language, 
    setLanguage 
  } = usePublicMenuData(isPreview, previewLanguage);

  const {
    selectedCategory,
    showBackToTop,
    menuRef,
    scrollToCategory,
    scrollToTop,
    initializeCategory,
    setupScrollHighlighting
  } = useMenuNavigation();

  const {
    selectedProduct,
    setSelectedProduct,
    truncateText
  } = useProductDetails();

  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    addToCart, 
    removeFromCart, 
    removeItemCompletely,
    calculateTotal, 
    clearCart, 
    submitOrder,
    getCartItemsCount 
  } = useCart(language);

  const { siteSettings, isLoading: isLoadingSiteSettings } = useSiteSettings();
  const { t } = usePublicMenuUiStrings(language);

  // Re-setup scroll highlighting quando cambiano le categorie o la lingua
  useEffect(() => {
    if (categories.length > 0) {
      // Piccolo delay per assicurarsi che il DOM sia aggiornato
      const timeoutId = setTimeout(() => {
        setupScrollHighlighting();
      }, 200);
      
      return () => clearTimeout(timeoutId);
    }
  }, [categories, language, setupScrollHighlighting]);

  // Inizializza la categoria selezionata quando arrivano le categorie
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      initializeCategory(categories[0].id);
    }
  }, [categories, selectedCategory, initializeCategory]);

  // Settings derivati
  const showPricesInOrder = typeof siteSettings?.showPricesInOrder === 'boolean' 
    ? siteSettings.showPricesInOrder 
    : true;

  const serviceCoverCharge =
    typeof siteSettings?.serviceCoverCharge === "number"
      ? siteSettings.serviceCoverCharge
      : parseFloat(siteSettings?.serviceCoverCharge);

  const productCardLayoutType = siteSettings?.publicMenuLayoutType || "default";
  const publicMenuButtonSettings = siteSettings?.publicMenuButtonSettings || {};
  const buttonSettings = publicMenuButtonSettings?.[productCardLayoutType] || {
    color: "#9b87f5",
    icon: "plus"
  };

  const { getCardFontSettings, getDetailFontSettings } = useFontSettings(siteSettings, productCardLayoutType);
  const hideProductDetailImage = productCardLayoutType === "custom1";

  return {
    // State
    showAllergensInfo,
    setShowAllergensInfo,
    
    // Data
    categories,
    products,
    allergens,
    categoryNotes,
    isLoading,
    error,
    language,
    setLanguage,
    
    // Navigation
    selectedCategory,
    showBackToTop,
    menuRef,
    scrollToCategory,
    scrollToTop,
    
    // Product details
    selectedProduct,
    setSelectedProduct,
    truncateText,
    
    // Cart
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    removeItemCompletely,
    calculateTotal,
    clearCart,
    submitOrder,
    getCartItemsCount,
    
    // Settings
    siteSettings,
    isLoadingSiteSettings,
    showPricesInOrder,
    serviceCoverCharge,
    productCardLayoutType,
    buttonSettings,
    getCardFontSettings,
    getDetailFontSettings,
    hideProductDetailImage,
    
    // UI strings
    t
  };
};
