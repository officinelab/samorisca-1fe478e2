
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Category, Product, Allergen, ProductLabel, ProductFeature } from "@/types/database";

export const useDashboardData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [labels, setLabels] = useState<ProductLabel[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId) || null;
  const selectedProduct = products.find(p => p.id === selectedProductId) || null;

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      setCategories(data || []);
      
      if (data && data.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(data[0].id);
        await loadProducts(data[0].id);
      } else if (selectedCategoryId) {
        await loadProducts(selectedCategoryId);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      throw error;
    }
  };

  const loadAllergens = async () => {
    try {
      const { data, error } = await supabase
        .from('allergens')
        .select('*')
        .order('number', { ascending: true });

      if (error) throw error;
      setAllergens(data || []);
    } catch (error) {
      console.error('Error loading allergens:', error);
      throw error;
    }
  };

  const loadLabels = async () => {
    try {
      const { data, error } = await supabase
        .from('product_labels')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setLabels(data || []);
    } catch (error) {
      console.error('Error loading labels:', error);
      throw error;
    }
  };

  const loadProducts = async (categoryId: string) => {
    console.log('=== loadProducts START for category:', categoryId);
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*, label:label_id(*)')
        .eq('category_id', categoryId)
        .order('display_order', { ascending: true });

      if (productsError) throw productsError;
      
      const productsWithDetails = await Promise.all(
        (productsData || []).map(async (product) => {
          const { data: productAllergens, error: allergensError } = await supabase
            .from('product_allergens')
            .select('allergen_id')
            .eq('product_id', product.id);
          
          if (allergensError) throw allergensError;
          
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
      console.log('=== loadProducts: Setting products:', productsWithDetails.length, 'items');
      setProducts(productsWithDetails);
      setSelectedProductId(null);
    } catch (error) {
      console.error('Error loading products:', error);
      throw error;
    }
  };

  const loadData = async () => {
    console.log('=== loadData START ===');
    setIsLoading(true);
    try {
      console.log('Loading categories, allergens, labels...');
      await Promise.all([
        loadCategories(),
        loadAllergens(),
        loadLabels()
      ]);
      console.log('=== loadData COMPLETED ===');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error("Errore nel caricamento dei dati. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    categories,
    products,
    allergens,
    labels,
    selectedCategoryId,
    selectedProductId,
    selectedCategory,
    selectedProduct,
    isLoading,
    setCategories,
    setProducts,
    setSelectedCategoryId,
    setSelectedProductId,
    loadData,
    loadCategories,
    loadProducts
  };
};
