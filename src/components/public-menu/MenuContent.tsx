
import React from 'react';
import { Product, Category } from "@/types/database";
import { CategorySection } from "./CategorySection";
import { AllergensSection } from "./AllergensSection";
import { CategoryNoteItem } from "./CategoryNoteItem";
import { CategoryNote } from "@/types/categoryNotes";

interface MenuContentProps {
  menuRef: React.RefObject<HTMLDivElement>;
  categories: Category[];
  products: Record<string, Product[]>;
  allergens: any[];
  categoryNotes: CategoryNote[];
  isLoading: boolean;
  deviceView: 'mobile' | 'desktop';
  showAllergensInfo: boolean;
  toggleAllergensInfo: () => void;
  setSelectedProduct: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  truncateText: (text: string | null, maxLength: number) => string;
  language: string;
  serviceCoverCharge?: number;
  productCardLayoutType?: string;
  fontSettings?: any;
  buttonSettings?: any;
  categoryTitleStyle?: {
    fontFamily: string;
    fontWeight: "normal" | "bold";
    fontStyle: "normal" | "italic";
    backgroundColor: string;
    textColor: string;
  };
}

export const MenuContent: React.FC<MenuContentProps> = ({
  menuRef,
  categories,
  products,
  allergens,
  categoryNotes,
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
  buttonSettings,
  categoryTitleStyle
}) => {
  return (
    <div 
      ref={menuRef}
      className={`${deviceView === 'desktop' ? 'col-span-3' : 'col-span-1'} space-y-8`}
    >
      {categories.map((category) => {
        const categoryProducts = products[category.id] || [];
        const categoryNote = categoryNotes.find(note => 
          note.categoryIds && note.categoryIds.includes(category.id)
        );
        
        return (
          <div key={category.id}>
            <CategorySection
              category={category}
              products={categoryProducts}
              isLoading={isLoading}
              onSelectProduct={setSelectedProduct}
              addToCart={addToCart}
              deviceView={deviceView}
              truncateText={truncateText}
              language={language}
              productCardLayoutType={productCardLayoutType}
              fontSettings={fontSettings}
              buttonSettings={buttonSettings}
              categoryTitleStyle={categoryTitleStyle}
            />
            
            {categoryNote && (
              <CategoryNoteItem
                note={categoryNote}
                language={language}
              />
            )}
          </div>
        );
      })}

      {/* Service Cover Charge Notice */}
      {serviceCoverCharge && serviceCoverCharge > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-8">
          <p className="text-sm text-amber-800">
            ℹ️ Coperto: €{serviceCoverCharge.toFixed(2)} a persona
          </p>
        </div>
      )}

      {/* Allergens Section */}
      <AllergensSection
        allergens={allergens}
        showAllergensInfo={showAllergensInfo}
        onToggle={toggleAllergensInfo}
        language={language}
      />
    </div>
  );
};
