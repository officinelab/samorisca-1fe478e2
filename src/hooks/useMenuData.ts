
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { Category, Product } from "@/types/database";
import * as dataFetchers from "./menu/menuDataFetchers";
import { getStoredLogo, setStoredLogo } from "./menu/menuStorage";
import { useCategorySelection } from "./menu/useCategorySelection";

export const useMenuData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [allergens, setAllergens] = useState([]);
  const [labels, setLabels] = useState([]);
  const [features, setFeatures] = useState([]);
  const [restaurantLogo, setRestaurantLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    selectedCategories,
    setSelectedCategories,
    initializeSelectedCategories,
    handleCategoryToggle,
    handleToggleAllCategories
  } = useCategorySelection(categories);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load restaurant logo from local storage
      const savedLogo = getStoredLogo();
      if (savedLogo) {
        setRestaurantLogo(savedLogo);
      }

      // Load categories
      const categoriesData = await dataFetchers.fetchCategories();
      setCategories(categoriesData);
      initializeSelectedCategories(categoriesData);

      // Load labels
      const labelsData = await dataFetchers.fetchLabels();
      setLabels(labelsData);

      // Load features
      const featuresData = await dataFetchers.fetchFeatures();
      setFeatures(featuresData);
      
      // Load products for each category
      const productsMap: Record<string, Product[]> = {};
      
      for (const category of categoriesData) {
        const productsData = await dataFetchers.fetchProductsByCategory(category.id);
        
        // For each product, load associated allergens and features
        const productsWithDetails = await Promise.all(
          productsData.map(async (product) => {
            // Load allergens for the product
            const productAllergensDetails = await dataFetchers.fetchProductAllergens(product.id);
            
            // Load features for the product
            const productFeaturesDetails = await dataFetchers.fetchProductFeatures(product.id);
            
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
      const allergensData = await dataFetchers.fetchAllAllergens();
      setAllergens(allergensData);
      
    } catch (error) {
      console.error('Errore nel caricamento dei dati:', error);
      setError("Errore nel caricamento dei dati. Riprova più tardi.");
      toast.error("Errore nel caricamento dei dati. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update restaurant logo
  const updateRestaurantLogo = (logoUrl: string) => {
    setRestaurantLogo(logoUrl);
    setStoredLogo(logoUrl);
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
    restaurantLogo,
    updateRestaurantLogo,
    isLoading,
    error,
    retryLoading,
    selectedCategories,
    setSelectedCategories,
    handleCategoryToggle,
    handleToggleAllCategories
  };
};
