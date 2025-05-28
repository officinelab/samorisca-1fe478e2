
import React, { useState, useRef, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@/types/database";
import { ProductCard } from "../ProductCards";
import { useSiteSettings } from "@/hooks/useSiteSettings";

interface LazyProductListProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  deviceView: 'mobile' | 'desktop';
  truncateText: (text: string | null, maxLength: number) => string;
  productCardLayoutType?: string;
  fontSettings?: any;
  buttonSettings?: any;
}

export const LazyProductList: React.FC<LazyProductListProps> = ({ 
  products, 
  onSelectProduct, 
  addToCart, 
  deviceView, 
  truncateText, 
  productCardLayoutType,
  fontSettings,
  buttonSettings
}) => {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);
  const observerRef = useRef<HTMLDivElement>(null);
  const PRODUCTS_PER_BATCH = 6;
  const { siteSettings } = useSiteSettings();

  // Funzione helper per validare il layout type
  const validateLayoutType = (layoutType?: string): 'default' | 'compact' => {
    if (layoutType === 'compact') return 'compact';
    return 'default';
  };

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
            image_url: product.image_url || siteSettings?.defaultProductImage
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
