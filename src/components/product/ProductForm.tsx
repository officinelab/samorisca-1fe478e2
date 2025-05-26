import React, { useCallback, useMemo } from "react";
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
  onSave?: () => void;
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
    selectedAllergens,
    setSelectedAllergens,
    selectedFeatures,
    setSelectedFeatures,
    handleSubmit,
  } = useProductForm(product, categoryId, onSave);

  // MEMO version to block new reference loops
  const memoSelectedAllergens = useMemo(() => selectedAllergens, [selectedAllergens]);
  const memoSelectedFeatures = useMemo(() => selectedFeatures, [selectedFeatures]);

  // Evita ciclo: chiama set solo se effettivamente diverso
  const handleAllergensChange = useCallback(
    (newAllergens: string[]) => {
      if (arraysAreDifferent(newAllergens, memoSelectedAllergens)) {
        setSelectedAllergens(newAllergens);
      }
    },
    [setSelectedAllergens, memoSelectedAllergens]
  );
  const handleFeaturesChange = useCallback(
    (newFeatures: string[]) => {
      if (arraysAreDifferent(newFeatures, memoSelectedFeatures)) {
        setSelectedFeatures(newFeatures);
      }
    },
    [setSelectedFeatures, memoSelectedFeatures]
  );

  return (
    <div className="px-0 py-4 md:px-3 max-w-2xl mx-auto space-y-4 animate-fade-in">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
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

          {/* Caratteristiche */}
          <Card>
            <CardContent className="p-0 border-0 shadow-none">
              <FeaturesSelector
                selectedFeatureIds={memoSelectedFeatures}
                onChange={handleFeaturesChange}
              />
            </CardContent>
          </Card>

          {/* Allergeni */}
          <Card>
            <CardContent className="p-0 border-0 shadow-none">
              <AllergenSelector
                selectedAllergenIds={memoSelectedAllergens}
                onChange={handleAllergensChange}
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
