
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardImage } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// Sostituisco Plus con CirclePlus
import { CirclePlus } from "lucide-react";
import { Product } from "@/types/database";
import { LabelBadge } from "@/components/menu-settings/product-labels/LabelBadge";
import { ProductFeaturesIcons } from "./ProductFeaturesIcons";
import { useDynamicGoogleFont } from "@/hooks/useDynamicGoogleFont";

interface ProductCardMobileProps {
  product: Product;
  onProductSelect: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  truncateText: (text: string | null, maxLength: number) => string;
  fontSettings?: {
    title: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic" };
    description: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic" };
  };
}

export const ProductCardMobile: React.FC<ProductCardMobileProps> = ({
  product,
  onProductSelect,
  addToCart,
  truncateText,
  fontSettings
}) => {
  const title = product.displayTitle || product.title;
  const description = product.displayDescription || product.description;
  const priceSuffix = product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : "";

  // Carica dinamicamente il font titolo
  useDynamicGoogleFont(fontSettings?.title?.fontFamily);

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
          <div className="relative">
            <CardImage src={product.image_url} alt={title} mobileView />
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
                    className="rounded-full h-8 w-8 shadow-md bg-[#9b87f5] hover:bg-[#7E69AB] focus:ring-2 focus:ring-[#7E69AB] focus:outline-none transition"
                  >
                    <CirclePlus size={18} />
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
                    className="rounded-full h-8 w-8 shadow-md bg-[#9b87f5] hover:bg-[#7E69AB] focus:ring-2 focus:ring-[#7E69AB] focus:outline-none transition"
                  >
                    <CirclePlus size={18} />
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
                    className="rounded-full h-8 w-8 shadow-md bg-[#9b87f5] hover:bg-[#7E69AB] focus:ring-2 focus:ring-[#7E69AB] focus:outline-none transition"
                  >
                    <CirclePlus size={18} />
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
                className="rounded-full h-8 w-8 shadow-md bg-[#9b87f5] hover:bg-[#7E69AB] focus:ring-2 focus:ring-[#7E69AB] focus:outline-none transition"
              >
                <CirclePlus size={18} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
