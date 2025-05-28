
import { supabase } from "@/integrations/supabase/client";
import { CategoryNote } from "@/types/categoryNotes";
import { getCachedData, setCachedData } from "./cacheUtils";

export const fetchCategoryNotesOptimized = async (signal?: AbortSignal): Promise<CategoryNote[]> => {
  const cacheKey = 'categoryNotes';
  const cached = getCachedData<CategoryNote[]>(cacheKey);
  if (cached) {
    return cached;
  }

  // Controlla abort signal all'inizio
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
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

    // Controlla abort signal dopo la query
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

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
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    console.error('Errore nel fetch delle note categorie:', error);
    return [];
  }
};
