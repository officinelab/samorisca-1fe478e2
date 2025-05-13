
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Allergen, Category, Product } from "@/types/database";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export const usePublicMenuData = (isPreview = false, previewLanguage = 'it') => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState(previewLanguage);
  const { siteSettings } = useSiteSettings();

  // Set language based on preview settings
  useEffect(() => {
    if (isPreview) {
      setLanguage(previewLanguage);
    }
  }, [isPreview, previewLanguage]);

  // Load menu data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Load active categories ordered by display_order
        const {
          data: categoriesData,
          error: categoriesError
        } = await supabase.from('categories').select('*').eq('is_active', true).order('display_order', {
          ascending: true
        });
        
        if (categoriesError) throw categoriesError;
        setCategories(categoriesData || []);
        
        if (categoriesData && categoriesData.length > 0) {
          // Load products for each category
          const productsMap: Record<string, Product[]> = {};
          for (const category of categoriesData) {
            const {
              data: productsData,
              error: productsError
            } = await supabase.from('products').select('*').eq('category_id', category.id).eq('is_active', true).order('display_order', {
              ascending: true
            });
            
            if (productsError) throw productsError;

            // For each product, load associated allergens
            const productsWithAllergens = await Promise.all((productsData || []).map(async product => {
              const {
                data: productAllergens,
                error: allergensError
              } = await supabase.from('product_allergens').select('allergen_id').eq('product_id', product.id);
              
              if (allergensError) throw allergensError;
              
              let productAllergensDetails: Allergen[] = [];
              
              if (productAllergens && productAllergens.length > 0) {
                const allergenIds = productAllergens.map(pa => pa.allergen_id);
                const {
                  data: allergensDetails,
                  error: detailsError
                } = await supabase.from('allergens').select('*').in('id', allergenIds).order('number', {
                  ascending: true
                });
                
                if (detailsError) throw detailsError;
                
                // Applica le traduzioni agli allergeni se disponibili
                productAllergensDetails = (allergensDetails || []).map(allergen => {
                  // Prima controlla se esiste una traduzione per la lingua corrente
                  const translatedTitle = language !== 'it' && allergen[`title_${language}`] 
                    ? allergen[`title_${language}`] 
                    : allergen.title;
                    
                  const translatedDescription = language !== 'it' && allergen[`description_${language}`]
                    ? allergen[`description_${language}`]
                    : allergen.description;
                  
                  return {
                    ...allergen,
                    // Manteniamo i campi originali ma aggiungiamo i campi di visualizzazione
                    displayTitle: translatedTitle,
                    displayDescription: translatedDescription
                  };
                });
              }
              
              // Applica le traduzioni ai prodotti se disponibili
              const displayTitle = language !== 'it' && product[`title_${language}`]
                ? product[`title_${language}`]
                : product.title;
                
              const displayDescription = language !== 'it' && product[`description_${language}`]
                ? product[`description_${language}`]
                : product.description;
              
              return {
                ...product,
                allergens: productAllergensDetails,
                // Aggiungiamo campi di visualizzazione che non alterano la struttura originale
                displayTitle,
                displayDescription
              } as Product;
            }));
            
            productsMap[category.id] = productsWithAllergens;
          }
          
          setProducts(productsMap);
        }

        // Load all allergens
        const {
          data: allergensData,
          error: allergensError
        } = await supabase.from('allergens').select('*').order('number', {
          ascending: true
        });
        
        if (allergensError) throw allergensError;
        
        // Applica le traduzioni agli allergeni se disponibili
        const translatedAllergens = (allergensData || []).map(allergen => {
          const translatedTitle = language !== 'it' && allergen[`title_${language}`]
            ? allergen[`title_${language}`]
            : allergen.title;
            
          const translatedDescription = language !== 'it' && allergen[`description_${language}`]
            ? allergen[`description_${language}`]
            : allergen.description;
          
          return {
            ...allergen,
            displayTitle: translatedTitle,
            displayDescription: translatedDescription
          };
        });
        
        setAllergens(translatedAllergens);
        
      } catch (error) {
        console.error('Errore nel caricamento dei dati:', error);
        toast.error("Errore nel caricamento del menu. Riprova più tardi.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [language, isPreview, previewLanguage]);

  return {
    categories,
    products,
    allergens,
    isLoading,
    language,
    setLanguage
  };
};
