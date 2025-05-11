
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category, Product } from "@/types/database";
import { CategorySection, CategorySectionSkeleton } from "@/components/public-menu/CategorySection";
import { AllergensSection } from "@/components/public-menu/AllergensSection";

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
  truncateText
}) => {
  return (
    <div className={deviceView === 'desktop' ? 'col-span-3' : ''}>
      <ScrollArea ref={menuRef} className="h-[calc(100vh-140px)]">
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
            />
          ))}

          {isLoading && <CategorySectionSkeleton />}

          {/* Allergens section */}
          <AllergensSection 
            allergens={allergens}
            showAllergensInfo={showAllergensInfo}
            toggleAllergensInfo={toggleAllergensInfo}
          />
        </div>
      </ScrollArea>
    </div>
  );
};
