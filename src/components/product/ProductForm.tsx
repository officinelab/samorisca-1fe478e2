
import React from "react";
import { Form } from "@/components/ui/form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/database";
import { useProductForm } from "@/hooks/products/useProductForm";
import ProductBasicInfo from "./sections/ProductBasicInfo";
import ProductActionButtons from "./sections/ProductActionButtons";
import FeaturesSelector from "./FeaturesSelector";
import AllergenSelector from "./AllergenSelector";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ProductLabelSelect from "./sections/ProductLabelSelect";
import ProductPriceSection from "./sections/ProductPriceSection";

interface ProductFormProps {
  product?: Product;
  onSave?: () => void;
  onCancel?: () => void;
  categoryId?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel, categoryId }) => {
  // Prevent invalid state: do not proceed if something is deeply wrong
  if (typeof onSave !== "function" || typeof onCancel !== "function") {
    return (
      <div className="text-destructive p-6">
        Errore: il form non è stato inizializzato correttamente.
      </div>
    );
  }

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
    toggleFeature,
    loadingFeatures,
    allergens,
    selectedAllergenIds,
    setSelectedAllergenIds,
    toggleAllergen,
    loadingAllergens,
  } = useProductForm(product, categoryId, onSave);

  return (
    <div className="px-0 py-4 md:px-3 max-w-2xl mx-auto space-y-4 animate-fade-in">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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

          {/* Features (Caratteristiche) */}
          <FeaturesSelector
            selectedFeatureIds={selectedFeatureIds}
            onToggleFeature={toggleFeature}
          />

          {/* Sezione allergeni */}
          <AllergenSelector
            selectedAllergenIds={selectedAllergenIds}
            onToggleAllergen={toggleAllergen}
          />

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

