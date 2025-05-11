
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { Category, Product } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
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

      // Carica le categorie, i prodotti e gli allergeni in parallelo
      const [categoriesResult, allAllergens, labelsResult, featuresResult] = await Promise.all([
        // 1. Carica le categorie attive ordinate per display_order
        supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true }),
          
        // 2. Carica tutti gli allergeni
        supabase
          .from('allergens')
          .select('*')
          .order('number', { ascending: true }),
          
        // 3. Carica tutte le etichette
        supabase
          .from('product_labels')
          .select('*')
          .order('display_order', { ascending: true }),
          
        // 4. Carica tutte le caratteristiche
        supabase
          .from('product_features')
          .select('*')
          .order('display_order', { ascending: true })
      ]);

      // Gestisci eventuali errori nelle query
      if (categoriesResult.error) throw categoriesResult.error;
      if (allAllergens.error) throw allAllergens.error;
      if (labelsResult.error) throw labelsResult.error;
      if (featuresResult.error) throw featuresResult.error;

      const categoriesData = categoriesResult.data || [];
      setCategories(categoriesData);
      initializeSelectedCategories(categoriesData);
      setAllergensData(allAllergens.data || []);
      setLabels(labelsResult.data || []);
      setFeatures(featuresResult.data || []);

      // Ottieni tutti i prodotti in un'unica query
      if (categoriesData.length > 0) {
        const categoryIds = categoriesData.map(cat => cat.id);
        
        const { data: allProducts, error: productsError } = await supabase
          .from('products')
          .select('*, label:label_id(*)')
          .in('category_id', categoryIds)
          .eq('is_active', true)
          .order('display_order', { ascending: true });
          
        if (productsError) throw productsError;
        
        // Ottieni tutte le relazioni prodotti-allergeni in un'unica query
        const { data: allProductAllergens, error: allergensError } = await supabase
          .from('product_allergens')
          .select('product_id, allergen_id');
          
        if (allergensError) throw allergensError;
        
        // Ottieni tutte le relazioni prodotti-caratteristiche in un'unica query
        const { data: allProductFeatures, error: featuresError } = await supabase
          .from('product_to_features')
          .select('product_id, feature_id');
          
        if (featuresError) throw featuresError;
        
        // Crea una mappa per un accesso più rapido
        const allergensByProductId = groupByProductId(allProductAllergens || []);
        const featuresByProductId = groupByProductId(allProductFeatures || []);
        
        // Organizza i prodotti per categoria e aggiungi i dettagli
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
      console.error('Errore nel caricamento dei dati:', error);
      setError("Errore nel caricamento dei dati. Riprova più tardi.");
      toast.error("Errore nel caricamento dei dati. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Utility per raggruppare per product_id
  const groupByProductId = (items: any[]) => {
    const result: Record<string, any[]> = {};
    for (const item of items) {
      if (!result[item.product_id]) {
        result[item.product_id] = [];
      }
      result[item.product_id].push(item);
    }
    return result;
  };

  // Organizza i prodotti per categoria e aggiungi i dettagli sugli allergeni e caratteristiche
  const organizeProductsByCategory = (
    products: any[],
    allergensByProductId: Record<string, any[]>,
    featuresByProductId: Record<string, any[]>,
    allAllergensData: any[],
    allFeaturesData: any[]
  ) => {
    const result: Record<string, Product[]> = {};
    
    // Crea mappe per un accesso più veloce
    const allergensMap = allAllergensData.reduce((acc, allergen) => {
      acc[allergen.id] = allergen;
      return acc;
    }, {} as Record<string, any>);
    
    const featuresMap = allFeaturesData.reduce((acc, feature) => {
      acc[feature.id] = feature;
      return acc;
    }, {} as Record<string, any>);
    
    // Organizza i prodotti per categoria
    for (const product of products) {
      if (!result[product.category_id]) {
        result[product.category_id] = [];
      }
      
      // Aggiungi gli allergeni al prodotto
      const productAllergens = allergensByProductId[product.id] || [];
      const allergenDetails = productAllergens
        .map(item => allergensMap[item.allergen_id])
        .filter(Boolean)
        .sort((a, b) => a.number - b.number);
      
      // Aggiungi le caratteristiche al prodotto
      const productFeatures = featuresByProductId[product.id] || [];
      const featureDetails = productFeatures
        .map(item => featuresMap[item.feature_id])
        .filter(Boolean)
        .sort((a, b) => a.display_order - b.display_order);
      
      result[product.category_id].push({
        ...product,
        allergens: allergenDetails,
        features: featureDetails
      });
    }
    
    return result;
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
