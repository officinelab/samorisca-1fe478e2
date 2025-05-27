
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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

  if (currentView === 'categories') {
    return (
      <div className="h-full">
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
    );
  }

  if (currentView === 'products') {
    // DEBUG before ProductsList
    console.log('=== Dashboard rendering ProductsList ===');
    console.log('Passing products:', products.length);
    console.log('Passing reorderingProductsList:', reorderingProductsList.length);

    return (
      <div className="h-full">
        <div className="flex items-center p-4 border-b">
          <Button 
            variant="ghost" 
            size="sm"
            className={dashboardStyles.mobileBackButton}
            onClick={() => setCurrentView('categories')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            Prodotti {selectedCategory && `- ${selectedCategory.title}`}
          </h2>
        </div>
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
    );
  }

  return (
    <div className="h-full">
      <div className="flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="sm"
          className={dashboardStyles.mobileBackButton}
          onClick={() => setCurrentView('products')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">Dettagli Prodotto</h2>
      </div>
      <ProductDetail
        product={selectedProduct}
        selectedCategory={selectedCategory}
        onEditProduct={() => handleEditProduct(selectedProduct!)}
      />
    </div>
  );
};

export default DashboardMobile;
