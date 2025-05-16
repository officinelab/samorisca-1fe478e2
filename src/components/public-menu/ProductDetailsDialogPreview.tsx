import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Product } from "@/types/database";
import { LabelBadge } from "@/components/menu-settings/product-labels/LabelBadge";
import { ProductFeaturesIcons } from "./product-card/ProductFeaturesIcons";
import { usePublicMenuUiStrings } from "@/hooks/public-menu/usePublicMenuUiStrings";

interface ProductDetailsDialogPreviewProps {
  product: Product | null;
  addToCart?: (product: Product, variantName?: string, variantPrice?: number) => void;
  hideImage?: boolean;
  language?: string;
  // Nuovo: stili font opzionali SOLO preview o menu pubblico
  previewFontStyles?: {
    title?: React.CSSProperties;
    description?: React.CSSProperties;
  };
}

export const ProductDetailsDialogPreview: React.FC<ProductDetailsDialogPreviewProps> = ({
  product,
  addToCart,
  hideImage = false,
  language = "it",
  previewFontStyles
}) => {
  if (!product) return null;

  const { t } = usePublicMenuUiStrings(language);

  const title = product.displayTitle || product.title;
  const description = product.displayDescription || product.description;
  const priceSuffix = product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : "";

  return (
    <div className="w-full px-4 pb-4">
      <div className="py-4">
        {/* Applichiamo gli stili font se presenti */}
        <h3 className="text-2xl font-semibold" style={previewFontStyles?.title}>{title}</h3>
        {product.label && (
          <div className="mt-2">
            <LabelBadge
              title={product.label.displayTitle || product.label.title}
              color={product.label.color}
              textColor={product.label.text_color}
            />
          </div>
        )}
      </div>
      <div className="grid gap-4">
        {!hideImage && product.image_url && (
          <div className="w-full h-48 relative rounded-md overflow-hidden">
            <img
              src={product.image_url}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div>
          <h4 className="font-semibold mb-1">{t("description")}</h4>
          <p className="text-gray-600" style={previewFontStyles?.description}>
            {description || t("description") + "..."}
          </p>
        </div>
        {product.allergens && product.allergens.length > 0 && (
          <div>
            <h4 className="font-semibold mb-1">{t("allergens")}</h4>
            <div className="flex flex-wrap gap-2 mb-2">
              {product.allergens.map(allergen => (
                <Badge key={allergen.id} variant="outline">
                  {allergen.number} - {allergen.displayTitle || allergen.title}
                </Badge>
              ))}
            </div>
            {product.features && product.features.length > 0 && (
              <ProductFeaturesIcons features={product.features} />
            )}
          </div>
        )}
        {!product.allergens?.length && product.features && product.features.length > 0 && (
          <div>
            <ProductFeaturesIcons features={product.features} />
          </div>
        )}

        <div>
          <h4 className="font-semibold mb-1">{t("price")}</h4>
          {product.has_multiple_prices ? (
            <div className="space-y-2">
              {/* Prezzo standard SOLO con suffisso */}
              {typeof product.price_standard === "number" && (
                <div className="flex justify-between items-center gap-2">
                  <span>
                    {product.price_standard?.toFixed(2)} €
                    {priceSuffix && <span className="ml-1">{priceSuffix}</span>}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                  >
                    {t("add")} <Plus className="ml-2" size={16} />
                  </Button>
                </div>
              )}
              {/* Variante 1 */}
              {product.price_variant_1_name && product.price_variant_1_value !== null && (
                <div className="flex justify-between items-center gap-2">
                  <span>
                    {product.price_variant_1_value?.toFixed(2)} €
                    {product.price_variant_1_name ? ` ${product.price_variant_1_name}` : ""}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                  >
                    {t("add")} <Plus className="ml-2" size={16} />
                  </Button>
                </div>
              )}
              {/* Variante 2 */}
              {product.price_variant_2_name && product.price_variant_2_value !== null && (
                <div className="flex justify-between items-center gap-2">
                  <span>
                    {product.price_variant_2_value?.toFixed(2)} €
                    {product.price_variant_2_name ? ` ${product.price_variant_2_name}` : ""}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled
                  >
                    {t("add")} <Plus className="ml-2" size={16} />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <p className="font-medium">
              {typeof product.price_standard === "number" && (
                <>
                  {product.price_standard?.toFixed(2)} €{priceSuffix && <span className="ml-1">{priceSuffix}</span>}
                </>
              )}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-4">
        {!product.has_multiple_prices && (
          <Button disabled>
            {t("add_to_cart")} <Plus className="ml-2" size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};
