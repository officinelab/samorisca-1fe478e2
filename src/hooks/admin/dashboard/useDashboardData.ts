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
    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          label:label_id(*),
          product_allergens:product_allergens (
            allergen_id
          ),
          product_to_features:product_to_features (
            feature_id
          )
        `)
        .eq('category_id', categoryId)
        .order('display_order', { ascending: true });

      if (productsError) throw productsError;

      // NOTA: ora productsData[x].product_allergens è array di { allergen_id }
      //       idem per product_to_features

      const productsWithDetails = (productsData || []).map((product: any) => {
        const allergen_ids = Array.isArray(product.product_allergens)
          ? product.product_allergens.map((pa: any) => pa.allergen_id)
          : [];
        const feature_ids = Array.isArray(product.product_to_features)
          ? product.product_to_features.map((pf: any) => pf.feature_id)
          : [];
        // Mantieni il resto dei dati prodotto originale
        return {
          ...product,
          allergen_ids,
          feature_ids,
        } as Product & { allergen_ids: string[]; feature_ids: string[] };
      });

      setProducts(productsWithDetails);
      setSelectedProductId(null);
    } catch (error) {
      console.error('Error loading products:', error);
      throw error;
    }
  };

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
