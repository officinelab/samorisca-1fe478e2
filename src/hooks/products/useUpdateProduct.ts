
import { useState } from "react";
import { useProductSubmit } from "./use-product-submit";
import { Product } from "@/types/database";
import { ProductFormValues } from "@/types/form";

export const useUpdateProduct = (product: Product, onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { saveProduct } = useProductSubmit();

  const updateProduct = async (
    values: ProductFormValues,
    selectedAllergenIds: string[],
    selectedFeatureIds: string[]
  ) => {
    setIsSubmitting(true);
    
    try {
      const result = await saveProduct(values, selectedAllergenIds, selectedFeatureIds, product.id);
      
      if (result.success && onSuccess) {
        onSuccess();
      }
      
      return result;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { updateProduct, isSubmitting };
};
