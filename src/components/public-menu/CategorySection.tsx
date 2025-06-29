
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

  // Mostra skeleton solo se stiamo caricando E non abbiamo prodotti per questa categoria
  const showProductsLoadingSkeleton = isLoading && (!products || products.length === 0);

  return (
    <section id={`category-container-${category.id}`}>
      <CategorySectionHeader 
        category={category} 
        language={language} 
      />
      
      {showProductsLoadingSkeleton ? (
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
