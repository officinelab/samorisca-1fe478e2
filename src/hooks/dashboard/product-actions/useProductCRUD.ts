
import { useState, useCallback } from "react";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

export const useProductCRUD = (categoryId: string | null, loadProducts: (categoryId: string) => Promise<void>, selectProduct: (productId: string) => void) => {
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

  // Update a product
  const updateProduct = useCallback(async (productId: string, productData: Partial<Product>) => {
    try {
      // Create a copy of the product data without allergens and features
      const { allergens, features, ...productUpdateData } = productData;
      
      // Handle the "none" value for label_id
      if (productUpdateData.label_id === "none") {
        productUpdateData.label_id = null;
      }
      
      // Update the product data in the products table
      const { error } = await supabase
        .from('products')
        .update(productUpdateData)
        .eq('id', productId);
      
      if (error) throw error;
      
      // Handle allergens separately if they are present
      if (allergens !== undefined) {
        // Remove all existing associations
        const { error: deleteError } = await supabase
          .from('product_allergens')
          .delete()
          .eq('product_id', productId);
        
        if (deleteError) throw deleteError;
        
        // Add the new associations if there are any
        if (allergens.length > 0) {
          const allergenInserts = allergens.map(allergen => ({
            product_id: productId,
            allergen_id: allergen.id,
          }));

          const { error: insertError } = await supabase
            .from('product_allergens')
            .insert(allergenInserts);
          
          if (insertError) throw insertError;
        }
      }
      
      // Handle features separately if they are present
      if (features !== undefined) {
        // Remove all existing associations
        const { error: deleteError } = await supabase
          .from('product_to_features')
          .delete()
          .eq('product_id', productId);
        
        if (deleteError) throw deleteError;
        
        // Add the new associations if there are any
        if (features.length > 0) {
          const featureInserts = features.map(feature => ({
            product_id: productId,
            feature_id: feature.id,
          }));

          const { error: insertError } = await supabase
            .from('product_to_features')
            .insert(featureInserts);
          
          if (insertError) throw insertError;
        }
      }
      
      // Update products
      if (categoryId) {
        await loadProducts(categoryId);
      }
      
      // Reselect the updated product
      selectProduct(productId);
      
      toast.success("Product updated successfully!");
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error("Error updating product. Please try again later.");
      return false;
    }
  }, [categoryId, loadProducts, selectProduct]);

  // Delete a product
  const deleteProduct = useCallback(async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      // Update the local state
      if (categoryId) {
        await loadProducts(categoryId);
      }
      
      toast.success("Product deleted successfully!");
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error("Error deleting product. Please try again later.");
      return false;
    }
  }, [categoryId, loadProducts]);

  return {
    addProduct,
    updateProduct,
    deleteProduct
  };
};
