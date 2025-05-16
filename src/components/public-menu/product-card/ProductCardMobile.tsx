import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardImage } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Product } from "@/types/database";
import { LabelBadge } from "@/components/menu-settings/product-labels/LabelBadge";
import { ProductFeaturesIcons } from "./ProductFeaturesIcons";
import { useMenuUiTranslation } from "@/hooks/public-menu/useMenuUiTranslation";

interface ProductCardMobileProps {
  product: Product;
  onProductSelect: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  truncateText: (text: string | null, maxLength: number) => string;
  language: string;
}

export const ProductCardMobile: React.FC<ProductCardMobileProps> = ({
  product,
  onProductSelect,
  addToCart,
  truncateText,
  language,
}) => {
  const title = product.displayTitle || product.title;
  const description = product.displayDescription || product.description;
  const priceSuffix = product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : "";
  const { t } = useMenuUiTranslation(language);
  
  return (
    <Card clickable onClick={() => onProductSelect(product)}>
      {product.image_url ? (
        <CardImage
          src={product.image_url}
          alt={title}
          square={true}
          className="w-full"
        />
      ) : (
        <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">{t("no_image")}</span>
        </div>
      )}
      <div className="p-4 pb-2 flex flex-col space-y-2">
        <div className="flex justify-between items-start mb-1">
          <div>
            <h3 className="font-medium text-base">{title}</h3>
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
            <span className="font-medium flex items-center">
              {product.price_standard?.toFixed(2)} €
              {priceSuffix && <span className="ml-1">{priceSuffix}</span>}
            </span>
          ) : null}
        </div>
        {description && (
          <p className="text-gray-600 text-sm mb-2">{description}</p>
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
                <span>
                  {product.price_standard?.toFixed(2)} €
                  {priceSuffix && <span className="ml-1">{priceSuffix}</span>}
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
                <span>
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
                <span>
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
            size="sm"
            className="w-full justify-between mt-2 flex"
            onClick={e => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            {t("add_to_cart")}
            <Plus size={16} />
          </Button>
        )}
      </div>
    </Card>
  );
};
