
import React from "react";
import ClassicLayout from "./layouts/ClassicLayout";
import ModernLayout from "./layouts/ModernLayout";
import { Allergen, Category } from "@/types/database";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import { toast } from "../ui/use-toast";

interface MenuLayoutSelectorProps {
  selectedLayout: string;
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
  showPageBoundaries: boolean;
  categories: Category[];
  products: Record<string, any[]>;
  selectedCategories: string[];
  language: string;
  allergens: Allergen[];
  printAllergens: boolean;
  restaurantLogo?: string | null;
  safetyMargin?: {
    vertical: number;
    horizontal: number;
  };
}

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
  safetyMargin = { vertical: 8, horizontal: 3 }
}) => {
  const { layouts } = useMenuLayouts();
  
  // Trova il layout personalizzato in base all'ID
  const customLayout = React.useMemo(() => {
    return layouts.find(layout => layout.id === selectedLayout) || null;
  }, [layouts, selectedLayout]);
  
  // Debug
  React.useEffect(() => {
    if (!customLayout) {
      console.warn(`Layout con ID ${selectedLayout} non trovato`);
    }
  }, [customLayout, selectedLayout]);
  
  // Scegli il tipo di layout appropriato
  const layoutType = customLayout?.type || "classic";
  
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
    customLayout,
    safetyMargin
  };
  
  switch (layoutType) {
    case "modern":
      return <ModernLayout {...commonProps} />;
    case "classic":
    default:
      return <ClassicLayout {...commonProps} />;
  }
};

export default MenuLayoutSelector;
