
import { useState } from "react";
import { Allergen } from "@/types/database";
import { updateAllergensOrder } from "./allergensService";

export const useAllergenReordering = (allergens: Allergen[], setAllergens: React.Dispatch<React.SetStateAction<Allergen[]>>) => {
  const [isReordering, setIsReordering] = useState(false);
  const [reorderingList, setReorderingList] = useState<Allergen[]>([]);

  // Start reordering mode
  const startReordering = () => {
    setIsReordering(true);
    setReorderingList([...allergens]);
  };

  // Cancel reordering
  const cancelReordering = () => {
    setIsReordering(false);
  };

  // Move an allergen in the reordering list
  const moveAllergen = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === reorderingList.length - 1)
    ) {
      return;
    }

    const newList = [...reorderingList];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    setReorderingList(newList);
  };

  // Save the new order
  const handleReorderAllergens = async () => {
    // Update the numbers and display_order values
    const updatedAllergens = reorderingList.map((allergen, index) => ({
      ...allergen,
      number: index + 1,
      display_order: index
    }));
    
    // Update in the database
    const success = await updateAllergensOrder(updatedAllergens);
    
    if (success) {
      // Update local state
      setAllergens(updatedAllergens);
      setIsReordering(false);
    }
  };

  return {
    isReordering,
    reorderingList,
    startReordering,
    cancelReordering,
    moveAllergen,
    handleReorderAllergens
  };
};
