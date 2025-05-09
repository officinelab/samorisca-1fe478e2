
import { supabase } from "@/integrations/supabase/client";
import { Category, Product, Allergen, ProductLabel, ProductFeature } from "@/types/database";
import { toast } from "@/components/ui/sonner";

// Fetch active categories ordered by display_order
export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }

  return data?.filter(c => c.is_active) || [];
};

// Fetch product labels
export const fetchLabels = async () => {
  const { data, error } = await supabase
    .from('product_labels')
    .select('*')
    .order('display_order', { ascending: true });
    
  if (error) {
    console.error('Error fetching labels:', error);
    throw error;
  }
  
  return data || [];
};

// Fetch product features
export const fetchFeatures = async () => {
  const { data, error } = await supabase
    .from('product_features')
    .select('*')
    .order('display_order', { ascending: true });
    
  if (error) {
    console.error('Error fetching features:', error);
    throw error;
  }
  
  return data || [];
};

// Fetch products for a specific category
export const fetchProductsByCategory = async (categoryId: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, label:label_id(*)')
    .eq('category_id', categoryId)
    .eq('is_active', true)
    .order('display_order', { ascending: true });
    
  if (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
  
  return data || [];
};

// Fetch allergens for a specific product
export const fetchProductAllergens = async (productId: string) => {
  // Get allergen IDs associated with the product
  const { data: productAllergens, error: allergensError } = await supabase
    .from('product_allergens')
    .select('allergen_id')
    .eq('product_id', productId);
  
  if (allergensError) {
    console.error('Error fetching product allergens:', allergensError);
    throw allergensError;
  }
  
  if (!productAllergens || productAllergens.length === 0) {
    return [];
  }
  
  // Get allergen details
  const allergenIds = productAllergens.map(pa => pa.allergen_id);
  const { data: allergensDetails, error: detailsError } = await supabase
    .from('allergens')
    .select('*')
    .in('id', allergenIds)
    .order('number', { ascending: true });
  
  if (detailsError) {
    console.error('Error fetching allergen details:', detailsError);
    throw detailsError;
  }
  
  return allergensDetails || [];
};

// Fetch features for a specific product
export const fetchProductFeatures = async (productId: string) => {
  // Get feature IDs associated with the product
  const { data: productFeatures, error: featuresError } = await supabase
    .from('product_to_features')
    .select('feature_id')
    .eq('product_id', productId);
  
  if (featuresError) {
    console.error('Error fetching product features:', featuresError);
    throw featuresError;
  }
  
  if (!productFeatures || productFeatures.length === 0) {
    return [];
  }
  
  // Get feature details
  const featureIds = productFeatures.map(pf => pf.feature_id);
  const { data: featuresDetails, error: detailsError } = await supabase
    .from('product_features')
    .select('*')
    .in('id', featureIds)
    .order('display_order', { ascending: true });
  
  if (detailsError) {
    console.error('Error fetching feature details:', detailsError);
    throw detailsError;
  }
  
  return featuresDetails || [];
};

// Fetch all allergens
export const fetchAllAllergens = async () => {
  const { data, error } = await supabase
    .from('allergens')
    .select('*')
    .order('number', { ascending: true });

  if (error) {
    console.error('Error fetching allergens:', error);
    throw error;
  }
  
  return data || [];
};
