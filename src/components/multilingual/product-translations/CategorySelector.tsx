
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/database";

interface CategorySelectorProps {
  selectedCategoryId: string;
  onCategoryChange: (value: string) => void;
  onTranslateAll: () => void;
  translatingAll: boolean;
  loadingProducts: boolean;
  productsCount: number;
}

export const CategorySelector = ({
  selectedCategoryId,
  onCategoryChange,
  onTranslateAll,
  translatingAll,
  loadingProducts,
  productsCount
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
      <div className="flex gap-2 items-start">
        {loadingCategories ? (
          <div>Caricamento categorie...</div>
        ) : (
          <div className="flex-1">
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
          </div>
        )}
        
        <Button 
          variant="outline"
          size="sm"
          disabled={translatingAll || loadingProducts || productsCount === 0}
          onClick={onTranslateAll}
          className="whitespace-nowrap"
        >
          {translatingAll ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Traduzione...
            </>
          ) : (
            <>
              <Globe className="h-4 w-4 mr-2" />
              Traduci tutto
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
