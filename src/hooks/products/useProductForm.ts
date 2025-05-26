
import { useProductFormState } from "./useProductFormState";
import { useProductLabels } from "./useProductLabels";
import { useProductFormSubmit } from "./useProductFormSubmit";
import { Product, Allergen } from "@/types/database";
import { useProductFeatures } from "./useProductFeatures";
import { useState } from "react";

/**
 * product: prodotto pre-caricato (con eventuale allergen_ids, feature_ids)
 * allergens: lista di allergeni già caricata dal parent
 */
export const useProductForm = (
  product?: Product & { allergen_ids?: string[]; feature_ids?: string[] },
  categoryId?: string,
  allergens?: Allergen[],
  onSave?: () => void
) => {
  // Form base
  const { form, hasPriceSuffix, hasMultiplePrices } = useProductFormState(product);
  const { labels } = useProductLabels();
  const { handleSubmit: submitForm, isSubmitting } = useProductFormSubmit(onSave);

  // Stato caratteristiche prodotto (usando hook dedicato)
  const {
    features,
    selectedFeatures,
    setSelectedFeatures,
    isLoading: isLoadingFeatures
  } = useProductFeatures(product);

  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(product?.allergen_ids ?? []);

  // Submit con injection di stato allergeni/features
  const handleSubmit = async (values: any) => {
    if (categoryId && !values.category_id) {
      values.category_id = categoryId;
    }
    return await submitForm(
      values,
      selectedAllergens,
      selectedFeatures, // ora passiamo lo stato attuale delle features selezionate
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
    // --- Features (per ProductForm) ---
    selectedFeatureIds: selectedFeatures,
    setSelectedFeatureIds: setSelectedFeatures,
    loadingFeatures: isLoadingFeatures,
    // --- Allergeni ---
    selectedAllergenIds: selectedAllergens,
    setSelectedAllergenIds: setSelectedAllergens,
    loadingAllergens: false,
    allergens, // ora sempre disponibile come prop da passare direttamente
  };
};
