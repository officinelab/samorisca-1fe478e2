
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

  const handleSave = async (formValues: any) => {
    await handleSubmit(formValues);
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
