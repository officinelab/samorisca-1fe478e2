
import React from 'react';
import { Category, Product, ProductFeature } from "@/types/database";
import { CategorySection, CategorySectionSkeleton } from "@/components/public-menu/CategorySection";
import { AllergensSection } from "@/components/public-menu/AllergensSection";
import ProductFeaturesSection from "@/components/public-menu/ProductFeaturesSection";

interface MenuContentProps {
  menuRef: React.RefObject<HTMLDivElement>;
  categories: Category[];
  products: Record<string, Product[]>;
  allergens: any[];
  isLoading: boolean;
  deviceView: 'mobile' | 'desktop';
  showAllergensInfo: boolean;
  toggleAllergensInfo: () => void;
  setSelectedProduct: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  truncateText: (text: string | null, maxLength: number) => string;
  language: string;
  features?: ProductFeature[]; // aggiunto
}

export const MenuContent: React.FC<MenuContentProps> = ({
  menuRef,
  categories,
  products,
  allergens,
  isLoading,
  deviceView,
  showAllergensInfo,
  toggleAllergensInfo,
  setSelectedProduct,
  addToCart,
  truncateText,
  language,
  features = [],
}) => {
  return (
    <div
      className={deviceView === 'desktop' ? 'col-span-3' : ''}
      ref={menuRef}
    >
      <div className="space-y-10 pb-16">
        {categories.map(category => (
          <CategorySection 
            key={category.id}
            category={category}
            products={products[category.id] || []}
            isLoading={isLoading}
            onSelectProduct={setSelectedProduct}
            addToCart={addToCart}
            deviceView={deviceView}
            truncateText={truncateText}
            language={language}
          />
        ))}

        {isLoading && <CategorySectionSkeleton />}

        {/* Allergens section */}
        <AllergensSection 
          allergens={allergens}
          showAllergensInfo={showAllergensInfo}
          toggleAllergensInfo={toggleAllergensInfo}
        />

        {/* Product features section */}
        <ProductFeaturesSection
          products={products}
          features={features}
          deviceView={deviceView}
        />
      </div>
    </div>
  );
};
