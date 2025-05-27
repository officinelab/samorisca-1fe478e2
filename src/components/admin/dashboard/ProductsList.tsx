import React, { useEffect } from "react";
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
  console.log('=== ProductsList RENDER ===');
  console.log('Products received:', products.length);
  console.log('Is reordering:', isReorderingProducts);
  console.log('Reordering list:', reorderingProductsList.length);

  const [productToDelete, setProductToDelete] = React.useState<string | null>(null);

  // 1. Usa la lista giusta (quella in riordino se necessario)
  const baseProductList = isReorderingProducts
    ? reorderingProductsList
    : products;

  // 2. Filtra per categoria selezionata
  const categoryFilteredProducts = selectedCategory
    ? baseProductList.filter(p => p.category_id === selectedCategory.id)
    : baseProductList;

  // 3. Passa i prodotti già filtrati per categoria all'hook di ricerca
  const {
    searchQuery,
    setSearchQuery,
    filteredProducts,
    isSearchDisabled
  } = useProductsSearch(categoryFilteredProducts, false);

  useEffect(() => {
    if (products.length > 0 && !isReorderingProducts) {
      onStartReordering();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

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
                {filteredProducts.map((product, index) => (
                  <ProductItem
                    key={product.id}
                    product={product}
                    isSelected={selectedProductId === product.id}
                    isReordering={true}
                    canMoveUp={index > 0}
                    canMoveDown={index < filteredProducts.length - 1}
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
