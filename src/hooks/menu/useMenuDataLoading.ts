
import { useState } from 'react';
import { toast } from "@/components/ui/sonner";
import { Category, Product } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
import { useProductOrganizer } from "./useProductOrganizer";
import { useCategorySelection } from "./useCategorySelection";

export const useMenuDataLoading = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [allergens, setAllergens] = useState([]);
  const [labels, setLabels] = useState([]);
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { groupByProductId, organizeProductsByCategory } = useProductOrganizer();
  const {
    selectedCategories,
    setSelectedCategories,
    initializeSelectedCategories,
    handleCategoryToggle,
    handleToggleAllCategories
  } = useCategorySelection(categories);

  // Load data function
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load categories, products and allergens in parallel
      const [categoriesResult, allAllergens, labelsResult, featuresResult] = await Promise.all([
        // 1. Load active categories ordered by display_order
        supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true }),
          
        // 2. Load all allergens
        supabase
          .from('allergens')
          .select('*')
          .order('number', { ascending: true }),
          
        // 3. Load all labels
        supabase
          .from('product_labels')
          .select('*')
          .order('display_order', { ascending: true }),
          
        // 4. Load all features
        supabase
          .from('product_features')
          .select('*')
          .order('display_order', { ascending: true })
      ]);

      // Handle potential errors in queries
      if (categoriesResult.error) throw categoriesResult.error;
      if (allAllergens.error) throw allAllergens.error;
      if (labelsResult.error) throw labelsResult.error;
      if (featuresResult.error) throw featuresResult.error;

      const categoriesData = categoriesResult.data || [];
      setCategories(categoriesData);
      initializeSelectedCategories(categoriesData);
      setAllergens(allAllergens.data || []);
      setLabels(labelsResult.data || []);
      setFeatures(featuresResult.data || []);

      // Get all products in a single query
      if (categoriesData.length > 0) {
        const categoryIds = categoriesData.map(cat => cat.id);
        
        const { data: allProducts, error: productsError } = await supabase
          .from('products')
          .select('*, label:label_id(*)')
          .in('category_id', categoryIds)
          .eq('is_active', true)
          .order('display_order', { ascending: true });
          
        if (productsError) throw productsError;
        
        // Get all product-allergen relationships in a single query
        const { data: allProductAllergens, error: allergensError } = await supabase
          .from('product_allergens')
          .select('product_id, allergen_id');
          
        if (allergensError) throw allergensError;
        
        // Get all product-feature relationships in a single query
        const { data: allProductFeatures, error: featuresError } = await supabase
          .from('product_to_features')
          .select('product_id, feature_id');
          
        if (featuresError) throw featuresError;
        
        // Create a map for faster access
        const allergensByProductId = groupByProductId(allProductAllergens || []);
        const featuresByProductId = groupByProductId(allProductFeatures || []);
        
        // Organize products by category and add details
        const productsByCategory = organizeProductsByCategory(
          allProducts || [],
          allergensByProductId,
          featuresByProductId,
          allAllergens.data || [],
          featuresResult.data || []
        );
        
        setProducts(productsByCategory);
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
      setError("Error loading data. Try again later.");
      toast.error("Error loading data. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Retry loading data
  const retryLoading = () => {
    loadData();
  };

  return {
    categories,
    products,
    allergens,
    labels,
    features,
    isLoading,
    error,
    loadData,
    retryLoading,
    selectedCategories,
    setSelectedCategories,
    handleCategoryToggle,
    handleToggleAllCategories
  };
};
