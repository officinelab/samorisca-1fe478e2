
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardImage } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookmarkPlus, CirclePlus, Plus, BadgePlus, CircleCheckBig } from "lucide-react";
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
    title?: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic"; fontSize?: number };
    description?: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic"; fontSize?: number };
    price?: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic"; fontSize?: number };
  };
  buttonSettings?: {
    color?: string;
    icon?: string;
  };
}

export const ProductCardMobile: React.FC<ProductCardMobileProps> = ({
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

  // Map icon string to component
  const iconsMap: Record<string, React.ComponentType<any>> = {
    "bookmark-plus": BookmarkPlus,
    "circle-plus": CirclePlus,
    "plus": Plus,
    "badge-plus": BadgePlus,
    "circle-check-big": CircleCheckBig,
  };
  const ButtonIcon = iconsMap[buttonSettings?.icon || "plus"] || Plus;
  const btnColor = buttonSettings?.color || "#9b87f5";

  // Ordina allergeni per numero crescente
  const sortedAllergens = product.allergens 
    ? [...product.allergens].sort((a, b) => a.number - b.number)
    : [];

  // Ordina caratteristiche per display_order crescente
  const sortedFeatures = product.features 
    ? [...product.features].sort((a, b) => a.display_order - b.display_order)
    : [];

  return (
    <Card className="mb-4" clickable onClick={() => onProductSelect(product)}>
      <div className="p-4">
        <div className="flex">
          <div className="flex-1 pr-4">
            <h3
              className="font-bold mb-1"
              style={{
                fontFamily: fontSettings?.title?.fontFamily,
                fontWeight: fontSettings?.title?.fontWeight,
                fontStyle: fontSettings?.title?.fontStyle,
                fontSize: fontSettings?.title?.fontSize || 18,
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
                  <span
                    className="font-medium"
                    style={{
                      fontFamily: fontSettings?.price?.fontFamily,
                      fontWeight: fontSettings?.price?.fontWeight,
                      fontStyle: fontSettings?.price?.fontStyle,
                      fontSize: fontSettings?.price?.fontSize || 16,
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
                    style={{ backgroundColor: btnColor }}
                    className="rounded-full h-8 w-8 shadow-md hover:opacity-90 focus:ring-2 focus:outline-none transition"
                  >
                    <ButtonIcon size={18} color="#fff" />
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
                      fontSize: fontSettings?.price?.fontSize || 16,
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
                    style={{ backgroundColor: btnColor }}
                    className="rounded-full h-8 w-8 shadow-md hover:opacity-90 focus:ring-2 focus:outline-none transition"
                  >
                    <ButtonIcon size={18} color="#fff" />
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
                      fontSize: fontSettings?.price?.fontSize || 16,
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
                    style={{ backgroundColor: btnColor }}
                    className="rounded-full h-8 w-8 shadow-md hover:opacity-90 focus:ring-2 focus:outline-none transition"
                  >
                    <ButtonIcon size={18} color="#fff" />
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
                onClick={e => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                style={{ backgroundColor: btnColor }}
                className="rounded-full h-8 w-8 shadow-md hover:opacity-90 focus:ring-2 focus:outline-none transition"
              >
                <ButtonIcon size={18} color="#fff" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
