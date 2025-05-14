
import { Product } from "@/types/database";
import { useProductFormState } from "./useProductFormState";
import { useProductLabels } from "./useProductLabels";
import { useProductAllergens } from "./useProductAllergens";
import { useProductFeatures } from "./useProductFeatures";
import { useProductFormSubmit } from "./useProductFormSubmit";

export const useProductForm = (product?: Product, onSave?: () => void) => {
  // Hook per il form e lo stato
  const { form, hasPriceSuffix, hasMultiplePrices } = useProductFormState(product);
  
  // Hook per le etichette
  const { labels } = useProductLabels();
  
  // Hook per gli allergeni
  const { selectedAllergens, setSelectedAllergens } = useProductAllergens(product);
  
  // Hook per le caratteristiche
  const { selectedFeatures, setSelectedFeatures } = useProductFeatures(product);
  
  // Hook per la gestione dell'invio del form
  const { handleSubmit: submitForm, isSubmitting } = useProductFormSubmit(onSave);

  // Gestore per l'invio del form
  const handleSubmit = async (values: any) => {
    return await submitForm(values, selectedAllergens, selectedFeatures, product?.id);
  };

  return {
    form,
    isSubmitting,
    labels,
    hasPriceSuffix,
    hasMultiplePrices,
    selectedAllergens,
    setSelectedAllergens,
    selectedFeatures,
    setSelectedFeatures,
    handleSubmit
  };
};
