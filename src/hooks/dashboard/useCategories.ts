
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/sonner";
import { Category } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Load categories
  const loadCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      setCategories(data || []);
      
      // Select first category if none is selected and categories exist
      if (data && data.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(data[0].id);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error("Error loading categories. Please try again later.");
    } finally {
      setIsLoadingCategories(false);
    }
  }, [selectedCategoryId]);

  // Select a category
  const selectCategory = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
  }, []);

  // Add a new category
  const addCategory = useCallback(async (categoryData: Partial<Category>) => {
    try {
      // Determine the next display_order
      const maxOrder = Math.max(...categories.map(c => c.display_order), 0);
      const nextOrder = maxOrder + 1;
      
      if (!categoryData.title) {
        toast.error("Title is required");
        return null;
      }
      
      const categoryToInsert = {
        title: categoryData.title,
        description: categoryData.description || null,
        image_url: categoryData.image_url || null,
        is_active: categoryData.is_active !== undefined ? categoryData.is_active : true,
        display_order: nextOrder
      };
      
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryToInsert])
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        await loadCategories();
        toast.success("Category added successfully!");
        return data[0];
      }
      return null;
    } catch (error: any) {
      console.error('Error adding category:', error);
      toast.error(`Error adding category: ${error.message || 'Please try again later.'}`);
      return null;
    }
  }, [categories, loadCategories]);

  // Update a category
  const updateCategory = useCallback(async (categoryId: string, categoryData: Partial<Category>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', categoryId);
      
      if (error) throw error;
      
      await loadCategories();
      toast.success("Category updated successfully!");
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error("Error updating category. Please try again later.");
      return false;
    }
  }, [loadCategories]);

  // Delete a category
  const deleteCategory = useCallback(async (categoryId: string) => {
    if (!confirm("Are you sure you want to delete this category? All associated products will also be deleted.")) {
      return false;
    }
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
      
      await loadCategories();
      toast.success("Category deleted successfully!");
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error("Error deleting category. Please try again later.");
      return false;
    }
  }, [loadCategories]);

  // Reorder a category
  const reorderCategory = useCallback(async (categoryId: string, direction: 'up' | 'down') => {
    // Find the index of the current category
    const currentIndex = categories.findIndex(c => c.id === categoryId);
    if (currentIndex === -1) return false;

    // Calculate the new index
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Verify that the new index is valid
    if (newIndex < 0 || newIndex >= categories.length) return false;
    
    // Create a copy of the categories array
    const updatedCategories = [...categories];
    
    // Get the categories involved
    const category1 = updatedCategories[currentIndex];
    const category2 = updatedCategories[newIndex];
    
    // Swap the display orders
    const tempOrder = category1.display_order;
    category1.display_order = category2.display_order;
    category2.display_order = tempOrder;
    
    // Update the local array
    [updatedCategories[currentIndex], updatedCategories[newIndex]] = 
      [updatedCategories[newIndex], updatedCategories[currentIndex]];
    
    // Update the state
    setCategories(updatedCategories);
    
    try {
      // Update the database with all required fields
      const updates = [
        { 
          id: category1.id, 
          display_order: category1.display_order,
          title: category1.title,
          description: category1.description,
          image_url: category1.image_url,
          is_active: category1.is_active
        },
        { 
          id: category2.id, 
          display_order: category2.display_order,
          title: category2.title,
          description: category2.description,
          image_url: category2.image_url,
          is_active: category2.is_active
        }
      ];
      
      const { error } = await supabase
        .from('categories')
        .upsert(updates);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error reordering categories:', error);
      toast.error("Error reordering categories. Please try again later.");
      // Reload categories in case of error
      loadCategories();
      return false;
    }
  }, [categories, loadCategories]);

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    selectedCategoryId,
    isLoadingCategories,
    editingCategory,
    setEditingCategory,
    selectCategory,
    loadCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategory
  };
};
