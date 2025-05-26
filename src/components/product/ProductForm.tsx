import React from "react";
import { Form } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/database";
import { useProductFormState } from "@/hooks/products/useProductFormState";
import ProductBasicInfo from "./sections/ProductBasicInfo";
import ProductActionButtons from "./sections/ProductActionButtons";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ProductLabelSelect from "./sections/ProductLabelSelect";
import ProductPriceSection from "./sections/ProductPriceSection";
import { useProductFormSubmit } from "@/hooks/products/useProductFormSubmit";
import { useAllergens } from "@/hooks/allergens/useAllergens";
import { useProductAllergens } from "@/hooks/products/useProductAllergens";
import { useProductFeatures } from "@/hooks/products/useProductFeatures";
import { useProductLabels } from "@/hooks/products/useProductLabels";
import AllergenSelector from "./AllergenSelector";
import FeaturesSelector from "./FeaturesSelector";

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
  // Dati di base del form
  const { form, hasPriceSuffix, hasMultiplePrices } = useProductFormState(product);
  const { labels } = useProductLabels();

  // Allergen logic "vecchia scuola"
  const { allergens: allergenOptions, isLoading: loadingAllergens } = useAllergens();
  const {
    selectedAllergens,
    setSelectedAllergens,
    isLoading: loadingSelectedAllergens,
  } = useProductAllergens(product);

  // Features logic "vecchia scuola"
  const {
    selectedFeatures,
    setSelectedFeatures,
    isLoading: loadingSelectedFeatures,
  } = useProductFeatures(product);

  // Submit handler: aggiorna DB per allergeni/features solo qui
  const { handleSubmit, isSubmitting } = useProductFormSubmit(onSave);

  // wrapper per la submit
  const handleSave = async (formValues: any) => {
    await handleSubmit(
      formValues,
      selectedAllergens,
      selectedFeatures,
      product?.id
    );
  };

  return (
    <div className="px-0 py-4 md:px-3 max-w-2xl mx-auto space-y-4 animate-fade-in">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
          {/* Informazioni Base */}
          <Card className="overflow-visible">
            <CardHeader>
              <CardTitle className="text-lg">Informazioni di Base</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductBasicInfo form={form} />
              <ProductPriceSection
                form={form}
                labels={labels}
                hasPriceSuffix={hasPriceSuffix}
                hasMultiplePrices={hasMultiplePrices}
              />
            </CardContent>
          </Card>

          {/* Sezione caratteristiche (Features) */}
          <Card>
            <CardContent className="p-0 border-0 shadow-none">
              <FeaturesSelector
                selectedFeatureIds={selectedFeatures}
                onToggleFeature={(fId) => {
                  if (selectedFeatures.includes(fId)) {
                    setSelectedFeatures(selectedFeatures.filter((id) => id !== fId));
                  } else {
                    setSelectedFeatures([...selectedFeatures, fId]);
                  }
                }}
              />
            </CardContent>
          </Card>

          {/* Sezione allergeni */}
          <Card>
            <CardContent className="p-0 border-0 shadow-none">
              <AllergenSelector
                selectedAllergenIds={selectedAllergens}
                onToggleAllergen={(aId) => {
                  if (selectedAllergens.includes(aId)) {
                    setSelectedAllergens(selectedAllergens.filter((id) => id !== aId));
                  } else {
                    setSelectedAllergens([...selectedAllergens, aId]);
                  }
                }}
              />
            </CardContent>
          </Card>

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
