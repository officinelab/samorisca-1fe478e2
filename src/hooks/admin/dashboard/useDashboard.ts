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
    // Esce dalla modalità riordino prodotti quando si cambia categoria!
    dashboardOperations.cancelReorderingProducts();
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

  // AGGIORNATO: ora riceve i dati dal form e li inoltra alla funzione di salvataggio
  const handleCategoryFormSave = async (
    values: { title: string; description?: string; is_active: boolean; id?: string }
  ) => {
    let catData = { ...values };
    if (editingCategory) {
      // Aggiungi id in caso di modifica
      catData = { ...catData, id: editingCategory.id };
    }
    await dashboardOperations.saveCategory(catData);
    setShowAddCategory(false);
    setEditingCategory(null);
  };

  // AGGIORNATO: ora ricarica tutti i dati della dashboard dopo il salvataggio
  const handleProductFormSave = async () => {
    console.log('handleProductFormSave called');

    // Prima cancella il riordino se attivo
    dashboardOperations.cancelReorderingProducts();

    // Poi ricarica i dati
    await dashboardOperations.loadData();

    // Riattiva il riordino dopo il caricamento
    if (dashboardOperations.products && dashboardOperations.products.length > 0) {
      dashboardOperations.startReorderingProducts();
    }

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
