import React from "react";
import { Product } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { LabelBadge } from "@/components/menu-settings/product-labels/LabelBadge";
import { ProductFeaturesIcons } from "./product-card/ProductFeaturesIcons";

interface ProductDetailsDialogPreviewProps {
  product: Product;
  hideImage?: boolean;
  fontSettings?: {
    titleFont: string;
    titleBold: boolean;
    titleItalic: boolean;
    descriptionFont: string;
    descriptionBold: boolean;
    descriptionItalic: boolean;
  };
}

export const ProductDetailsDialogPreview: React.FC<ProductDetailsDialogPreviewProps> = ({
  product,
  hideImage,
  fontSettings
}) => {
  if (!product) return null;

  const titleStyle = fontSettings
    ? {
        fontFamily: fontSettings.titleFont,
        fontWeight: fontSettings.titleBold ? "bold" : "normal",
        fontStyle: fontSettings.titleItalic ? "italic" : "normal",
        fontSize: 22,
        lineHeight: 1.13,
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
    <div>
      {!hideImage && (
        <img
          src={product.image_url}
          alt={product.title}
          style={{ width: "100%", borderRadius: 8, maxHeight: 230, objectFit: "cover" }}
        />
      )}
      <div className="mt-2">
        <h2 className="text-xl font-semibold" style={titleStyle}>
          {product.displayTitle || product.title}
        </h2>
        {product.displayDescription || product.description ? (
          <p className="mt-2 text-base" style={descStyle}>
            {product.displayDescription || product.description}
          </p>
        ) : null}
      </div>

      {/* Prezzo */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">
            € {product.price_standard?.toFixed(2)}
            {product.has_price_suffix && product.price_suffix
              ? ` ${product.price_suffix}`
              : ""}
          </span>
        </div>

        {/* Varianti prezzo */}
        {product.has_multiple_prices && (
          <div className="mt-2 space-y-1">
            {product.price_variant_1_name && product.price_variant_1_value && (
              <div className="flex justify-between">
                <span>{product.price_variant_1_name}</span>
                <span>€ {product.price_variant_1_value.toFixed(2)}</span>
              </div>
            )}
            {product.price_variant_2_name && product.price_variant_2_value && (
              <div className="flex justify-between">
                <span>{product.price_variant_2_name}</span>
                <span>€ {product.price_variant_2_value.toFixed(2)}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Allergeni */}
      {product.allergens && product.allergens.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-1">Allergeni:</h3>
          <div className="flex flex-wrap gap-1">
            {product.allergens.map(allergen => (
              <Badge key={allergen.id} variant="outline" className="text-xs">
                {allergen.number}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Caratteristiche */}
      {product.features && product.features.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-1">Caratteristiche:</h3>
          <ProductFeaturesIcons features={product.features} />
        </div>
      )}
    </div>
  );
};
