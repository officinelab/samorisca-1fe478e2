
import React from "react";
import { ProductCardMobile } from "./ProductCardMobile";
import { ProductCardDesktop } from "./ProductCardDesktop";
import { Product } from "@/types/database";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProductCardMobileCustom1 } from "./ProductCardMobileCustom1";
import { ProductCardDesktopCustom1 } from "./ProductCardDesktopCustom1";

type DeviceView = 'mobile' | 'desktop';
type ProductCardLayoutType = 'default' | 'compact' | 'custom1';

interface ProductFontSettings {
  titleFont: string;
  titleBold: boolean;
  titleItalic: boolean;
  descriptionFont: string;
  descriptionBold: boolean;
  descriptionItalic: boolean;
}

interface ProductCardWrapperProps {
  product: Product;
  onProductSelect: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  deviceView: DeviceView;
  truncateText: (text: string | null, maxLength: number) => string;
  layoutType?: ProductCardLayoutType;
  fontSettings?: ProductFontSettings;
}

// Mappa dei layout disponibili...
const productCardLayouts = {
  default: {
    Mobile: ProductCardMobile,
    Desktop: ProductCardDesktop,
  },
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
  fontSettings
}) => {
  const isMobile = useIsMobile();

  const propsForCard = {
    product,
    onProductSelect,
    addToCart,
    fontSettings,
    truncateText
  };

  const LayoutSet = productCardLayouts[layoutType] || productCardLayouts.default;
  if (deviceView === "mobile" || isMobile) {
    const MobileComponent = LayoutSet.Mobile;
    return (
      <MobileComponent {...propsForCard} />
    );
  }
  const DesktopComponent = LayoutSet.Desktop;
  return (
    <DesktopComponent {...propsForCard} />
  );
};
