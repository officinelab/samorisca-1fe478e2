
import { useProductFormState } from "./useProductFormState";
import { useProductLabels } from "./useProductLabels";
import { useProductFormSubmit } from "./useProductFormSubmit";
import { Product } from "@/types/database";
import { useProductFeatures } from "./useProductFeatures";
import { useState } from "react";
// SEMPLIFICAZIONE: useProductAllergens non serve più fetch

export const useProductForm = (product?: Product & { allergen_ids?: string[], feature_ids?: string[] }, categoryId?: string, onSave?: () => void) => {
  // Form base
  const { form, hasPriceSuffix, hasMultiplePrices } = useProductFormState(product);
  const { labels } = useProductLabels();

  const { handleSubmit: submitForm, isSubmitting } = useProductFormSubmit(onSave);

  // Stato caratteristiche prodotto (puoi mantenere quello attuale, oppure anche qui usare product?.feature_ids se servisse gran uniformità)

  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(product?.allergen_ids ?? []);
  // NB: Se vuoi uniformare anche features, puoi fare come sotto:
  // const [selectedFeatures, setSelectedFeatures] = useState<string[]>(product?.feature_ids ?? []);
  // (Qui lasciamo eventuale gestione features invariata)

  // Submit con injection di stato allergeni/features
  const handleSubmit = async (values: any) => {
    if (categoryId && !values.category_id) {
      values.category_id = categoryId;
    }
    return await submitForm(
      values,
      selectedAllergens,
      product?.feature_ids ?? [], // NB: oppure selectedFeatures se decidi di uniformare anche per features
      product?.id
    );
  };

  return {
    form,
    isSubmitting,
    labels,
    hasPriceSuffix,
    hasMultiplePrices,
    handleSubmit,
    // features,  // <-- elimina se ora lo carichi a monte!
    selectedAllergenIds: selectedAllergens,
    setSelectedAllergenIds: setSelectedAllergens,
    loadingAllergens: false, // non serve più
  };
};
