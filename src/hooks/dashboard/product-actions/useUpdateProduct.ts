
import { useCallback } from "react";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

export const useUpdateProduct = (
  categoryId: string | null, 
  loadProducts: (categoryId: string) => Promise<Product[] | void>,
  selectProduct: (productId: string) => void
) => {
  // Update a product
  const updateProduct = useCallback(async (productId: string, productData: Partial<Product>) => {
    try {
      console.log("Aggiornamento prodotto:", productId);
      console.log("Dati prodotto:", productData);
      
      // Extract allergens and features from productData
      const { allergens, features, ...productUpdateData } = productData;
      
      // Handle the "none" value for label_id
      if (productUpdateData.label_id === "none") {
        productUpdateData.label_id = null;
      }
      
      // Update the product data in the products table
      console.log("Aggiornamento dati principali del prodotto:", productUpdateData);
      const { error } = await supabase
        .from('products')
        .update(productUpdateData)
        .eq('id', productId);
      
      if (error) {
        console.error("Errore nell'aggiornamento del prodotto:", error);
        throw error;
      }
      
      // Handle allergens
      console.log("Gestione allergeni per il prodotto:", productId, allergens);
      
      // Remove all existing allergen associations
      const { error: deleteAllergenError } = await supabase
        .from('product_allergens')
        .delete()
        .eq('product_id', productId);
      
      if (deleteAllergenError) {
        console.error("Errore nella rimozione degli allergeni:", deleteAllergenError);
        throw deleteAllergenError;
      }
      
      // Add the new allergen associations if there are any
      if (allergens && allergens.length > 0) {
        const allergenInserts = allergens.map(allergen => ({
          product_id: productId,
          allergen_id: typeof allergen === 'string' ? allergen : allergen.id,
        }));

        console.log("Inserimento dei nuovi allergeni:", allergenInserts);
        const { error: insertAllergenError } = await supabase
          .from('product_allergens')
          .insert(allergenInserts);
        
        if (insertAllergenError) {
          console.error("Errore nell'inserimento degli allergeni:", insertAllergenError);
          throw insertAllergenError;
        }
      }
      
      // Handle features
      console.log("Gestione caratteristiche per il prodotto:", productId, features);
      
      // Remove all existing feature associations
      const { error: deleteFeatureError } = await supabase
        .from('product_to_features')
        .delete()
        .eq('product_id', productId);
      
      if (deleteFeatureError) {
        console.error("Errore nella rimozione delle caratteristiche:", deleteFeatureError);
        throw deleteFeatureError;
      }
      
      // Add the new feature associations if there are any
      if (features && features.length > 0) {
        const featureInserts = features.map(feature => ({
          product_id: productId,
          feature_id: typeof feature === 'string' ? feature : feature.id,
        }));

        console.log("Inserimento delle nuove caratteristiche:", featureInserts);
        const { error: insertFeatureError } = await supabase
          .from('product_to_features')
          .insert(featureInserts);
        
        if (insertFeatureError) {
          console.error("Errore nell'inserimento delle caratteristiche:", insertFeatureError);
          throw insertFeatureError;
        }
      }
      
      // Update products
      if (categoryId) {
        await loadProducts(categoryId);
      }
      
      // Reselect the updated product
      selectProduct(productId);
      
      toast.success("Prodotto aggiornato con successo!");
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error("Error updating product. Please try again later.");
      return false;
    }
  }, [categoryId, loadProducts, selectProduct]);

  return { updateProduct };
};
