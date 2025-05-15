
import React from "react";
import { ProductCardMobile } from "./ProductCardMobile";
import { ProductCardDesktop } from "./ProductCardDesktop";
import { Product } from "@/types/database";
import { useIsMobile } from "@/hooks/use-mobile";

type DeviceView = 'mobile' | 'desktop';
type ProductCardLayoutType = 'default' | 'compact';

interface ProductCardWrapperProps {
  product: Product;
  onProductSelect: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  deviceView: DeviceView;
  truncateText: (text: string | null, maxLength: number) => string;
  layoutType?: ProductCardLayoutType;
}

// Mappa dei layout disponibili, pronto per espansioni future
const productCardLayouts = {
  default: {
    Mobile: ProductCardMobile,
    Desktop: ProductCardDesktop,
  },
  // compact: { Mobile: ProductCardMobileCompact, Desktop: ProductCardDesktopCompact },
};

export const ProductCardWrapper: React.FC<ProductCardWrapperProps> = ({
  product,
  onProductSelect,
  addToCart,
  deviceView,
  truncateText,
  layoutType = 'default'
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
      />
    );
  }

  const DesktopComponent = LayoutSet.Desktop;
  return (
    <DesktopComponent
      product={product}
      onProductSelect={onProductSelect}
      addToCart={addToCart}
    />
  );
};
