
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/database";

interface CategorySelectorProps {
  selectedCategoryId: string;
  onCategoryChange: (value: string) => void;
}

export const CategorySelector = ({
  selectedCategoryId,
  onCategoryChange,
}: CategorySelectorProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, title, is_active, display_order, image_url, description')
          .order('display_order', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        setCategories(data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Categoria</h3>
      {loadingCategories ? (
        <div>Caricamento categorie...</div>
      ) : (
        <Select
          value={selectedCategoryId}
          onValueChange={onCategoryChange}
          disabled={categories.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleziona categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
