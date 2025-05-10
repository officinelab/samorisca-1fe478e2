
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/sonner";
import { Product, Allergen, ProductFeature } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

export const useProducts = (categoryId: string | null) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load products for a category
  const loadProducts = useCallback(async (categoryId: string) => {
    if (!categoryId) return;
    
    setIsLoadingProducts(true);
    try {
      // Load products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*, label:label_id(*)')
        .eq('category_id', categoryId)
        .order('display_order', { ascending: true });

      if (productsError) throw productsError;
      
      // For each product, load associated allergens and features
      const productsWithDetails = await Promise.all(
        (productsData || []).map(async (product) => {
          // Load allergens
          const { data: productAllergens, error: allergensError } = await supabase
            .from('product_allergens')
            .select('allergen_id')
            .eq('product_id', product.id);
          
          if (allergensError) throw allergensError;
          
          // If there are allergens, retrieve the details
          let productAllergensDetails: Allergen[] = [];
          if (productAllergens && productAllergens.length > 0) {
            const allergenIds = productAllergens.map(pa => pa.allergen_id);
            const { data: allergensDetails, error: detailsError } = await supabase
              .from('allergens')
              .select('*')
              .in('id', allergenIds);
            
            if (detailsError) throw detailsError;
            productAllergensDetails = allergensDetails || [];
          }
          
          // Load features
          const { data: productFeatures, error: featuresError } = await supabase
            .from('product_to_features')
            .select('feature_id')
            .eq('product_id', product.id);
          
          if (featuresError) throw featuresError;
          
          let productFeaturesDetails: ProductFeature[] = [];
          if (productFeatures && productFeatures.length > 0) {
            const featureIds = productFeatures.map(pf => pf.feature_id);
            const { data: featuresDetails, error: detailsError } = await supabase
              .from('product_features')
              .select('*')
              .in('id', featureIds)
              .order('display_order', { ascending: true });
            
            if (detailsError) throw detailsError;
            productFeaturesDetails = featuresDetails || [];
          }
          
          return { 
            ...product, 
            allergens: productAllergensDetails,
            features: productFeaturesDetails
          } as Product;
        })
      );
      
      setProducts(productsWithDetails);
      // Reset the selected product when changing category
      setSelectedProductId(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error("Error loading products. Please try again later.");
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // Select a product
  const selectProduct = useCallback((productId: string) => {
    setSelectedProductId(productId);
    setIsEditing(false);
  }, []);

  // Start editing a product
  const startEditingProduct = useCallback((productId: string | null) => {
    setSelectedProductId(productId);
    setIsEditing(true);
  }, []);

  // Add a new product
  const addProduct = useCallback(async (productData: Partial<Product>) => {
    if (!categoryId) {
      toast.error("Please select a category first");
      return null;
    }

    try {
      // Determine the next display_order
      const maxOrder = Math.max(...products.map(p => p.display_order), 0);
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
  }, [categoryId, products, loadProducts, selectProduct]);

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
      setIsEditing(false);
      
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
      
      setSelectedProductId(null);
      setIsEditing(false);
      
      toast.success("Product deleted successfully!");
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error("Error deleting product. Please try again later.");
      return false;
    }
  }, [categoryId, loadProducts]);

  // Reorder a product
  const reorderProduct = useCallback(async (productId: string, direction: 'up' | 'down') => {
    // Find the index of the current product
    const currentIndex = products.findIndex(p => p.id === productId);
    if (currentIndex === -1) return false;

    // Calculate the new index
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Verify that the new index is valid
    if (newIndex < 0 || newIndex >= products.length) return false;
    
    // Create a copy of the products array
    const updatedProducts = [...products];
    
    // Get the products involved
    const product1 = updatedProducts[currentIndex];
    const product2 = updatedProducts[newIndex];
    
    // Swap the display orders
    const tempOrder = product1.display_order;
    product1.display_order = product2.display_order;
    product2.display_order = tempOrder;
    
    // Update the local array
    [updatedProducts[currentIndex], updatedProducts[newIndex]] = 
      [updatedProducts[newIndex], updatedProducts[currentIndex]];
    
    // Update the state
    setProducts(updatedProducts);
    
    try {
      // Update the database with all required fields
      const updates = [
        { 
          id: product1.id, 
          display_order: product1.display_order,
          title: product1.title,
          category_id: product1.category_id,
          description: product1.description,
          image_url: product1.image_url,
          is_active: product1.is_active,
          price_standard: product1.price_standard,
          has_multiple_prices: product1.has_multiple_prices,
          price_variant_1_name: product1.price_variant_1_name,
          price_variant_1_value: product1.price_variant_1_value,
          price_variant_2_name: product1.price_variant_2_name,
          price_variant_2_value: product1.price_variant_2_value,
          has_price_suffix: product1.has_price_suffix,
          price_suffix: product1.price_suffix
        },
        { 
          id: product2.id, 
          display_order: product2.display_order,
          title: product2.title,
          category_id: product2.category_id,
          description: product2.description,
          image_url: product2.image_url,
          is_active: product2.is_active,
          price_standard: product2.price_standard,
          has_multiple_prices: product2.has_multiple_prices,
          price_variant_1_name: product2.price_variant_1_name,
          price_variant_1_value: product2.price_variant_1_value,
          price_variant_2_name: product2.price_variant_2_name,
          price_variant_2_value: product2.price_variant_2_value,
          has_price_suffix: product2.has_price_suffix,
          price_suffix: product2.price_suffix
        }
      ];
      
      const { error } = await supabase
        .from('products')
        .upsert(updates);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error reordering products:', error);
      toast.error("Error reordering products. Please try again later.");
      // Reload products in case of error
      if (categoryId) {
        loadProducts(categoryId);
      }
      return false;
    }
  }, [products, categoryId, loadProducts]);

  // Filter products based on search query
  const filteredProducts = useCallback(() => {
    return products.filter(
      product => product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Load products when categoryId changes
  useEffect(() => {
    if (categoryId) {
      loadProducts(categoryId);
    }
  }, [categoryId, loadProducts]);

  return {
    products,
    filteredProducts: filteredProducts(),
    selectedProductId,
    isLoadingProducts,
    isEditing,
    searchQuery,
    setSearchQuery,
    selectProduct,
    startEditingProduct,
    setIsEditing,
    loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    reorderProduct
  };
};
