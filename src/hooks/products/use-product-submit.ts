
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/types/database";
import { ProductFormValues, formValuesToProduct } from "@/types/form";
import { UseFormReturn } from "react-hook-form";

interface UseProductSubmitProps {
  product?: Product;
  onSave?: (productData: Partial<Product>) => void;
  selectedAllergens: string[];
  selectedFeatures: string[];
  form: UseFormReturn<ProductFormValues>;
}

/**
 * Hook to handle product form submission
 */
export const useProductSubmit = ({ 
  product, 
  onSave, 
  selectedAllergens, 
  selectedFeatures,
  form
}: UseProductSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (values: ProductFormValues) => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    console.log("Iniziando il salvataggio del prodotto", { values, selectedAllergens, selectedFeatures });
    setIsSubmitting(true);
    
    try {
      // Convert form values to product data
      const productData = formValuesToProduct(values, product?.id);
      
      // Add allergens and features to the product data
      const completeProductData = {
        ...productData,
        allergens: selectedAllergens.map(id => ({ id })),
        features: selectedFeatures.map(id => ({ id }))
      };
      
      if (onSave) {
        // Pass the completed product data to the onSave callback
        console.log("Passing complete product data to onSave:", completeProductData);
        await onSave(completeProductData);
        
        // Since onSave will handle everything, we don't need to do anything else here
        toast.success(product?.id ? "Prodotto aggiornato con successo" : "Prodotto creato con successo");
        form.reset(product ? productToFormValues(product as Product) : undefined);
      } else {
        // Direct database handling if no onSave is provided
        console.warn("No onSave provided to useProductSubmit, this should not happen");
        toast.error("Errore: funzione di salvataggio non configurata");
      }
    } catch (error: any) {
      console.error("Errore durante il salvataggio del prodotto:", error);
      toast.error(`Errore: ${error.message || "Si è verificato un errore durante il salvataggio"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
};

// Imported from product-form-utils to avoid circular dependency
function productToFormValues(product: Product): ProductFormValues {
  return {
    title: product.title || "",
    description: product.description || "",
    category_id: product.category_id || "",
    image_url: product.image_url || "",
    label_id: product.label_id || "",
    price_standard: product.price_standard?.toString() || "",
    has_price_suffix: Boolean(product.has_price_suffix),
    price_suffix: product.price_suffix || "",
    has_multiple_prices: Boolean(product.has_multiple_prices),
    price_variant_1_name: product.price_variant_1_name || "",
    price_variant_1_value: product.price_variant_1_value?.toString() || "",
    price_variant_2_name: product.price_variant_2_name || "",
    price_variant_2_value: product.price_variant_2_value?.toString() || "",
    is_active: product.is_active !== undefined ? product.is_active : true,
  };
}
