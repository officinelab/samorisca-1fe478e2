
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

  // Caratteristiche prodotto (vecchio stile, con fetch e stato completo)
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
    features,  // <--- ADESSO ARRAY REALE DA HOOK
    selectedFeatureIds: selectedFeatures, // <--- NOME UNIFORME
    setSelectedFeatureIds: setSelectedFeatures,
    loadingFeatures,
    allergens, // <--- ADESSO ARRAY REALE DA HOOK
    selectedAllergenIds: selectedAllergens, // <--- NOME UNIFORME
    setSelectedAllergenIds: setSelectedAllergens,
    loadingAllergens,
  };
};
