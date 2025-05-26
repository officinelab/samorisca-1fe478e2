
import { useProductFormState } from "./useProductFormState";
import { useProductLabels } from "./useProductLabels";
import { useProductFormSubmit } from "./useProductFormSubmit";
import { Product } from "@/types/database";

export const useProductForm = (product?: Product, categoryId?: string, onSave?: () => void) => {
  // Form base
  const { form, hasPriceSuffix, hasMultiplePrices } = useProductFormState(product);
  const { labels } = useProductLabels();

  const { handleSubmit: submitForm, isSubmitting } = useProductFormSubmit(onSave);

  const handleSubmit = async (values: any) => {
    // categoryId da parent? lo iniettiamo se manca
    if (categoryId && !values.category_id) {
      values.category_id = categoryId;
    }
    return await submitForm(values, values.allergens ?? [], values.features ?? [], product?.id);
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
