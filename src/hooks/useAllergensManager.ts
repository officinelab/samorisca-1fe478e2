
import { Allergen } from "@/types/database";
import { useAllergensList } from "./allergens/useAllergensList";
import { useAllergenDialogs } from "./allergens/useAllergenDialogs";
import { useAllergenReordering } from "./allergens/useAllergenReordering";

export interface AllergenFormData {
  number?: number;
  title: string;
  description: string | null;
  icon_url: string | null;
}

export const useAllergensManager = () => {
  // Get allergens list and loading state
  const { allergens, setAllergens, isLoading } = useAllergensList();
  
  // Dialog management and CRUD operations
  const {
    showAddDialog,
    setShowAddDialog,
    editingAllergen,
    setEditingAllergen,
    handleAddAllergen,
    handleUpdateAllergen,
    handleDeleteAllergen
  } = useAllergenDialogs(allergens, setAllergens);
  
  // Reordering functionality
  const {
    isReordering,
    reorderingList,
    startReordering,
    cancelReordering,
    moveAllergen,
    handleReorderAllergens
  } = useAllergenReordering(allergens, setAllergens);

  return {
    // List and state
    allergens,
    isLoading,
    
    // Dialog state
    showAddDialog,
    setShowAddDialog,
    editingAllergen,
    setEditingAllergen,
    
    // CRUD operations
    handleAddAllergen,
    handleUpdateAllergen,
    handleDeleteAllergen,
    
    // Reordering
    isReordering,
    reorderingList,
    handleReorderAllergens,
    startReordering,
    cancelReordering,
    moveAllergen
  };
};
