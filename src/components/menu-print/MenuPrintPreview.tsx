import React from "react";
import { useMenuLayouts } from "@/hooks/useMenuLayouts";
import MenuLayoutSelector from "./MenuLayoutSelector";
import { Allergen, Category } from "@/types/database";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";

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
  /* RIMOSSO: pageCount */
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
  /* RIMOSSO: pageCount */
}) => {
  const { layouts, activeLayout, isLoading: isLayoutsLoading } = useMenuLayouts();

  const selectedLayout = React.useMemo(() => {
    if (!layouts || layouts.length === 0) {
      console.warn("MenuPrintPreview - Nessun layout disponibile");
      return null;
    }
    
    const layout = layouts.find(layout => layout.id === layoutId);
    if (!layout) {
      console.warn(`MenuPrintPreview - Layout con ID ${layoutId} non trovato, utilizzo il primo layout disponibile`);
      // Se il layout richiesto non è disponibile, utilizza il layout predefinito o il primo disponibile
      return layouts.find(l => l.isDefault) || layouts[0];
    }
    
    return layout;
  }, [layouts, layoutId]);

  React.useEffect(() => {
    console.log("MenuPrintPreview - Props:", { 
      layoutId,
      selectedCategories
    });
    console.log("MenuPrintPreview - Selected layout:", selectedLayout);
    
    if (!selectedLayout && !isLayoutsLoading && layouts.length > 0) {
      toast.warning("Layout non trovato. Utilizzando layout predefinito.");
    }
  }, [layoutId, selectedCategories, selectedLayout, isLayoutsLoading, layouts]);

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
    />
  );
};

export default MenuPrintPreview;
