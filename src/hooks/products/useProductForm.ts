
import { useEffect, useState } from "react";
import { Product } from "@/types/database";
import { useProductFormState } from "./useProductFormState";
import { useProductLabels } from "./useProductLabels";
import { useProductAllergens } from "./useProductAllergens";
import { useProductFeatures } from "./useProductFeatures";
import { useProductFormSubmit } from "./useProductFormSubmit";

export const useProductForm = (product?: Product, categoryId?: string, onSave?: () => void) => {
  // Hook per il form e lo stato
  const { form, hasPriceSuffix, hasMultiplePrices } = useProductFormState(product);

  // Hook per le etichette
  const { labels } = useProductLabels();

  // Hook per gli allergeni/features solo per FETCH all'apertura prodotto
  const { selectedAllergens: initialAllergens } = useProductAllergens(product);
  const { selectedFeatures: initialFeatures } = useProductFeatures(product);

  // Stato locale indipendente di editing (allergeni/features)
  const [localAllergens, setLocalAllergens] = useState<string[]>(initialAllergens);
  const [localFeatures, setLocalFeatures] = useState<string[]>(initialFeatures);

  // Aggiorna stato locale SOLO se il prodotto cambia veramente
  useEffect(() => {
    setLocalAllergens(initialAllergens);
  }, [product?.id, initialAllergens.join(",")]);

  useEffect(() => {
    setLocalFeatures(initialFeatures);
  }, [product?.id, initialFeatures.join(",")]);

  // Hook per la gestione dell'invio del form
  const { handleSubmit: submitForm, isSubmitting } = useProductFormSubmit(onSave);

  // Gestore per l'invio del form
  const handleSubmit = async (values: any) => {
    // Se categoryId è fornito e non c'è category_id nei valori, lo impostiamo
    if (categoryId && !values.category_id) {
      values.category_id = categoryId;
    }
    return await submitForm(values, localAllergens, localFeatures, product?.id);
  };

  return {
    form,
    isSubmitting,
    labels,
    hasPriceSuffix,
    hasMultiplePrices,
    selectedAllergens: localAllergens,
    setSelectedAllergens: setLocalAllergens,
    selectedFeatures: localFeatures,
    setSelectedFeatures: setLocalFeatures,
    handleSubmit
  };
};
