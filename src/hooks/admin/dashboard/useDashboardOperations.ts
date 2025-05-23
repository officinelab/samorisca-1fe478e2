
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Category, Product, ProductLabel } from "@/types/database";
import { toast } from "sonner";

export const useDashboardOperations = () => {
  const queryClient = useQueryClient();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // Reordering states
  const [isReorderingCategories, setIsReorderingCategories] = useState(false);
  const [isReorderingProducts, setIsReorderingProducts] = useState(false);
  const [reorderingCategoriesList, setReorderingCategoriesList] = useState<Category[]>([]);
  const [reorderingProductsList, setReorderingProductsList] = useState<Product[]>([]);

  // Fetch categories
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as Category[];
    },
  });

  // Fetch products for selected category
  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products", selectedCategoryId],
    queryFn: async () => {
      if (!selectedCategoryId) return [];
      
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", selectedCategoryId)
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as Product[];
    },
    enabled: !!selectedCategoryId,
  });

  // Fetch labels
  const { data: labels = [] } = useQuery({
    queryKey: ["product-labels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_labels")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (error) throw error;
      return data as ProductLabel[];
    },
  });

  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId) || null;
  const selectedProduct = products.find(prod => prod.id === selectedProductId) || null;

  const isLoading = categoriesLoading || productsLoading;

  // Category reordering functions
  const startReorderingCategories = () => {
    setIsReorderingCategories(true);
    setReorderingCategoriesList([...categories]);
  };

  const cancelReorderingCategories = () => {
    setIsReorderingCategories(false);
    setReorderingCategoriesList([]);
  };

  const moveCategoryInList = (index: number, direction: "up" | "down") => {
    const newList = [...reorderingCategoriesList];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    setReorderingCategoriesList(newList);
  };

  const saveReorderCategories = async () => {
    try {
      const updates = reorderingCategoriesList.map((category, index) => ({
        id: category.id,
        display_order: index + 1,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from("categories")
          .update({ display_order: update.display_order })
          .eq("id", update.id);
        
        if (error) throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsReorderingCategories(false);
      setReorderingCategoriesList([]);
      toast.success("Ordine categorie salvato con successo");
    } catch (error) {
      console.error("Errore nel salvare l'ordine delle categorie:", error);
      toast.error("Errore nel salvare l'ordine delle categorie");
    }
  };

  // Product reordering functions
  const startReorderingProducts = () => {
    setIsReorderingProducts(true);
    setReorderingProductsList([...products]);
  };

  const cancelReorderingProducts = () => {
    setIsReorderingProducts(false);
    setReorderingProductsList([]);
  };

  const moveProductInList = (index: number, direction: "up" | "down") => {
    const newList = [...reorderingProductsList];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    setReorderingProductsList(newList);
  };

  const saveReorderProducts = async () => {
    try {
      const updates = reorderingProductsList.map((product, index) => ({
        id: product.id,
        display_order: index + 1,
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from("products")
          .update({ display_order: update.display_order })
          .eq("id", update.id);
        
        if (error) throw error;
      }

      await queryClient.invalidateQueries({ queryKey: ["products", selectedCategoryId] });
      setIsReorderingProducts(false);
      setReorderingProductsList([]);
      toast.success("Ordine prodotti salvato con successo");
    } catch (error) {
      console.error("Errore nel salvare l'ordine dei prodotti:", error);
      toast.error("Errore nel salvare l'ordine dei prodotti");
    }
  };

  // Delete functions
  const deleteCategory = async (categoryId: string) => {
    try {
      // First delete all products in this category
      const { error: productsError } = await supabase
        .from("products")
        .delete()
        .eq("category_id", categoryId);
      
      if (productsError) throw productsError;

      // Then delete the category
      const { error: categoryError } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);
      
      if (categoryError) throw categoryError;

      await queryClient.invalidateQueries({ queryKey: ["categories"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      
      if (selectedCategoryId === categoryId) {
        setSelectedCategoryId(null);
        setSelectedProductId(null);
      }
      
      toast.success("Categoria eliminata con successo");
    } catch (error) {
      console.error("Errore nell'eliminazione della categoria:", error);
      toast.error("Errore nell'eliminazione della categoria");
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);
      
      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["products", selectedCategoryId] });
      
      if (selectedProductId === productId) {
        setSelectedProductId(null);
      }
      
      toast.success("Prodotto eliminato con successo");
    } catch (error) {
      console.error("Errore nell'eliminazione del prodotto:", error);
      toast.error("Errore nell'eliminazione del prodotto");
    }
  };

  const loadData = async () => {
    await queryClient.invalidateQueries({ queryKey: ["categories"] });
    await queryClient.invalidateQueries({ queryKey: ["products"] });
    await queryClient.invalidateQueries({ queryKey: ["product-labels"] });
  };

  return {
    // Data
    categories,
    products,
    labels,
    
    // Selection state
    selectedCategoryId,
    selectedProductId,
    selectedCategory,
    selectedProduct,
    
    // Loading state
    isLoading,
    
    // Reordering state
    isReorderingCategories,
    isReorderingProducts,
    reorderingCategoriesList,
    reorderingProductsList,
    
    // Selection functions
    setSelectedCategoryId,
    setSelectedProductId,
    
    // Data functions
    loadData,
    
    // Category reordering functions
    startReorderingCategories,
    cancelReorderingCategories,
    moveCategoryInList,
    saveReorderCategories,
    
    // Product reordering functions
    startReorderingProducts,
    cancelReorderingProducts,
    moveProductInList,
    saveReorderProducts,
    
    // Delete functions
    deleteCategory,
    deleteProduct,
  };
};
