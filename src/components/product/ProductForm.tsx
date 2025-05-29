
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
import ProductPriceSection from "./sections/ProductPriceSection";

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

  // Nuovo handleSave con debug dettagliati
  const handleSave = async (formValues: any) => {
    console.log('=== PRODUCT FORM SAVE DEBUG ===');
    console.log('1. Starting save with values:', formValues);
  
    try {
      const result = await handleSubmit(formValues);
      console.log('2. handleSubmit result:', result);
      
      if (result && result.success) {
        console.log('3. Save successful, calling onSave');
        if (onSave) {
          console.log('4. onSave exists, calling it');
          await onSave();
          console.log('5. onSave completed');
        } else {
          console.log('4. ERROR: onSave is not defined!');
        }
      } else {
        console.log('3. Save failed or no success flag');
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <Form {...form}>
        {/* Campo nascosto per category_id se viene passata come prop */}
        {categoryId && !product && (
          <input 
            type="hidden" 
            {...form.register('category_id')} 
            value={categoryId} 
          />
        )}
        <form onSubmit={form.handleSubmit(handleSave)} className="flex flex-col h-full">
          {/* Contenuto scrollabile */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
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
                  selectedFeatureIds={selectedFeatureIds}
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
                  selectedAllergenIds={selectedAllergenIds}
                  setSelectedAllergenIds={setSelectedAllergenIds}
                  loading={loadingAllergens}
                />
              </CardContent>
            </Card>

            <Separator className="my-4" />
          </div>

          {/* Pulsanti fissi in basso */}
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
