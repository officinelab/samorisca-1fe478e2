
import { useState, useEffect } from "react";
import { Category, Product, ProductLabel } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useDashboardOperations = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [labels, setLabels] = useState<ProductLabel[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Reordering states
  const [isReorderingCategories, setIsReorderingCategories] = useState(false);
  const [isReorderingProducts, setIsReorderingProducts] = useState(false);
  const [reorderingCategoriesList, setReorderingCategoriesList] = useState<Category[]>([]);
  const [reorderingProductsList, setReorderingProductsList] = useState<Product[]>([]);

  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        loadCategories(),
        loadProducts(),
        loadLabels()
      ]);
    } catch (error) {
      console.error("Errore nel caricamento dei dati:", error);
      toast({
        title: "Errore",
        description: "Errore nel caricamento dei dati.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    setCategories(data || []);
  };

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        allergens:product_allergens(allergen:allergens(*)),
        features:product_to_features(feature:product_features(*))
      `)
      .order("display_order", { ascending: true });

    if (error) throw error;
    
    const processedProducts = (data || []).map(product => ({
      ...product,
      allergens: product.allergens?.map((pa: any) => pa.allergen).filter(Boolean) || [],
      features: product.features?.map((pf: any) => pf.feature).filter(Boolean) || []
    }));
    
    setProducts(processedProducts);
  };

  const loadLabels = async () => {
    const { data, error } = await supabase
      .from("product_labels")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    setLabels(data || []);
  };

  // Category operations
  const startReorderingCategories = () => {
    setIsReorderingCategories(true);
    setReorderingCategoriesList([...categories]);
  };

  const cancelReorderingCategories = () => {
    setIsReorderingCategories(false);
    setReorderingCategoriesList([]);
  };

  const moveCategoryInList = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === reorderingCategoriesList.length - 1)
    ) {
      return;
    }

    const newList = [...reorderingCategoriesList];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    setReorderingCategoriesList(newList);
  };

  const saveReorderCategories = async () => {
    const updatedCategories = reorderingCategoriesList.map((category, index) => ({
      ...category,
      display_order: index
    }));

    try {
      for (const category of updatedCategories) {
        const { error } = await supabase
          .from("categories")
          .update({ display_order: category.display_order })
          .eq("id", category.id);

        if (error) throw error;
      }

      setCategories(updatedCategories);
      setIsReorderingCategories(false);
      setReorderingCategoriesList([]);
      
      toast({
        title: "Successo",
        description: "Ordine delle categorie aggiornato con successo."
      });
    } catch (error) {
      console.error("Errore nel riordinamento delle categorie:", error);
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento dell'ordine delle categorie.",
        variant: "destructive"
      });
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa categoria? Tutti i prodotti associati verranno scollegati.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

      if (error) throw error;

      setCategories(categories.filter(c => c.id !== categoryId));
      if (selectedCategoryId === categoryId) {
        setSelectedCategoryId(null);
      }

      toast({
        title: "Successo",
        description: "Categoria eliminata con successo."
      });

      // Reload products to reflect category changes
      await loadProducts();
    } catch (error) {
      console.error("Errore nell'eliminazione della categoria:", error);
      toast({
        title: "Errore",
        description: "Errore nell'eliminazione della categoria.",
        variant: "destructive"
      });
    }
  };

  // Product operations
  const startReorderingProducts = () => {
    const filteredProducts = selectedCategoryId
      ? products.filter(p => p.category_id === selectedCategoryId)
      : products;
    
    setIsReorderingProducts(true);
    setReorderingProductsList([...filteredProducts]);
  };

  const cancelReorderingProducts = () => {
    setIsReorderingProducts(false);
    setReorderingProductsList([]);
  };

  const moveProductInList = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === reorderingProductsList.length - 1)
    ) {
      return;
    }

    const newList = [...reorderingProductsList];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    setReorderingProductsList(newList);
  };

  const saveReorderProducts = async () => {
    const updatedProducts = reorderingProductsList.map((product, index) => ({
      ...product,
      display_order: index
    }));

    try {
      for (const product of updatedProducts) {
        const { error } = await supabase
          .from("products")
          .update({ display_order: product.display_order })
          .eq("id", product.id);

        if (error) throw error;
      }

      // Update local state
      const allProducts = [...products];
      for (const updatedProduct of updatedProducts) {
        const index = allProducts.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          allProducts[index] = updatedProduct;
        }
      }
      setProducts(allProducts);
      setIsReorderingProducts(false);
      setReorderingProductsList([]);
      
      toast({
        title: "Successo",
        description: "Ordine dei prodotti aggiornato con successo."
      });
    } catch (error) {
      console.error("Errore nel riordinamento dei prodotti:", error);
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento dell'ordine dei prodotti.",
        variant: "destructive"
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo prodotto?")) {
      return;
    }

    try {
      // Delete product allergens first
      await supabase
        .from("product_allergens")
        .delete()
        .eq("product_id", productId);

      // Delete product features
      await supabase
        .from("product_to_features")
        .delete()
        .eq("product_id", productId);

      // Delete product prices
      await supabase
        .from("product_prices")
        .delete()
        .eq("product_id", productId);

      // Delete the product
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));
      if (selectedProductId === productId) {
        setSelectedProductId(null);
      }

      toast({
        title: "Successo",
        description: "Prodotto eliminato con successo."
      });
    } catch (error) {
      console.error("Errore nell'eliminazione del prodotto:", error);
      toast({
        title: "Errore",
        description: "Errore nell'eliminazione del prodotto.",
        variant: "destructive"
      });
    }
  };

  // Getters
  const selectedCategory = categories.find(c => c.id === selectedCategoryId) || null;
  const selectedProduct = products.find(p => p.id === selectedProductId) || null;
  
  const filteredProducts = selectedCategoryId
    ? products.filter(p => p.category_id === selectedCategoryId)
    : products;

  return {
    // Data
    categories,
    products: filteredProducts,
    labels,
    selectedCategoryId,
    selectedProductId,
    selectedCategory,
    selectedProduct,
    isLoading,

    // Reordering states
    isReorderingCategories,
    isReorderingProducts,
    reorderingCategoriesList,
    reorderingProductsList,

    // Actions
    setSelectedCategoryId,
    setSelectedProductId,
    loadData,

    // Category operations
    startReorderingCategories,
    cancelReorderingCategories,
    moveCategoryInList,
    saveReorderCategories,
    deleteCategory,

    // Product operations
    startReorderingProducts,
    cancelReorderingProducts,
    moveProductInList,
    saveReorderProducts,
    deleteProduct
  };
};
