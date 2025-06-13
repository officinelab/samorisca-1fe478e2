
import React, { useState, useEffect } from 'react';
import { useMenuData } from '@/hooks/useMenuData';
import { PrintLayout } from '@/types/printLayout';
import ClassicLayout from './layouts/ClassicLayout';
import ModernLayout from './layouts/ModernLayout';
import AllergensLayout from './layouts/AllergensLayout';
import PrintOptions from './PrintOptions';

interface MenuPrintPreviewProps {
  currentLayout: PrintLayout | undefined;
  showMargins: boolean;
}

const MenuPrintPreview: React.FC<MenuPrintPreviewProps> = ({
  currentLayout,
  showMargins
}) => {
  const {
    categories,
    products,
    allergens,
    restaurantLogo,
    updateRestaurantLogo,
    isLoading,
    selectedCategories,
    setSelectedCategories,
    handleCategoryToggle,
    handleToggleAllCategories
  } = useMenuData();

  const [language, setLanguage] = useState('it');
  const [printAllergens, setPrintAllergens] = useState(false);
  const [layoutId, setLayoutId] = useState(currentLayout?.id || '');

  // Dimensioni pagina A4 in mm
  const A4_WIDTH_MM = 210;
  const A4_HEIGHT_MM = 297;

  console.log('🖨️ MenuPrintPreview render:', {
    currentLayout: currentLayout?.name,
    categoriesCount: categories.length,
    selectedCategoriesCount: selectedCategories.length,
    productsCount: Object.keys(products).length,
    isLoading
  });

  useEffect(() => {
    if (categories.length > 0 && selectedCategories.length === 0) {
      console.log('🔄 Auto-selezionando tutte le categorie');
      setSelectedCategories(categories.map(cat => cat.id));
    }
  }, [categories, selectedCategories.length, setSelectedCategories]);

  // Aggiorna layoutId quando cambia currentLayout
  useEffect(() => {
    if (currentLayout?.id) {
      setLayoutId(currentLayout.id);
    }
  }, [currentLayout]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento menu...</p>
        </div>
      </div>
    );
  }

  if (!currentLayout) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-600">Nessun layout selezionato</p>
      </div>
    );
  }

  const renderLayout = () => {
    const layoutProps = {
      A4_WIDTH_MM,
      A4_HEIGHT_MM,
      showPageBoundaries: showMargins,
      categories,
      products,
      selectedCategories,
      language,
      allergens,
      printAllergens,
      restaurantLogo,
      customLayout: currentLayout
    };

    console.log('📋 Rendering layout:', currentLayout.type, 'con props:', {
      categoriesCount: categories.length,
      selectedCategoriesCount: selectedCategories.length,
      productsKeys: Object.keys(products),
      hasProducts: Object.keys(products).length > 0
    });

    switch (currentLayout.type) {
      case 'classic':
        return <ClassicLayout {...layoutProps} />;
      case 'modern':
        return <ModernLayout {...layoutProps} />;
      case 'allergens':
        return <AllergensLayout {...layoutProps} />;
      default:
        return <ClassicLayout {...layoutProps} />;
    }
  };

  return (
    <div className="space-y-6">
      <PrintOptions
        language={language}
        setLanguage={setLanguage}
        layoutId={layoutId}
        setLayoutId={setLayoutId}
        printAllergens={printAllergens}
        setPrintAllergens={setPrintAllergens}
        showPageBoundaries={showMargins}
        setShowPageBoundaries={() => {}} // Non usato qui, gestito dal parent
        categories={categories}
        selectedCategories={selectedCategories}
        handleCategoryToggle={handleCategoryToggle}
        handleToggleAllCategories={handleToggleAllCategories}
        isLoading={isLoading}
        restaurantLogo={restaurantLogo}
        updateRestaurantLogo={updateRestaurantLogo}
      />
      
      <div className="print-preview-container">
        {renderLayout()}
      </div>
    </div>
  );
};

export default MenuPrintPreview;
