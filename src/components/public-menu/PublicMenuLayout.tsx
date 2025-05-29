
import React from 'react';
import { Header } from "@/components/public-menu/Header";
import { Footer } from "@/components/public-menu/Footer";
import { CategorySidebar } from "@/components/public-menu/CategorySidebar";
import { MenuContent } from "@/components/public-menu/MenuContent";
import { BackToTopButton } from "@/components/public-menu/BackToTopButton";
import { ProductDetailsDialog } from "@/components/public-menu/ProductDetailsDialog";
import { CartSheet } from "@/components/public-menu/CartSheet";
import { Category, Product } from "@/types/database";
import { CategoryNote } from "@/types/categoryNotes";

interface PublicMenuLayoutProps {
  // Navigation props
  language: string;
  setLanguage: (value: string) => void;
  cartItemsCount: number;
  openCart: () => void;
  deviceView: 'mobile' | 'desktop';
  
  // Categories and products
  categories: Category[];
  products: Record<string, Product[]>;
  allergens: any[];
  categoryNotes: CategoryNote[];
  selectedCategory: string | null;
  scrollToCategory: (categoryId: string) => void;
  
  // Menu content
  menuRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  showAllergensInfo: boolean;
  toggleAllergensInfo: () => void;
  setSelectedProduct: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  truncateText: (text: string | null, maxLength: number) => string;
  serviceCoverCharge?: number;
  productCardLayoutType?: 'default' | 'custom1';
  fontSettings?: any;
  buttonSettings?: any;
  
  // Back to top
  showBackToTop: boolean;
  scrollToTop: () => void;
  
  // Product details
  selectedProduct: Product | null;
  hideProductDetailImage: boolean;
  
  // Cart
  cart: any[];
  isCartOpen: boolean;
  onCartClose: () => void;
  onItemRemove: (itemId: string) => void;
  onItemRemoveCompletely: (itemId: string) => void;
  onClearCart: () => void;
  onSubmitOrder: () => void;
  calculateTotal: () => number;
  showPricesInOrder: boolean;
}

export const PublicMenuLayout: React.FC<PublicMenuLayoutProps> = ({
  language,
  setLanguage,
  cartItemsCount,
  openCart,
  deviceView,
  categories,
  products,
  allergens,
  categoryNotes,
  selectedCategory,
  scrollToCategory,
  menuRef,
  isLoading,
  showAllergensInfo,
  toggleAllergensInfo,
  setSelectedProduct,
  addToCart,
  truncateText,
  serviceCoverCharge,
  productCardLayoutType,
  fontSettings,
  buttonSettings,
  showBackToTop,
  scrollToTop,
  selectedProduct,
  hideProductDetailImage,
  cart,
  isCartOpen,
  onCartClose,
  onItemRemove,
  onItemRemoveCompletely,
  onClearCart,
  onSubmitOrder,
  calculateTotal,
  showPricesInOrder
}) => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <Header 
        language={language}
        setLanguage={setLanguage}
        cartItemsCount={cartItemsCount}
        openCart={openCart}
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
            toggleAllergensInfo={toggleAllergensInfo}
            setSelectedProduct={setSelectedProduct}
            addToCart={addToCart}
            truncateText={truncateText}
            language={language}
            serviceCoverCharge={serviceCoverCharge}
            productCardLayoutType={productCardLayoutType}
            fontSettings={fontSettings}
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
        language={language}
        fontSettings={fontSettings}
        buttonSettings={buttonSettings}
      />
      
      {/* Cart sheet */}
      <CartSheet 
        cart={cart}
        open={isCartOpen}
        onClose={onCartClose}
        onItemAdd={addToCart}
        onItemRemove={onItemRemove}
        onItemRemoveCompletely={onItemRemoveCompletely}
        onClearCart={onClearCart}
        onSubmitOrder={onSubmitOrder}
        calculateTotal={calculateTotal}
        showPricesInOrder={showPricesInOrder}
        language={language}
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};
