
import { useState } from "react";
import { Allergen } from "@/types/database";
import { addAllergen, updateAllergen, deleteAllergen } from "./allergensService";

export const useAllergenDialogs = (allergens: Allergen[], setAllergens: React.Dispatch<React.SetStateAction<Allergen[]>>) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingAllergen, setEditingAllergen] = useState<Allergen | null>(null);

  // Handle adding a new allergen
  const handleAddAllergen = async (allergenData: Partial<Allergen>) => {
    const newAllergen = await addAllergen(allergenData, allergens);
    if (newAllergen) {
      setAllergens([...allergens, newAllergen]);
      setShowAddDialog(false);
    }
  };

  // Handle updating an existing allergen
  const handleUpdateAllergen = async (allergenId: string, allergenData: Partial<Allergen>) => {
    const success = await updateAllergen(allergenId, allergenData);
    if (success) {
      // Update local state
      setAllergens(allergens.map(a => 
        a.id === allergenId ? { ...a, ...allergenData } : a
      ));
      setEditingAllergen(null);
    }
  };

  // Handle deleting an allergen
  const handleDeleteAllergen = async (allergenId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo allergene? Verrà rimosso da tutti i prodotti associati.")) {
      return;
    }
    
    const success = await deleteAllergen(allergenId);
    if (success) {
      // Update local state by removing the deleted allergen
      setAllergens(allergens.filter(a => a.id !== allergenId));
    }
  };

  return {
    showAddDialog,
    setShowAddDialog,
    editingAllergen,
    setEditingAllergen,
    handleAddAllergen,
    handleUpdateAllergen,
    handleDeleteAllergen
  };
};
