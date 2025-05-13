
import React from "react";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import MenuLayoutSelector from "./MenuLayoutSelector";
import { Allergen, Category } from "@/types/database";
import { Skeleton } from "@/components/ui/skeleton";

type MenuPrintPreviewProps = {
  layoutId: string;
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
  pageCount: number;
  safetyMargin?: {
    vertical: number;
    horizontal: number;
  };
};

const MenuPrintPreview: React.FC<MenuPrintPreviewProps> = ({
  layoutId,
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
  pageCount,
  safetyMargin = { vertical: 8, horizontal: 3 }
}) => {
  const { layouts, activeLayout, isLoading: isLayoutsLoading } = useMenuLayouts();
  
  // Cerca il layout attivo usando l'ID
  const selectedLayout = React.useMemo(() => {
    if (!layouts || layouts.length === 0) return null;
    return layouts.find(layout => layout.id === layoutId) || null;
  }, [layouts, layoutId]);
  
  // Debug logs
  React.useEffect(() => {
    console.log("MenuPrintPreview - Props:", { 
      layoutId,
      selectedCategories, 
      pageCount,
      safetyMargin
    });
    console.log("MenuPrintPreview - Selected layout:", selectedLayout);
  }, [layoutId, selectedCategories, pageCount, selectedLayout, safetyMargin]);

  if (isLayoutsLoading || !selectedLayout) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-[40px] w-[80%]" />
        <Skeleton className="h-[600px] w-[100%]" />
      </div>
    );
  }

  return (
    <MenuLayoutSelector
      selectedLayout={layoutId}
      A4_WIDTH_MM={A4_WIDTH_MM}
      A4_HEIGHT_MM={A4_HEIGHT_MM}
      showPageBoundaries={showPageBoundaries}
      categories={categories}
      products={products}
      selectedCategories={selectedCategories}
      language={language}
      allergens={allergens}
      printAllergens={printAllergens}
      restaurantLogo={restaurantLogo}
      safetyMargin={safetyMargin}
    />
  );
};

export default MenuPrintPreview;
