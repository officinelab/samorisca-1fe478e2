
import { useProductFormState } from "./useProductFormState";
import { useProductLabels } from "./useProductLabels";
import { useProductFormSubmit } from "./useProductFormSubmit";
import { Product } from "@/types/database";
import { useProductFeatures } from "./useProductFeatures";
import { useProductAllergens } from "./useProductAllergens";
import { useCallback } from "react";

export const useProductForm = (product?: Product, categoryId?: string, onSave?: () => void) => {
  const { form, hasPriceSuffix, hasMultiplePrices } = useProductFormState(product);
  const { labels } = useProductLabels();
  const { handleSubmit: submitForm, isSubmitting } = useProductFormSubmit(onSave);

  const {
    features,
    selectedFeatures,
    setSelectedFeatures,
    isLoading: loadingFeatures,
  } = useProductFeatures(product);

  const {
    allergens,
    selectedAllergens,
    setSelectedAllergens,
    isLoading: loadingAllergens,
  } = useProductAllergens(product);

  // Memoizza i setter per evitare re-render inutili
  const setSelectedFeatureIds = useCallback(
    (ids: string[] | ((prev: string[]) => string[])) => setSelectedFeatures(ids),
    [setSelectedFeatures]
  );

  const setSelectedAllergenIds = useCallback(
    (ids: string[] | ((prev: string[]) => string[])) => setSelectedAllergens(ids),
    [setSelectedAllergens]
  );

  // Submit con injection di stato features/allergeni
  const handleSubmit = async (values: any) => {
    if (categoryId && !values.category_id) {
      values.category_id = categoryId;
    }
    return await submitForm(
      values, 
      selectedAllergens,
      selectedFeatures,
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
    features,
    selectedFeatureIds: selectedFeatures,
    setSelectedFeatureIds,
    loadingFeatures,
    allergens,
    selectedAllergenIds: selectedAllergens,
    setSelectedAllergenIds,
    loadingAllergens,
  };
};
