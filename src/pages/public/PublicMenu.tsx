
import React, { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePublicMenu } from "@/hooks/public-menu/usePublicMenu";
import { PublicMenuLayout } from "@/components/public-menu/PublicMenuLayout";
import { PublicMenuLoadingState } from "@/components/public-menu/PublicMenuLoadingState";
import { PublicMenuErrorState } from "@/components/public-menu/PublicMenuErrorState";
import { MenuErrorBoundary } from "@/components/public-menu/MenuErrorBoundary";
import { useVersionCheckContext } from "@/contexts/VersionCheckContext";

interface PublicMenuProps {
  isPreview?: boolean;
  previewLanguage?: string;
  deviceView?: 'mobile' | 'desktop';
}

const PublicMenuInner: React.FC<PublicMenuProps> = ({
  isPreview = false,
  previewLanguage = 'it',
  deviceView = 'mobile'
}) => {
  const isMobile = useIsMobile();
  
  const {
    showAllergensInfo,
    setShowAllergensInfo,
    categories,
    products,
    allergens,
    categoryNotes,
    isLoading,
    error,
    language,
    setLanguage,
    selectedCategory,
    showBackToTop,
    menuRef,
    scrollToCategory,
    scrollToTop,
    selectedProduct,
    setSelectedProduct,
    truncateText,
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    removeItemCompletely,
    calculateTotal,
    clearCart,
    submitOrder,
    getCartItemsCount,
    isLoadingSiteSettings,
    showPricesInOrder,
    serviceCoverCharge,
    productCardLayoutType,
    buttonSettings,
    getCardFontSettings,
    getDetailFontSettings,
    hideProductDetailImage,
    t
  } = usePublicMenu({ isPreview, previewLanguage });

  // Auto-reload del menu pubblico quando viene rilevata una nuova versione,
  // ma solo se l'utente non sta interagendo con elementi critici
  // (carrello aperto, scheda prodotto aperta, info allergeni aperta).
  // Vedi src/hooks/useVersionCheck.ts per la logica di rilevamento.
  const { updateAvailable, reload } = useVersionCheckContext();
  useEffect(() => {
    if (isPreview) return;
    if (!updateAvailable) return;
    if (isCartOpen || selectedProduct || showAllergensInfo) return;
    const t = window.setTimeout(reload, 5000);
    return () => window.clearTimeout(t);
  }, [updateAvailable, isCartOpen, selectedProduct, showAllergensInfo, reload, isPreview]);

  // Mostra uno skeleton o loader se le impostazioni sono ancora in caricamento
  if (isLoadingSiteSettings) {
    return <PublicMenuLoadingState />;
  }

  // Mostra errore se presente
  if (error) {
    return (
      <PublicMenuErrorState
        error={error}
        onRetry={() => window.location.reload()}
        errorLoadingMessage={t("error_loading_menu")}
        retryMessage={t("error_loading_retry")}
      />
    );
  }

  return (
    <PublicMenuLayout
      language={language}
      setLanguage={setLanguage}
      cartItemsCount={getCartItemsCount()}
      openCart={() => setIsCartOpen(true)}
      deviceView={deviceView}
      categories={categories}
      products={products}
      allergens={allergens}
      categoryNotes={categoryNotes}
      selectedCategory={selectedCategory}
      scrollToCategory={scrollToCategory}
      menuRef={menuRef}
      isLoading={isLoading}
      showAllergensInfo={showAllergensInfo}
      toggleAllergensInfo={() => setShowAllergensInfo(!showAllergensInfo)}
      setSelectedProduct={setSelectedProduct}
      addToCart={addToCart}
      truncateText={truncateText}
      serviceCoverCharge={serviceCoverCharge}
      productCardLayoutType={productCardLayoutType}
      fontSettings={getCardFontSettings(deviceView)}
      buttonSettings={buttonSettings}
      showBackToTop={showBackToTop}
      scrollToTop={scrollToTop}
      selectedProduct={selectedProduct}
      hideProductDetailImage={hideProductDetailImage}
      cart={cart}
      isCartOpen={isCartOpen}
      onCartClose={() => setIsCartOpen(false)}
      onItemRemove={removeFromCart}
      onItemRemoveCompletely={removeItemCompletely}
      onClearCart={clearCart}
      onSubmitOrder={submitOrder}
      calculateTotal={calculateTotal}
      showPricesInOrder={showPricesInOrder}
    />
  );
};

const PublicMenu: React.FC<PublicMenuProps> = (props) => (
  <MenuErrorBoundary>
    <PublicMenuInner {...props} />
  </MenuErrorBoundary>
);

export default PublicMenu;
