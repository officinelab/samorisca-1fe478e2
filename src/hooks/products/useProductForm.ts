import { useProductFormState } from "./useProductFormState";
import { useProductLabels } from "./useProductLabels";
import { useProductFormSubmit } from "./useProductFormSubmit";
import { Product } from "@/types/database";
import { useProductFeaturesCheckboxes } from "./useProductFeaturesCheckboxes";
import { useProductAllergensCheckboxes } from "./useProductAllergensCheckboxes";

export const useProductForm = (product?: Product, categoryId?: string, onSave?: () => void) => {
  // Form base
  const { form, hasPriceSuffix, hasMultiplePrices } = useProductFormState(product);
  const { labels } = useProductLabels();

  const { handleSubmit: submitForm, isSubmitting } = useProductFormSubmit(onSave);

  // Stato locale caratteristiche e allergeni tramite i nuovi hooks
  const {
    features,
    selectedFeatureIds,
    setSelectedFeatureIds,
    toggleFeature,
    loading: loadingFeatures,
  } = useProductFeaturesCheckboxes(product?.id);

  const {
    allergens,
    selectedAllergenIds,
    setSelectedAllergenIds,
    toggleAllergen,
    loading: loadingAllergens,
  } = useProductAllergensCheckboxes(product?.id);

  // Intercetta il submit e invia i dati delle features/allergeni selezionati
  const handleSubmit = async (values: any) => {
    // Inietta la category se manca
    if (categoryId && !values.category_id) {
      values.category_id = categoryId;
    }
    // Passa state aggiornato!
    return await submitForm(
      values, // form
      selectedAllergenIds,
      selectedFeatureIds,
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
    // Per accesso in ProductForm
    features,
    selectedFeatureIds,
    setSelectedFeatureIds,
    toggleFeature,
    loadingFeatures,
    allergens,
    selectedAllergenIds,
    setSelectedAllergenIds,
    toggleAllergen,
    loadingAllergens,
  };
};
