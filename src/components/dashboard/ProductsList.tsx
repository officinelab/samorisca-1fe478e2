
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product } from "@/types/database";
import ProductSearch from "./product-list/ProductSearch";
import ProductItem from "./product-list/ProductItem";
import ProductEmptyState from "./product-list/ProductEmptyState";
import ProductsLoading from "./product-list/ProductsLoading";

interface ProductsListProps {
  products: Product[];
  selectedProductId: string | null;
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onProductSelect: (productId: string) => void;
  onAddProduct: () => void;
  onEditProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onReorderProduct: (productId: string, direction: 'up' | 'down') => void;
  onBackToCategories?: () => void;
  isMobile?: boolean;
  noCategory?: boolean;
}

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  selectedProductId,
  isLoading,
  searchQuery,
  onSearchChange,
  onProductSelect,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onReorderProduct,
  onBackToCategories,
  isMobile = false,
  noCategory = false
}) => {
  return (
    <div className="h-full flex flex-col">
      <ProductSearch 
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onAddProduct={onAddProduct}
        onBackToCategories={onBackToCategories}
        isMobile={isMobile}
        noCategory={noCategory}
      />
      
      <ScrollArea className="flex-grow">
        <div className="p-4">
          <ProductEmptyState 
            isLoading={isLoading}
            noCategory={noCategory || false}
            hasSearchQuery={searchQuery.length > 0}
            hasProducts={products.length > 0}
          />
          
          {isLoading ? (
            <ProductsLoading />
          ) : products.length > 0 && (
            <div className="space-y-2">
              {products.map((product, index) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  isSelected={selectedProductId === product.id}
                  index={index}
                  totalProducts={products.length}
                  onSelect={onProductSelect}
                  onEdit={onEditProduct}
                  onDelete={onDeleteProduct}
                  onReorder={onReorderProduct}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ProductsList;
