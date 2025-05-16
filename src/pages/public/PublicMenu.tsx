import { useState } from "react";
import { Product } from "@/types/database";
import { useIsMobile } from "@/hooks/use-mobile";

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

// Local interfaces for PublicMenu props
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
  
  // Use custom hooks
  const { 
    categories, 
    products, 
    allergens,
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

  // ⬇️ Recupero impostazione mostra prezzi
  const { siteSettings } = useSiteSettings();
  const showPricesInOrder = typeof siteSettings?.showPricesInOrder === 'boolean' 
    ? siteSettings.showPricesInOrder 
    : true; // fallback true

  // ⬇️ Recupero prezzo Servizio e Coperto (accetta numeri e stringhe convertibili a numero)
  const serviceCoverCharge =
    typeof siteSettings?.serviceCoverCharge === "number"
      ? siteSettings.serviceCoverCharge
      : parseFloat(siteSettings?.serviceCoverCharge);

  // Initialize selected category when categories are loaded
  if (categories.length > 0 && !selectedCategory) {
    initializeCategory(categories[0].id);
  }

  // ⬇️ Layout selezionato (default o custom1)
  const productCardLayoutType = siteSettings?.publicMenuLayoutType || "default";
  // ⬇️ Imposta fontSettings in base al layout selezionato
  const publicMenuFontSettings = siteSettings?.publicMenuFontSettings || {};
  const fontSettings = publicMenuFontSettings?.[productCardLayoutType] || {};

  // Nascondi immagine nella finestra dettagli prodotto solo se "custom1"
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
            fontSettings={fontSettings}
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
        fontSettings={fontSettings}
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
