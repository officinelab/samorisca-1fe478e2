
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Category, Product } from "@/types/database";

export const useDashboardState = () => {
  // Mobile view state
  const isMobile = useIsMobile();
  const [showMobileCategories, setShowMobileCategories] = useState(true);
  const [showMobileProducts, setShowMobileProducts] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  
  // Category form state
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Handle category selection
  const handleCategorySelect = (categoryId: string, selectCategory: (id: string) => void) => {
    selectCategory(categoryId);
    
    if (isMobile) {
      setShowMobileCategories(false);
      setShowMobileProducts(true);
      setShowMobileDetail(false);
    }
  };
  
  // Handle product selection
  const handleProductSelect = (productId: string, selectProduct: (id: string) => void) => {
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
  
  // Handle adding new product
  const handleAddProduct = (startEditingProduct: (id: string | null) => void) => {
    startEditingProduct(null);
    
    if (isMobile) {
      setShowMobileProducts(false);
      setShowMobileDetail(true);
    }
  };
  
  // Handle editing product
  const handleEditProduct = (productId: string, startEditingProduct: (id: string) => void) => {
    startEditingProduct(productId);
    
    if (isMobile) {
      setShowMobileProducts(false);
      setShowMobileDetail(true);
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
  
  return {
    isMobile,
    showMobileCategories,
    showMobileProducts,
    showMobileDetail,
    showCategoryForm,
    setShowCategoryForm,
    editingCategory,
    setEditingCategory,
    handleCategorySelect,
    handleProductSelect,
    handleShowAddCategory,
    handleShowEditCategory,
    handleAddProduct,
    handleEditProduct,
    handleBackToCategories,
    handleBackToProducts
  };
};
