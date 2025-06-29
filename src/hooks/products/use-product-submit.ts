
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/types/database";
import { formValuesToProduct } from "@/types/form";
import { ProductFormValues } from "@/types/form";

export const useProductSubmit = () => {
  // Funzione per salvare un prodotto (nuovo o esistente)
  const saveProduct = async (
    values: ProductFormValues, 
    selectedAllergenIds: string[], 
    selectedFeatureIds: string[],
    existingProductId?: string
  ) => {
    try {
      let existingProduct = null;
      
      // Se stiamo modificando un prodotto esistente, recupera prima i suoi dati
      if (existingProductId) {
        const { data: productData, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .eq("id", existingProductId)
          .single();
          
        if (fetchError) {
          console.error("Errore nel recupero del prodotto esistente:", fetchError);
        } else {
          existingProduct = productData;
          console.log("Prodotto esistente recuperato:", existingProduct);
        }
      }
      
      // Converte i valori del form in dati del prodotto PRESERVANDO il display_order
      const productData = formValuesToProduct(values, existingProductId, existingProduct);
      
      // Inserisce o aggiorna il prodotto
      let savedProduct;
      let productId;
      
      if (existingProductId) {
        // Aggiorna il prodotto esistente
        const { data, error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", existingProductId)
          .select()
          .single();
          
        if (error) throw error;
        savedProduct = data;
        productId = existingProductId;
        console.log("Prodotto aggiornato con display_order preservato:", savedProduct);
      } else {
        // Prima di inserire, trova il display_order più alto per questa categoria
        const { data: lastProduct } = await supabase
          .from("products")
          .select("display_order")
          .eq("category_id", productData.category_id)
          .order("display_order", { ascending: false })
          .limit(1)
          .single();

        // Imposta il display_order del nuovo prodotto (parte da 1)
        const newDisplayOrder = lastProduct ? lastProduct.display_order + 1 : 1;
        productData.display_order = newDisplayOrder;

        // Inserisce un nuovo prodotto
        const { data, error } = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();
          
        if (error) throw error;
        savedProduct = data;
        productId = savedProduct?.id;
        console.log("Nuovo prodotto creato con display_order:", newDisplayOrder);
      }
      
      if (!productId) throw new Error("Impossibile ottenere l'ID del prodotto");
      
      // Gestisce gli allergeni
      if (selectedAllergenIds.length > 0) {
        // Rimuove gli allergeni esistenti
        await supabase
          .from("product_allergens")
          .delete()
          .eq("product_id", productId);
        
        console.log("Allergeni esistenti rimossi per il prodotto:", productId);
          
        // Inserisce i nuovi allergeni
        const allergenInserts = selectedAllergenIds.map(allergenId => ({
          product_id: productId,
          allergen_id: allergenId
        }));
        
        const { error: allergenError } = await supabase
          .from("product_allergens")
          .insert(allergenInserts);
          
        if (allergenError) throw allergenError;
        console.log("Nuovi allergeni associati al prodotto:", allergenInserts);
      } else {
        // Se non ci sono allergeni selezionati, rimuovi tutte le associazioni esistenti
        await supabase
          .from("product_allergens")
          .delete()
          .eq("product_id", productId);
        
        console.log("Tutte le associazioni di allergeni rimosse per il prodotto:", productId);
      }
      
      // Gestisce le caratteristiche
      if (selectedFeatureIds.length > 0) {
        // Rimuove le caratteristiche esistenti
        await supabase
          .from("product_to_features")
          .delete()
          .eq("product_id", productId);
        
        console.log("Caratteristiche esistenti rimosse per il prodotto:", productId);
          
        // Inserisce le nuove caratteristiche
        const featureInserts = selectedFeatureIds.map(featureId => ({
          product_id: productId,
          feature_id: featureId
        }));
        
        const { error: featureError } = await supabase
          .from("product_to_features")
          .insert(featureInserts);
          
        if (featureError) throw featureError;
        console.log("Nuove caratteristiche associate al prodotto:", featureInserts);
      } else {
        // Se non ci sono caratteristiche selezionate, rimuovi tutte le associazioni esistenti
        await supabase
          .from("product_to_features")
          .delete()
          .eq("product_id", productId);
        
        console.log("Tutte le associazioni di caratteristiche rimosse per il prodotto:", productId);
      }
      
      toast.success(existingProductId ? 
        "Prodotto aggiornato con successo" : 
        "Prodotto creato con successo");
      
      return { success: true, productId, product: savedProduct };
    } catch (error: any) {
      console.error("Errore durante il salvataggio del prodotto:", error);
      toast.error(`Errore: ${error.message || "Si è verificato un errore durante il salvataggio"}`);
      return { success: false, error };
    }
  };

  return { saveProduct };
};
