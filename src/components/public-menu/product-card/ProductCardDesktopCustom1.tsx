
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Product } from "@/types/database";
import { ProductFeaturesIcons } from "./ProductFeaturesIcons";
import { ProductMultiplePrices } from "./ProductMultiplePrices";
import { ProductHeader } from "./ProductHeader";
import { useProductCardLogic } from "@/hooks/useProductCardLogic";

interface ProductCardDesktopCustom1Props {
  product: Product;
  onProductSelect: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  fontSettings?: {
    title?: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic"; fontSize?: number };
    description?: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic"; fontSize?: number };
    price?: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic"; fontSize?: number };
  };
  buttonSettings?: {
    color?: string;
    icon?: string;
  };
}

export const ProductCardDesktopCustom1: React.FC<ProductCardDesktopCustom1Props> = ({
  product,
  onProductSelect,
  addToCart,
  fontSettings
}) => {
  const { title, description, priceSuffix, sortedAllergens, sortedFeatures } = useProductCardLogic(product, fontSettings);

  return (
    <Card className="overflow-hidden h-full" clickable onClick={() => onProductSelect(product)}>
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
            size="sm"
            className="w-full justify-between mt-2 flex"
            onClick={e => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            Aggiungi
            <Plus size={16} />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
