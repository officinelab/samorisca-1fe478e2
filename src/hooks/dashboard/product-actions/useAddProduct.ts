
import { useCallback } from "react";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

export const useAddProduct = (
  categoryId: string | null, 
  loadProducts: (categoryId: string) => Promise<Product[] | void>,
  selectProduct: (productId: string) => void
) => {
  // Add a new product
  const addProduct = useCallback(async (productData: Partial<Product>) => {
    if (!categoryId) {
      toast.error("Seleziona prima una categoria");
      return null;
    }

    try {
      console.log("Aggiunta nuovo prodotto nella categoria:", categoryId, productData);
      
      // Determine the next display_order
      const { data: productsData, error: orderError } = await supabase
        .from('products')
        .select('display_order')
        .eq('category_id', categoryId)
        .order('display_order', { ascending: false })
        .limit(1);
      
      if (orderError) {
        console.error("Errore nel recuperare l'ordine di visualizzazione:", orderError);
      }
      
      const maxOrder = productsData && productsData.length > 0 ? productsData[0].display_order : 0;
      const nextOrder = maxOrder + 1;
      
      if (!productData.title) {
        toast.error("Il titolo è obbligatorio");
        return null;
      }
      
      // Handle the "none" value for label_id
      if (productData.label_id === "none") {
        productData.label_id = null;
      }
      
      const productInsert = {
        title: productData.title,
        description: productData.description || null,
        image_url: productData.image_url || null,
        category_id: categoryId,
        is_active: productData.is_active !== undefined ? productData.is_active : true,
        display_order: nextOrder,
        price_standard: productData.price_standard || 0,
        has_multiple_prices: productData.has_multiple_prices || false,
        price_variant_1_name: productData.price_variant_1_name || null,
        price_variant_1_value: productData.price_variant_1_value || null,
        price_variant_2_name: productData.price_variant_2_name || null,
        price_variant_2_value: productData.price_variant_2_value || null,
        has_price_suffix: productData.has_price_suffix || false,
        price_suffix: productData.price_suffix || null,
        label_id: productData.label_id || null
      };
      
      console.log("Dati prodotto da inserire:", productInsert);
      
      const { data, error } = await supabase
        .from('products')
        .insert([productInsert])
        .select();
      
      if (error) {
        console.error("Errore nell'inserimento del prodotto:", error);
        throw error;
      }
      
      if (data && data.length > 0) {
        const newProductId = data[0].id;
        console.log("Prodotto inserito con successo:", data[0]);
        
        // Handle allergens if present
        if (productData.allergens && productData.allergens.length > 0) {
          const allergenInserts = productData.allergens.map((allergen: any) => ({
            product_id: newProductId,
            allergen_id: typeof allergen === 'string' ? allergen : allergen.id,
          }));
          
          const { error: allergenError } = await supabase
            .from('product_allergens')
            .insert(allergenInserts);
          
          if (allergenError) {
            console.error("Errore nell'inserimento degli allergeni:", allergenError);
          }
        }
        
        // Handle features if present
        if (productData.features && productData.features.length > 0) {
          const featureInserts = productData.features.map((feature: any) => ({
            product_id: newProductId,
            feature_id: typeof feature === 'string' ? feature : feature.id,
          }));
          
          const { error: featureError } = await supabase
            .from('product_to_features')
            .insert(featureInserts);
          
          if (featureError) {
            console.error("Errore nell'inserimento delle caratteristiche:", featureError);
          }
        }
        
        // Update products
        await loadProducts(categoryId);
        selectProduct(newProductId);
        toast.success("Prodotto aggiunto con successo!");
        return data[0];
      }
      return null;
    } catch (error: any) {
      console.error('Errore aggiunta prodotto:', error);
      toast.error(`Errore aggiunta prodotto: ${error.message || 'Riprova più tardi.'}`);
      return null;
    }
  }, [categoryId, loadProducts, selectProduct]);

  return { addProduct };
};
