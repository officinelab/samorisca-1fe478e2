
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { ProductFormData, productFormSchema } from "@/types/form";
import { useProductForm } from "@/hooks/products/useProductForm";
import { ProductFormHeader } from "./sections/ProductFormHeader";
import { ProductFormContent } from "./sections/ProductFormContent";
import { ProductActionButtons } from "./sections/ProductActionButtons";
import { useProductFormData } from "./hooks/useProductFormData";

interface ProductFormProps {
  product?: any;
  onBack: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onBack }) => {
  const isEditing = Boolean(product);
  
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price_standard: 0,
      price_variant_1_name: "",
      price_variant_1_value: 0,
      price_variant_2_name: "",
      price_variant_2_value: 0,
      price_suffix: "",
      has_multiple_prices: false,
      has_price_suffix: false,
      image_url: "",
      category_id: "",
      label_id: "",
      is_active: true,
      display_order: 0,
    },
  });

  const {
    categories,
    allergens,
    features,
    selectedAllergens,
    setSelectedAllergens,
    selectedFeatures,
    setSelectedFeatures,
    handleSubmit,
    isSubmitting,
  } = useProductForm({ 
    product, 
    onBack, 
    form 
  });

  useProductFormData({
    product,
    reset: form.reset,
    setValue: form.setValue,
    setSelectedAllergens,
    setSelectedFeatures,
    allergens,
    features,
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ProductFormHeader isEditing={isEditing} onBack={onBack} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <ProductFormContent
                control={form.control}
                setValue={form.setValue}
                watch={form.watch}
                selectedAllergens={selectedAllergens}
                onAllergensChange={setSelectedAllergens}
                selectedFeatures={selectedFeatures}
                onFeaturesChange={setSelectedFeatures}
              />
            </CardContent>
          </Card>
          
          <ProductActionButtons 
            onBack={onBack}
            isSubmitting={isSubmitting}
            isEditing={isEditing}
          />
        </form>
      </Form>
    </div>
  );
};
