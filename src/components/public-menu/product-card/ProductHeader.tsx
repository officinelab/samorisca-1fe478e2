
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/types/database";
import { LabelBadge } from "@/components/menu-settings/product-labels/LabelBadge";

interface FontSettings {
  title?: { fontFamily?: string; fontWeight?: "normal" | "bold"; fontStyle?: "normal" | "italic"; fontSize?: number };
}

interface ProductHeaderProps {
  product: Product;
  title: string;
  fontSettings?: FontSettings;
  showPrice?: boolean;
  priceSuffix?: string;
  className?: string;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  product,
  title,
  fontSettings,
  showPrice = false,
  priceSuffix = "",
  className = ""
}) => {
  return (
    <div className={`flex justify-between items-start mb-1 ${className}`}>
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
      {showPrice && !product.has_multiple_prices && (
        <span
          style={{
            fontFamily: fontSettings?.title?.fontFamily,
            fontWeight: fontSettings?.title?.fontWeight,
            fontStyle: fontSettings?.title?.fontStyle,
            fontSize: fontSettings?.title?.fontSize || 16,
          }}
          className="font-medium flex items-center"
        >
          {product.price_standard?.toFixed(2)} €
          {priceSuffix && <span className="ml-1">{priceSuffix}</span>}
        </span>
      )}
    </div>
  );
};
