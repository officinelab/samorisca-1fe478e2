import { useProductFormState } from "./useProductFormState";
import { useProductLabels } from "./useProductLabels";
import { useProductFormSubmit } from "./useProductFormSubmit";
import { Product } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

export const useProductForm = (product?: Product, categoryId?: string, onSave?: () => void) => {
  // Form base
  const { form, hasPriceSuffix, hasMultiplePrices } = useProductFormState(product);
  const { labels } = useProductLabels();

  const { handleSubmit: submitForm, isSubmitting } = useProductFormSubmit(onSave);

  // Nuova logica di submit: salva relazioni features/allergeni
  const handleSubmit = async (values: any) => {
    if (categoryId && !values.category_id) {
      values.category_id = categoryId;
    }

    // Salva prodotto base
    const result = await submitForm(values, [], [], product?.id);

    if (!result.success || !result.data) return result;

    // Prendi productId (nuovo o esistente)
    const prodId = result.data.id || product?.id;

    // Salva relazioni product_to_features
    if ("features" in values) {
      await supabase
        .from("product_to_features")
        .delete()
        .eq("product_id", prodId);
      if (Array.isArray(values.features) && values.features.length > 0) {
        await supabase.from("product_to_features").insert(
          values.features.map((f: string) => ({
            product_id: prodId, feature_id: f,
          }))
        );
      }
    }

    // Salva relazioni product_allergens
    if ("allergens" in values) {
      await supabase
        .from("product_allergens")
        .delete()
        .eq("product_id", prodId);
      if (Array.isArray(values.allergens) && values.allergens.length > 0) {
        await supabase.from("product_allergens").insert(
          values.allergens.map((a: string) => ({
            product_id: prodId, allergen_id: a,
          }))
        );
      }
    }
    return result;
  };

  return {
    form,
    isSubmitting,
    labels,
    hasPriceSuffix,
    hasMultiplePrices,
    handleSubmit,
  };
};
