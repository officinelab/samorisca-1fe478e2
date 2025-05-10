
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/types/database";
import { ProductFormValues, formValuesToProduct } from "@/types/form";

interface UseProductSubmitProps {
  product?: Product;
  onSave?: (productData: Partial<Product>) => void;
  selectedAllergens: string[];
  selectedFeatures: string[];
}

/**
 * Hook to handle product form submission
 */
export const useProductSubmit = ({ 
  product, 
  onSave, 
  selectedAllergens, 
  selectedFeatures 
}: UseProductSubmitProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (values: ProductFormValues) => {
    if (isSubmitting) return; // Prevent multiple submissions
    
    setIsSubmitting(true);
    
    try {
      // Convert form values to product data
      const productData = formValuesToProduct(values, product?.id);
      
      // Insert or update the product
      let savedProduct;
      let productId;
      
      if (product?.id) {
        // Update existing product
        const { data, error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id)
          .select()
          .single();
          
        if (error) throw error;
        savedProduct = data;
        productId = product.id;
      } else {
        // Insert new product
        const { data, error } = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();
          
        if (error) throw error;
        savedProduct = data;
        productId = savedProduct?.id;
      }
      
      if (!productId) throw new Error("Impossibile ottenere l'ID del prodotto");
      
      // Handle allergens
      if (selectedAllergens.length > 0) {
        // Remove existing allergens
        await supabase
          .from("product_allergens")
          .delete()
          .eq("product_id", productId);
          
        // Insert new allergens
        const allergenInserts = selectedAllergens.map(allergenId => ({
          product_id: productId,
          allergen_id: allergenId
        }));
        
        const { error: allergenError } = await supabase
          .from("product_allergens")
          .insert(allergenInserts);
          
        if (allergenError) throw allergenError;
      }
      
      // Handle features
      if (selectedFeatures.length > 0) {
        // Remove existing features
        await supabase
          .from("product_to_features")
          .delete()
          .eq("product_id", productId);
          
        // Insert new features
        const featureInserts = selectedFeatures.map(featureId => ({
          product_id: productId,
          feature_id: featureId
        }));
        
        const { error: featureError } = await supabase
          .from("product_to_features")
          .insert(featureInserts);
          
        if (featureError) throw featureError;
      }
      
      toast.success(product?.id ? "Prodotto aggiornato con successo" : "Prodotto creato con successo");
      
      // Pass the product data to the onSave callback, but after the state updates are complete
      if (onSave) {
        // Use setTimeout to break the synchronous rendering cycle
        setTimeout(() => {
          onSave(savedProduct || productData);
        }, 0);
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
