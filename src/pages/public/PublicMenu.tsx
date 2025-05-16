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

  // ============ Stili font per prodotti e dettagli menu pubblico per layout separato ============
  // Legacy fallback: Inter, font impostato SOLO per il layout selezionato
  function getPreviewFontStyles(layoutFontSettings: {
    titleFont: string;
    titleBold: boolean;
    titleItalic: boolean;
    descriptionFont: string;
    descriptionBold: boolean;
    descriptionItalic: boolean;
  }, forcedTitleFontSize?: number) {
    return {
      title: {
        fontFamily: layoutFontSettings.titleFont,
        fontWeight: layoutFontSettings.titleBold ? "bold" : "normal",
        fontStyle: layoutFontSettings.titleItalic ? "italic" : "normal",
        fontSize: forcedTitleFontSize ?? 22,
        lineHeight: 1.13
      },
      description: {
        fontFamily: layoutFontSettings.descriptionFont,
        fontWeight: layoutFontSettings.descriptionBold ? "bold" : "normal",
        fontStyle: layoutFontSettings.descriptionItalic ? "italic" : "normal"
      }
    };
  }
  // Leggi key dinamica come fa la sezione impostazioni:
  const FONT_SETTINGS_KEY = (layout: string) => `publicMenuFont__${layout}`;
  const fontSettingsRaw = siteSettings?.[FONT_SETTINGS_KEY(productCardLayoutType)];
  const fallbackFontSettings = {
    titleFont: "Inter, sans-serif",
    titleBold: false,
    titleItalic: false,
    descriptionFont: "Inter, sans-serif",
    descriptionBold: false,
    descriptionItalic: false,
  };
  const effectiveFontSettings = fontSettingsRaw || fallbackFontSettings;

  // ⬇️ Calcolo grandezza titoli diversa in base al layout e tipo di preview
  // Decide se nascondere le immagini solo per custom1 (in dettaglio prodotto)
  const hideProductDetailImage = productCardLayoutType === "custom1";

  // Variante: per mobile/desktop/dettagli
  const previewFontStyles = {
    desktop: getPreviewFontStyles(effectiveFontSettings, 22),
    mobile: getPreviewFontStyles(effectiveFontSettings, 18),
    details: getPreviewFontStyles(effectiveFontSettings, 20),
  };

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
            // Passa anche gli stili font GIUSTI per tipo di preview
            previewFontStyles={deviceView === "mobile" 
              ? previewFontStyles.mobile
              : previewFontStyles.desktop}
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
        // Passa stili font solo per dettagli prodotto!
        previewFontStyles={previewFontStyles.details}
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
