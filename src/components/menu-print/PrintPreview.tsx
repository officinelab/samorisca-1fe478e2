
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MenuPrintPreview from "@/components/menu-print/MenuPrintPreview";
import { Allergen, Category } from "@/types/database";

interface PrintPreviewProps {
  printContentRef: React.RefObject<HTMLDivElement>;
  layoutId: string;
  showPageBoundaries: boolean;
  categories: Category[];
  products: Record<string, any[]>;
  selectedCategories: string[];
  language: string;
  allergens: Allergen[];
  printAllergens: boolean;
  restaurantLogo: string | null;
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
}

const PrintPreview: React.FC<PrintPreviewProps> = ({
  printContentRef,
  layoutId,
  showPageBoundaries,
  categories,
  products,
  selectedCategories,
  language,
  allergens,
  printAllergens,
  restaurantLogo,
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
}) => {
  // Forza refresh su cambio layout
  useEffect(() => {
    if (!printContentRef.current) return;
    // Hack per forzare re-render se necessario
    const timer = setTimeout(() => {
      const height = printContentRef.current!.style.height;
      printContentRef.current!.style.height = '0';
      setTimeout(() => {
        if (printContentRef.current) {
          printContentRef.current.style.height = height;
        }
      }, 10);
    }, 50);
    return () => clearTimeout(timer);
  }, [layoutId, printContentRef]);

  // Fallback per props essenziali (evita crash se undefined)
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeProducts = products && typeof products === 'object' ? products : {};
  const safeSelectedCategories = Array.isArray(selectedCategories) ? selectedCategories : [];
  const safeAllergens = Array.isArray(allergens) ? allergens : [];

  return (
    <div className="print:p-0 print:shadow-none print:bg-white print:w-full">
      <h2 className="text-lg font-semibold mb-2 print:hidden">Anteprima:</h2>
      <div className="border rounded-md overflow-visible shadow print:border-0 print:shadow-none relative">
        <ScrollArea className="h-[80vh] print:h-auto">
          <div 
            id="print-content" 
            className="bg-white print:p-0 relative"
            ref={printContentRef}
            data-layout-id={layoutId}
          >
            <MenuPrintPreview
              layoutId={layoutId}
              A4_WIDTH_MM={A4_WIDTH_MM}
              A4_HEIGHT_MM={A4_HEIGHT_MM}
              showPageBoundaries={showPageBoundaries}
              categories={safeCategories}
              products={safeProducts}
              selectedCategories={safeSelectedCategories}
              language={language}
              allergens={safeAllergens}
              printAllergens={!!printAllergens}
              restaurantLogo={restaurantLogo}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default PrintPreview;
