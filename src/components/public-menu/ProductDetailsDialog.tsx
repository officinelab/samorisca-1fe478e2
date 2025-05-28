import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product } from "@/types/database";
import { LabelBadge } from "@/components/menu-settings/product-labels/LabelBadge";
import { ProductFeaturesWithText } from "./product-card/ProductFeaturesWithText";
import { usePublicMenuUiStrings } from "@/hooks/public-menu/usePublicMenuUiStrings";
import { ProductCardButtonIconsDemo } from "@/components/menu-settings/ProductCardButtonIconsDemo";

interface ProductDetailsDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  hideImage?: boolean;
  language?: string;
  fontSettings?: {
    title: { fontFamily: string; fontWeight: "normal" | "bold"; fontStyle: "normal" | "italic"; fontSize?: number };
    description: { fontFamily: string; fontWeight: "normal" | "bold"; fontStyle: "normal" | "italic"; fontSize?: number };
    price?: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic"; fontSize?: number };
  };
  buttonSettings?: {
    color?: string;
    icon?: string;
  };
}

export const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({
  product,
  open,
  onClose,
  addToCart,
  hideImage = false,
  language = "it",
  fontSettings,
  buttonSettings
}) => {
  const handleClose = () => onClose();
  const { t } = usePublicMenuUiStrings(language);

  // Helper: render icona custom (fallback Plus)
  const renderAddIcon = () => {
    if (buttonSettings?.icon === "plus" || !buttonSettings?.icon) {
      return <Plus className="ml-2" size={16} />;
    }
    // Usa la demo icona dello stesso sistema delle anteprime
    return <ProductCardButtonIconsDemo iconName={buttonSettings.icon} color={buttonSettings.color || "#9b87f5"} size={20} />;
  };

  if (!product) return null;

  const title = product.displayTitle || product.title;
  const description = product.displayDescription || product.description;
  const priceSuffix = product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : "";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle
            style={{
              fontFamily: fontSettings?.title?.fontFamily,
              fontWeight: fontSettings?.title?.fontWeight,
              fontStyle: fontSettings?.title?.fontStyle,
              fontSize: fontSettings?.title?.fontSize,
            }}
          >
            {title}
          </DialogTitle>
          {product.label && (
            <div className="mt-2">
              <LabelBadge
                title={product.label.displayTitle || product.label.title}
                color={product.label.color}
                textColor={product.label.text_color}
              />
            </div>
          )}
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
            <p
              className="text-gray-600"
              style={{
                fontFamily: fontSettings?.description?.fontFamily,
                fontWeight: fontSettings?.description?.fontWeight,
                fontStyle: fontSettings?.description?.fontStyle,
                fontSize: fontSettings?.description?.fontSize
              }}
            >
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
                <ProductFeaturesWithText features={product.features} />
              )}
            </div>
          )}
          {!product.allergens?.length && product.features && product.features.length > 0 && (
            <div>
              <ProductFeaturesWithText features={product.features} />
            </div>
          )}

          <div>
            <h4 className="font-semibold mb-1">{t("price")}</h4>
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
                      onClick={() => {
                        addToCart(product);
                        onClose();
                      }}
                      style={buttonSettings?.color ? { backgroundColor: buttonSettings.color, color: "#fff", border: "none" } : undefined}
                      className={buttonSettings?.color ? "" : undefined}
                    >
                      {t("add")} {renderAddIcon()}
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
                      onClick={() => {
                        addToCart(product, product.price_variant_1_name!, product.price_variant_1_value!);
                        onClose();
                      }}
                      style={buttonSettings?.color ? { backgroundColor: buttonSettings.color, color: "#fff", border: "none" } : undefined}
                      className={buttonSettings?.color ? "" : undefined}
                    >
                      {t("add")} {renderAddIcon()}
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
                      onClick={() => {
                        addToCart(product, product.price_variant_2_name!, product.price_variant_2_value!);
                        onClose();
                      }}
                      style={buttonSettings?.color ? { backgroundColor: buttonSettings.color, color: "#fff", border: "none" } : undefined}
                      className={buttonSettings?.color ? "" : undefined}
                    >
                      {t("add")} {renderAddIcon()}
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
        </div>
        <div className="flex justify-end">
          {!product.has_multiple_prices && (
            <Button
              onClick={() => {
                addToCart(product);
                onClose();
              }}
              style={buttonSettings?.color ? { backgroundColor: buttonSettings.color, color: "#fff", border: "none" } : undefined}
              className={buttonSettings?.color ? "" : undefined}
            >
              {t("add_to_cart")} {renderAddIcon()}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
