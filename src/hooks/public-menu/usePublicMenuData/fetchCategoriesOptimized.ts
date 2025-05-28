
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/database";
import { getCachedData, setCachedData } from "./cacheUtils";

export const fetchCategoriesOptimized = async (): Promise<Category[]> => {
  const cacheKey = 'categories';
  const cached = getCachedData<Category[]>(cacheKey);
  if (cached) {
    return cached;
  }

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) throw error;
  
  const result = data || [];
  setCachedData(cacheKey, result);
  return result;
};
