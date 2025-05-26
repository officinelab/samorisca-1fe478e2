import React from "react";
import { Form } from "@/components/ui/form";
import { Product } from "@/types/database";
import { useProductForm } from "@/hooks/products/useProductForm";

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
  console.log('ProductForm WITH FORM WRAPPER render', product?.id);
  
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

  return (
    <div>
      <h1>TEST FORM con Form Wrapper - Product ID: {product?.id || 'NEW'}</h1>
      <Form {...form}>
        <form>
          <p>Form wrapper attivo</p>
          <p>Features: {features.length} (Selected: {selectedFeatureIds.length})</p>
          <p>Allergens: {allergens.length} (Selected: {selectedAllergenIds.length})</p>
        </form>
      </Form>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default ProductForm;
