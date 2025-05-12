
import React from "react";
import { useMenuPrintState } from "@/hooks/menu-print/useMenuPrintState";
import PrintHeader from "@/components/menu-print/PrintHeader";
import PrintPreview from "@/components/menu-print/PrintPreview";
import OptionsCard from "@/components/menu-print/OptionsCard";
import PrintStylesheet from "@/components/menu-print/PrintStylesheet";

const MenuPrint = () => {
  const {
    // Layout and display options
    layoutType,
    setLayoutType,
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
    handleCategoryToggle,
    handleToggleAllCategories,
    restaurantLogo,
    updateRestaurantLogo,
    
    // Print operations
    printContentRef,
    
    // Constants
    A4_WIDTH_MM,
    A4_HEIGHT_MM,
    pageCount
  } = useMenuPrintState();

  return (
    <div className="space-y-6">
      {/* Header with title and action buttons */}
      <PrintHeader
        layoutType={layoutType}
        language={language}
        printAllergens={printAllergens}
        selectedCategories={selectedCategories}
        restaurantLogo={restaurantLogo}
      />

      {/* Options card with print settings */}
      <OptionsCard
        restaurantLogo={restaurantLogo}
        updateRestaurantLogo={updateRestaurantLogo}
        language={language}
        setLanguage={setLanguage}
        layoutType={layoutType}
        setLayoutType={setLayoutType}
        printAllergens={printAllergens}
        setPrintAllergens={setPrintAllergens}
        showPageBoundaries={showPageBoundaries}
        setShowPageBoundaries={setShowPageBoundaries}
        categories={categories}
        selectedCategories={selectedCategories}
        handleCategoryToggle={handleCategoryToggle}
        handleToggleAllCategories={handleToggleAllCategories}
        isLoading={isLoadingMenu}
      />

      {/* Print preview */}
      <PrintPreview
        printContentRef={printContentRef}
        layoutType={layoutType}
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

      {/* Print styles */}
      <PrintStylesheet />
    </div>
  );
};

export default MenuPrint;
