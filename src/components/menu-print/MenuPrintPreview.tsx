
import React from "react";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import MenuLayoutSelector from "./MenuLayoutSelector";
import { Allergen, Category } from "@/types/database";
import { Skeleton } from "@/components/ui/skeleton";

type MenuPrintPreviewProps = {
  layoutId: string; // Cambiato da layoutType a layoutId
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
};

const MenuPrintPreview: React.FC<MenuPrintPreviewProps> = ({
  layoutId, // Cambiato da layoutType a layoutId
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
      layoutId, // Cambiato da layoutType a layoutId
      selectedCategories, 
      pageCount 
    });
    console.log("MenuPrintPreview - Selected layout:", selectedLayout);
  }, [layoutId, selectedCategories, pageCount, selectedLayout]); // Cambiato da layoutType a layoutId

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
      selectedLayout={layoutId} // Manteniamo layoutId per compatibilità
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
    />
  );
};

export default MenuPrintPreview;
