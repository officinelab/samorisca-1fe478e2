import { useState } from "react";
import { Category, Product } from "@/types/database";
import { useDashboardOperations } from "./useDashboardOperations";

export const useDashboard = () => {
  const [currentView, setCurrentView] = useState<'categories' | 'products' | 'detail'>('categories');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const dashboardOperations = useDashboardOperations();

  // Carica i prodotti della categoria selezionata
  const handleCategorySelect = async (categoryId: string) => {
    dashboardOperations.setSelectedCategoryId(categoryId);
    dashboardOperations.setSelectedProductId(null);
    if (dashboardOperations.loadProducts) {
      await dashboardOperations.loadProducts(categoryId);
    }
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
    currentView,
    setCurrentView,
    showAddCategory,
    editingCategory,
    showAddProduct,
    editingProduct,
    ...dashboardOperations,
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
