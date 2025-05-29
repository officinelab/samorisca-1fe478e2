
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Product, Category } from "@/types/database";
import { useIsMobile } from "@/hooks/use-mobile";
import { LazyProductList } from "./category-section/LazyProductList";
import { CategorySectionHeader } from "./category-section/CategorySectionHeader";
import { EmptyProductsMessage } from "./category-section/EmptyProductsMessage";

interface CategorySectionProps {
  category: Category;
  products: Product[];
  isLoading: boolean;
  onSelectProduct: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  deviceView: 'mobile' | 'desktop';
  truncateText: (text: string | null, maxLength: number) => string;
  language?: string;
  productCardLayoutType?: string;
  fontSettings?: {
    title: { fontFamily: string; fontWeight: "normal" | "bold"; fontStyle: "normal" | "italic" };
    description: { fontFamily: string; fontWeight: "normal" | "bold"; fontStyle: "normal" | "italic" };
  };
  buttonSettings?: {
    color?: string;
    icon?: string;
  };
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  products,
  isLoading,
  onSelectProduct,
  addToCart,
  deviceView,
  truncateText,
  language = 'it',
  productCardLayoutType = "default",
  fontSettings,
  buttonSettings
}) => {
  const isMobile = useIsMobile();

  return (
    <section 
      id={`category-${category.id}`} 
      className="scroll-mt-40"
      data-category-id={category.id}
      data-category-name={category.title}
    >
      <CategorySectionHeader 
        category={category} 
        language={language} 
      />
      
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <>
          {products?.length > 0 ? (
            <LazyProductList
              products={products}
              onSelectProduct={onSelectProduct}
              addToCart={addToCart}
              deviceView={deviceView}
              truncateText={truncateText}
              productCardLayoutType={productCardLayoutType}
              fontSettings={fontSettings}
              buttonSettings={buttonSettings}
            />
          ) : (
            <EmptyProductsMessage />
          )}
        </>
      )}
    </section>
  );
};

// Export skeleton component from the main file for backward compatibility
export { CategorySectionSkeleton } from "./category-section/CategorySectionSkeleton";
