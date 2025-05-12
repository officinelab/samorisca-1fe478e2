
import React, { useEffect } from 'react';
import { Category, Product, Allergen } from "@/types/database";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import ClassicLayout from "./ClassicLayout";
import ModernLayout from "./ModernLayout";
import AllergensLayout from "./AllergensLayout";

type MenuLayoutSelectorProps = {
  selectedLayout: string;
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  categories: Category[];
  products: Record<string, Product[]>;
  selectedCategories: string[];
  language: string;
  allergens: Allergen[];
  printAllergens: boolean;
  restaurantLogo?: string | null;
};

const MenuLayoutSelector: React.FC<MenuLayoutSelectorProps> = ({
  selectedLayout,
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
  showPageBoundaries,
  categories,
  products,
  selectedCategories,
  language,
  allergens,
  printAllergens,
  restaurantLogo,
}) => {
  const { activeLayout, layouts } = useMenuLayouts();
  
  // Aggiungiamo log per debug
  useEffect(() => {
    console.log("MenuLayoutSelector - Props:", { 
      selectedLayout, 
      showPageBoundaries, 
      selectedCategories, 
      language, 
      printAllergens 
    });
    console.log("MenuLayoutSelector - activeLayout:", activeLayout);
    console.log("MenuLayoutSelector - layouts disponibili:", layouts);
  }, [selectedLayout, activeLayout, layouts, showPageBoundaries, selectedCategories, language, printAllergens]);
  
  // Use selected layout as fallback if activeLayout is not available
  // Ensure we always have a valid layout type
  const effectiveLayoutType = activeLayout?.type || selectedLayout || "classic";
  
  console.log("MenuLayoutSelector - Layout selezionato:", effectiveLayoutType);
  
  const commonProps = {
    A4_WIDTH_MM,
    A4_HEIGHT_MM,
    showPageBoundaries,
    categories,
    products,
    selectedCategories,
    language,
    allergens,
    printAllergens,
    restaurantLogo,
    customLayout: activeLayout || null
  };
  
  switch (effectiveLayoutType) {
    case "modern":
      return <ModernLayout {...commonProps} />;
    case "allergens":
      return <AllergensLayout {...commonProps} />;
    case "custom":
      // Per i layout personalizzati, usa ClassicLayout come base
      return <ClassicLayout {...commonProps} />;
    case "classic":
    default:
      return <ClassicLayout {...commonProps} />;
  }
};

export default MenuLayoutSelector;
