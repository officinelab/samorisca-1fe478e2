
import React, { useEffect } from 'react';
import { Category, Product, Allergen } from "@/types/database";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import ClassicLayout from "./layouts/ClassicLayout";
import ModernLayout from "./layouts/ModernLayout";
import AllergensLayout from "./layouts/AllergensLayout";

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
  const { layouts, activeLayout, changeActiveLayout, isLoading } = useMenuLayouts();
  
  // Default layout type as fallback
  const defaultLayoutType = "classic";
  
  // Debug logs
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
  
  // When selectedLayout changes, update activeLayout
  useEffect(() => {
    if (selectedLayout && !isLoading && Array.isArray(layouts) && layouts.length > 0) {
      console.log("MenuLayoutSelector - Ricerca layout per tipo:", selectedLayout);
      // Find layout by type
      const matchingLayout = layouts.find(layout => layout.type === selectedLayout);
      if (matchingLayout) {
        console.log("MenuLayoutSelector - Trovato layout corrispondente:", matchingLayout);
        changeActiveLayout(matchingLayout.id);
      } else {
        console.log("MenuLayoutSelector - Nessun layout trovato per il tipo:", selectedLayout);
      }
    }
  }, [selectedLayout, layouts, isLoading, changeActiveLayout]);
  
  // Determine which layout type to use based on available data
  const effectiveLayoutType = selectedLayout || (activeLayout?.type || defaultLayoutType);
  
  console.log("MenuLayoutSelector - Layout selezionato:", effectiveLayoutType);
  console.log("MenuLayoutSelector - activeLayout utilizzato:", activeLayout);
  
  const commonProps = {
    A4_WIDTH_MM,
    A4_HEIGHT_MM,
    showPageBoundaries,
    categories: Array.isArray(categories) ? categories : [],
    products: products || {},
    selectedCategories: Array.isArray(selectedCategories) ? selectedCategories : [],
    language: language || "it",
    allergens: Array.isArray(allergens) ? allergens : [],
    printAllergens: Boolean(printAllergens),
    restaurantLogo,
    customLayout: activeLayout
  };
  
  switch (effectiveLayoutType) {
    case "modern":
      return <ModernLayout {...commonProps} />;
    case "allergens":
      return <AllergensLayout {...commonProps} />;
    case "custom":
      return <ClassicLayout {...commonProps} />;
    case "classic":
    default:
      return <ClassicLayout {...commonProps} />;
  }
};

export default MenuLayoutSelector;
