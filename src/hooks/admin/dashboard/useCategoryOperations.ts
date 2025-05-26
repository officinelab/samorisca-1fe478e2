
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/database";

export const useCategoryOperations = (
  categories: Category[],
  loadCategories: () => Promise<void>
) => {
  const [isReorderingCategories, setIsReorderingCategories] = useState(false);
  const [reorderingCategoriesList, setReorderingCategoriesList] = useState<Category[]>([]);

  const startReorderingCategories = () => {
    setIsReorderingCategories(true);
    setReorderingCategoriesList([...categories]);
  };

  const cancelReorderingCategories = () => {
    setIsReorderingCategories(false);
    setReorderingCategoriesList([]);
  };

  const moveCategoryInList = (categoryId: string, direction: 'up' | 'down') => {
    const currentIndex = reorderingCategoriesList.findIndex(c => c.id === categoryId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= reorderingCategoriesList.length) return;
    
    const updatedList = [...reorderingCategoriesList];
    [updatedList[currentIndex], updatedList[newIndex]] = [updatedList[newIndex], updatedList[currentIndex]];
    
    setReorderingCategoriesList(updatedList);
  };

  const saveReorderCategories = async () => {
    try {
      const updates = reorderingCategoriesList.map((category, index) => ({
        id: category.id,
        display_order: index + 1,
        title: category.title,
        description: category.description,
        image_url: category.image_url,
        is_active: category.is_active
      }));
      
      const { error } = await supabase
        .from('categories')
        .upsert(updates);
      
      if (error) throw error;
      
      await loadCategories();
      setIsReorderingCategories(false);
      setReorderingCategoriesList([]);
      
      toast.success("Ordine delle categorie aggiornato con successo!");
    } catch (error) {
      console.error('Error reordering categories:', error);
      toast.error("Errore nel riordinamento delle categorie. Riprova più tardi.");
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
      
      await loadCategories();
      toast.success("Categoria eliminata con successo!");
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error("Errore nell'eliminazione della categoria. Riprova più tardi.");
    }
  };

  // AGGIUNTA: salva nuova categoria (o aggiorna se ha id)
  const saveCategory = async (data: { title: string; description?: string; is_active: boolean; id?: string }) => {
    try {
      // Se c'è id aggiorna, altrimenti inserisce
      const upsertData = {
        ...(data.id ? { id: data.id } : {}),
        title: data.title,
        description: data.description ?? null,
        is_active: data.is_active
      };

      const { error } = await supabase.from('categories').upsert(upsertData);
      if (error) throw error;

      await loadCategories();
      toast.success(data.id ? "Categoria aggiornata!" : "Categoria creata!");
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error("Errore nel salvataggio della categoria. Riprova più tardi.");
    }
  };

  return {
    isReorderingCategories,
    reorderingCategoriesList,
    startReorderingCategories,
    cancelReorderingCategories,
    moveCategoryInList,
    saveReorderCategories,
    deleteCategory,
    saveCategory // export funzione
  };
};

