
import React from "react";
import { Category, Product } from "@/types/database";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductBasicInfo from "./sections/ProductBasicInfo";
import ProductPricing from "./sections/ProductPricing";
import ProductFeatures from "./sections/ProductFeatures";
import ProductAllergens from "./sections/ProductAllergens";
import ProductTechnicalInfo from "./sections/ProductTechnicalInfo";

interface ProductDetailContentProps {
  product: Product;
  allCategories: Category[];
}

const ProductDetailContent: React.FC<ProductDetailContentProps> = ({
  product,
  allCategories
}) => {
  return (
    <ScrollArea className="flex-grow">
      <div className="p-4 space-y-6">
        {/* Product basic info */}
        <ProductBasicInfo product={product} />
        
        {/* Prices */}
        <ProductPricing product={product} />
        
        {/* Product features */}
        {product.features && product.features.length > 0 && (
          <ProductFeatures features={product.features} />
        )}
        
        {/* Allergens */}
        {product.allergens && product.allergens.length > 0 && (
          <ProductAllergens allergens={product.allergens} />
        )}
        
        {/* Technical info */}
        <ProductTechnicalInfo 
          product={product} 
          categoryName={allCategories.find(c => c.id === product.category_id)?.title || ""}
        />
      </div>
    </ScrollArea>
  );
};

export default ProductDetailContent;
