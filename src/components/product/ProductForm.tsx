
import React, { useCallback, useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/database";
import { useProductForm } from "@/hooks/products/useProductForm";
import ProductBasicInfo from "./sections/ProductBasicInfo";
import ProductActionButtons from "./sections/ProductActionButtons";
import AllergenSelector from "./AllergenSelector";
import FeaturesSelector from "./FeaturesSelector";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ProductLabelSelect from "./sections/ProductLabelSelect";
import ProductPriceSection from "./sections/ProductPriceSection";

// Funzione helper per evitare loop
function arraysAreDifferent(a: string[], b: string[]) {
  if (a.length !== b.length) return true;
  const sa = [...a].sort();
  const sb = [...b].sort();
  for (let i = 0; i < sa.length; i++) {
    if (sa[i] !== sb[i]) return true;
  }
  return false;
}

interface ProductFormProps {
  product?: Product;
  categoryId?: string;
  onSave?: (valuesOverride?: any) => void;
  onCancel?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categoryId,
  onSave,
  onCancel,
}) => {
  const {
    form,
    isSubmitting,
    labels,
    hasPriceSuffix,
    hasMultiplePrices,
    // selectedAllergens,
    // setSelectedAllergens,
    // selectedFeatures,
    // setSelectedFeatures,
    handleSubmit,
  } = useProductForm(product, categoryId);

  // ---------- Stato locale per Allergen/Features selezionati ----------
  // Inizializza locale solo al mount/cambio prodotto
  const [localAllergens, setLocalAllergens] = useState<string[]>(product?.allergens?.map(a => a.id) ?? []);
  const [localFeatures, setLocalFeatures] = useState<string[]>(product?.features?.map(f => f.id) ?? []);
  useEffect(() => {
    setLocalAllergens(product?.allergens?.map(a => a.id) ?? []);
    setLocalFeatures(product?.features?.map(f => f.id) ?? []);
  }, [product?.id]);
  // --------------------------------------------------------------------

  // Handler per cambiare allergene solo localmente
  const handleAllergenToggle = useCallback((allergenId: string) => {
    setLocalAllergens(prev =>
      prev.includes(allergenId)
        ? prev.filter(id => id !== allergenId)
        : [...prev, allergenId]
    );
  }, []);

  // Handler per cambiare feature solo localmente
  const handleFeatureToggle = useCallback((featureId: string) => {
    setLocalFeatures(prev =>
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  }, []);

  // Gestore submit che invia ANCHE i dati di allergeni/features
  const handleSave = async (formValues: any) => {
    await handleSubmit({
      ...formValues,
      allergens: localAllergens,
      features: localFeatures,
    });
    // Inoltra anche al parent, se richiesto
    if (onSave) {
      onSave({
        ...product,
        ...formValues,
        allergens: localAllergens,
        features: localFeatures,
      });
    }
  };

  return (
    <div className="px-0 py-4 md:px-3 max-w-2xl mx-auto space-y-4 animate-fade-in">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSave)}
          className="space-y-6"
        >
          {/* Informazioni Base */}
          <Card className="overflow-visible">
            <CardHeader>
              <CardTitle className="text-lg">Informazioni di Base</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductBasicInfo form={form} />
              {/* --- SEZIONE PREZZI --- */}
              <ProductPriceSection
                form={form}
                labels={labels}
                hasPriceSuffix={hasPriceSuffix}
                hasMultiplePrices={hasMultiplePrices}
              />
            </CardContent>
          </Card>

          {/* Caratteristiche (stato locale!) */}
          <Card>
            <CardContent className="p-0 border-0 shadow-none">
              <FeaturesSelector
                selectedFeatureIds={localFeatures}
                onToggleFeature={handleFeatureToggle}
              />
            </CardContent>
          </Card>

          {/* Allergeni (stato locale!) */}
          <Card>
            <CardContent className="p-0 border-0 shadow-none">
              <AllergenSelector
                selectedAllergenIds={localAllergens}
                onToggleAllergen={handleAllergenToggle}
              />
            </CardContent>
          </Card>

          {/* Azioni */}
          <Separator className="my-4" />
          <ProductActionButtons
            isSubmitting={isSubmitting}
            onCancel={onCancel}
          />
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;
