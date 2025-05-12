
import React from 'react';
import { Category, Product, Allergen } from "@/types/database";
import ClassicLayout from "./layouts/ClassicLayout";
import ModernLayout from "./layouts/ModernLayout";
import AllergensLayout from "./layouts/AllergensLayout";
import PageBoundaries from "./PageBoundaries";

type MenuPrintPreviewProps = {
  layoutType: string;
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
  pageCount: number;
};

const MenuPrintPreview: React.FC<MenuPrintPreviewProps> = ({
  layoutType,
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
  pageCount
}) => {
  // Log per debug
  React.useEffect(() => {
    console.log("MenuPrintPreview - Props:", { 
      layoutType, 
      selectedCategories: selectedCategories.length, 
      language 
    });
  }, [layoutType, selectedCategories, language]);
  
  // Props comuni per tutti i layout
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
    restaurantLogo
  };
  
  // Componente del layout basato sul tipo selezionato
  const renderLayout = () => {
    switch (layoutType) {
      case "modern":
        return <ModernLayout {...commonProps} />;
      case "allergens":
        return <AllergensLayout {...commonProps} />;
      case "classic":
      default:
        return <ClassicLayout {...commonProps} />;
    }
  };

  return (
    <div className="relative">
      {renderLayout()}
      
      {showPageBoundaries && (
        <PageBoundaries
          pageCount={pageCount}
          A4_WIDTH_MM={A4_WIDTH_MM}
          A4_HEIGHT_MM={A4_HEIGHT_MM}
          MM_TO_PX_FACTOR={3.78}
        />
      )}
    </div>
  );
};

export default MenuPrintPreview;
