
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { Product, Category } from "@/types/database";

// Imported section components
import ProductDetailHeader from "./product-detail/ProductDetailHeader";
import ProductMainInfo from "./product-detail/ProductMainInfo";
import ProductPriceSection from "./product-detail/ProductPriceSection";
import ProductFeaturesSection from "./product-detail/ProductFeaturesSection";
import ProductAllergensSection from "./product-detail/ProductAllergensSection";
import ProductTechnicalInfo from "./product-detail/ProductTechnicalInfo";

interface ProductDetailProps {
  product: Product | null;
  selectedCategory: Category | null;
  onEditProduct: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  selectedCategory,
  onEditProduct
}) => {
  if (!product) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Seleziona un prodotto per visualizzare i dettagli.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ProductDetailHeader onEditProduct={onEditProduct} />
      
      <ScrollArea className="flex-grow">
        <div className={dashboardStyles.detailContent}>
          <ProductMainInfo 
            product={product} 
            selectedCategory={selectedCategory} 
          />
          
          <Separator />
          
          <ProductPriceSection product={product} />
          
          <ProductFeaturesSection product={product} />
          
          <ProductAllergensSection product={product} />
          
          <ProductTechnicalInfo product={product} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProductDetail;
