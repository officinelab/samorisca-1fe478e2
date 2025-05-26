import React from "react";
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
  console.log('ProductForm WITH HOOK render', product?.id);
  
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
  
  console.log('Hook data:', {
    featuresCount: features.length,
    selectedFeatures: selectedFeatureIds.length,
    allergensCount: allergens.length,
    selectedAllergens: selectedAllergenIds.length
  });

  return (
    <div>
      <h1>TEST FORM con Hook - Product ID: {product?.id || 'NEW'}</h1>
      <p>Features: {features.length} (Selected: {selectedFeatureIds.length})</p>
      <p>Allergens: {allergens.length} (Selected: {selectedAllergenIds.length})</p>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default ProductForm;
