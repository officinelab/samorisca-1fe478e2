
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePublicMenu } from "@/hooks/public-menu/usePublicMenu";
import { PublicMenuLayout } from "@/components/public-menu/PublicMenuLayout";
import { PublicMenuLoadingState } from "@/components/public-menu/PublicMenuLoadingState";
import { PublicMenuErrorState } from "@/components/public-menu/PublicMenuErrorState";

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
    getCategoryTitleStyle,
    hideProductDetailImage,
    t
  } = usePublicMenu({ isPreview, previewLanguage });

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
      categoryTitleStyle={getCategoryTitleStyle()}
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

export default PublicMenu;
