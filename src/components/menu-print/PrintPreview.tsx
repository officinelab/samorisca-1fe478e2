
import React, { useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import MenuPrintPreview from "@/components/menu-print/MenuPrintPreview";
import { Allergen, Category } from "@/types/database";

interface PrintPreviewProps {
  printContentRef: React.RefObject<HTMLDivElement>;
  layoutType: string;
  showPageBoundaries: boolean;
  categories: Category[];
  products: Record<string, any[]>;
  selectedCategories: string[];
  language: string;
  allergens: Allergen[];
  printAllergens: boolean;
  restaurantLogo: string | null;
  pageCount: number;
  A4_WIDTH_MM: number;
  A4_HEIGHT_MM: number;
}

const PrintPreview: React.FC<PrintPreviewProps> = ({
  printContentRef,
  layoutType,
  showPageBoundaries,
  categories,
  products,
  selectedCategories,
  language,
  allergens,
  printAllergens,
  restaurantLogo,
  pageCount,
  A4_WIDTH_MM,
  A4_HEIGHT_MM,
}) => {
  // Ogni volta che cambia il layout, forziamo un aggiornamento completo del contenuto
  useEffect(() => {
    console.log("PrintPreview - Layout type cambiato:", layoutType);
    
    // Forza un refresh del contenuto dopo il cambio di layout
    const timer = setTimeout(() => {
      if (printContentRef.current) {
        // Piccolo hack per forzare un re-render completo
        const height = printContentRef.current.style.height;
        printContentRef.current.style.height = '0';
        setTimeout(() => {
          if (printContentRef.current) {
            printContentRef.current.style.height = height;
          }
        }, 10);
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [layoutType, printContentRef]);

  return (
    <div className="print:p-0 print:shadow-none print:bg-white print:w-full">
      <h2 className="text-lg font-semibold mb-2 print:hidden">Anteprima:</h2>
      <div className="border rounded-md overflow-visible shadow print:border-0 print:shadow-none relative">
        <ScrollArea className="h-[80vh] print:h-auto">
          <div 
            id="print-content" 
            className="bg-white print:p-0 relative" 
            ref={printContentRef}
            data-layout-type={layoutType} // Aggiungiamo un attributo per tracciare il tipo di layout
          >
            <MenuPrintPreview
              layoutType={layoutType}
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
              pageCount={pageCount}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default PrintPreview;
