
import { supabase } from "@/integrations/supabase/client";
import { CategoryNote } from "@/types/categoryNotes";
import { getCachedData, setCachedData } from "./cacheUtils";

export const fetchCategoryNotesOptimized = async (): Promise<CategoryNote[]> => {
  const cacheKey = 'categoryNotes';
  const cached = getCachedData<CategoryNote[]>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const { data, error } = await supabase
      .from('category_notes')
      .select(`
        id,
        title,
        text,
        icon_url,
        display_order,
        created_at,
        updated_at,
        category_notes_categories!inner(category_id)
      `)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Errore nel caricamento delle note categorie:', error);
      return [];
    }

    const notesWithCategories = data?.map(note => ({
      ...note,
      categories: note.category_notes_categories?.map((cnc: any) => cnc.category_id) || []
    })) || [];

    setCachedData(cacheKey, notesWithCategories);
    return notesWithCategories;
  } catch (error) {
    console.error('Errore nel fetch delle note categorie:', error);
    return [];
  }
};
