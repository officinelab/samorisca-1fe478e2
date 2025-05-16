
import React from "react";
import { Category } from "@/types/database";
import { CategorySection } from "./CategorySection";

interface MenuContentProps {
  menuRef: React.RefObject<HTMLDivElement>;
  categories: Category[];
  products: Record<string, any[]>;
  allergens: any[];
  isLoading: boolean;
  deviceView: 'mobile' | 'desktop';
  showAllergensInfo: boolean;
  toggleAllergensInfo: () => void;
  setSelectedProduct: (product: any | null) => void;
  addToCart: (product: any, variantName?: string, variantPrice?: number) => void;
  truncateText: (text: string | null, maxLength: number) => string;
  language: string;
  serviceCoverCharge: number | string | undefined;
  productCardLayoutType: string; // Ok ora come string
  fontSettings?: {
    titleFont: string;
    titleBold: boolean;
    titleItalic: boolean;
    descriptionFont: string;
    descriptionBold: boolean;
    descriptionItalic: boolean;
  };
}

export const MenuContent: React.FC<MenuContentProps> = ({
  menuRef,
  categories,
  products,
  allergens,
  isLoading,
  deviceView,
  showAllergensInfo,
  toggleAllergensInfo,
  setSelectedProduct,
  addToCart,
  truncateText,
  language,
  serviceCoverCharge,
  productCardLayoutType,
  fontSettings,
}) => {
  if (isLoading) {
    return (
      <main ref={menuRef} className={`col-span-3`}>
        <p>Caricamento in corso...</p>
      </main>
    );
  }

  return (
    <main ref={menuRef} className={`col-span-3`}>
      {categories.map(category => (
        <CategorySection
          key={category.id}
          category={category}
          deviceView={deviceView}
          showAllergensInfo={showAllergensInfo}
          toggleAllergensInfo={toggleAllergensInfo}
          allergens={allergens}
          products={products[category.id] || []}
          setSelectedProduct={setSelectedProduct}
          addToCart={addToCart}
          truncateText={truncateText}
          language={language}
          productCardLayoutType={productCardLayoutType}
          fontSettings={fontSettings}
        />
      ))}
    </main>
  );
};
