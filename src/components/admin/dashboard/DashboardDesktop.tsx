
import React from "react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { useDashboard } from "@/hooks/admin/dashboard/useDashboard";
import CategoriesList from "./CategoriesList";
import ProductsList from "./ProductsList";
import ProductDetail from "./ProductDetail";

interface DashboardDesktopProps {
  dashboard: ReturnType<typeof useDashboard>;
}

const DashboardDesktop: React.FC<DashboardDesktopProps> = ({ dashboard }) => {
  const {
    categories,
    products,
    selectedCategoryId,
    selectedProductId,
    selectedCategory,
    selectedProduct,
    isReorderingCategories,
    isReorderingProducts,
    reorderingCategoriesList,
    reorderingProductsList,
    handleCategorySelect,
    handleProductSelect,
    startReorderingCategories,
    cancelReorderingCategories,
    moveCategoryInList,
    saveReorderCategories,
    deleteCategory,
    startReorderingProducts,
    cancelReorderingProducts,
    moveProductInList,
    saveReorderProducts,
    deleteProduct,
    handleEditCategory,
    handleEditProduct,
    handleAddCategory,
    handleAddProduct
  } = dashboard;

  // DEBUG before ProductsList
  console.log('=== Dashboard rendering ProductsList ===');
  console.log('Passing products:', products.length);
  console.log('Passing reorderingProductsList:', reorderingProductsList.length);

  return (
    <div className={dashboardStyles.desktopGrid}>
      <div className={dashboardStyles.categoriesColumn}>
        <CategoriesList
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          isReorderingCategories={isReorderingCategories}
          reorderingCategoriesList={reorderingCategoriesList}
          onCategorySelect={handleCategorySelect}
          onStartReordering={startReorderingCategories}
          onCancelReordering={cancelReorderingCategories}
          onMoveCategory={moveCategoryInList}
          onSaveReorder={saveReorderCategories}
          onEditCategory={handleEditCategory}
          onDeleteCategory={deleteCategory}
          onAddCategory={handleAddCategory}
        />
      </div>
      
      <div className={dashboardStyles.productsColumn}>
        <ProductsList
          products={products}
          selectedProductId={selectedProductId}
          selectedCategory={selectedCategory}
          isReorderingProducts={isReorderingProducts}
          reorderingProductsList={reorderingProductsList}
          onProductSelect={handleProductSelect}
          onStartReordering={startReorderingProducts}
          onCancelReordering={cancelReorderingProducts}
          onMoveProduct={moveProductInList}
          onSaveReorder={saveReorderProducts}
          onEditProduct={handleEditProduct}
          onDeleteProduct={deleteProduct}
          onAddProduct={handleAddProduct}
        />
      </div>
      
      <div className={dashboardStyles.detailColumn}>
        <ProductDetail
          product={selectedProduct}
          selectedCategory={selectedCategory}
          onEditProduct={() => handleEditProduct(selectedProduct!)}
        />
      </div>
    </div>
  );
};

export default DashboardDesktop;
