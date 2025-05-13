
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SupportedLanguage, TranslationStats } from '@/types/translation';

export const useTranslationStats = (language: SupportedLanguage) => {
  const [stats, setStats] = useState<TranslationStats>({
    total: 0,
    translated: 0,
    untranslated: 0,
    percentage: 0
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        // Get all translatable entities
        const [
          { data: categories, error: categoriesError },
          { data: products, error: productsError },
          { data: allergens, error: allergensError },
          { data: features, error: featuresError },
          { data: labels, error: labelsError }
        ] = await Promise.all([
          supabase.from('categories').select('id'),
          supabase.from('products').select('id'),
          supabase.from('allergens').select('id'),
          supabase.from('product_features').select('id'),
          supabase.from('product_labels').select('id')
        ]);

        if (categoriesError || productsError || allergensError || featuresError || labelsError) {
          console.error('Error fetching entities:', {
            categoriesError,
            productsError,
            allergensError,
            featuresError,
            labelsError
          });
          return;
        }

        // Calculate total number of translatable fields
        const categoryFields = categories.length; // title only
        const productFields = products.length * 2; // title and description
        const allergenFields = allergens.length * 2; // title and description
        const featureFields = features.length; // title only
        const labelFields = labels.length; // title only

        const totalFields = categoryFields + productFields + allergenFields + featureFields + labelFields;

        // Get translated fields count for this language
        const { data: translations, error: translationsError } = await supabase
          .from('translations')
          .select('*')
          .eq('language', language);

        if (translationsError) {
          console.error('Error fetching translations:', translationsError);
          return;
        }

        const translatedCount = translations ? translations.length : 0;
        const untranslatedCount = totalFields - translatedCount;
        const percentage = totalFields > 0 ? Math.round((translatedCount / totalFields) * 100) : 0;

        setStats({
          total: totalFields,
          translated: translatedCount,
          untranslated: untranslatedCount,
          percentage
        });
      } catch (error) {
        console.error('Error calculating translation stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [language]);

  return { stats, isLoading };
};
