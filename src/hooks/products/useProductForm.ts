
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema, ProductFormValues } from "@/types/form";
import { Product } from "@/types/database";
import { productToFormValues } from "./product-form-utils";
import { useProductData } from "./use-product-data";
import { useProductSubmit } from "./use-product-submit";

// Main product form hook that combines the other hooks
export const useProductForm = (product?: Product, onSave?: (productData: Partial<Product>) => void) => {
  // Initialize the form with product data
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product 
      ? productToFormValues(product) 
      : {
          is_active: true,
          has_price_suffix: false,
          has_multiple_prices: false,
        }
  });
  
  const { watch } = form;
  const hasPriceSuffix = watch("has_price_suffix");
  const hasMultiplePrices = watch("has_multiple_prices");
  
  // Get product data (labels, allergens, features)
  const {
    labels,
    selectedAllergens,
    setSelectedAllergens,
    selectedFeatures,
    setSelectedFeatures
  } = useProductData(product);
  
  // Get product submission handler
  const {
    isSubmitting,
    handleSubmit
  } = useProductSubmit({
    product,
    onSave,
    selectedAllergens,
    selectedFeatures
  });

  return {
    form,
    isSubmitting,
    labels,
    hasPriceSuffix,
    hasMultiplePrices,
    selectedAllergens,
    setSelectedAllergens,
    selectedFeatures,
    setSelectedFeatures,
    handleSubmit
  };
};
