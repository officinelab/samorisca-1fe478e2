
import { Product, Category } from "@/types/database";
import { useCategories } from "@/hooks/dashboard/useCategories";
import { useProducts } from "@/hooks/dashboard/useProducts";
import { useDashboardState } from "@/hooks/dashboard/useDashboardState";
import MobileLayout from "@/components/dashboard/MobileLayout";
import DesktopLayout from "@/components/dashboard/DesktopLayout";
import CategoryForm from "@/components/dashboard/CategoryForm";

const Dashboard = () => {
  // Use custom hooks
  const {
    categories,
    selectedCategoryId,
    isLoadingCategories,
    editingCategory,
    setEditingCategory,
    selectCategory,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategory
  } = useCategories();
  
  const {
    filteredProducts,
    selectedProductId,
    isLoadingProducts,
    isEditing,
    searchQuery,
    setSearchQuery,
    selectProduct,
    startEditingProduct,
    setIsEditing,
    addProduct,
    updateProduct,
    deleteProduct,
    reorderProduct
  } = useProducts(selectedCategoryId);
  
  const {
    isMobile,
    showMobileCategories,
    showMobileProducts,
    showMobileDetail,
    showCategoryForm,
    setShowCategoryForm,
    handleCategorySelect,
    handleProductSelect,
    handleShowAddCategory,
    handleShowEditCategory,
    handleAddProduct,
    handleEditProduct,
    handleBackToCategories,
    handleBackToProducts
  } = useDashboardState();

  // Handle saving category
  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }
    setShowCategoryForm(false);
  };
  
  // Handle saving product
  const handleSaveProduct = (productData: Partial<Product>) => {
    if (selectedProductId) {
      updateProduct(selectedProductId, productData);
    } else {
      addProduct(productData);
    }
  };
  
  // Get the currently selected product
  const selectedProduct = selectedProductId 
    ? filteredProducts.find(p => p.id === selectedProductId) || null
    : null;

  return (
    <div className="h-[calc(100vh-4rem)]">
      {isMobile ? (
        <MobileLayout
          showMobileCategories={showMobileCategories}
          showMobileProducts={showMobileProducts}
          showMobileDetail={showMobileDetail}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          isLoadingCategories={isLoadingCategories}
          filteredProducts={filteredProducts}
          selectedProductId={selectedProductId}
          isLoadingProducts={isLoadingProducts}
          isEditing={isEditing}
          searchQuery={searchQuery}
          selectedProduct={selectedProduct}
          allCategories={categories}
          onCategorySelect={(categoryId) => handleCategorySelect(categoryId, selectCategory)}
          onAddCategory={handleShowAddCategory}
          onEditCategory={handleShowEditCategory}
          onDeleteCategory={deleteCategory}
          onReorderCategory={reorderCategory}
          onSearchChange={setSearchQuery}
          onProductSelect={(productId) => handleProductSelect(productId, selectProduct)}
          onAddProduct={() => handleAddProduct(startEditingProduct)}
          onEditProduct={(productId) => handleEditProduct(productId, startEditingProduct)}
          onDeleteProduct={deleteProduct}
          onReorderProduct={reorderProduct}
          onBackToCategories={handleBackToCategories}
          onStartEditing={() => setIsEditing(true)}
          onCancelEditing={() => {
            if (selectedProduct) {
              setIsEditing(false);
            } else {
              handleBackToProducts();
            }
          }}
          onSaveProduct={handleSaveProduct}
          onBackToProducts={handleBackToProducts}
        />
      ) : (
        <DesktopLayout
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          isLoadingCategories={isLoadingCategories}
          filteredProducts={filteredProducts}
          selectedProductId={selectedProductId}
          isLoadingProducts={isLoadingProducts}
          isEditing={isEditing}
          searchQuery={searchQuery}
          selectedProduct={selectedProduct}
          allCategories={categories}
          onCategorySelect={(categoryId) => handleCategorySelect(categoryId, selectCategory)}
          onAddCategory={handleShowAddCategory}
          onEditCategory={handleShowEditCategory}
          onDeleteCategory={deleteCategory}
          onReorderCategory={reorderCategory}
          onSearchChange={setSearchQuery}
          onProductSelect={(productId) => handleProductSelect(productId, selectProduct)}
          onAddProduct={() => handleAddProduct(startEditingProduct)}
          onEditProduct={(productId) => handleEditProduct(productId, startEditingProduct)}
          onDeleteProduct={deleteProduct}
          onReorderProduct={reorderProduct}
          onStartEditing={() => setIsEditing(true)}
          onCancelEditing={() => setIsEditing(false)}
          onSaveProduct={handleSaveProduct}
        />
      )}
      
      {/* Category form */}
      <CategoryForm
        isOpen={showCategoryForm}
        onOpenChange={setShowCategoryForm}
        category={editingCategory}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default Dashboard;
