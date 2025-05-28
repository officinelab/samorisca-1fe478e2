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

  // ⬇️ Recupero impostazione mostra prezzi
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

  // ====== SETTINGS LAYOUT, FONT, BUTTONS ======
  const productCardLayoutType = siteSettings?.publicMenuLayoutType || "default";

  // Ricaviamo oggetti fontSettings e buttonSettings coerenti con le anteprime
  const publicMenuFontSettings = siteSettings?.publicMenuFontSettings || {};
  const fontSettingsConfig = publicMenuFontSettings?.[productCardLayoutType] || {};

  // Button settings (per icona e colore pulsante mobile)
  const publicMenuButtonSettings = siteSettings?.publicMenuButtonSettings || {};
  const buttonSettings = publicMenuButtonSettings?.[productCardLayoutType] || {
    color: "#9b87f5",
    icon: "plus"
  };

  // Costruiamo i fontSettings suddivisi identici alle anteprime
  // Fallback ai valori default se manca qualcosa
  const defaultFontSettings = {
    title: { fontFamily: "Poppins", fontWeight: "bold", fontStyle: "normal", desktop: { fontSize: 18 }, mobile: { fontSize: 18 }, detail: { fontSize: 18 } },
    description: { fontFamily: "Open Sans", fontWeight: "normal", fontStyle: "normal", desktop: { fontSize: 14 }, mobile: { fontSize: 14 }, detail: { fontSize: 16 } },
    price: { fontFamily: "Poppins", fontWeight: "bold", fontStyle: "normal", desktop: { fontSize: 16 }, mobile: { fontSize: 16 }, detail: { fontSize: 18 } }
  };
  const fontSettings = {
    title: {
      fontFamily: fontSettingsConfig?.title?.fontFamily || defaultFontSettings.title.fontFamily,
      fontWeight: fontSettingsConfig?.title?.fontWeight || defaultFontSettings.title.fontWeight,
      fontStyle: fontSettingsConfig?.title?.fontStyle || defaultFontSettings.title.fontStyle,
      desktop: { fontSize: fontSettingsConfig?.title?.desktop?.fontSize || defaultFontSettings.title.desktop.fontSize },
      mobile: { fontSize: fontSettingsConfig?.title?.mobile?.fontSize || defaultFontSettings.title.mobile.fontSize },
      detail: { fontSize: fontSettingsConfig?.title?.detail?.fontSize || defaultFontSettings.title.detail.fontSize }
    },
    description: {
      fontFamily: fontSettingsConfig?.description?.fontFamily || defaultFontSettings.description.fontFamily,
      fontWeight: fontSettingsConfig?.description?.fontWeight || defaultFontSettings.description.fontWeight,
      fontStyle: fontSettingsConfig?.description?.fontStyle || defaultFontSettings.description.fontStyle,
      desktop: { fontSize: fontSettingsConfig?.description?.desktop?.fontSize || defaultFontSettings.description.desktop.fontSize },
      mobile: { fontSize: fontSettingsConfig?.description?.mobile?.fontSize || defaultFontSettings.description.mobile.fontSize },
      detail: { fontSize: fontSettingsConfig?.description?.detail?.fontSize || defaultFontSettings.description.detail.fontSize }
    },
    price: {
      fontFamily: fontSettingsConfig?.price?.fontFamily || defaultFontSettings.price.fontFamily,
      fontWeight: fontSettingsConfig?.price?.fontWeight || defaultFontSettings.price.fontWeight,
      fontStyle: fontSettingsConfig?.price?.fontStyle || defaultFontSettings.price.fontStyle,
      desktop: { fontSize: fontSettingsConfig?.price?.desktop?.fontSize || defaultFontSettings.price.desktop.fontSize },
      mobile: { fontSize: fontSettingsConfig?.price?.mobile?.fontSize || defaultFontSettings.price.mobile.fontSize },
      detail: { fontSize: fontSettingsConfig?.price?.detail?.fontSize || defaultFontSettings.price.detail.fontSize }
    }
  };

  // Determiniamo se card mobile/desktop/detail, e passiamo config appropriato
  // Nascondi immagine nella finestra dettagli prodotto solo se "custom1"
  const hideProductDetailImage = productCardLayoutType === "custom1";

  // Mappature config per mobile e desktop confontSettings appropriati
  const getCardFontSettings = (view: 'mobile' | 'desktop') => ({
    title: {
      fontFamily: fontSettings.title.fontFamily,
      fontWeight: fontSettings.title.fontWeight,
      fontStyle: fontSettings.title.fontStyle,
      fontSize: fontSettings.title?.[view]?.fontSize || fontSettings.title.desktop.fontSize
    },
    description: {
      fontFamily: fontSettings.description.fontFamily,
      fontWeight: fontSettings.description.fontWeight,
      fontStyle: fontSettings.description.fontStyle,
      fontSize: fontSettings.description?.[view]?.fontSize || fontSettings.description.desktop.fontSize
    },
    price: {
      fontFamily: fontSettings.price.fontFamily,
      fontWeight: fontSettings.price.fontWeight,
      fontStyle: fontSettings.price.fontStyle,
      fontSize: fontSettings.price?.[view]?.fontSize || fontSettings.price.desktop.fontSize
    }
  });

  // FontSettings per finestra dettaglio (usiamo .detail)
  const getDetailFontSettings = () => ({
    title: {
      fontFamily: fontSettings.title.fontFamily,
      fontWeight: fontSettings.title.fontWeight,
      fontStyle: fontSettings.title.fontStyle,
      fontSize: fontSettings.title?.detail?.fontSize || fontSettings.title.desktop.fontSize
    },
    description: {
      fontFamily: fontSettings.description.fontFamily,
      fontWeight: fontSettings.description.fontWeight,
      fontStyle: fontSettings.description.fontStyle,
      fontSize: fontSettings.description?.detail?.fontSize || fontSettings.description.desktop.fontSize
    },
    price: {
      fontFamily: fontSettings.price.fontFamily,
      fontWeight: fontSettings.price.fontWeight,
      fontStyle: fontSettings.price.fontStyle,
      fontSize: fontSettings.price?.detail?.fontSize || fontSettings.price.desktop.fontSize
    }
  });
  
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
            // Font settings per mobile/desktop card prodotto
            fontSettings={getCardFontSettings(deviceView)}
            // Propaga anche i settings del pulsante aggiungi 
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
        // Font settings per dettaglio prodotto
        fontSettings={getDetailFontSettings()}
        // Propaga anche icona e colore aggiungi se serve
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
