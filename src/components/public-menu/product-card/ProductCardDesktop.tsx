
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardImage } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Product } from "@/types/database";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProductFeaturesIcons } from "./ProductFeaturesIcons";
import { ProductMultiplePrices } from "./ProductMultiplePrices";
import { ProductHeader } from "./ProductHeader";
import { useProductCardLogic } from "@/hooks/useProductCardLogic";

interface ProductCardDesktopProps {
  product: Product;
  onProductSelect: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  fontSettings?: {
    title?: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic"; fontSize?: number };
    description?: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic"; fontSize?: number };
    price?: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic"; fontSize?: number };
  };
}

export const ProductCardDesktop: React.FC<ProductCardDesktopProps> = ({
  product,
  onProductSelect,
  addToCart,
  fontSettings
}) => {
  const isMobileView = useIsMobile();
  const { title, description, priceSuffix, sortedAllergens, sortedFeatures } = useProductCardLogic(product, fontSettings);

  return (
    <Card horizontal className="overflow-hidden h-full" clickable onClick={() => onProductSelect(product)}>
      {product.image_url ? (
        <CardImage
          src={product.image_url}
          alt={title}
          className="w-1/6 h-auto"
          square={isMobileView}
        />
      ) : (
        <div className={`w-1/6 bg-gray-100 flex items-center justify-center ${isMobileView ? "aspect-square" : "min-h-[150px]"}`}>
          <span className="text-gray-400">Nessuna immagine</span>
        </div>
      )}
      <CardContent className="flex-1 p-4">
        <ProductHeader 
          product={product} 
          title={title} 
          fontSettings={fontSettings} 
          showPrice={true}
          priceSuffix={priceSuffix}
        />
        {description && (
          <p
            className="text-gray-600 mb-2"
            style={{
              fontFamily: fontSettings?.description?.fontFamily,
              fontWeight: fontSettings?.description?.fontWeight,
              fontStyle: fontSettings?.description?.fontStyle,
              fontSize: fontSettings?.description?.fontSize || 14,
            }}
          >
            {description}
          </p>
        )}
        {sortedAllergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {sortedAllergens.map(allergen => (
              <Badge key={allergen.id} variant="outline" className="text-xs px-1 py-0">
                {allergen.number}
              </Badge>
            ))}
          </div>
        )}
        {sortedFeatures.length > 0 && (
          <ProductFeaturesIcons features={sortedFeatures} />
        )}
        {product.has_multiple_prices ? (
          <ProductMultiplePrices
            product={product}
            priceSuffix={priceSuffix}
            addToCart={addToCart}
            fontSettings={fontSettings}
            variant="desktop"
          />
        ) : (
          <Button
            variant="outline"
            size={isMobileView ? "icon" : "sm"}
            className={`${!isMobileView ? "w-full justify-between" : ""} mt-2 ml-auto flex`}
            onClick={e => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            {!isMobileView && "Aggiungi"}
            <span className="flex items-center">
              <Plus size={16} />
            </span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
