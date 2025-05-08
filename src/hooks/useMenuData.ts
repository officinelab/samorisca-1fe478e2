
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Category, Product, Allergen } from "@/types/database";

export const useMenuData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Carica i dati
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Carica categorie attive ordinate per display_order
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('display_order', { ascending: true });

        if (categoriesError) throw categoriesError;
        
        const activeCategories = categoriesData?.filter(c => c.is_active) || [];
        setCategories(activeCategories);
        
        // Seleziona tutte le categorie per default
        setSelectedCategories(activeCategories.map(c => c.id));
        
        // Carica prodotti per ogni categoria
        const productsMap: Record<string, Product[]> = {};
        
        for (const category of activeCategories) {
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', category.id)
            .eq('is_active', true)
            .order('display_order', { ascending: true });
            
          if (productsError) throw productsError;
          
          // Per ogni prodotto, carica gli allergeni associati
          const productsWithAllergens = await Promise.all(
            (productsData || []).map(async (product) => {
              const { data: productAllergens, error: allergensError } = await supabase
                .from('product_allergens')
                .select('allergen_id')
                .eq('product_id', product.id);
              
              if (allergensError) throw allergensError;
              
              let productAllergensDetails: { id: string; number: number; title: string }[] = [];
              if (productAllergens && productAllergens.length > 0) {
                const allergenIds = productAllergens.map(pa => pa.allergen_id);
                const { data: allergensDetails, error: detailsError } = await supabase
                  .from('allergens')
                  .select('id, number, title')
                  .in('id', allergenIds)
                  .order('number', { ascending: true });
                
                if (detailsError) throw detailsError;
                productAllergensDetails = allergensDetails || [];
              }
              
              return { ...product, allergens: productAllergensDetails } as Product;
            })
          );
          
          productsMap[category.id] = productsWithAllergens;
        }
        
        setProducts(productsMap);
        
        // Carica tutti gli allergeni
        const { data: allergensData, error: allergensError } = await supabase
          .from('allergens')
          .select('*')
          .order('number', { ascending: true });

        if (allergensError) throw allergensError;
        setAllergens(allergensData || []);
        
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
        toast.error("Errore nel caricamento dei dati. Riprova più tardi.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Gestisce il toggle delle categorie selezionate
  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  // Gestisce la selezione/deselezione di tutte le categorie
  const handleToggleAllCategories = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map(c => c.id));
    }
  };

  return {
    categories,
    products,
    allergens,
    isLoading,
    selectedCategories,
    setSelectedCategories,
    handleCategoryToggle,
    handleToggleAllCategories
  };
};
