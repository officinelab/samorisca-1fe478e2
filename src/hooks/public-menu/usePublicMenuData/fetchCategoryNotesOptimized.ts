
import { supabase } from "@/integrations/supabase/client";
import { CategoryNote } from "@/types/categoryNotes";
import { getCachedData, setCachedData } from "./cacheUtils";

export const fetchCategoryNotesOptimized = async (language: string = 'it', signal?: AbortSignal): Promise<CategoryNote[]> => {
  const cacheKey = `categoryNotes_${language}`;
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

    let notesWithCategories = data?.map(note => ({
      ...note,
      categories: note.category_notes_categories?.map((cnc: any) => cnc.category_id) || []
    })) || [];

    // Se la lingua è diversa dall'italiano, recupera le traduzioni
    if (language !== 'it' && notesWithCategories.length > 0) {
      const noteIds = notesWithCategories.map(note => note.id);
      
      const { data: translations, error: translationsError } = await supabase
        .from('translations')
        .select('entity_id, field, translated_text')
        .eq('entity_type', 'category_notes')
        .eq('language', language)
        .in('entity_id', noteIds);

      if (!translationsError && translations) {
        // Crea una mappa delle traduzioni
        const translationsMap: Record<string, Record<string, string>> = {};
        translations.forEach(translation => {
          if (!translationsMap[translation.entity_id]) {
            translationsMap[translation.entity_id] = {};
          }
          translationsMap[translation.entity_id][translation.field] = translation.translated_text;
        });

        // Aggiungi le traduzioni alle note
        notesWithCategories = notesWithCategories.map(note => ({
          ...note,
          displayTitle: translationsMap[note.id]?.title || note.title,
          displayText: translationsMap[note.id]?.text || note.text,
        }));
      }
    } else {
      // Per l'italiano, usa i campi originali come display
      notesWithCategories = notesWithCategories.map(note => ({
        ...note,
        displayTitle: note.title,
        displayText: note.text,
      }));
    }

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
