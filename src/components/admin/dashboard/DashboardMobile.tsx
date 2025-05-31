
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Package } from "lucide-react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { useDashboard } from "@/hooks/admin/dashboard/useDashboard";
import CategoriesList from "./CategoriesList";
import ProductsList from "./ProductsList";
import ProductDetail from "./ProductDetail";

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

  // Breadcrumb navigation helper
  const getBreadcrumb = () => {
    if (currentView === 'categories') return 'Gestione Menu';
    if (currentView === 'products') return `Gestione Menu > ${selectedCategory?.title || 'Prodotti'}`;
    if (currentView === 'detail') return `Gestione Menu > ${selectedCategory?.title || 'Prodotti'} > ${selectedProduct?.title || 'Dettagli'}`;
    return 'Gestione Menu';
  };

  // Categories view
  if (currentView === 'categories') {
    return (
      <div className={dashboardStyles.mobileContainer}>
        <div className={dashboardStyles.mobileHeader}>
          <div className={dashboardStyles.mobileHeaderContent}>
            <div className={dashboardStyles.mobileHeaderLeft}>
              <div className="flex items-center">
                <Home className="h-5 w-5 text-primary mr-2" />
                <h1 className={dashboardStyles.mobileTitle}>Categorie</h1>
              </div>
              <div className={dashboardStyles.mobileBreadcrumb}>
                {getBreadcrumb()}
              </div>
            </div>
          </div>
        </div>
        <div className={dashboardStyles.mobileContent}>
          <CategoriesList
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            isReorderingCategories={isReorderingCategories}
            reorderingCategoriesList={reorderingCategoriesList}
            onCategorySelect={handleCategorySelectMobile}
            onStartReordering={startReorderingCategories}
            onCancelReordering={cancelReorderingCategories}
            onMoveCategory={moveCategoryInList}
            onSaveReorder={saveReorderCategories}
            onEditCategory={handleEditCategory}
            onDeleteCategory={deleteCategory}
            onAddCategory={handleAddCategory}
          />
        </div>
      </div>
    );
  }

  // Products view
  if (currentView === 'products') {
    return (
      <div className={dashboardStyles.mobileContainer}>
        <div className={dashboardStyles.mobileHeader}>
          <div className={dashboardStyles.mobileHeaderContent}>
            <div className={dashboardStyles.mobileHeaderLeft}>
              <Button 
                variant="ghost" 
                size="sm"
                className={dashboardStyles.mobileBackButton}
                onClick={() => setCurrentView('categories')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-primary mr-2" />
                  <h1 className={dashboardStyles.mobileTitle}>Prodotti</h1>
                </div>
                <div className={dashboardStyles.mobileBreadcrumb}>
                  {getBreadcrumb()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={dashboardStyles.mobileContent}>
          <ProductsList
            products={products}
            selectedProductId={selectedProductId}
            selectedCategory={selectedCategory}
            isReorderingProducts={isReorderingProducts}
            reorderingProductsList={reorderingProductsList}
            onProductSelect={handleProductSelectMobile}
            onStartReordering={startReorderingProducts}
            onCancelReordering={cancelReorderingProducts}
            onMoveProduct={moveProductInList}
            onSaveReorder={saveReorderProducts}
            onEditProduct={handleEditProduct}
            onDeleteProduct={deleteProduct}
            onAddProduct={handleAddProduct}
          />
        </div>
      </div>
    );
  }

  // Product detail view
  return (
    <div className={dashboardStyles.mobileContainer}>
      <div className={dashboardStyles.mobileHeader}>
        <div className={dashboardStyles.mobileHeaderContent}>
          <div className={dashboardStyles.mobileHeaderLeft}>
            <Button 
              variant="ghost" 
              size="sm"
              className={dashboardStyles.mobileBackButton}
              onClick={() => setCurrentView('products')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex flex-col min-w-0">
              <h1 className={dashboardStyles.mobileTitle}>Dettagli Prodotto</h1>
              <div className={dashboardStyles.mobileBreadcrumb}>
                {getBreadcrumb()}
              </div>
            </div>
          </div>
          <div className={dashboardStyles.mobileHeaderRight}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditProduct(selectedProduct!)}
              className="h-9 px-3 text-sm"
            >
              Modifica
            </Button>
          </div>
        </div>
      </div>
      <div className={dashboardStyles.mobileContent}>
        <ProductDetail
          product={selectedProduct}
          selectedCategory={selectedCategory}
          onEditProduct={() => handleEditProduct(selectedProduct!)}
        />
      </div>
    </div>
  );
};

export default DashboardMobile;
