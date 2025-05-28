
import React from 'react';
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product } from "@/types/database";
import { LabelBadge } from "@/components/menu-settings/product-labels/LabelBadge";

interface ProductDetailsHeaderProps {
  product: Product;
  title: string;
  fontSettings?: {
    title: { fontFamily: string; fontWeight: "normal" | "bold"; fontStyle: "normal" | "italic"; fontSize?: number };
  };
}

export const ProductDetailsHeader: React.FC<ProductDetailsHeaderProps> = ({
  product,
  title,
  fontSettings
}) => {
  return (
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
  );
};
