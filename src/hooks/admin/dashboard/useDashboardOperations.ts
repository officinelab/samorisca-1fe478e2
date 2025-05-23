
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { Category, Product, Allergen, ProductLabel, ProductFeature } from "@/types/database";

export const useDashboardOperations = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [labels, setLabels] = useState<ProductLabel[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Reordering states
  const [isReorderingCategories, setIsReorderingCategories] = useState(false);
  const [isReorderingProducts, setIsReorderingProducts] = useState(false);
  const [reorderingCategoriesList, setReorderingCategoriesList] = useState<Category[]>([]);
  const [reorderingProductsList, setReorderingProductsList] = useState<Product[]>([]);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId) || null;
  const selectedProduct = products.find(p => p.id === selectedProductId) || null;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadCategories(),
        loadAllergens(),
        loadLabels()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error("Errore nel caricamento dei dati. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

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
        loadProducts(data[0].id);
      } else if (selectedCategoryId) {
        loadProducts(selectedCategoryId);
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
      
      setProducts(productsWithDetails);
      setSelectedProductId(null);
    } catch (error) {
      console.error('Error loading products:', error);
      throw error;
    }
  };

  // Category reordering
  const startReorderingCategories = () => {
    setIsReorderingCategories(true);
    setReorderingCategoriesList([...categories]);
  };

  const cancelReorderingCategories = () => {
    setIsReorderingCategories(false);
    setReorderingCategoriesList([]);
  };

  const moveCategoryInList = (categoryId: string, direction: 'up' | 'down') => {
    const currentIndex = reorderingCategoriesList.findIndex(c => c.id === categoryId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= reorderingCategoriesList.length) return;
    
    const updatedList = [...reorderingCategoriesList];
    [updatedList[currentIndex], updatedList[newIndex]] = [updatedList[newIndex], updatedList[currentIndex]];
    
    setReorderingCategoriesList(updatedList);
  };

  const saveReorderCategories = async () => {
    try {
      const updates = reorderingCategoriesList.map((category, index) => ({
        id: category.id,
        display_order: index + 1,
        title: category.title,
        description: category.description,
        image_url: category.image_url,
        is_active: category.is_active
      }));
      
      const { error } = await supabase
        .from('categories')
        .upsert(updates);
      
      if (error) throw error;
      
      await loadCategories();
      setIsReorderingCategories(false);
      setReorderingCategoriesList([]);
      
      toast.success("Ordine delle categorie aggiornato con successo!");
    } catch (error) {
      console.error('Error reordering categories:', error);
      toast.error("Errore nel riordinamento delle categorie. Riprova più tardi.");
    }
  };

  // Product reordering
  const startReorderingProducts = () => {
    setIsReorderingProducts(true);
    setReorderingProductsList([...products]);
  };

  const cancelReorderingProducts = () => {
    setIsReorderingProducts(false);
    setReorderingProductsList([]);
  };

  const moveProductInList = (productId: string, direction: 'up' | 'down') => {
    const currentIndex = reorderingProductsList.findIndex(p => p.id === productId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= reorderingProductsList.length) return;
    
    const updatedList = [...reorderingProductsList];
    [updatedList[currentIndex], updatedList[newIndex]] = [updatedList[newIndex], updatedList[currentIndex]];
    
    setReorderingProductsList(updatedList);
  };

  const saveReorderProducts = async () => {
    try {
      const updates = reorderingProductsList.map((product, index) => ({
        id: product.id,
        display_order: index + 1,
        title: product.title,
        category_id: product.category_id,
        description: product.description,
        image_url: product.image_url,
        is_active: product.is_active,
        price_standard: product.price_standard,
        has_multiple_prices: product.has_multiple_prices,
        price_variant_1_name: product.price_variant_1_name,
        price_variant_1_value: product.price_variant_1_value,
        price_variant_2_name: product.price_variant_2_name,
        price_variant_2_value: product.price_variant_2_value,
        has_price_suffix: product.has_price_suffix,
        price_suffix: product.price_suffix,
        label_id: product.label_id
      }));
      
      const { error } = await supabase
        .from('products')
        .upsert(updates);
      
      if (error) throw error;
      
      if (selectedCategoryId) {
        await loadProducts(selectedCategoryId);
      }
      
      setIsReorderingProducts(false);
      setReorderingProductsList([]);
      
      toast.success("Ordine dei prodotti aggiornato con successo!");
    } catch (error) {
      console.error('Error reordering products:', error);
      toast.error("Errore nel riordinamento dei prodotti. Riprova più tardi.");
    }
  };

  // Delete operations
  const deleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
      
      await loadCategories();
      toast.success("Categoria eliminata con successo!");
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error("Errore nell'eliminazione della categoria. Riprova più tardi.");
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      if (selectedCategoryId) {
        await loadProducts(selectedCategoryId);
      }
      
      setSelectedProductId(null);
      toast.success("Prodotto eliminato con successo!");
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error("Errore nell'eliminazione del prodotto. Riprova più tardi.");
    }
  };

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
    isReorderingCategories,
    isReorderingProducts,
    reorderingCategoriesList,
    reorderingProductsList,
    setSelectedCategoryId,
    setSelectedProductId,
    loadData,
    loadProducts,
    startReorderingCategories,
    cancelReorderingCategories,
    moveCategoryInList,
    saveReorderCategories,
    deleteCategory,
    startReorderingProducts,
    cancelReorderingProducts,
    moveProductInList,
    saveReorderProducts,
    deleteProduct
  };
};
