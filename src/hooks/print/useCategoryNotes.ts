
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CategoryNote {
  id: string;
  title: string;
  text: string;
  icon_url?: string;
}

export const useCategoryNotes = () => {
  const [categoryNotes, setCategoryNotes] = useState<Record<string, CategoryNote[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategoryNotes = async () => {
    try {
      setIsLoading(true);
      
      // Carica le relazioni categoria-note
      const { data: relations, error: relationsError } = await supabase
        .from('category_notes_categories')
        .select(`
          category_id,
          note_id,
          category_notes (
            id,
            title,
            text,
            icon_url
          )
        `);

      if (relationsError) {
        throw relationsError;
      }

      // Organizza le note per categoria
      const notesByCategory: Record<string, CategoryNote[]> = {};
      
      relations?.forEach(relation => {
        const categoryId = relation.category_id;
        const note = relation.category_notes as CategoryNote;
        
        if (!notesByCategory[categoryId]) {
          notesByCategory[categoryId] = [];
        }
        
        notesByCategory[categoryId].push(note);
      });

      setCategoryNotes(notesByCategory);
      setError(null);
    } catch (err) {
      console.error('Errore caricamento note categorie:', err);
      setError('Errore nel caricamento delle note delle categorie');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategoryNotes();
  }, []);

  return {
    categoryNotes,
    isLoading,
    error,
    refetch: loadCategoryNotes
  };
};
