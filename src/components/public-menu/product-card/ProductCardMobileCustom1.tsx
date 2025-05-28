
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/database";
import { ProductFeaturesIcons } from "./ProductFeaturesIcons";
import { ProductMultiplePrices } from "./ProductMultiplePrices";
import { ProductHeader } from "./ProductHeader";
import { useProductCardLogic } from "@/hooks/useProductCardLogic";
import { ProductCardButtonIconsDemo } from "@/components/menu-settings/ProductCardButtonIconsDemo";

interface ProductCardMobileCustom1Props {
  product: Product;
  onProductSelect: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  truncateText: (text: string | null, maxLength: number) => string;
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

export const ProductCardMobileCustom1: React.FC<ProductCardMobileCustom1Props> = ({
  product,
  onProductSelect,
  addToCart,
  truncateText,
  fontSettings,
  buttonSettings,
}) => {
  const { title, description, priceSuffix, sortedAllergens, sortedFeatures } = useProductCardLogic(product, fontSettings);
  const buttonColor = buttonSettings?.color || "#9b87f5";
  const buttonIcon = buttonSettings?.icon || "plus";

  return (
    <Card className="mb-4" clickable onClick={() => onProductSelect(product)}>
      <div className="p-4">
        <div className="flex">
          <div className="flex-1 pr-4">
            <ProductHeader 
              product={product} 
              title={title} 
              fontSettings={fontSettings} 
              className="font-bold"
            />
            <p
              className="text-gray-600 mb-2"
              style={{
                fontFamily: fontSettings?.description?.fontFamily,
                fontWeight: fontSettings?.description?.fontWeight,
                fontStyle: fontSettings?.description?.fontStyle,
                fontSize: fontSettings?.description?.fontSize || 14,
              }}
            >
              {truncateText(description, 110)}
            </p>
            {sortedAllergens.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
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
          </div>
        </div>
        <div className="mt-4">
          {product.has_multiple_prices ? (
            <ProductMultiplePrices
              product={product}
              priceSuffix={priceSuffix}
              addToCart={addToCart}
              fontSettings={fontSettings}
              buttonSettings={buttonSettings}
              variant="custom1-mobile"
            />
          ) : (
            <div className="flex items-center justify-between w-full">
              <span
                className="font-medium"
                style={{
                  fontFamily: fontSettings?.price?.fontFamily,
                  fontWeight: fontSettings?.price?.fontWeight,
                  fontStyle: fontSettings?.price?.fontStyle,
                  fontSize: fontSettings?.price?.fontSize || 16,
                }}
              >
                {product.price_standard !== null && product.price_standard !== undefined
                  ? `${product.price_standard.toFixed(2)} €${priceSuffix}`
                  : ""}
              </span>
              <Button
                variant="default"
                size="icon"
                style={{ backgroundColor: buttonColor }}
                onClick={e => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                className="rounded-full h-8 w-8 shadow-md hover:opacity-90"
              >
                <ProductCardButtonIconsDemo iconName={buttonIcon} color={buttonColor} size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
