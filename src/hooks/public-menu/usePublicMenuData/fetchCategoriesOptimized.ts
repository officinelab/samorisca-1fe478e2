
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/database";
import { getCachedData, setCachedData } from "./cacheUtils";

export const fetchCategoriesOptimized = async (
  language: string = 'it',
  signal?: AbortSignal
): Promise<Category[]> => {
  const cacheKey = `categories-${language}`;
  const cached = getCachedData<Category[]>(cacheKey);
  
  if (cached) {
    console.log(`📦 Categories loaded from cache for language: ${language}`);
    return cached;
  }

  try {
    // Query base per le categorie
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    // Controlla abort signal
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    if (error) throw error;
    if (!categories || categories.length === 0) return [];

    // Se non è italiano, carica le traduzioni
    if (language !== 'it') {
      const categoryIds = categories.map(c => c.id);
      const { data: translations } = await supabase
        .from('translations')
        .select('*')
        .in('entity_id', categoryIds)
        .eq('entity_type', 'categories')
        .eq('language', language);

      // Controlla abort signal dopo query traduzioni
      if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }

      // Crea mappa traduzioni
      const translationsMap = new Map<string, Map<string, string>>();
      translations?.forEach(tr => {
        if (!translationsMap.has(tr.entity_id)) {
          translationsMap.set(tr.entity_id, new Map());
        }
        translationsMap.get(tr.entity_id)!.set(tr.field, tr.translated_text);
      });

      // Applica traduzioni
      const translatedCategories = categories.map(category => {
        const categoryTranslations = translationsMap.get(category.id);
        return {
          ...category,
          displayTitle: categoryTranslations?.get('title') || category.title,
          displayDescription: categoryTranslations?.get('description') || category.description
        };
      });

      setCachedData(cacheKey, translatedCategories);
      return translatedCategories;
    } else {
      // Per italiano, usa i campi originali
      const categoriesWithDisplay = categories.map(cat => ({
        ...cat,
        displayTitle: cat.title,
        displayDescription: cat.description
      }));
      
      setCachedData(cacheKey, categoriesWithDisplay);
      return categoriesWithDisplay;
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw error;
    }
    console.error('Error fetching categories:', error);
    throw error;
  }
};
