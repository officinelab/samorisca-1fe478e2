
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Menu } from "lucide-react";
import { dashboardStyles } from "./Dashboard.styles";
import { useDashboardOperations } from "@/hooks/admin/dashboard/useDashboardOperations";

// Imported components
import CategoriesList from "@/components/admin/dashboard/CategoriesList";
import ProductsList from "@/components/admin/dashboard/ProductsList";
import ProductDetail from "@/components/admin/dashboard/ProductDetail";
import ProductForm from "@/components/product/ProductForm";
import CategoryForm from "@/components/categories/CategoryForm";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [currentView, setCurrentView] = useState<'categories' | 'products' | 'detail'>('categories');

  // Dialog states
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const {
    categories,
    products,
    labels,
    selectedCategoryId,
    selectedProductId,
    selectedCategory,
    selectedProduct,
    isLoading,
    isReorderingCategories,
    isReorderingProducts,
    reorderingCategoriesList,
    reorderingProductsList,
    setSelectedCategoryId,
    setSelectedProductId,
    loadData,
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
  } = useDashboardOperations();

  // Event handlers
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedProductId(null);
    if (isMobile) {
      setCurrentView('products');
    }
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    if (isMobile && productId) {
      setCurrentView('detail');
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
  };

  const handleAddCategory = () => {
    setShowAddCategory(true);
  };

  const handleAddProduct = () => {
    setShowAddProduct(true);
  };

  const handleCategoryFormSave = async () => {
    await loadData();
    setShowAddCategory(false);
    setEditingCategory(null);
  };

  const handleProductFormSave = async () => {
    await loadData();
    setShowAddProduct(false);
    setEditingProduct(null);
  };

  if (isLoading) {
    return (
      <div className={dashboardStyles.container}>
        <div className="flex items-center justify-center h-full">
          <div className={dashboardStyles.loadingSpinner}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p>Caricamento...</p>
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout
  if (isMobile) {
    return (
      <div className={dashboardStyles.container}>
        {currentView === 'categories' && (
          <div className="h-full">
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
        )}

        {currentView === 'products' && (
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
        )}

        {currentView === 'detail' && (
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
              <h2 className="text-lg font-semibold">Dettaglio Prodotto</h2>
            </div>
            <ProductDetail product={selectedProduct} labels={labels} />
          </div>
        )}

        {/* Mobile Dialogs */}
        <Dialog open={showAddCategory || !!editingCategory} onOpenChange={(open) => {
          if (!open) {
            setShowAddCategory(false);
            setEditingCategory(null);
          }
        }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Modifica Categoria" : "Nuova Categoria"}
              </DialogTitle>
            </DialogHeader>
            <CategoryForm
              category={editingCategory}
              onSave={handleCategoryFormSave}
              onCancel={() => {
                setShowAddCategory(false);
                setEditingCategory(null);
              }}
            />
          </DialogContent>
        </Dialog>

        <Dialog open={showAddProduct || !!editingProduct} onOpenChange={(open) => {
          if (!open) {
            setShowAddProduct(false);
            setEditingProduct(null);
          }
        }}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Modifica Prodotto" : "Nuovo Prodotto"}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              onSave={handleProductFormSave}
              onCancel={() => {
                setShowAddProduct(false);
                setEditingProduct(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className={dashboardStyles.container}>
      <div className={dashboardStyles.sidebar}>
        <div className={dashboardStyles.sidebarSection}>
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

        <div className={dashboardStyles.sidebarSection}>
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
      </div>

      <div className={dashboardStyles.mainContent}>
        <ProductDetail product={selectedProduct} labels={labels} />
      </div>

      {/* Desktop Sheets */}
      <Sheet open={showAddCategory || !!editingCategory} onOpenChange={(open) => {
        if (!open) {
          setShowAddCategory(false);
          setEditingCategory(null);
        }
      }}>
        <SheetContent>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingCategory ? "Modifica Categoria" : "Nuova Categoria"}
            </h3>
            <CategoryForm
              category={editingCategory}
              onSave={handleCategoryFormSave}
              onCancel={() => {
                setShowAddCategory(false);
                setEditingCategory(null);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={showAddProduct || !!editingProduct} onOpenChange={(open) => {
        if (!open) {
          setShowAddProduct(false);
          setEditingProduct(null);
        }
      }}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingProduct ? "Modifica Prodotto" : "Nuovo Prodotto"}
            </h3>
            <ProductForm
              product={editingProduct}
              onSave={handleProductFormSave}
              onCancel={() => {
                setShowAddProduct(false);
                setEditingProduct(null);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Dashboard;
