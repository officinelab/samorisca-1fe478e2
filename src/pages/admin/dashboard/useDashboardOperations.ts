
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useDashboardOperations = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Categories query
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('position');
      
      if (error) throw error;
      return data;
    }
  });

  // Products query
  const { data: products = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['products', selectedCategoryId],
    queryFn: async () => {
      if (!selectedCategoryId) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          allergens:product_allergens(allergen:allergens(*)),
          features:product_features(feature:product_features_list(*)),
          label:product_labels(*)
        `)
        .eq('category_id', selectedCategoryId)
        .order('position');
      
      if (error) throw error;
      return data.map(product => ({
        ...product,
        allergens: product.allergens?.map(pa => pa.allergen) || [],
        features: product.features?.map(pf => pf.feature) || [],
        label: product.label?.[0] || null
      }));
    },
    enabled: !!selectedCategoryId
  });

  // Category operations
  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: "Categoria aggiornata con successo" });
    },
    onError: (error) => {
      toast({ 
        title: "Errore durante l'aggiornamento della categoria", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setSelectedCategoryId(null);
      setSelectedProductId(null);
      toast({ title: "Categoria eliminata con successo" });
    },
    onError: (error) => {
      toast({ 
        title: "Errore durante l'eliminazione della categoria", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  // Product operations
  const updateProductMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: "Prodotto aggiornato con successo" });
    },
    onError: (error) => {
      toast({ 
        title: "Errore durante l'aggiornamento del prodotto", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setSelectedProductId(null);
      toast({ title: "Prodotto eliminato con successo" });
    },
    onError: (error) => {
      toast({ 
        title: "Errore durante l'eliminazione del prodotto", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  // Reorder functions
  const reorderCategory = useCallback(async (categoryId: string, direction: 'up' | 'down') => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const sortedCategories = [...categories].sort((a, b) => a.position - b.position);
    const currentIndex = sortedCategories.findIndex(c => c.id === categoryId);
    
    if (direction === 'up' && currentIndex > 0) {
      const targetCategory = sortedCategories[currentIndex - 1];
      updateCategoryMutation.mutate({ 
        id: categoryId, 
        updates: { position: targetCategory.position } 
      });
      updateCategoryMutation.mutate({ 
        id: targetCategory.id, 
        updates: { position: category.position } 
      });
    } else if (direction === 'down' && currentIndex < sortedCategories.length - 1) {
      const targetCategory = sortedCategories[currentIndex + 1];
      updateCategoryMutation.mutate({ 
        id: categoryId, 
        updates: { position: targetCategory.position } 
      });
      updateCategoryMutation.mutate({ 
        id: targetCategory.id, 
        updates: { position: category.position } 
      });
    }
  }, [categories, updateCategoryMutation]);

  const reorderProduct = useCallback(async (productId: string, direction: 'up' | 'down') => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const sortedProducts = [...products].sort((a, b) => a.position - b.position);
    const currentIndex = sortedProducts.findIndex(p => p.id === productId);
    
    if (direction === 'up' && currentIndex > 0) {
      const targetProduct = sortedProducts[currentIndex - 1];
      updateProductMutation.mutate({ 
        id: productId, 
        updates: { position: targetProduct.position } 
      });
      updateProductMutation.mutate({ 
        id: targetProduct.id, 
        updates: { position: product.position } 
      });
    } else if (direction === 'down' && currentIndex < sortedProducts.length - 1) {
      const targetProduct = sortedProducts[currentIndex + 1];
      updateProductMutation.mutate({ 
        id: productId, 
        updates: { position: targetProduct.position } 
      });
      updateProductMutation.mutate({ 
        id: targetProduct.id, 
        updates: { position: product.position } 
      });
    }
  }, [products, updateProductMutation]);

  return {
    // State
    selectedCategoryId,
    selectedProductId,
    setSelectedCategoryId,
    setSelectedProductId,
    
    // Data
    categories,
    products,
    loadingCategories,
    loadingProducts,
    
    // Operations
    reorderCategory,
    reorderProduct,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate
  };
};
