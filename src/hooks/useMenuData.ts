
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Category, Product, Allergen, ProductLabel, ProductFeature } from "@/types/database";

export const useMenuData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [labels, setLabels] = useState<ProductLabel[]>([]);
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [restaurantLogo, setRestaurantLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load restaurant logo from local storage if available
        const savedLogo = localStorage.getItem('restaurantLogo');
        if (savedLogo) {
          setRestaurantLogo(savedLogo);
        }

        // Load active categories ordered by display_order
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });

        if (categoriesError) throw categoriesError;
        
        const activeCategories = categoriesData?.filter(c => c.is_active) || [];
        setCategories(activeCategories);
        
        // Select all categories by default
        setSelectedCategories(activeCategories.map(c => c.id));

        // Load product labels
        const { data: labelsData, error: labelsError } = await supabase
          .from('product_labels')
          .select('*')
          .order('display_order', { ascending: true });
          
        if (labelsError) throw labelsError;
        setLabels(labelsData || []);

        // Load product features
        const { data: featuresData, error: featuresError } = await supabase
          .from('product_features')
          .select('*')
          .order('display_order', { ascending: true });
          
        if (featuresError) throw featuresError;
        setFeatures(featuresData || []);
        
        // Load products for each category
        const productsMap: Record<string, Product[]> = {};
        
        for (const category of activeCategories) {
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*, label:label_id(*)')
            .eq('category_id', category.id)
            .eq('is_active', true)
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
              
              let productAllergensDetails: Allergen[] = [];
              if (productAllergens && productAllergens.length > 0) {
                const allergenIds = productAllergens.map(pa => pa.allergen_id);
                const { data: allergensDetails, error: detailsError } = await supabase
                  .from('allergens')
                  .select('id, number, title')
                  .in('id', allergenIds)
                  .order('number', { ascending: true });
                
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
          
          productsMap[category.id] = productsWithDetails;
        }
        
        setProducts(productsMap);
        
        // Load all allergens
        const { data: allergensData, error: allergensError } = await supabase
          .from('allergens')
          .select('*')
          .order('number', { ascending: true });

        if (allergensError) throw allergensError;
        setAllergens(allergensData || []);
        
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
        toast.error("Errore nel caricamento dei dati. Riprova più tardi.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handles toggling selected categories
  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  // Handles selecting/deselecting all categories
  const handleToggleAllCategories = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(c => c.id));
    }
  };

  // Update restaurant logo
  const updateRestaurantLogo = (logoUrl: string) => {
    setRestaurantLogo(logoUrl);
    localStorage.setItem('restaurantLogo', logoUrl);
  };

  return {
    categories,
    products,
    allergens,
    labels,
    features,
    restaurantLogo,
    updateRestaurantLogo,
    isLoading,
    selectedCategories,
    setSelectedCategories,
    handleCategoryToggle,
    handleToggleAllCategories
  };
};
