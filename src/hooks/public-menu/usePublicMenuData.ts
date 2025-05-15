
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { Allergen, Category, Product } from "@/types/database";
import { useSiteSettings } from "@/hooks/useSiteSettings";

import { fetchCategories } from "./usePublicMenuData/fetchCategories";
import { fetchProductFeatures, fetchProductLabels } from "./usePublicMenuData/fetchFeaturesAndLabels";
import { fetchProductsForCategories } from "./usePublicMenuData/fetchProductsByCategory";
import { fetchAllergens } from "./usePublicMenuData/fetchAllergens";

export const usePublicMenuData = (isPreview = false, previewLanguage = 'it') => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Record<string, Product[]>>({});
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState(previewLanguage);

  const { siteSettings } = useSiteSettings();

  useEffect(() => {
    if (isPreview) {
      setLanguage(previewLanguage);
    }
  }, [isPreview, previewLanguage]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Categorie
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);

        let featuresTranslations: Record<string, any[]> = {};
        let featuresData = await fetchProductFeatures(language);
        if (featuresData.length > 0 && language !== 'it') {
          const { supabase } = await import("@/integrations/supabase/client");
          const { data: featuresTrans } = await supabase
            .from('translations')
            .select('*')
            .in('entity_id', featuresData.map(f => f.id))
            .eq('entity_type', 'product_features')
            .eq('language', language);
          (featuresTrans || []).forEach(tr => {
            if (!featuresTranslations[tr.entity_id]) featuresTranslations[tr.entity_id] = [];
            featuresTranslations[tr.entity_id].push(tr);
          });
        }

        let labelsTranslations: Record<string, any[]> = {};
        let labelsData = await fetchProductLabels(language);
        if (labelsData.length > 0 && language !== 'it') {
          const { supabase } = await import("@/integrations/supabase/client");
          const { data: labelsTrans } = await supabase
            .from('translations')
            .select('*')
            .in('entity_id', labelsData.map(l => l.id))
            .eq('entity_type', 'product_labels')
            .eq('language', language);
          (labelsTrans || []).forEach(tr => {
            if (!labelsTranslations[tr.entity_id]) labelsTranslations[tr.entity_id] = [];
            labelsTranslations[tr.entity_id].push(tr);
          });
        }

        let productsMap: Record<string, Product[]> = {};
        if (categoriesData && categoriesData.length > 0) {
          productsMap = await fetchProductsForCategories({
            categories: categoriesData,
            featuresTranslations,
            labelsTranslations,
            language,
          });
        }
        setProducts(productsMap);

        const translatedAllergens = await fetchAllergens(language);
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
