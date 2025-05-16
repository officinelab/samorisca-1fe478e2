
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/types/database";

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('*').eq('is_active', true).order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
}
