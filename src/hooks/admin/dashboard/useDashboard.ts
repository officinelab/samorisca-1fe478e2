
import { useState } from "react";
import { Category, Product } from "@/types/database";
import { useDashboardOperations } from "./useDashboardOperations";

export const useDashboard = () => {
  const [currentView, setCurrentView] = useState<'categories' | 'products' | 'detail'>('categories');
  
  // Dialog states
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const dashboardOperations = useDashboardOperations();

  // Event handlers
  const handleCategorySelect = (categoryId: string) => {
    dashboardOperations.setSelectedCategoryId(categoryId);
    dashboardOperations.setSelectedProductId(null);
  };

  const handleProductSelect = (productId: string) => {
    dashboardOperations.setSelectedProductId(productId);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleAddCategory = () => {
    setShowAddCategory(true);
  };

  const handleAddProduct = () => {
    setShowAddProduct(true);
  };

  const handleCategoryFormSave = async () => {
    await dashboardOperations.loadData();
    setShowAddCategory(false);
    setEditingCategory(null);
  };

  const handleProductFormSave = async () => {
    await dashboardOperations.loadData();
    setShowAddProduct(false);
    setEditingProduct(null);
  };

  const handleCategoryFormCancel = () => {
    setShowAddCategory(false);
    setEditingCategory(null);
  };

  const handleProductFormCancel = () => {
    setShowAddProduct(false);
    setEditingProduct(null);
  };

  return {
    // State
    currentView,
    setCurrentView,
    showAddCategory,
    editingCategory,
    showAddProduct,
    editingProduct,
    
    // Dashboard operations
    ...dashboardOperations,
    
    // Event handlers
    handleCategorySelect,
    handleProductSelect,
    handleEditCategory,
    handleEditProduct,
    handleAddCategory,
    handleAddProduct,
    handleCategoryFormSave,
    handleProductFormSave,
    handleCategoryFormCancel,
    handleProductFormCancel
  };
};
