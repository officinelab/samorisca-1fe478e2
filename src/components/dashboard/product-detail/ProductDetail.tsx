
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Product, Category } from "@/types/database";
import { ArrowLeft, Edit } from "lucide-react";
import ProductForm from "@/components/product/ProductForm";
import ProductDetailHeader from "./ProductDetailHeader";
import ProductDetailContent from "./ProductDetailContent";
import ProductEmptyState from "./ProductEmptyState";

interface ProductDetailProps {
  product: Product | null;
  allCategories: Category[];
  selectedProductId: string | null;
  isEditing: boolean;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onSaveProduct: (productData: Partial<Product>) => void;
  onBackToProducts?: () => void;
  isMobile?: boolean;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  allCategories,
  selectedProductId,
  isEditing,
  onStartEditing,
  onCancelEditing,
  onSaveProduct,
  onBackToProducts,
  isMobile = false
}) => {
  if (!selectedProductId && !isEditing) {
    return <ProductEmptyState />;
  }
  
  if (isEditing) {
    return (
      <div className="h-full flex flex-col">
        <ProductDetailHeader 
          title={product ? "Modifica Prodotto" : "Nuovo Prodotto"}
          onBackToProducts={onBackToProducts}
          isMobile={isMobile}
          showActions={false}
        />
        
        <ScrollArea className="flex-grow">
          <div className="p-4">
            <ProductForm
              product={product}
              onSave={onSaveProduct}
              onCancel={onCancelEditing}
            />
          </div>
        </ScrollArea>
      </div>
    );
  }
  
  if (!product) return null;
  
  return (
    <div className="h-full flex flex-col">
      <ProductDetailHeader 
        title="Dettagli Prodotto"
        onBackToProducts={onBackToProducts}
        isMobile={isMobile}
        showActions={true}
        onEdit={onStartEditing}
      />
      
      <ProductDetailContent 
        product={product} 
        allCategories={allCategories} 
      />
    </div>
  );
};

export default ProductDetail;
