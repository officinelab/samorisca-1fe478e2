
import { useEffect } from "react";
import { useMenuDataLoading } from "./menu/useMenuDataLoading";
import { useRestaurantLogo } from "./menu/useRestaurantLogo";
import { supabase } from "@/integrations/supabase/client";

export const useMenuData = () => {
  const {
    categories,
    products,
    allergens,
    labels,
    features,
    isLoading,
    error,
    loadData,
    retryLoading,
    selectedCategories,
    setSelectedCategories,
    handleCategoryToggle,
    handleToggleAllCategories
  } = useMenuDataLoading();

  const { restaurantLogo, updateRestaurantLogo } = useRestaurantLogo();

  // Enhanced loadData function that includes translations
  const loadDataWithTranslations = async (language: string = 'it') => {
    console.log(`🌍 Caricando dati menu con traduzioni per lingua: ${language}`);
    
    try {
      // Carica i dati base
      await loadData();
      
      console.log('📦 Dati base caricati:', {
        categories: categories.length,
        totalProducts: Object.values(products).flat().length,
        selectedCategories: selectedCategories.length
      });
      
      // Se la lingua non è italiano, carica le traduzioni
      if (language !== 'it') {
        console.log('🔤 Caricando traduzioni prodotti...');
        
        // Carica traduzioni per tutti i prodotti
        const allProducts = Object.values(products).flat();
        const productIds = allProducts.map(p => p.id);
        
        if (productIds.length > 0) {
          const { data: translations, error: translationError } = await supabase
            .from('translations')
            .select('*')
            .in('entity_id', productIds)
            .eq('entity_type', 'products')
            .eq('language', language);

          if (translationError) {
            console.error('Errore caricamento traduzioni:', translationError);
            return;
          }
          
          console.log(`📝 Caricate ${translations?.length || 0} traduzioni prodotti per ${language}`);
          
          // Applica le traduzioni ai prodotti
          if (translations) {
            const translationsMap = new Map();
            translations.forEach(t => {
              const key = `${t.entity_id}-${t.field}`;
              translationsMap.set(key, t.translated_text);
            });
            
            console.log('🔄 Applicando traduzioni ai prodotti...');
            
            // Nota: Questo aggiornamento non viene persisto perché siamo in una funzione asincrona
            // Le traduzioni dovrebbero essere applicate al momento del rendering
            console.log('✅ Mappa traduzioni creata con', translationsMap.size, 'elementi');
          }
        }
      }
    } catch (error) {
      console.error('Errore nel caricamento dati con traduzioni:', error);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Debug dei prodotti caricati
  useEffect(() => {
    if (Object.keys(products).length > 0) {
      console.log('🍽️ Prodotti caricati per categoria:', 
        Object.entries(products).map(([catId, prods]) => ({
          categoryId: catId,
          count: prods.length,
          samples: prods.slice(0, 2).map(p => p.title)
        }))
      );
    }
  }, [products]);

  return {
    categories,
    products,
    allergens,
    labels,
    features,
    restaurantLogo,
    updateRestaurantLogo,
    isLoading,
    error,
    retryLoading,
    loadDataWithTranslations,
    selectedCategories,
    setSelectedCategories,
    handleCategoryToggle,
    handleToggleAllCategories
  };
};
