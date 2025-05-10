
import { useState, useCallback } from "react";

export const useProductSelection = () => {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Select a product
  const selectProduct = useCallback((productId: string) => {
    setSelectedProductId(productId);
    setIsEditing(false);
  }, []);

  // Start editing a product
  const startEditingProduct = useCallback((productId: string | null) => {
    setSelectedProductId(productId);
    setIsEditing(true);
  }, []);

  return {
    selectedProductId,
    isEditing,
    setIsEditing,
    selectProduct,
    startEditingProduct
  };
};
