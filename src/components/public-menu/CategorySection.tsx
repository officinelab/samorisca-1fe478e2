
import React, { useState, useRef, useEffect } from 'react';
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

// Funzione helper per validare il layout type
const validateLayoutType = (layoutType?: string): 'default' | 'compact' => {
  if (layoutType === 'compact') return 'compact';
  return 'default';
};

// Componente per lazy loading dei prodotti
const LazyProductList: React.FC<{
  products: Product[];
  onSelectProduct: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  deviceView: 'mobile' | 'desktop';
  truncateText: (text: string | null, maxLength: number) => string;
  productCardLayoutType?: string;
  fontSettings?: any;
  buttonSettings?: any;
  defaultProductImage?: string;
}> = ({ 
  products, 
  onSelectProduct, 
  addToCart, 
  deviceView, 
  truncateText, 
  productCardLayoutType,
  fontSettings,
  buttonSettings,
  defaultProductImage
}) => {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const observerRef = useRef<HTMLDivElement>(null);
  const PRODUCTS_PER_BATCH = 6;

  // Carica prodotti in batch per evitare blocchi del rendering
  useEffect(() => {
    if (products.length === 0) return;

    // Carica il primo batch immediatamente
    const initialBatch = products.slice(0, PRODUCTS_PER_BATCH);
    setVisibleProducts(initialBatch);
    setLoadedCount(PRODUCTS_PER_BATCH);
  }, [products]);

  // Intersection Observer per lazy loading
  useEffect(() => {
    if (!observerRef.current || loadedCount >= products.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && loadedCount < products.length) {
          const nextBatch = products.slice(0, Math.min(loadedCount + PRODUCTS_PER_BATCH, products.length));
          setVisibleProducts(nextBatch);
          setLoadedCount(nextBatch.length);
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [products, loadedCount]);

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {visibleProducts.map(product => {
          const productWithDefaultImage = {
            ...product,
            image_url: product.image_url || defaultProductImage
          };

          return (
            <ProductCard
              key={product.id}
              product={productWithDefaultImage}
              onProductSelect={onSelectProduct}
              addToCart={addToCart}
              deviceView={deviceView}
              truncateText={truncateText}
              layoutType={validateLayoutType(productCardLayoutType)}
              fontSettings={fontSettings}
              buttonSettings={buttonSettings}
            />
          );
        })}
      </div>
      
      {/* Loading trigger per lazy loading */}
      {loadedCount < products.length && (
        <div ref={observerRef} className="mt-4">
          <div className="grid grid-cols-1 gap-4">
            {[...Array(Math.min(PRODUCTS_PER_BATCH, products.length - loadedCount))].map((_, idx) => (
              <Skeleton key={idx} className="h-32 w-full" />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

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
              defaultProductImage={siteSettings?.defaultProductImage}
            />
          ) : (
            <p className="text-gray-500 text-center py-6">
              Nessun prodotto disponibile in questa categoria.
            </p>
          )}
        </>
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
