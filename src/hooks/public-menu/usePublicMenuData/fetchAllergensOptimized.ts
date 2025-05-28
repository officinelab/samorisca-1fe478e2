
import { supabase } from "@/integrations/supabase/client";
import { Allergen } from "@/types/database";
import { getCachedData, setCachedData } from "./cacheUtils";

export const fetchAllergensOptimized = async (
  language: string,
  signal?: AbortSignal
): Promise<Allergen[]> => {
  const cacheKey = `allergens-${language}`;
  const cached = getCachedData<Allergen[]>(cacheKey);
  
  if (cached) {
    console.log(`📦 Allergens loaded from cache for language: ${language}`);
    return cached;
  }

  // Controlla abort signal all'inizio
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  const [allergensResult, translationsResult] = await Promise.all([
    supabase.from('allergens').select('*').order('number', { ascending: true }),
    language !== 'it' 
      ? supabase.from('translations').select('*').eq('entity_type', 'allergens').eq('language', language)
      : Promise.resolve({ data: null })
  ]);

  // Controlla abort signal dopo le query
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  if (allergensResult.error) throw allergensResult.error;

  const translationsMap = new Map<string, Map<string, string>>();
  translationsResult.data?.forEach((tr: any) => {
    if (!translationsMap.has(tr.entity_id)) {
      translationsMap.set(tr.entity_id, new Map());
    }
    translationsMap.get(tr.entity_id)!.set(tr.field, tr.translated_text);
  });

  const result = (allergensResult.data || []).map(allergen => {
    const translations = translationsMap.get(allergen.id);
    return {
      ...allergen,
      displayTitle: translations?.get('title') || allergen.title,
      displayDescription: translations?.get('description') || allergen.description
    };
  });

  setCachedData(cacheKey, result);
  return result;
};
