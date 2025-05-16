
import React from "react";
import { ProductCardMobile } from "./ProductCardMobile";
import { ProductCardDesktop } from "./ProductCardDesktop";
import { Product } from "@/types/database";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProductCardMobileCustom1 } from "./ProductCardMobileCustom1";
import { ProductCardDesktopCustom1 } from "./ProductCardDesktopCustom1";

type DeviceView = 'mobile' | 'desktop';
type ProductCardLayoutType = 'default' | 'compact' | 'custom1';

interface ProductCardWrapperProps {
  product: Product;
  onProductSelect: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  deviceView: DeviceView;
  truncateText: (text: string | null, maxLength: number) => string;
  layoutType?: ProductCardLayoutType;
  // Nuovo: stili font opzionali solo preview anteprima layout menu settings
  previewFontStyles?: {
    title?: React.CSSProperties;
    description?: React.CSSProperties;
  };
}

// Mappa dei layout disponibili, pronto per espansioni future
const productCardLayouts = {
  default: {
    Mobile: ProductCardMobile,
    Desktop: ProductCardDesktop,
  },
  // compact: { Mobile: ProductCardMobileCompact, Desktop: ProductCardDesktopCompact },
  custom1: {
    Mobile: ProductCardMobileCustom1,
    Desktop: ProductCardDesktopCustom1,
  },
};

export const ProductCardWrapper: React.FC<ProductCardWrapperProps> = ({
  product,
  onProductSelect,
  addToCart,
  deviceView,
  truncateText,
  layoutType = 'default',
  previewFontStyles
}) => {
  const isMobile = useIsMobile();

  const LayoutSet = productCardLayouts[layoutType] || productCardLayouts.default;
  if (deviceView === "mobile" || isMobile) {
    const MobileComponent = LayoutSet.Mobile;
    return (
      <MobileComponent
        product={product}
        onProductSelect={onProductSelect}
        addToCart={addToCart}
        truncateText={truncateText}
        previewFontStyles={previewFontStyles}
      />
    );
  }

  const DesktopComponent = LayoutSet.Desktop;
  return (
    <DesktopComponent
      product={product}
      onProductSelect={onProductSelect}
      addToCart={addToCart}
      previewFontStyles={previewFontStyles}
    />
  );
};
