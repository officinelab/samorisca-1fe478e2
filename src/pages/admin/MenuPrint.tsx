
import React from "react";
import { useMenuPrintState } from "@/hooks/menu-print/useMenuPrintState";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import PrintHeader from "@/components/menu-print/PrintHeader";
import PrintPreview from "@/components/menu-print/PrintPreview";
import OptionsPanel from "@/components/menu-print/OptionsPanel";
import PrintStylesheet from "@/components/menu-print/PrintStylesheet";

const MenuPrint = () => {
  const {
    // Layout and display options
    layoutId,
    setLayoutId,
    language,
    setLanguage,
    printAllergens,
    setPrintAllergens,
    showPageBoundaries,
    setShowPageBoundaries,
    
    // Menu data
    categories,
    products,
    allergens,
    isLoadingMenu,
    selectedCategories,
    restaurantLogo,
    updateRestaurantLogo,
    
    // Print operations
    printContentRef,
    
    // Constants
    A4_WIDTH_MM,
    A4_HEIGHT_MM,
    pageCount,
    
    // Force layout refresh if needed
    forceLayoutRefresh
  } = useMenuPrintState();

  return (
    <div className="space-y-6">
      {/* Header con titolo e navigazione */}
      <PrintHeader />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pannello opzioni (1/3 dello spazio su desktop) */}
        <Card className="md:col-span-1 p-5 h-fit">
          <OptionsPanel
            restaurantLogo={restaurantLogo}
            updateRestaurantLogo={updateRestaurantLogo}
            language={language}
            setLanguage={setLanguage}
            layoutId={layoutId} // Cambiato da layoutType a layoutId
            setLayoutId={setLayoutId} // Cambiato da setLayoutType a setLayoutId
            showPageBoundaries={showPageBoundaries}
            setShowPageBoundaries={setShowPageBoundaries}
            isLoading={isLoadingMenu}
            forceLayoutRefresh={forceLayoutRefresh}
          />
        </Card>

        {/* Anteprima (2/3 dello spazio su desktop) */}
        <Card className="md:col-span-2">
          <ScrollArea className="h-[80vh] md:h-[85vh] p-4">
            <PrintPreview
              printContentRef={printContentRef}
              layoutId={layoutId} // Cambiato da layoutType a layoutId
              showPageBoundaries={showPageBoundaries}
              categories={categories}
              products={products}
              selectedCategories={selectedCategories}
              language={language}
              allergens={allergens}
              printAllergens={printAllergens}
              restaurantLogo={restaurantLogo}
              pageCount={pageCount}
              A4_WIDTH_MM={A4_WIDTH_MM}
              A4_HEIGHT_MM={A4_HEIGHT_MM}
            />
          </ScrollArea>
        </Card>
      </div>

      {/* Print styles */}
      <PrintStylesheet />
    </div>
  );
};

export default MenuPrint;
