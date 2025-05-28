
import { useState } from "react";
import { Product } from "@/types/database";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFontSettings } from "@/hooks/useFontSettings";

// Import hooks
import { usePublicMenuData } from "@/hooks/public-menu/usePublicMenuData";
import { useMenuNavigation } from "@/hooks/public-menu/useMenuNavigation";
import { useProductDetails } from "@/hooks/public-menu/useProductDetails";
import { useCart } from "@/hooks/useCart";
import { useSiteSettings } from "@/hooks/useSiteSettings";

// Import components
import { Header } from "@/components/public-menu/Header";
import { Footer } from "@/components/public-menu/Footer";
import { CategorySidebar } from "@/components/public-menu/CategorySidebar";
import { MenuContent } from "@/components/public-menu/MenuContent";
import { BackToTopButton } from "@/components/public-menu/BackToTopButton";
import { ProductDetailsDialog } from "@/components/public-menu/ProductDetailsDialog";
import { CartSheet } from "@/components/public-menu/CartSheet";

interface PublicMenuProps {
  isPreview?: boolean;
  previewLanguage?: string;
  deviceView?: 'mobile' | 'desktop';
}

const PublicMenu: React.FC<PublicMenuProps> = ({
  isPreview = false,
  previewLanguage = 'it',
  deviceView = 'mobile'
}) => {
  const isMobile = useIsMobile();
  const [showAllergensInfo, setShowAllergensInfo] = useState(false);

  const { 
    categories, 
    products, 
    allergens,
    categoryNotes,
    isLoading, 
    language, 
    setLanguage 
  } = usePublicMenuData(isPreview, previewLanguage);

  const {
    selectedCategory,
    showBackToTop,
    menuRef,
    scrollToCategory,
    scrollToTop,
    initializeCategory
  } = useMenuNavigation();

  const {
    selectedProduct,
    setSelectedProduct,
    truncateText
  } = useProductDetails();

  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    addToCart, 
    removeFromCart, 
    removeItemCompletely,
    calculateTotal, 
    clearCart, 
    submitOrder,
    getCartItemsCount 
  } = useCart();

  const { siteSettings, isLoading: isLoadingSiteSettings } = useSiteSettings();

  // Mostra uno skeleton o loader se le impostazioni sono ancora in caricamento
  if (isLoadingSiteSettings) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center bg-gray-50">
        <div className="animate-pulse w-60 h-32 bg-gray-200 rounded mb-4"></div>
        <div className="w-1/3 h-10 bg-gray-200 rounded mb-2"></div>
        <div className="w-1/2 h-8 bg-gray-100 rounded mb-6"></div>
        <div className="w-[90%] h-48 bg-gray-100 rounded"></div>
      </div>
    );
  }

  const showPricesInOrder = typeof siteSettings?.showPricesInOrder === 'boolean' 
    ? siteSettings.showPricesInOrder 
    : true;

  const serviceCoverCharge =
    typeof siteSettings?.serviceCoverCharge === "number"
      ? siteSettings.serviceCoverCharge
      : parseFloat(siteSettings?.serviceCoverCharge);

  // Inizializza la categoria selezionata quando arrivano le categorie
  if (categories.length > 0 && !selectedCategory) {
    initializeCategory(categories[0].id);
  }

  // Settings layout, font, buttons
  const productCardLayoutType = siteSettings?.publicMenuLayoutType || "default";
  const publicMenuButtonSettings = siteSettings?.publicMenuButtonSettings || {};
  const buttonSettings = publicMenuButtonSettings?.[productCardLayoutType] || {
    color: "#9b87f5",
    icon: "plus"
  };

  // Font settings usando il nuovo hook
  const { getCardFontSettings, getDetailFontSettings } = useFontSettings(siteSettings, productCardLayoutType);
  const hideProductDetailImage = productCardLayoutType === "custom1";
  
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <Header 
        language={language}
        setLanguage={setLanguage}
        cartItemsCount={getCartItemsCount()}
        openCart={() => setIsCartOpen(true)}
      />

      <div className="container max-w-5xl mx-auto px-4 py-6">
        <div className={`grid ${deviceView === 'desktop' ? 'grid-cols-4 gap-6' : 'grid-cols-1 gap-4'}`}>
          {/* Categories (Sidebar on desktop) */}
          <CategorySidebar 
            categories={categories}
            selectedCategory={selectedCategory}
            deviceView={deviceView}
            onSelectCategory={scrollToCategory}
            language={language}
          />

          {/* Main menu content */}
          <MenuContent 
            menuRef={menuRef}
            categories={categories}
            products={products}
            allergens={allergens}
            categoryNotes={categoryNotes}
            isLoading={isLoading}
            deviceView={deviceView}
            showAllergensInfo={showAllergensInfo}
            toggleAllergensInfo={() => setShowAllergensInfo(!showAllergensInfo)}
            setSelectedProduct={setSelectedProduct}
            addToCart={addToCart}
            truncateText={truncateText}
            language={language}
            serviceCoverCharge={serviceCoverCharge}
            productCardLayoutType={productCardLayoutType}
            fontSettings={getCardFontSettings(deviceView)}
            buttonSettings={buttonSettings}
          />
        </div>
      </div>

      {/* Back to top button */}
      <BackToTopButton show={showBackToTop} onClick={scrollToTop} />
      
      {/* Product details dialog */}
      <ProductDetailsDialog 
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        addToCart={addToCart}
        hideImage={hideProductDetailImage}
        fontSettings={getDetailFontSettings()}
        buttonSettings={buttonSettings}
      />
      
      {/* Cart sheet */}
      <CartSheet 
        cart={cart}
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onItemAdd={addToCart}
        onItemRemove={removeFromCart}
        onItemRemoveCompletely={removeItemCompletely}
        onClearCart={clearCart}
        onSubmitOrder={submitOrder}
        calculateTotal={calculateTotal}
        showPricesInOrder={showPricesInOrder}
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PublicMenu;
