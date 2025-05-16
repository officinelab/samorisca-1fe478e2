
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Product, Category } from "@/types/database";
import { ProductCard } from "./ProductCards";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useIsMobile } from "@/hooks/use-mobile";

interface CategorySectionProps {
  category: Category;
  products: Product[];
  isLoading: boolean;
  onSelectProduct: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  deviceView: 'mobile' | 'desktop';
  truncateText: (text: string | null, maxLength: number) => string;
  language?: string;
  productCardLayoutType?: 'default' | 'compact';
  // Permetti stili font opzionali per anteprima layout
  previewFontStyles?: {
    title?: React.CSSProperties;
    description?: React.CSSProperties;
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
  previewFontStyles
}) => {
  const isMobile = useIsMobile();
  const { siteSettings } = useSiteSettings();

  // Usa la versione valorizzata da fetchMenuDataOptimized (displayTitle) o fallback su category.title
  const categoryTitle = category.displayTitle || category.title;

  return (
    <section id={`category-${category.id}`} className="scroll-mt-20">
      <h2 className="text-2xl font-bold mb-4">{categoryTitle}</h2>
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products?.length > 0 ? products.map(product => {
            const productWithDefaultImage = {
              ...product,
              image_url: product.image_url || siteSettings.defaultProductImage
            };

            return (
              <ProductCard
                key={product.id}
                product={productWithDefaultImage}
                onProductSelect={onSelectProduct}
                addToCart={addToCart}
                deviceView={deviceView}
                truncateText={truncateText}
                layoutType={productCardLayoutType}
                // Passa gli stili font se presenti
                previewFontStyles={previewFontStyles}
              />
            );
          }) : (
            <p className="text-gray-500 text-center py-6">
              Nessun prodotto disponibile in questa categoria.
            </p>
          )}
        </div>
      )}
    </section>
  );
};

// Loading skeleton for category sections
export const CategorySectionSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-52 w-full" />
        </div>
      </div>
      <div>
        <Skeleton className="h-8 w-48 mb-4" />
        <div className="grid grid-cols-1 gap-4">
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-52 w-full" />
        </div>
      </div>
    </div>
  );
};

