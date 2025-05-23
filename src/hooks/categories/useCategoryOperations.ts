
import { useState } from "react";
import { Category } from "@/types/database";
import { toast } from "@/hooks/use-toast";

export const useCategoryOperations = (initialCategories: Category[] = []) => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const handleReorderCategory = (categoryId: string, direction: 'up' | 'down') => {
    const currentIndex = categories.findIndex(cat => cat.id === categoryId);
    if (currentIndex === -1) return;

    const newCategories = [...categories];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= newCategories.length) return;

    // Scambia le posizioni
    [newCategories[currentIndex], newCategories[targetIndex]] = 
    [newCategories[targetIndex], newCategories[currentIndex]];

    setCategories(newCategories);
    toast({
      title: "Categoria spostata",
      description: `La categoria è stata spostata ${direction === 'up' ? 'in alto' : 'in basso'}.`,
    });
  };

  const handleEditCategory = (category: Category) => {
    console.log("Modifica categoria:", category);
    // Qui andrà la logica per aprire il dialog di modifica
    toast({
      title: "Modifica categoria",
      description: `Apertura modifica per: ${category.title}`,
    });
  };

  const handleDeleteCategory = (categoryId: string) => {
    const categoryToDelete = categories.find(cat => cat.id === categoryId);
    if (!categoryToDelete) return;

    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast({
      title: "Categoria eliminata",
      description: `La categoria "${categoryToDelete.title}" è stata eliminata.`,
    });
  };

  return {
    categories,
    setCategories,
    handleReorderCategory,
    handleEditCategory,
    handleDeleteCategory,
  };
};
