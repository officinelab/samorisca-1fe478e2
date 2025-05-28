
import React from 'react';
import { Button } from "@/components/ui/button";
import { Product } from "@/types/database";

interface ProductDetailsPricingProps {
  product: Product;
  priceSuffix: string;
  priceLabel: string;
  addLabel: string;
  fontSettings?: {
    price?: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic"; fontSize?: number };
  };
  buttonSettings?: {
    color?: string;
  };
  onAddToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  renderAddIcon: () => React.ReactNode;
}

export const ProductDetailsPricing: React.FC<ProductDetailsPricingProps> = ({
  product,
  priceSuffix,
  priceLabel,
  addLabel,
  fontSettings,
  buttonSettings,
  onAddToCart,
  renderAddIcon
}) => {
  return (
    <div>
      <h4 className="font-semibold mb-1">{priceLabel}</h4>
      {product.has_multiple_prices ? (
        <div className="space-y-2">
          {/* Prezzo standard SOLO con suffisso */}
          {typeof product.price_standard === "number" && (
            <div className="flex justify-between items-center gap-2">
              <span style={{
                  fontFamily: fontSettings?.price?.fontFamily,
                  fontWeight: fontSettings?.price?.fontWeight,
                  fontStyle: fontSettings?.price?.fontStyle,
                  fontSize: fontSettings?.price?.fontSize
                }}>
                {product.price_standard?.toFixed(2)} €{priceSuffix && <span className="ml-1">{priceSuffix}</span>}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddToCart(product)}
                style={buttonSettings?.color ? { backgroundColor: buttonSettings.color, color: "#fff", border: "none" } : undefined}
                className={buttonSettings?.color ? "" : undefined}
              >
                {addLabel} {renderAddIcon()}
              </Button>
            </div>
          )}
          {/* Variante 1 */}
          {product.price_variant_1_name && product.price_variant_1_value !== null && (
            <div className="flex justify-between items-center gap-2">
              <span style={{
                  fontFamily: fontSettings?.price?.fontFamily,
                  fontWeight: fontSettings?.price?.fontWeight,
                  fontStyle: fontSettings?.price?.fontStyle,
                  fontSize: fontSettings?.price?.fontSize
                }}>
                {product.price_variant_1_value?.toFixed(2)} €
                {product.price_variant_1_name ? ` ${product.price_variant_1_name}` : ""}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddToCart(product, product.price_variant_1_name!, product.price_variant_1_value!)}
                style={buttonSettings?.color ? { backgroundColor: buttonSettings.color, color: "#fff", border: "none" } : undefined}
                className={buttonSettings?.color ? "" : undefined}
              >
                {addLabel} {renderAddIcon()}
              </Button>
            </div>
          )}
          {/* Variante 2 */}
          {product.price_variant_2_name && product.price_variant_2_value !== null && (
            <div className="flex justify-between items-center gap-2">
              <span style={{
                  fontFamily: fontSettings?.price?.fontFamily,
                  fontWeight: fontSettings?.price?.fontWeight,
                  fontStyle: fontSettings?.price?.fontStyle,
                  fontSize: fontSettings?.price?.fontSize
                }}>
                {product.price_variant_2_value?.toFixed(2)} €
                {product.price_variant_2_name ? ` ${product.price_variant_2_name}` : ""}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddToCart(product, product.price_variant_2_name!, product.price_variant_2_value!)}
                style={buttonSettings?.color ? { backgroundColor: buttonSettings.color, color: "#fff", border: "none" } : undefined}
                className={buttonSettings?.color ? "" : undefined}
              >
                {addLabel} {renderAddIcon()}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <p className="font-medium" style={{
          fontFamily: fontSettings?.price?.fontFamily,
          fontWeight: fontSettings?.price?.fontWeight,
          fontStyle: fontSettings?.price?.fontStyle,
          fontSize: fontSettings?.price?.fontSize
        }}>
          {typeof product.price_standard === "number" && (
            <>
              {product.price_standard?.toFixed(2)} €{priceSuffix && <span className="ml-1">{priceSuffix}</span>}
            </>
          )}
        </p>
      )}
    </div>
  );
};
