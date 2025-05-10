
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
      toast.error("Please select a category first");
      return null;
    }

    try {
      // Determine the next display_order
      const { data: productsData } = await supabase
        .from('products')
        .select('display_order')
        .eq('category_id', categoryId)
        .order('display_order', { ascending: false })
        .limit(1);
      
      const maxOrder = productsData && productsData.length > 0 ? productsData[0].display_order : 0;
      const nextOrder = maxOrder + 1;
      
      if (!productData.title) {
        toast.error("Title is required");
        return null;
      }
      
      // Extract features and allergens before inserting the product
      const { features, allergens, ...productToInsert } = productData;
      
      // Handle the "none" value for label_id
      if (productToInsert.label_id === "none") {
        productToInsert.label_id = null;
      }
      
      const productInsert = {
        title: productToInsert.title,
        description: productToInsert.description || null,
        image_url: productToInsert.image_url || null,
        category_id: categoryId,
        is_active: productToInsert.is_active !== undefined ? productToInsert.is_active : true,
        display_order: nextOrder,
        price_standard: productToInsert.price_standard || 0,
        has_multiple_prices: productToInsert.has_multiple_prices || false,
        price_variant_1_name: productToInsert.price_variant_1_name || null,
        price_variant_1_value: productToInsert.price_variant_1_value || null,
        price_variant_2_name: productToInsert.price_variant_2_name || null,
        price_variant_2_value: productToInsert.price_variant_2_value || null,
        has_price_suffix: productToInsert.has_price_suffix || false,
        price_suffix: productToInsert.price_suffix || null,
        label_id: productToInsert.label_id || null
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert([productInsert])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Handle allergens if present
        const productAllergens = allergens || [];
        if (productAllergens.length > 0) {
          const allergenInserts = productAllergens.map(allergen => ({
            product_id: data[0].id,
            allergen_id: allergen.id,
          }));

          const { error: allergensError } = await supabase
            .from('product_allergens')
            .insert(allergenInserts);
          
          if (allergensError) throw allergensError;
        }
        
        // Handle features if present
        const productFeatures = features || [];
        if (productFeatures.length > 0) {
          const featureInserts = productFeatures.map(feature => ({
            product_id: data[0].id,
            feature_id: feature.id,
          }));

          const { error: featuresError } = await supabase
            .from('product_to_features')
            .insert(featureInserts);
          
          if (featuresError) throw featuresError;
        }

        // Update products
        await loadProducts(categoryId);
        selectProduct(data[0].id);
        toast.success("Product added successfully!");
        return data[0];
      }
      return null;
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error(`Error adding product: ${error.message || 'Please try again later.'}`);
      return null;
    }
  }, [categoryId, loadProducts, selectProduct]);

  return { addProduct };
};
