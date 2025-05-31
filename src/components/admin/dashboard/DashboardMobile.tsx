
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Layers, Info } from "lucide-react";
import { dashboardStyles } from "@/pages/admin/Dashboard.styles";
import { useDashboard } from "@/hooks/admin/dashboard/useDashboard";
import { useBreadcrumb } from "@/hooks/admin/dashboard/useBreadcrumb";
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator, 
  BreadcrumbPage 
} from "@/components/ui/breadcrumb";
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

  const getViewIcon = () => {
    switch (currentView) {
      case 'categories':
        return <Layers className="h-5 w-5 text-gray-600" />;
      case 'products':
        return <Package className="h-5 w-5 text-gray-600" />;
      case 'detail':
        return <Info className="h-5 w-5 text-gray-600" />;
      default:
        return null;
    }
  };

  if (currentView === 'categories') {
    return (
      <div className={dashboardStyles.mobileContainer}>
        <div className={dashboardStyles.mobileHeader}>
          <div className={dashboardStyles.mobileHeaderContent}>
            {getViewIcon()}
            <h2 className={`${dashboardStyles.mobileTitle} ml-2`}>
              {currentPageTitle}
            </h2>
          </div>
        </div>
        <div className={dashboardStyles.mobileContent}>
          <div className={dashboardStyles.categoriesContent}>
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
      </div>
    );
  }

  if (currentView === 'products') {
    return (
      <div className={dashboardStyles.mobileContainer}>
        <div className={dashboardStyles.mobileHeader}>
          <div className={dashboardStyles.mobileHeaderContent}>
            <Button 
              variant="ghost" 
              size="sm"
              className={dashboardStyles.mobileBackButton}
              onClick={() => setCurrentView('categories')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbItems.map((item, index) => (
                    <React.Fragment key={index}>
                      <BreadcrumbItem>
                        {item.action ? (
                          <BreadcrumbLink 
                            onClick={item.action}
                            className="cursor-pointer text-gray-600 hover:text-gray-900"
                          >
                            {item.label}
                          </BreadcrumbLink>
                        ) : (
                          <BreadcrumbPage className="text-gray-900 font-medium">
                            {item.label}
                          </BreadcrumbPage>
                        )}
                      </BreadcrumbItem>
                      {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            {getViewIcon()}
          </div>
        </div>
        <div className={dashboardStyles.mobileContent}>
          <div className={dashboardStyles.productsContent}>
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
      </div>
    );
  }

  return (
    <div className={dashboardStyles.mobileContainer}>
      <div className={dashboardStyles.mobileHeader}>
        <div className={dashboardStyles.mobileHeaderContent}>
          <Button 
            variant="ghost" 
            size="sm"
            className={dashboardStyles.mobileBackButton}
            onClick={() => setCurrentView('products')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbItems.map((item, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {item.action ? (
                        <BreadcrumbLink 
                          onClick={item.action}
                          className="cursor-pointer text-gray-600 hover:text-gray-900"
                        >
                          {item.label}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="text-gray-900 font-medium">
                          {item.label}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          {getViewIcon()}
        </div>
      </div>
      <div className={dashboardStyles.mobileContent}>
        <div className="p-4">
          <ProductDetail
            product={selectedProduct}
            selectedCategory={selectedCategory}
            onEditProduct={() => handleEditProduct(selectedProduct!)}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardMobile;
