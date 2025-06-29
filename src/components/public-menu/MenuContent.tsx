
import React from 'react';
import { Category, Product, ProductFeature } from "@/types/database";
import { CategoryNote } from "@/types/categoryNotes";
import { CategorySection, CategorySectionSkeleton } from "@/components/public-menu/CategorySection";
import { ProductFeaturesSection } from "./ProductFeaturesSection";
import { CategoryNoteItem } from "./CategoryNoteItem";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { usePublicMenuUiStrings } from "@/hooks/public-menu/usePublicMenuUiStrings";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MenuContentProps {
  menuRef: React.RefObject<HTMLDivElement>;
  categories: Category[];
  products: Record<string, Product[]>;
  allergens: any[];
  categoryNotes?: CategoryNote[];
  isLoading: boolean;
  deviceView: 'mobile' | 'desktop';
  showAllergensInfo: boolean;
  toggleAllergensInfo: () => void;
  setSelectedProduct: (product: Product) => void;
  addToCart: (product: Product, variantName?: string, variantPrice?: number) => void;
  truncateText: (text: string | null, maxLength: number) => string;
  language: string;
  serviceCoverCharge?: number;
  productCardLayoutType?: 'default' | 'custom1';
  fontSettings?: {
    title: { fontFamily: string; fontWeight: "normal" | "bold"; fontStyle: "normal" | "italic" };
    description: { fontFamily: string; fontWeight: "normal" | "bold"; fontStyle: "normal" | "italic" };
  };
  buttonSettings?: {
    color?: string;
    icon?: string;
  };
}

export const MenuContent: React.FC<MenuContentProps> = ({
  menuRef,
  categories,
  products,
  allergens,
  categoryNotes = [],
  isLoading,
  deviceView,
  showAllergensInfo,
  toggleAllergensInfo,
  setSelectedProduct,
  addToCart,
  truncateText,
  language,
  serviceCoverCharge = 0,
  productCardLayoutType = "default",
  fontSettings,
  buttonSettings
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

  // Funzione per ottenere le note di una categoria specifica
  const getCategoryNotes = (categoryId: string) => {
    return categoryNotes.filter(note => 
      note.categories && note.categories.includes(categoryId)
    );
  };

  const [expandedAccordion, setExpandedAccordion] = React.useState<string | undefined>(undefined);
  const { t } = usePublicMenuUiStrings(language);

  // Unifica onValueChange per entrambe le voci
  const handleAccordionChange = (value: string | undefined) => {
    setExpandedAccordion(value);
  };

  // Mostra skeleton solo se stiamo caricando E non abbiamo ancora categorie
  const showInitialLoadingSkeleton = isLoading && categories.length === 0;

  return (
    <div
      className={deviceView === 'desktop' ? 'col-span-3' : ''}
      ref={menuRef}
    >
      <div className="space-y-10 pb-16">
        {categories.map((category, idx) => (
          <div 
            key={category.id} 
            id={`category-container-${category.id}`}
            className="scroll-mt-24"
          >
            <CategorySection 
              category={category}
              products={products[category.id] || []}
              isLoading={false}
              onSelectProduct={setSelectedProduct}
              addToCart={addToCart}
              deviceView={deviceView}
              truncateText={truncateText}
              language={language}
              productCardLayoutType={productCardLayoutType}
              fontSettings={fontSettings}
              buttonSettings={buttonSettings}
            />
            
            {/* Mostra le note della categoria corrente */}
            {getCategoryNotes(category.id).map(note => (
              <CategoryNoteItem 
                key={note.id}
                note={note}
                deviceView={deviceView}
              />
            ))}
            
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
          </div>
        ))}

        {showInitialLoadingSkeleton && <CategorySectionSkeleton />}

        {/* Accordion unificato per info allergeni e info prodotti */}
        <div className="pt-6 border-t">
          <Accordion
            type="single"
            collapsible
            value={expandedAccordion}
            onValueChange={handleAccordionChange}
          >
            {/* Allergen Info section */}
            <AccordionItem value="allergens" className="border-0">
              <AccordionTrigger className="flex items-center mb-2 text-base px-0 hover:underline hover:bg-transparent font-medium gap-2">
                <Info size={18} className="mr-2" />
                <span className="flex-1 text-left">{t("show_allergens_info")}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-semibold mb-2">{t("allergens_legend")}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {allergens.map(allergen => (
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
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            {/* Product Features Info section */}
            <AccordionItem value="features" className="border-0">
              <AccordionTrigger className="flex items-center mb-2 text-base px-0 hover:underline hover:bg-transparent font-medium gap-2">
                <Info size={18} className="mr-2" />
                <span className="flex-1 text-left">{t("info_products")}</span>
              </AccordionTrigger>
              <AccordionContent>
                <ProductFeaturesSection
                  features={allFeatures}
                  deviceView={deviceView}
                  open={expandedAccordion === "features"}
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
