
import { useState } from "react";
import { ProductFormValues } from "@/types/form";
import { useProductSubmit } from "./use-product-submit";

// Modifico qui la signature di onSave per accettare il parametro data
export const useProductFormSubmit = (onSave?: (data: any) => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { saveProduct } = useProductSubmit();

  const handleSubmit = async (
    values: ProductFormValues,
    selectedAllergens: string[],
    selectedFeatures: string[],
    productId?: string
  ) => {
    setIsSubmitting(true);

    try {
      // Salva il prodotto utilizzando l'hook useProductSubmit
      const result = await saveProduct(values, selectedAllergens, selectedFeatures, productId);

      if (result.success && onSave) {
        onSave(values); // invia i dati della form a onSave
      }

      return result;
    } catch (error: any) {
      console.error("Errore durante il salvataggio del prodotto:", error);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
