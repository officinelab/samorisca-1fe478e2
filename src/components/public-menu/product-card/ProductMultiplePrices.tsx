
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Product } from "@/types/database";
import { ProductCardButtonIconsDemo } from "@/components/menu-settings/ProductCardButtonIconsDemo";

interface FontSettings {
  price?: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic"; fontSize?: number };
}

interface ButtonSettings {
  color?: string;
  icon?: string;
}

interface ProductMultiplePricesProps {
  product: Product;
  priceSuffix: string;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  fontSettings?: FontSettings;
  buttonSettings?: ButtonSettings;
  variant: 'desktop' | 'mobile' | 'custom1-mobile';
}

export const ProductMultiplePrices: React.FC<ProductMultiplePricesProps> = ({
  product,
  priceSuffix,
  addToCart,
  fontSettings,
  buttonSettings,
  variant
}) => {
  const buttonColor = buttonSettings?.color || "#9b87f5";
  const buttonIcon = buttonSettings?.icon || "plus";

  const renderPriceRow = (price: number, label?: string, variantName?: string, variantValue?: number) => {
    const priceText = `${price.toFixed(2)} €${label ? ` ${label}` : ''}${priceSuffix}`;
    
    if (variant === 'custom1-mobile') {
      return (
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
            {priceText}
          </span>
          <Button
            variant="default"
            size="icon"
            style={{ backgroundColor: buttonColor }}
            onClick={e => {
              e.stopPropagation();
              addToCart(product, variantName, variantValue);
            }}
            className="rounded-full h-8 w-8 shadow-md hover:opacity-90"
          >
            <ProductCardButtonIconsDemo iconName={buttonIcon} color={buttonColor} size={16} />
          </Button>
        </div>
      );
    }

    if (variant === 'mobile') {
      const iconsMap: Record<string, React.ComponentType<any>> = {
        "bookmark-plus": require("lucide-react").BookmarkPlus,
        "circle-plus": require("lucide-react").CirclePlus,
        "plus": Plus,
        "badge-plus": require("lucide-react").BadgePlus,
        "circle-check-big": require("lucide-react").CircleCheckBig,
      };
      const ButtonIcon = iconsMap[buttonIcon] || Plus;

      return (
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
            {priceText}
          </span>
          <Button
            variant="default"
            size="icon"
            onClick={e => {
              e.stopPropagation();
              addToCart(product, variantName, variantValue);
            }}
            style={{ backgroundColor: buttonColor }}
            className="rounded-full h-8 w-8 shadow-md hover:opacity-90 focus:ring-2 focus:outline-none transition"
          >
            <ButtonIcon size={18} color="#fff" />
          </Button>
        </div>
      );
    }

    // Desktop variant
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-between flex items-center"
        onClick={e => {
          e.stopPropagation();
          addToCart(product, variantName, variantValue);
        }}
      >
        <span
          style={{
            fontFamily: fontSettings?.price?.fontFamily,
            fontWeight: fontSettings?.price?.fontWeight,
            fontStyle: fontSettings?.price?.fontStyle,
            fontSize: fontSettings?.price?.fontSize || 16,
          }}
        >
          {priceText}
        </span>
        <Plus size={16} />
      </Button>
    );
  };

  return (
    <div className={variant === 'desktop' ? "space-y-2 mt-3" : "flex flex-col gap-2"}>
      {product.price_standard !== null && product.price_standard !== undefined && (
        renderPriceRow(product.price_standard, undefined, undefined, undefined)
      )}
      {product.price_variant_1_name && product.price_variant_1_value !== null && (
        renderPriceRow(product.price_variant_1_value!, product.price_variant_1_name, product.price_variant_1_name, product.price_variant_1_value)
      )}
      {product.price_variant_2_name && product.price_variant_2_value !== null && (
        renderPriceRow(product.price_variant_2_value!, product.price_variant_2_name, product.price_variant_2_name, product.price_variant_2_value)
      )}
    </div>
  );
};
