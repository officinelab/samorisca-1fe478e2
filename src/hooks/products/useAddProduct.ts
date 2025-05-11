
import { useState } from "react";
import { useProductSubmit } from "./use-product-submit";
import { ProductFormValues } from "@/types/form";

export const useAddProduct = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { saveProduct } = useProductSubmit();

  const addProduct = async (
    values: ProductFormValues,
    selectedAllergenIds: string[],
    selectedFeatureIds: string[]
  ) => {
    setIsSubmitting(true);
    
    try {
      const result = await saveProduct(values, selectedAllergenIds, selectedFeatureIds);
      
      if (result.success && onSuccess) {
        onSuccess();
      }
      
      return result;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { addProduct, isSubmitting };
};
