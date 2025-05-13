
import React, { useEffect } from 'react';
import { Category, Product, Allergen } from "@/types/database";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import ClassicLayout from "./layouts/ClassicLayout";

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
  
  // Quando cambia selectedLayout, aggiorna activeLayout
  useEffect(() => {
    if (selectedLayout && !isLoading && Array.isArray(layouts) && layouts.length > 0) {
      console.log("MenuLayoutSelector - Ricerca layout per ID:", selectedLayout);
      // Trova layout per ID
      const matchingLayout = layouts.find(layout => layout.id === selectedLayout);
      if (matchingLayout) {
        console.log("MenuLayoutSelector - Trovato layout corrispondente:", matchingLayout);
        changeActiveLayout(matchingLayout.id);
      } else {
        console.log("MenuLayoutSelector - Nessun layout trovato per l'ID:", selectedLayout);
      }
    }
  }, [selectedLayout, layouts, isLoading, changeActiveLayout]);
  
  console.log("MenuLayoutSelector - Layout ID selezionato:", selectedLayout);
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
  
  // Utilizziamo solo ClassicLayout che è in grado di adattarsi al layout personalizzato
  return <ClassicLayout {...commonProps} />;
};

export default MenuLayoutSelector;
