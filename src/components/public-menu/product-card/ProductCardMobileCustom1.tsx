import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, BookmarkPlus, CirclePlus, HeartPlus, BadgePlus, CircleCheckBig } from "lucide-react";
import { Product } from "@/types/database";
import { LabelBadge } from "@/components/menu-settings/product-labels/LabelBadge";
import { ProductFeaturesIcons } from "./ProductFeaturesIcons";
import { useDynamicGoogleFont } from "@/hooks/useDynamicGoogleFont";

interface ProductCardMobileCustom1Props {
  product: Product;
  onProductSelect: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  truncateText: (text: string | null, maxLength: number) => string;
  fontSettings?: {
    title?: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic" };
    description?: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic" };
    price?: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic" };
  };
  buttonSettings?: {
    addToCartButtonColor?: string;
    addToCartButtonIcon?: string;
  };
}

export const ProductCardMobileCustom1: React.FC<ProductCardMobileCustom1Props> = ({
  product,
  onProductSelect,
  addToCart,
  truncateText,
  fontSettings,
  buttonSettings
}) => {
  const title = product.displayTitle || product.title;
  const description = product.displayDescription || product.description;
  const priceSuffix = product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : "";

  // Carica dinamicamente il font titolo
  useDynamicGoogleFont(fontSettings?.title?.fontFamily);
  useDynamicGoogleFont(fontSettings?.price?.fontFamily);

  const buttonBgColor = buttonSettings?.addToCartButtonColor || "#7E69AB";
  const iconName = buttonSettings?.addToCartButtonIcon || "plus";

  const renderIcon = (icon: string, size = 16, color = "#fff") => {
    switch (icon) {
      case "bookmark-plus":
        return <BookmarkPlus size={size} color={color} />;
      case "circle-plus":
        return <CirclePlus size={size} color={color} />;
      case "plus":
        return <Plus size={size} color={color} />;
      case "heart-plus":
        return <HeartPlus size={size} color={color} />;
      case "badge-plus":
        return <BadgePlus size={size} color={color} />;
      case "circle-check-big":
        return <CircleCheckBig size={size} color={color} />;
      default:
        return <Plus size={size} color={color} />;
    }
  };

  return (
    <Card className="mb-4" clickable onClick={() => onProductSelect(product)}>
      <div className="p-4">
        <div className="flex">
          <div className="flex-1 pr-4">
            <h3
              className="text-lg font-bold mb-1"
              style={{
                fontFamily: fontSettings?.title?.fontFamily,
                fontWeight: fontSettings?.title?.fontWeight,
                fontStyle: fontSettings?.title?.fontStyle,
              }}
            >
              {title}
            </h3>
            {product.label && (
              <div className="mb-1">
                <LabelBadge
                  title={product.label.displayTitle || product.label.title}
                  color={product.label.color}
                  textColor={product.label.text_color}
                />
              </div>
            )}
            <p
              className="text-gray-600 text-sm mb-2"
              style={{
                fontFamily: fontSettings?.description?.fontFamily,
                fontWeight: fontSettings?.description?.fontWeight,
                fontStyle: fontSettings?.description?.fontStyle,
              }}
            >
              {truncateText(description, 110)}
            </p>
            {product.allergens && product.allergens.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {product.allergens.map(allergen => (
                  <Badge key={allergen.id} variant="outline" className="text-xs px-1 py-0">
                    {allergen.number}
                  </Badge>
                ))}
              </div>
            )}
            {product.features && product.features.length > 0 && (
              <ProductFeaturesIcons features={product.features} />
            )}
          </div>
        </div>
        <div className="mt-4">
          {product.has_multiple_prices ? (
            <div className="flex flex-col gap-2">
              {/* Standard price row */}
              {product.price_standard !== null && product.price_standard !== undefined && (
                <div className="flex items-center justify-between w-full">
                  <span
                    className="font-medium"
                    style={{
                      fontFamily: fontSettings?.price?.fontFamily,
                      fontWeight: fontSettings?.price?.fontWeight,
                      fontStyle: fontSettings?.price?.fontStyle,
                    }}
                  >
                    {product.price_standard.toFixed(2)} €{priceSuffix}
                  </span>
                  <Button
                    variant="default"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    style={{ backgroundColor: buttonBgColor }}
                    className="rounded-full h-8 w-8 shadow-md hover:opacity-80"
                  >
                    {renderIcon(iconName)}
                  </Button>
                </div>
              )}
              {/* Variante 1 */}
              {product.price_variant_1_name && product.price_variant_1_value !== null && (
                <div className="flex items-center justify-between w-full">
                  <span
                    className="font-medium"
                    style={{
                      fontFamily: fontSettings?.price?.fontFamily,
                      fontWeight: fontSettings?.price?.fontWeight,
                      fontStyle: fontSettings?.price?.fontStyle,
                    }}
                  >
                    {product.price_variant_1_value?.toFixed(2)} €
                    {product.price_variant_1_name ? ` ${product.price_variant_1_name}` : ""}
                  </span>
                  <Button
                    variant="default"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation();
                      addToCart(product, product.price_variant_1_name!, product.price_variant_1_value!);
                    }}
                    style={{ backgroundColor: buttonBgColor }}
                    className="rounded-full h-8 w-8 shadow-md hover:opacity-80"
                  >
                    {renderIcon(iconName)}
                  </Button>
                </div>
              )}
              {/* Variante 2 */}
              {product.price_variant_2_name && product.price_variant_2_value !== null && (
                <div className="flex items-center justify-between w-full">
                  <span
                    className="font-medium"
                    style={{
                      fontFamily: fontSettings?.price?.fontFamily,
                      fontWeight: fontSettings?.price?.fontWeight,
                      fontStyle: fontSettings?.price?.fontStyle,
                    }}
                  >
                    {product.price_variant_2_value?.toFixed(2)} €
                    {product.price_variant_2_name ? ` ${product.price_variant_2_name}` : ""}
                  </span>
                  <Button
                    variant="default"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation();
                      addToCart(product, product.price_variant_2_name!, product.price_variant_2_value!);
                    }}
                    style={{ backgroundColor: buttonBgColor }}
                    className="rounded-full h-8 w-8 shadow-md hover:opacity-80"
                  >
                    {renderIcon(iconName)}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span
                className="font-medium"
                style={{
                  fontFamily: fontSettings?.price?.fontFamily,
                  fontWeight: fontSettings?.price?.fontWeight,
                  fontStyle: fontSettings?.price?.fontStyle,
                }}
              >
                {product.price_standard !== null && product.price_standard !== undefined
                  ? `${product.price_standard.toFixed(2)} €${priceSuffix}`
                  : ""}
              </span>
              <Button
                variant="default"
                size="icon"
                onClick={e => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                style={{ backgroundColor: buttonBgColor }}
                className="rounded-full h-8 w-8 shadow-md hover:opacity-80"
              >
                {renderIcon(iconName)}
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
