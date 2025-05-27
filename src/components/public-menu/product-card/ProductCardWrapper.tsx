import React from "react";
import { ProductCardMobile } from "./ProductCardMobile";
import { ProductCardDesktop } from "./ProductCardDesktop";
import { Product } from "@/types/database";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProductCardMobileCustom1 } from "./ProductCardMobileCustom1";
import { ProductCardDesktopCustom1 } from "./ProductCardDesktopCustom1";

type DeviceView = 'mobile' | 'desktop';
export type ProductCardLayoutType = 'default' | 'compact' | 'custom1';

interface ProductCardWrapperProps {
  product: Product;
  onProductSelect: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  deviceView: DeviceView;
  truncateText: (text: string | null, maxLength: number) => string;
  layoutType?: ProductCardLayoutType;
  fontSettings?: {
    title?: { fontFamily: string; fontWeight: "normal" | "bold"; fontStyle: "normal" | "italic" };
    description?: { fontFamily: string; fontWeight: "normal" | "bold"; fontStyle: "normal" | "italic" };
    price?: { fontFamily: string; fontWeight: "normal" | "bold"; fontStyle: "normal" | "italic" };
  };
  buttonSettings?: {
    color?: string;
    icon?: string;
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
  fontSettings,
  buttonSettings,
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
        fontSettings={fontSettings}
        buttonSettings={buttonSettings} {/* Passo sempre, anche custom1 */}
      />
    );
  }
  const DesktopComponent = LayoutSet.Desktop;
  return (
    <DesktopComponent
      product={product}
      onProductSelect={onProductSelect}
      addToCart={addToCart}
      fontSettings={fontSettings}
      buttonSettings={buttonSettings} {/* Passo anche qui per uniformità */}
    />
  );
};
