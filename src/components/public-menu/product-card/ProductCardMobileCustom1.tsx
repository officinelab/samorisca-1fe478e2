import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Product } from "@/types/database";
import { LabelBadge } from "@/components/menu-settings/product-labels/LabelBadge";
import { ProductFeaturesIcons } from "./ProductFeaturesIcons";

interface ProductCardMobileCustom1Props {
  product: Product;
  onProductSelect: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  truncateText: (text: string | null, maxLength: number) => string;
  fontSettings?: {
    titleFont: string;
    titleBold: boolean;
    titleItalic: boolean;
    descriptionFont: string;
    descriptionBold: boolean;
    descriptionItalic: boolean;
  };
}

export const ProductCardMobileCustom1: React.FC<ProductCardMobileCustom1Props> = ({
  product,
  onProductSelect,
  addToCart,
  truncateText,
  fontSettings
}) => {
  const title = product.displayTitle || product.title;
  const description = product.displayDescription || product.description;
  const priceSuffix = product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : "";

  const titleStyle = fontSettings
    ? {
        fontFamily: fontSettings.titleFont,
        fontWeight: fontSettings.titleBold ? "bold" : "normal",
        fontStyle: fontSettings.titleItalic ? "italic" : "normal",
      }
    : {};

  const descStyle = fontSettings
    ? {
        fontFamily: fontSettings.descriptionFont,
        fontWeight: fontSettings.descriptionBold ? "bold" : "normal",
        fontStyle: fontSettings.descriptionItalic ? "italic" : "normal",
      }
    : {};

  return (
    <Card className="mb-4" clickable onClick={() => onProductSelect(product)}>
      <div className="p-4">
        <div className="flex">
          <div className="flex-1 pr-4">
            <h3 className="font-bold text-lg mb-1" style={titleStyle}>{title}</h3>
            {product.label && (
              <div className="mb-1">
                <LabelBadge
                  title={product.label.displayTitle || product.label.title}
                  color={product.label.color}
                  textColor={product.label.text_color}
                />
              </div>
            )}
            <p className="text-gray-600 text-sm mb-2" style={descStyle}>
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
                  <span className="font-medium">
                    {product.price_standard.toFixed(2)} €{priceSuffix}
                  </span>
                  <Button
                    variant="default"
                    size="icon"
                    onClick={e => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="rounded-full h-8 w-8 shadow-md bg-teal-950 hover:bg-teal-800"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              )}
              {/* Variante 1 */}
              {product.price_variant_1_name && product.price_variant_1_value !== null && (
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">
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
                    className="rounded-full h-8 w-8 shadow-md bg-teal-950 hover:bg-teal-800"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              )}
              {/* Variante 2 */}
              {product.price_variant_2_name && product.price_variant_2_value !== null && (
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">
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
                    className="rounded-full h-8 w-8 shadow-md bg-teal-950 hover:bg-teal-800"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <span className="font-medium">
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
                className="rounded-full h-8 w-8 shadow-md bg-teal-950 hover:bg-teal-800"
              >
                <Plus size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
