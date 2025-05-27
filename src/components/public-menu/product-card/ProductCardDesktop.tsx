import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardImage } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Product } from "@/types/database";
import { useIsMobile } from "@/hooks/use-mobile";
import { LabelBadge } from "@/components/menu-settings/product-labels/LabelBadge";
import { ProductFeaturesIcons } from "./ProductFeaturesIcons";
import { useDynamicGoogleFont } from "@/hooks/useDynamicGoogleFont";

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
  const title = product.displayTitle || product.title;
  const description = product.displayDescription || product.description;
  const priceSuffix = product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : "";

  // Carica dinamicamente il font titolo e il font prezzo
  useDynamicGoogleFont(fontSettings?.title?.fontFamily);
  useDynamicGoogleFont(fontSettings?.price?.fontFamily);

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
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3
              className="mb-0"
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
          </div>
          {!product.has_multiple_prices ? (
            <span
              style={{
                fontFamily: fontSettings?.price?.fontFamily,
                fontWeight: fontSettings?.price?.fontWeight,
                fontStyle: fontSettings?.price?.fontStyle,
                fontSize: fontSettings?.price?.fontSize || 16,
              }}
              className="font-medium flex items-center"
            >
              {product.price_standard?.toFixed(2)} €{priceSuffix && <span className="ml-1">{priceSuffix}</span>}
            </span>
          ) : null}
        </div>
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
        {product.allergens && product.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
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
        {product.has_multiple_prices ? (
          <div className="space-y-2 mt-3">
            {product.price_standard !== null && product.price_standard !== undefined && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between flex items-center"
                onClick={e => {
                  e.stopPropagation();
                  addToCart(product);
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
                  {product.price_standard?.toFixed(2)} €{priceSuffix && <span className="ml-1">{priceSuffix}</span>}
                </span>
                <Plus size={16} />
              </Button>
            )}
            {product.price_variant_1_name && product.price_variant_1_value !== null && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between flex items-center"
                onClick={e => {
                  e.stopPropagation();
                  addToCart(product, product.price_variant_1_name!, product.price_variant_1_value!);
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
                  {product.price_variant_1_value?.toFixed(2)} €
                  {product.price_variant_1_name ? ` ${product.price_variant_1_name}` : ""}
                </span>
                <Plus size={16} />
              </Button>
            )}
            {product.price_variant_2_name && product.price_variant_2_value !== null && (
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between flex items-center"
                onClick={e => {
                  e.stopPropagation();
                  addToCart(product, product.price_variant_2_name!, product.price_variant_2_value!);
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
                  {product.price_variant_2_value?.toFixed(2)} €
                  {product.price_variant_2_name ? ` ${product.price_variant_2_name}` : ""}
                </span>
                <Plus size={16} />
              </Button>
            )}
          </div>
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
