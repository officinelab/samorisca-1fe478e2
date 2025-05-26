
import { useProductFormState } from "./useProductFormState";
import { useProductLabels } from "./useProductLabels";
import { useProductFormSubmit } from "./useProductFormSubmit";
import { Product } from "@/types/database";
import { useProductFeatures } from "./useProductFeatures";
import { useProductAllergens } from "./useProductAllergens";

export const useProductForm = (product?: Product, categoryId?: string, onSave?: () => void) => {
  // Form base
  const { form, hasPriceSuffix, hasMultiplePrices } = useProductFormState(product);
  const { labels } = useProductLabels();

  const { handleSubmit: submitForm, isSubmitting } = useProductFormSubmit(onSave);

  // Caratteristiche prodotto (stato semplice, NO toggle, NO useEffect per sync)
  const {
    selectedFeatures,
    setSelectedFeatures,
    isLoading: loadingFeatures,
  } = useProductFeatures(product);

  const {
    selectedAllergens,
    setSelectedAllergens,
    isLoading: loadingAllergens,
  } = useProductAllergens(product);

  // Submit con injection di stato features/allergeni
  const handleSubmit = async (values: any) => {
    // Inietta la category se manca
    if (categoryId && !values.category_id) {
      values.category_id = categoryId;
    }
    // Passa state aggiornato!
    return await submitForm(
      values, // form
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
    // Per accesso in ProductForm
    features: [], // le features vengono caricate nei componenti, non qui
    selectedFeatureIds: selectedFeatures,
    setSelectedFeatureIds: setSelectedFeatures,
    loadingFeatures,
    allergens: [], // gli allergeni vengono caricati nei componenti, non qui
    selectedAllergenIds: selectedAllergens,
    setSelectedAllergenIds: setSelectedAllergens,
    loadingAllergens,
  };
};
