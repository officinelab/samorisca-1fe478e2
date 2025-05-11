
import { useState, useCallback } from "react";
import { toast } from "@/components/ui/sonner";
import { Product, Allergen, ProductFeature } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

export const useProductLoader = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Load products for a category
  const loadProducts = useCallback(async (categoryId: string): Promise<Product[] | void> => {
    if (!categoryId) return [];
    
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
      return productsWithDetails;
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error("Error loading products. Please try again later.");
      setProducts([]); // Ensure products is always an array
      return [];
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  return {
    products,
    setProducts,
    isLoadingProducts,
    loadProducts
  };
};
