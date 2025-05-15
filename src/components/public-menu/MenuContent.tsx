import React from 'react';
import { Category, Product, ProductFeature } from "@/types/database";
import { CategorySection, CategorySectionSkeleton } from "@/components/public-menu/CategorySection";
import { AllergensSection } from "@/components/public-menu/AllergensSection";
import { ProductFeaturesSection } from "./ProductFeaturesSection";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface MenuContentProps {
  menuRef: React.RefObject<HTMLDivElement>;
  categories: Category[];
  products: Record<string, Product[]>;
  allergens: any[];
  isLoading: boolean;
  deviceView: 'mobile' | 'desktop';
  showAllergensInfo: boolean;
  toggleAllergensInfo: () => void;
  setSelectedProduct: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  truncateText: (text: string | null, maxLength: number) => string;
  language: string;
  serviceCoverCharge?: number;
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
  serviceCoverCharge = 0
}) => {
  // Raccogli tutte le features usate nei prodotti del menu
  const allFeatures: ProductFeature[] = React.useMemo(() => {
    const featuresMap = new Map<string, ProductFeature>();
    Object.values(products).forEach(productList => {
      productList?.forEach(prod => {
        prod.features?.forEach(feature => {
          if (feature && !featuresMap.has(feature.id)) {
            featuresMap.set(feature.id, feature);
          }
        });
      });
    });
    return Array.from(featuresMap.values());
  }, [products]);

  // Stato e handling espansione sezione caratteristiche prodotti
  const [showFeatures, setShowFeatures] = React.useState(false);

  return (
    <div
      className={deviceView === 'desktop' ? 'col-span-3' : ''}
      ref={menuRef}
    >
      <div className="space-y-10 pb-16">
        {categories.map((category, idx) => (
          <React.Fragment key={category.id}>
            <CategorySection 
              category={category}
              products={products[category.id] || []}
              isLoading={isLoading}
              onSelectProduct={setSelectedProduct}
              addToCart={addToCart}
              deviceView={deviceView}
              truncateText={truncateText}
              language={language}
            />
            {/* Mostra il prezzo Servizio e Coperto tra categorie, tranne dopo l'ultima */}
            {(serviceCoverCharge && serviceCoverCharge > 0 && idx < categories.length - 1) && (
              <div className="flex justify-end mt-2">
                <span className="italic text-sm text-gray-700">
                  Servizio e coperto:{" "}
                  <span className="font-medium">
                    {serviceCoverCharge.toLocaleString("it-IT", { style: 'currency', currency: 'EUR' })}
                  </span>
                </span>
              </div>
            )}
          </React.Fragment>
        ))}

        {isLoading && <CategorySectionSkeleton />}

        {/* Allergens section */}
        <AllergensSection 
          allergens={allergens}
          showAllergensInfo={showAllergensInfo}
          toggleAllergensInfo={toggleAllergensInfo}
        />

        {/* Expandable Product Features section */}
        <div className="pt-6 border-t">
          <Accordion
            type="single"
            collapsible
            value={showFeatures ? "features" : undefined}
            onValueChange={v => setShowFeatures(v === "features")}
          >
            <AccordionItem value="features" className="border-0">
              <AccordionTrigger className="flex items-center mb-2 text-base px-0 hover:underline hover:bg-transparent">
                Info prodotti
              </AccordionTrigger>
              <AccordionContent>
                <ProductFeaturesSection
                  features={allFeatures}
                  deviceView={deviceView}
                  open={showFeatures}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
