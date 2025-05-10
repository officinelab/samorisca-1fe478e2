
import React from "react";
import { Category, Product } from "@/types/database";
import CategoriesList from "./CategoriesList";
import ProductsList from "./ProductsList";
import ProductDetail from "./ProductDetail";

interface MobileLayoutProps {
  showMobileCategories: boolean;
  showMobileProducts: boolean;
  showMobileDetail: boolean;
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
  onBackToCategories: () => void;
  onStartEditing: () => void;
  onCancelEditing: () => void;
  onSaveProduct: (productData: Partial<Product>) => void;
  onBackToProducts: () => void;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  showMobileCategories,
  showMobileProducts,
  showMobileDetail,
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
  onBackToCategories,
  onStartEditing,
  onCancelEditing,
  onSaveProduct,
  onBackToProducts
}) => {
  if (showMobileCategories) {
    return (
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
    );
  } else if (showMobileProducts) {
    return (
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
        onBackToCategories={onBackToCategories}
        isMobile={true}
      />
    );
  } else if (showMobileDetail) {
    return (
      <ProductDetail
        product={selectedProduct}
        allCategories={allCategories}
        selectedProductId={selectedProductId}
        isEditing={isEditing}
        onStartEditing={onStartEditing}
        onCancelEditing={onCancelEditing}
        onSaveProduct={onSaveProduct}
        onBackToProducts={onBackToProducts}
        isMobile={true}
      />
    );
  }
  
  // Default fallback
  return (
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
  );
};

export default MobileLayout;
