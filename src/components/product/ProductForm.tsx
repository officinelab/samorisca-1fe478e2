import React from "react";
import { Form } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/database";
import { useProductForm } from "@/hooks/products/useProductForm";
import ProductBasicInfo from "./sections/ProductBasicInfo";
import ProductActionButtons from "./sections/ProductActionButtons";
import ProductFeaturesCheckboxes from "./ProductFeaturesCheckboxes";
import ProductAllergensCheckboxes from "./ProductAllergensCheckboxes";
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
  // DEBUG: render count/output
  const [renderCount, setRenderCount] = React.useState(0);
  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
    console.log(`ProductForm render #${renderCount + 1}`, {
      productId: typeof product !== 'undefined' ? product?.id : undefined,
      hasProduct: !!product,
    });

    if (renderCount > 50) {
      console.error('TOO MANY RENDERS - STOPPING');
      return;
    }
  }, []);

  const {
    form,
    isSubmitting,
    labels,
    hasPriceSuffix,
    hasMultiplePrices,
    handleSubmit,
    features,
    selectedFeatureIds,
    setSelectedFeatureIds,
    loadingFeatures,
    allergens,
    selectedAllergenIds,
    setSelectedAllergenIds,
    loadingAllergens,
  } = useProductForm(product, categoryId);

  // DEBUG aggiuntivo richiesto
  React.useEffect(() => {
    console.log('ProductForm mount/update debug:', {
      productId: product?.id,
      formValues: form.getValues(),
      selectedFeatureIds,
      selectedAllergenIds,
    });
  }, [product?.id, selectedFeatureIds.length, selectedAllergenIds.length]);

  React.useEffect(() => {
    return () => {
      console.log('ProductForm unmounting for product:', product?.id);
    };
  }, [product?.id]);

  console.log('ProductForm render:', {
    productId: product?.id,
    hasProduct: !!product,
    featuresLength: selectedFeatureIds.length,
    allergensLength: selectedAllergenIds.length
  });

  // Questi array sono sempre sicuri ora
  const safeSelectedFeatureIds = Array.isArray(selectedFeatureIds) ? selectedFeatureIds : [];
  const safeSelectedAllergenIds = Array.isArray(selectedAllergenIds) ? selectedAllergenIds : [];

  const handleSave = async (formValues: any) => {
    await handleSubmit(formValues);
    if (onSave) onSave();
  };

  const handleSaveRaw = async () => {
    const formValues = form.getValues();
    await handleSave(formValues);
    if (onSave) onSave();
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

          {/* Sezione caratteristiche */}
          <Card>
            <CardContent className="p-0 border-0 shadow-none">
              <ProductFeaturesCheckboxes
                features={features}
                selectedFeatureIds={Array.isArray(selectedFeatureIds) ? selectedFeatureIds : []}
                setSelectedFeatureIds={setSelectedFeatureIds}
                loading={loadingFeatures}
              />
            </CardContent>
          </Card>

          {/* Sezione allergeni */}
          <Card>
            <CardContent className="p-0 border-0 shadow-none">
              <ProductAllergensCheckboxes
                allergens={allergens}
                selectedAllergenIds={Array.isArray(selectedAllergenIds) ? selectedAllergenIds : []}
                setSelectedAllergenIds={setSelectedAllergenIds}
                loading={loadingAllergens}
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
