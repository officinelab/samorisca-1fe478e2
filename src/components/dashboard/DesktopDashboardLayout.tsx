
import React from "react";
import CategoriesList from "@/components/dashboard/CategoriesList";
import ProductsList from "@/components/dashboard/ProductsList";
import ProductDetail from "@/components/dashboard/ProductDetail";
import { Category, Product } from "@/types/database";

interface DesktopDashboardLayoutProps {
  state: any;
  actions: any;
}

const DesktopDashboardLayout: React.FC<DesktopDashboardLayoutProps> = ({
  state,
  actions,
}) => {
  const {
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

  return (
    <div className="grid grid-cols-12 h-full divide-x">
      <div className="col-span-2 h-full border-r">
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
      </div>
      <div className="col-span-5 h-full border-r">
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
          selectedCategory={selectedCategory}
        />
      </div>
      <div className="col-span-5 h-full">
        <ProductDetail
          product={products.find((p) => p.id === selectedProduct)}
          categories={categories}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          ProductFormComponent={ProductDetailFormComponent}
          showForm={isEditing}
        />
      </div>
    </div>
  );
};

export default DesktopDashboardLayout;
