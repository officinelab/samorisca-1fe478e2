
import React from "react";
import { ProductCardMobile } from "./ProductCardMobile";
import { ProductCardDesktop } from "./ProductCardDesktop";
import { Product } from "@/types/database";
import { useIsMobile } from "@/hooks/use-mobile";

type DeviceView = 'mobile' | 'desktop';

interface ProductCardWrapperProps {
  product: Product;
  onProductSelect: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  deviceView: DeviceView;
  truncateText: (text: string | null, maxLength: number) => string;
}

export const ProductCardWrapper: React.FC<ProductCardWrapperProps> = ({
  product,
  onProductSelect,
  addToCart,
  deviceView,
  truncateText,
}) => {
  const isMobile = useIsMobile();

  // Logica di selezione: mobile ha priorità se deviceView = mobile o isMobile true
  if (deviceView === "mobile" || isMobile) {
    return (
      <ProductCardMobile
        product={product}
        onProductSelect={onProductSelect}
        addToCart={addToCart}
        truncateText={truncateText}
      />
    );
  }

  // Desktop default
  return (
    <ProductCardDesktop
      product={product}
      onProductSelect={onProductSelect}
      addToCart={addToCart}
    />
  );
};

