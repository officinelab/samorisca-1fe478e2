
import React from "react";
import { useDashboard } from "@/hooks/admin/dashboard/useDashboard";
import { useBreadcrumb } from "@/hooks/admin/dashboard/useBreadcrumb";
import DashboardMobileCategoriesView from "./mobile/DashboardMobileCategoriesView";
import DashboardMobileProductsView from "./mobile/DashboardMobileProductsView";
import DashboardMobileDetailView from "./mobile/DashboardMobileDetailView";

interface DashboardMobileProps {
  dashboard: ReturnType<typeof useDashboard>;
}

const DashboardMobile: React.FC<DashboardMobileProps> = ({ dashboard }) => {
  const {
    currentView,
    setCurrentView,
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

  const { breadcrumbItems, currentPageTitle } = useBreadcrumb({
    currentView,
    selectedCategory,
    selectedProduct,
    onNavigateToCategories: () => setCurrentView('categories'),
    onNavigateToProducts: () => setCurrentView('products')
  });

  const handleCategorySelectMobile = (categoryId: string) => {
    handleCategorySelect(categoryId);
    setCurrentView('products');
  };

  const handleProductSelectMobile = (productId: string) => {
    handleProductSelect(productId);
    if (productId) {
      setCurrentView('detail');
    }
  };

  if (currentView === 'categories') {
    return (
      <DashboardMobileCategoriesView
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        isReorderingCategories={isReorderingCategories}
        reorderingCategoriesList={reorderingCategoriesList}
        currentPageTitle={currentPageTitle}
        onCategorySelect={handleCategorySelectMobile}
        onStartReordering={startReorderingCategories}
        onCancelReordering={cancelReorderingCategories}
        onMoveCategory={moveCategoryInList}
        onSaveReorder={saveReorderCategories}
        onEditCategory={handleEditCategory}
        onDeleteCategory={deleteCategory}
        onAddCategory={handleAddCategory}
      />
    );
  }

  if (currentView === 'products') {
    return (
      <DashboardMobileProductsView
        products={products}
        selectedProductId={selectedProductId}
        selectedCategory={selectedCategory}
        isReorderingProducts={isReorderingProducts}
        reorderingProductsList={reorderingProductsList}
        breadcrumbItems={breadcrumbItems}
        onProductSelect={handleProductSelectMobile}
        onBack={() => setCurrentView('categories')}
        onStartReordering={startReorderingProducts}
        onCancelReordering={cancelReorderingProducts}
        onMoveProduct={moveProductInList}
        onSaveReorder={saveReorderProducts}
        onEditProduct={handleEditProduct}
        onDeleteProduct={deleteProduct}
        onAddProduct={handleAddProduct}
      />
    );
  }

  return (
    <DashboardMobileDetailView
      selectedProduct={selectedProduct}
      selectedCategory={selectedCategory}
      breadcrumbItems={breadcrumbItems}
      onBack={() => setCurrentView('products')}
      onEditProduct={() => handleEditProduct(selectedProduct!)}
    />
  );
};

export default DashboardMobile;
