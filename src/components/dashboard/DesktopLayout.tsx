
import React from "react";
import { Category, Product } from "@/types/database";
import CategoriesList from "./CategoriesList";
import ProductsList from "./ProductsList";
import ProductDetail from "./ProductDetail";

interface DesktopLayoutProps {
  categories: Category[];
  selectedCategoryId: string | null;
  isLoadingCategories: boolean;
  filteredProducts: Product[];
  selectedProductId: string | null;
  isLoadingProducts: boolean;
  isEditing: boolean;
  searchQuery: string;
  selectedProduct: Product | null;
  allCategories: Category[];
  onCategorySelect: (categoryId: string) => void;
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (categoryId: string) => void;
  onReorderCategory: (categoryId: string, direction: 'up' | 'down') => void;
  onSearchChange: (query: string) => void;
  onProductSelect: (productId: string) => void;
  onAddProduct: () => void;
  onEditProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => void;
  onReorderProduct: (productId: string, direction: 'up' | 'down') => void;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onSaveProduct: (productData: Partial<Product>) => void;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  categories,
  selectedCategoryId,
  isLoadingCategories,
  filteredProducts,
  selectedProductId,
  isLoadingProducts,
  isEditing,
  searchQuery,
  selectedProduct,
  allCategories,
  onCategorySelect,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onReorderCategory,
  onSearchChange,
  onProductSelect,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onReorderProduct,
  onStartEditing,
  onCancelEditing,
  onSaveProduct
}) => {
  return (
    <div className="grid grid-cols-12 h-full divide-x">
      <div className="col-span-2 h-full border-r">
        <CategoriesList
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          isLoading={isLoadingCategories}
          onCategorySelect={onCategorySelect}
          onAddCategory={onAddCategory}
          onEditCategory={onEditCategory}
          onDeleteCategory={onDeleteCategory}
          onReorderCategory={onReorderCategory}
        />
      </div>
      
      <div className="col-span-5 h-full border-r">
        <ProductsList
          products={filteredProducts}
          selectedProductId={selectedProductId}
          isLoading={isLoadingProducts}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          onProductSelect={onProductSelect}
          onAddProduct={onAddProduct}
          onEditProduct={onEditProduct}
          onDeleteProduct={onDeleteProduct}
          onReorderProduct={onReorderProduct}
          noCategory={!selectedCategoryId}
        />
      </div>
      
      <div className="col-span-5 h-full">
        <ProductDetail
          product={selectedProduct}
          allCategories={allCategories}
          selectedProductId={selectedProductId}
          isEditing={isEditing}
          onStartEditing={onStartEditing}
          onCancelEditing={onCancelEditing}
          onSaveProduct={onSaveProduct}
        />
      </div>
    </div>
  );
};

export default DesktopLayout;
