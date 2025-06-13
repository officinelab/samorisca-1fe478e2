
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
    
    // Carica i dati base
    await loadData();
    
    // Se la lingua non è italiano, carica le traduzioni
    if (language !== 'it') {
      console.log('🔤 Caricando traduzioni prodotti...');
      
      // Carica traduzioni per tutti i prodotti
      const allProducts = Object.values(products).flat();
      const productIds = allProducts.map(p => p.id);
      
      if (productIds.length > 0) {
        const { data: translations } = await supabase
          .from('translations')
          .select('*')
          .in('entity_id', productIds)
          .eq('entity_type', 'products')
          .eq('language', language);
        
        console.log(`📝 Caricate ${translations?.length || 0} traduzioni prodotti per ${language}`);
        
        // Applica le traduzioni ai prodotti
        if (translations) {
          const translationsMap = new Map();
          translations.forEach(t => {
            const key = `${t.entity_id}-${t.field}`;
            translationsMap.set(key, t.translated_text);
          });
          
          // Aggiorna i prodotti con le traduzioni
          const updatedProducts = { ...products };
          Object.keys(updatedProducts).forEach(categoryId => {
            updatedProducts[categoryId] = updatedProducts[categoryId].map(product => ({
              ...product,
              [`title_${language}`]: translationsMap.get(`${product.id}-title`) || product.title,
              [`description_${language}`]: translationsMap.get(`${product.id}-description`) || product.description,
              [`price_suffix_${language}`]: translationsMap.get(`${product.id}-price_suffix`) || product.price_suffix,
              [`price_variant_1_name_${language}`]: translationsMap.get(`${product.id}-price_variant_1_name`) || product.price_variant_1_name,
              [`price_variant_2_name_${language}`]: translationsMap.get(`${product.id}-price_variant_2_name`) || product.price_variant_2_name
            }));
          });
          
          console.log('✅ Traduzioni applicate ai prodotti');
        }
      }
    }
  };

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

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
