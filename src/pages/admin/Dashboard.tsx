
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Product, Category } from "@/types/database";
import { useCategories } from "@/hooks/dashboard/useCategories";
import { useProducts } from "@/hooks/dashboard/useProducts";
import CategoriesList from "@/components/dashboard/CategoriesList";
import ProductsList from "@/components/dashboard/ProductsList";
import ProductDetail from "@/components/dashboard/ProductDetail";
import CategoryForm from "@/components/dashboard/CategoryForm";

const Dashboard = () => {
  // Get screen size
  const isMobile = useIsMobile();
  
  // Mobile view state
  const [showMobileCategories, setShowMobileCategories] = useState(true);
  const [showMobileProducts, setShowMobileProducts] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  
  // Category form state
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  
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
  
  // Handle category selection
  const handleCategorySelect = (categoryId: string) => {
    selectCategory(categoryId);
    
    if (isMobile) {
      setShowMobileCategories(false);
      setShowMobileProducts(true);
      setShowMobileDetail(false);
    }
  };
  
  // Handle product selection
  const handleProductSelect = (productId: string) => {
    selectProduct(productId);
    
    if (isMobile) {
      setShowMobileProducts(false);
      setShowMobileDetail(true);
    }
  };
  
  // Handle showing add category form
  const handleShowAddCategory = () => {
    setEditingCategory(null);
    setShowCategoryForm(true);
  };
  
  // Handle showing edit category form
  const handleShowEditCategory = (category: Category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };
  
  // Handle saving category
  const handleSaveCategory = (categoryData: Partial<Category>) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
    } else {
      addCategory(categoryData);
    }
    setShowCategoryForm(false);
  };
  
  // Handle adding new product
  const handleAddProduct = () => {
    startEditingProduct(null);
    
    if (isMobile) {
      setShowMobileProducts(false);
      setShowMobileDetail(true);
    }
  };
  
  // Handle editing product
  const handleEditProduct = (productId: string) => {
    startEditingProduct(productId);
    
    if (isMobile) {
      setShowMobileProducts(false);
      setShowMobileDetail(true);
    }
  };
  
  // Handle saving product
  const handleSaveProduct = (productData: Partial<Product>) => {
    if (selectedProductId) {
      updateProduct(selectedProductId, productData);
    } else {
      addProduct(productData);
    }
  };
  
  // Handle mobile navigation
  const handleBackToCategories = () => {
    setShowMobileCategories(true);
    setShowMobileProducts(false);
    setShowMobileDetail(false);
  };
  
  const handleBackToProducts = () => {
    setShowMobileProducts(true);
    setShowMobileDetail(false);
  };
  
  // Get the currently selected product
  const selectedProduct = selectedProductId 
    ? filteredProducts.find(p => p.id === selectedProductId) || null
    : null;

  // Mobile Layout
  const MobileLayout = () => {
    if (showMobileCategories) {
      return (
        <CategoriesList
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          isLoading={isLoadingCategories}
          onCategorySelect={handleCategorySelect}
          onAddCategory={handleShowAddCategory}
          onEditCategory={handleShowEditCategory}
          onDeleteCategory={deleteCategory}
          onReorderCategory={reorderCategory}
        />
      );
    } else if (showMobileProducts) {
      return (
        <ProductsList
          products={filteredProducts}
          selectedProductId={selectedProductId}
          isLoading={isLoadingProducts}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onProductSelect={handleProductSelect}
          onAddProduct={handleAddProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={deleteProduct}
          onReorderProduct={reorderProduct}
          onBackToCategories={handleBackToCategories}
          isMobile={true}
        />
      );
    } else if (showMobileDetail) {
      return (
        <ProductDetail
          product={selectedProduct}
          allCategories={categories}
          selectedProductId={selectedProductId}
          isEditing={isEditing}
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
        onCategorySelect={handleCategorySelect}
        onAddCategory={handleShowAddCategory}
        onEditCategory={handleShowEditCategory}
        onDeleteCategory={deleteCategory}
        onReorderCategory={reorderCategory}
      />
    );
  };

  // Desktop Layout
  const DesktopLayout = () => (
    <div className="grid grid-cols-12 h-full divide-x">
      <div className="col-span-2 h-full border-r">
        <CategoriesList
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          isLoading={isLoadingCategories}
          onCategorySelect={handleCategorySelect}
          onAddCategory={handleShowAddCategory}
          onEditCategory={handleShowEditCategory}
          onDeleteCategory={deleteCategory}
          onReorderCategory={reorderCategory}
        />
      </div>
      
      <div className="col-span-5 h-full border-r">
        <ProductsList
          products={filteredProducts}
          selectedProductId={selectedProductId}
          isLoading={isLoadingProducts}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onProductSelect={handleProductSelect}
          onAddProduct={handleAddProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={deleteProduct}
          onReorderProduct={reorderProduct}
          noCategory={!selectedCategoryId}
        />
      </div>
      
      <div className="col-span-5 h-full">
        <ProductDetail
          product={selectedProduct}
          allCategories={categories}
          selectedProductId={selectedProductId}
          isEditing={isEditing}
          onStartEditing={() => setIsEditing(true)}
          onCancelEditing={() => setIsEditing(false)}
          onSaveProduct={handleSaveProduct}
        />
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-4rem)]">
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
      
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
