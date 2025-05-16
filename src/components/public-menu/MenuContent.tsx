
import React from 'react';
import { Category, Product, ProductFeature } from "@/types/database";
import { CategorySection, CategorySectionSkeleton } from "@/components/public-menu/CategorySection";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import { ProductFeaturesSection } from "./ProductFeaturesSection";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { usePublicMenuUiStrings } from "@/hooks/public-menu/usePublicMenuUiStrings";

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
  productCardLayoutType?: 'default' | 'compact';
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
  serviceCoverCharge = 0,
  productCardLayoutType = "default"
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
  const [showAllergens, setShowAllergens] = React.useState(false);

  const { t } = usePublicMenuUiStrings(language);

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
              productCardLayoutType={productCardLayoutType}
            />
            {/* Mostra il prezzo Servizio e Coperto tra categorie, tranne dopo l'ultima */}
            {(serviceCoverCharge && serviceCoverCharge > 0 && idx < categories.length - 1) && (
              <div className="flex justify-end mt-2">
                <span className="italic text-sm text-gray-700">
                  {t("service_and_cover")}:{" "}
                  <span className="font-medium">
                    {serviceCoverCharge.toLocaleString("it-IT", { style: 'currency', currency: 'EUR' })}
                  </span>
                </span>
              </div>
            )}
          </React.Fragment>
        ))}

        {isLoading && <CategorySectionSkeleton />}

        {/* Allergens and Product Features: styled accordions */}
        <div className="pt-6 border-t space-y-3">
          <Accordion
            type="multiple"
            value={[
              showAllergens ? "allergens" : "",
              showFeatures ? "features" : ""
            ].filter(Boolean)}
            onValueChange={vals => {
              setShowAllergens(vals.includes("allergens"));
              setShowFeatures(vals.includes("features"));
            }}
            className="w-full"
          >
            {/* Legenda Allergen Accordion */}
            <AccordionItem value="allergens" className="border-0">
              <AccordionTrigger className="flex items-center px-0 text-base hover:bg-transparent focus:bg-transparent bg-white rounded-lg shadow-sm">
                <Info size={18} className="mr-2" />
                <span>{t("allergens_legend")}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {allergens && allergens.length > 0 ? (
                      allergens.map((allergen: any) => (
                        <div key={allergen.id} className="flex items-center">
                          {allergen.icon_url && (
                            <img
                              src={allergen.icon_url}
                              alt={allergen.displayTitle || allergen.title}
                              className="w-6 h-6 object-contain mr-2"
                            />
                          )}
                          <Badge variant="outline" className="mr-2">
                            {allergen.number}
                          </Badge>
                          <span className="text-sm">{allergen.displayTitle || allergen.title}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted-foreground text-sm py-2">
                        {t("allergens_legend")}: {t("empty_order")}
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            {/* Product Features Accordion */}
            <AccordionItem value="features" className="border-0">
              <AccordionTrigger className="flex items-center px-0 text-base hover:bg-transparent focus:bg-transparent bg-white rounded-lg shadow-sm">
                <span>{t("info_products")}</span>
              </AccordionTrigger>
              <AccordionContent>
                <ProductFeaturesSection
                  features={allFeatures}
                  deviceView={deviceView}
                  open={showFeatures}
                  language={language}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};
