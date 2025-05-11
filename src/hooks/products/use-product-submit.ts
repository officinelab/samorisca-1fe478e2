
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
    
    console.log("Iniziando il salvataggio del prodotto", { values, selectedAllergens, selectedFeatures });
    setIsSubmitting(true);
    
    try {
      // Convert form values to product data
      const productData = formValuesToProduct(values, product?.id);
      
      // Insert or update the product
      let savedProduct;
      let productId;
      
      if (product?.id) {
        console.log("Aggiornando prodotto esistente:", product.id);
        // Update existing product
        const { data, error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id)
          .select()
          .single();
          
        if (error) {
          console.error("Errore nell'aggiornamento del prodotto:", error);
          throw error;
        }
        savedProduct = data;
        productId = product.id;
      } else {
        console.log("Inserendo nuovo prodotto:", productData);
        // Insert new product
        const { data, error } = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();
          
        if (error) {
          console.error("Errore nell'inserimento del prodotto:", error);
          throw error;
        }
        savedProduct = data;
        productId = savedProduct?.id;
        console.log("Nuovo prodotto creato con ID:", productId);
      }
      
      if (!productId) {
        console.error("Impossibile ottenere l'ID del prodotto");
        throw new Error("Impossibile ottenere l'ID del prodotto");
      }
      
      console.log("Gestione allergeni...", selectedAllergens);
      // Handle allergens
      // Remove existing allergens regardless of selection
      const { error: deleteAllergensError } = await supabase
        .from("product_allergens")
        .delete()
        .eq("product_id", productId);
        
      if (deleteAllergensError) {
        console.error("Errore nella rimozione degli allergeni:", deleteAllergensError);
        throw deleteAllergensError;
      }
      
      // Insert new allergens if there are any
      if (selectedAllergens.length > 0) {
        const allergenInserts = selectedAllergens.map(allergenId => ({
          product_id: productId,
          allergen_id: allergenId
        }));
        
        console.log("Inserimento allergeni:", allergenInserts);
        const { error: allergenError } = await supabase
          .from("product_allergens")
          .insert(allergenInserts);
          
        if (allergenError) {
          console.error("Errore nell'inserimento degli allergeni:", allergenError);
          throw allergenError;
        }
      }
      
      console.log("Gestione caratteristiche...", selectedFeatures);
      // Handle features
      // Remove existing features regardless of selection
      const { error: deleteFeaturesError } = await supabase
        .from("product_to_features")
        .delete()
        .eq("product_id", productId);
        
      if (deleteFeaturesError) {
        console.error("Errore nella rimozione delle caratteristiche:", deleteFeaturesError);
        throw deleteFeaturesError;
      }
      
      // Insert new features if there are any
      if (selectedFeatures.length > 0) {
        const featureInserts = selectedFeatures.map(featureId => ({
          product_id: productId,
          feature_id: featureId
        }));
        
        console.log("Inserimento caratteristiche:", featureInserts);
        const { error: featureError } = await supabase
          .from("product_to_features")
          .insert(featureInserts);
          
        if (featureError) {
          console.error("Errore nell'inserimento delle caratteristiche:", featureError);
          throw featureError;
        }
      }
      
      toast.success(product?.id ? "Prodotto aggiornato con successo" : "Prodotto creato con successo");
      console.log("Prodotto salvato con successo:", savedProduct);
      
      // Pass the product data to the onSave callback
      if (onSave) {
        onSave(savedProduct || productData);
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
