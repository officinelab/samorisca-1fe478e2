
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Product, Category } from "@/types/database";
import { useProductsSearch } from "@/hooks/admin/dashboard/useProductsSearch";
import ProductsHeader from "./products/ProductsHeader";
import ProductItem from "./products/ProductItem";
import ProductsEmptyState from "./products/ProductsEmptyState";
import ProductDeleteDialog from "./products/ProductDeleteDialog";

interface ProductsListProps {
  products: Product[];
  selectedProductId: string | null;
  selectedCategory: Category | null;
  isReorderingProducts: boolean;
  reorderingProductsList: Product[];
  onProductSelect: (productId: string) => void;
  onStartReordering: () => void;
  onCancelReordering: () => void;
  onMoveProduct: (productId: string, direction: 'up' | 'down') => void;
  onSaveReorder: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProduct: () => void;
}

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  selectedProductId,
  selectedCategory,
  isReorderingProducts,
  reorderingProductsList,
  onProductSelect,
  onStartReordering,
  onCancelReordering,
  onMoveProduct,
  onSaveReorder,
  onEditProduct,
  onDeleteProduct,
  onAddProduct
}) => {
  const [productToDelete, setProductToDelete] = React.useState<string | null>(null);

  // Always use the reordering list if present, else products
  const alwaysActiveReorderingList: Product[] = Array.isArray(reorderingProductsList) && reorderingProductsList.length > 0
    ? reorderingProductsList
    : Array.isArray(products) ? products : [];

  // Defensive: Ensure input is always array
  const {
    searchQuery, 
    setSearchQuery, 
    filteredProducts: rawFilteredProducts,
    isSearchDisabled 
  } = useProductsSearch(alwaysActiveReorderingList, false);

  // Extra guard: filter out invalid entries
  const filteredProducts = Array.isArray(rawFilteredProducts)
    ? rawFilteredProducts.filter((p): p is Product => !!p && typeof p === 'object' && !!p.id)
    : [];

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete);
      setProductToDelete(null);
    }
  };

  const closeDeleteDialog = () => {
    setProductToDelete(null);
  };

  return (
    <>
      <div className="h-full flex flex-col">
        <ProductsHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchDisabled={isSearchDisabled}
          selectedCategory={selectedCategory}
          onAddProduct={onAddProduct}
        />
        
        <ScrollArea className="flex-grow">
          <div className="p-4">
            {filteredProducts.length === 0 ? (
              <ProductsEmptyState
                selectedCategory={selectedCategory}
                hasSearchQuery={!!searchQuery.trim()}
              />
            ) : (
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    isSelected={selectedProductId === product.id}
                    isReordering={true}
                    canMoveUp={true}
                    canMoveDown={true}
                    onClick={() => onProductSelect(product.id)}
                    onEdit={() => onEditProduct(product)}
                    onDelete={() => handleDeleteClick(product.id)}
                    onMoveUp={() => onMoveProduct(product.id, 'up')}
                    onMoveDown={() => onMoveProduct(product.id, 'down')}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <ProductDeleteDialog
        isOpen={!!productToDelete}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default ProductsList;
