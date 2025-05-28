
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Product } from "@/types/database";
import { usePublicMenuUiStrings } from "@/hooks/public-menu/usePublicMenuUiStrings";

// Import the new focused components
import { ProductDetailsHeader } from "./product-details-dialog/ProductDetailsHeader";
import { ProductDetailsImage } from "./product-details-dialog/ProductDetailsImage";
import { ProductDetailsDescription } from "./product-details-dialog/ProductDetailsDescription";
import { ProductDetailsFeatures } from "./product-details-dialog/ProductDetailsFeatures";
import { ProductDetailsAllergens } from "./product-details-dialog/ProductDetailsAllergens";
import { ProductDetailsPricing } from "./product-details-dialog/ProductDetailsPricing";

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
    const { ProductCardButtonIconsDemo } = require("@/components/menu-settings/ProductCardButtonIconsDemo");
    return <ProductCardButtonIconsDemo iconName={buttonSettings.icon} color={buttonSettings.color || "#9b87f5"} size={20} />;
  };

  const handleAddToCart = (product: Product, variantName?: string, variantPrice?: number) => {
    addToCart(product, variantName, variantPrice);
    onClose();
  };

  if (!product) return null;

  const title = product.displayTitle || product.title;
  const description = product.displayDescription || product.description;
  const priceSuffix = product.has_price_suffix && product.price_suffix ? ` ${product.price_suffix}` : "";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <ProductDetailsHeader 
          product={product}
          title={title}
          fontSettings={fontSettings}
        />
        
        <div className="grid gap-4 py-4">
          <ProductDetailsImage 
            imageUrl={product.image_url}
            title={title}
            hideImage={hideImage}
          />
          
          <ProductDetailsDescription 
            description={description}
            descriptionLabel={t("description")}
            fontSettings={fontSettings}
          />
          
          <ProductDetailsFeatures 
            features={product.features}
            featuresLabel={t("product_features")}
          />

          <ProductDetailsAllergens 
            allergens={product.allergens}
            allergensLabel={t("allergens")}
          />

          <ProductDetailsPricing 
            product={product}
            priceSuffix={priceSuffix}
            priceLabel={t("price")}
            addLabel={t("add")}
            fontSettings={fontSettings}
            buttonSettings={buttonSettings}
            onAddToCart={handleAddToCart}
            renderAddIcon={renderAddIcon}
          />
        </div>
        
        <div className="flex justify-end">
          {!product.has_multiple_prices && (
            <Button
              onClick={() => handleAddToCart(product)}
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
