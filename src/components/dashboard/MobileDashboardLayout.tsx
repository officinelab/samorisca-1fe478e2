
// Mobile dashboard layout component
import React from "react";
import CategoriesList from "@/components/dashboard/CategoriesList";
import ProductsList from "@/components/dashboard/ProductsList";
import ProductDetail from "@/components/dashboard/ProductDetail";
import { Category, Product } from "@/types/database";

interface MobileDashboardLayoutProps {
  state: any;
  actions: any;
}

const MobileDashboardLayout: React.FC<MobileDashboardLayoutProps> = ({
  state,
  actions,
}) => {
  const {
    showMobileCategories,
    showMobileProducts,
    showMobileDetail,
    categories,
    selectedCategory,
    isLoadingCategories,
    products,
    selectedProduct,
    isLoadingProducts,
    searchQuery,
    isMobile,
    isEditing,
    ProductDetailFormComponent,
    onCategoriesBack,
    onProductsBack,
  } = state;
  const {
    handleCategorySelect,
    handleCategoryReorder,
    handleCategoryNew,
    handleCategoryEdit,
    handleCategoryDelete,
    handleProductSelect,
    handleProductReorder,
    handleProductEdit,
    handleProductDelete,
    handleProductNew,
    setSearchQuery,
    setIsEditing,
  } = actions;

  if (showMobileCategories) {
    return (
      <CategoriesList
        categories={categories}
        selectedCategory={selectedCategory}
        isLoading={isLoadingCategories}
        onSelect={handleCategorySelect}
        onMoveUp={handleCategoryReorder.bind(null, "up")}
        onMoveDown={handleCategoryReorder.bind(null, "down")}
        onNew={handleCategoryNew}
        onEdit={handleCategoryEdit}
        onDelete={handleCategoryDelete}
      />
    );
  }
  if (showMobileProducts) {
    return (
      <ProductsList
        products={products}
        selectedProduct={selectedProduct}
        isLoading={isLoadingProducts}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onSelect={handleProductSelect}
        onMoveUp={handleProductReorder.bind(null, "up")}
        onMoveDown={handleProductReorder.bind(null, "down")}
        onEdit={handleProductEdit}
        onDelete={handleProductDelete}
        onNew={handleProductNew}
        isMobile={isMobile}
        onBack={onCategoriesBack}
        selectedCategory={selectedCategory}
      />
    );
  }
  if (showMobileDetail) {
    return (
      <ProductDetail
        product={products.find((p) => p.id === selectedProduct)}
        categories={categories}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onBack={onProductsBack}
        isMobile={isMobile}
        ProductFormComponent={ProductDetailFormComponent}
        showForm={isEditing}
      />
    );
  }
  return <CategoriesList
    categories={categories}
    selectedCategory={selectedCategory}
    isLoading={isLoadingCategories}
    onSelect={handleCategorySelect}
    onMoveUp={handleCategoryReorder.bind(null, "up")}
    onMoveDown={handleCategoryReorder.bind(null, "down")}
    onNew={handleCategoryNew}
    onEdit={handleCategoryEdit}
    onDelete={handleCategoryDelete}
  />;
};

export default MobileDashboardLayout;
