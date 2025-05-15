import React from "react";
import { Category, Product, Allergen } from "@/types/database";
import { DeviceView } from "@/types/deviceView";
import { Button } from "@/components/ui/button";
import { ProductFeaturesIcons } from "@/components/public-menu/product-card/ProductFeaturesIcons";
import ProductFeaturesSection from "./ProductFeaturesSection";

interface MenuContentProps {
  menuRef: React.RefObject<HTMLDivElement>;
  categories: Category[];
  products: Record<string, Product[]>;
  allergens: Allergen[];
  isLoading: boolean;
  deviceView: DeviceView;
  showAllergensInfo: boolean;
  toggleAllergensInfo: () => void;
  setSelectedProduct: (product: Product | null) => void;
  addToCart: (product: Product) => void;
  truncateText: (text: string | null, maxLength: number) => string;
  language: string;
}

export const MenuContent = ({
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
}) => {
  if (isLoading) {
    return <div className="text-center py-12">Caricamento in corso...</div>;
  }

  if (!categories || categories.length === 0) {
    return <div className="text-center py-12">Nessuna categoria disponibile.</div>;
  }

  return (
    <main ref={menuRef} className="col-span-3">
      {categories.map((category) => (
        <section key={category.id} id={`category-${category.id}`} className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">{category[`title_${language}`] || category.title}</h2>
          <p className="text-gray-600 mb-4">{category[`description_${language}`] || category.description}</p>
          
          {/* Elenco prodotti */}
          {(products[category.id] || []).map((product) => (
            <div key={product.id} className="mb-4">
              <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold">{product[`title_${language}`] || product.title}</h3>
                  <span className="text-gray-700">€ {product.price_standard}</span>
                </div>
                <p className="text-gray-500 mb-3">{truncateText(product[`description_${language}`] || product.description, 100)}</p>
                
                {/* Sezione Allergeni e Caratteristiche */}
                <div>
                  {/* Allergeni */}
                  {product.allergens && product.allergens.length > 0 && (
                    <div className="mb-2">
                      <span className="text-xs text-muted-foreground font-medium">
                        Allergeni:{" "}
                      </span>
                      <span className="text-xs">
                        {product.allergens.map((a) => a.number).join(", ")}
                      </span>
                    </div>
                  )}
                  {/* Caratteristiche */}
                  {product.features && product.features.length > 0 && (
                    <ProductFeaturesSection
                      features={product.features}
                      deviceView={deviceView}
                    />
                  )}
                </div>
                
                <Button size="sm" onClick={() => addToCart(product)}>
                  Aggiungi al carrello
                </Button>
              </div>
            </div>
          ))}
        </section>
      ))}
    </main>
  );
};

export default MenuContent;
