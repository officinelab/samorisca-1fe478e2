
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { CategoryNote, CategoryNoteFormData } from "@/types/categoryNotes";

export const useCategoryNotes = () => {
  const [categoryNotes, setCategoryNotes] = useState<CategoryNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategoryNotes = async () => {
    try {
      setIsLoading(true);
      
      // Fetch notes con le categorie associate
      const { data: notesData, error: notesError } = await supabase
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

      if (notesError) throw notesError;

      // Trasforma i dati per includere l'array di categorie
      const notesWithCategories = notesData?.map(note => ({
        ...note,
        categories: note.category_notes_categories?.map((cnc: any) => cnc.category_id) || []
      })) || [];

      setCategoryNotes(notesWithCategories);
    } catch (error) {
      console.error('Errore nel caricamento delle note categorie:', error);
      toast.error("Errore nel caricamento delle note categorie");
    } finally {
      setIsLoading(false);
    }
  };

  const createCategoryNote = async (data: CategoryNoteFormData) => {
    try {
      // Calcola il prossimo display_order
      const maxOrder = categoryNotes.length > 0 
        ? Math.max(...categoryNotes.map(note => note.display_order))
        : 0;

      // Crea la nota
      const { data: noteData, error: noteError } = await supabase
        .from('category_notes')
        .insert({
          title: data.title,
          text: data.text,
          icon_url: data.icon_url || null,
          display_order: maxOrder + 1
        })
        .select()
        .single();

      if (noteError) throw noteError;

      // Crea le relazioni con le categorie
      if (data.categories.length > 0) {
        const categoryRelations = data.categories.map(categoryId => ({
          note_id: noteData.id,
          category_id: categoryId
        }));

        const { error: relationsError } = await supabase
          .from('category_notes_categories')
          .insert(categoryRelations);

        if (relationsError) throw relationsError;
      }

      toast.success("Nota categoria creata con successo");
      fetchCategoryNotes();
      return noteData;
    } catch (error) {
      console.error('Errore nella creazione della nota categoria:', error);
      toast.error("Errore nella creazione della nota categoria");
      throw error;
    }
  };

  const updateCategoryNote = async (id: string, data: CategoryNoteFormData) => {
    try {
      // Aggiorna la nota
      const { error: noteError } = await supabase
        .from('category_notes')
        .update({
          title: data.title,
          text: data.text,
          icon_url: data.icon_url || null
        })
        .eq('id', id);

      if (noteError) throw noteError;

      // Rimuovi le relazioni esistenti
      const { error: deleteError } = await supabase
        .from('category_notes_categories')
        .delete()
        .eq('note_id', id);

      if (deleteError) throw deleteError;

      // Crea le nuove relazioni
      if (data.categories.length > 0) {
        const categoryRelations = data.categories.map(categoryId => ({
          note_id: id,
          category_id: categoryId
        }));

        const { error: relationsError } = await supabase
          .from('category_notes_categories')
          .insert(categoryRelations);

        if (relationsError) throw relationsError;
      }

      toast.success("Nota categoria aggiornata con successo");
      fetchCategoryNotes();
    } catch (error) {
      console.error('Errore nell\'aggiornamento della nota categoria:', error);
      toast.error("Errore nell'aggiornamento della nota categoria");
      throw error;
    }
  };

  const deleteCategoryNote = async (id: string) => {
    try {
      const { error } = await supabase
        .from('category_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Nota categoria eliminata con successo");
      fetchCategoryNotes();
    } catch (error) {
      console.error('Errore nell\'eliminazione della nota categoria:', error);
      toast.error("Errore nell'eliminazione della nota categoria");
      throw error;
    }
  };

  const reorderCategoryNotes = async (reorderedNotes: CategoryNote[]) => {
    try {
      const updates = reorderedNotes.map((note, index) => ({
        id: note.id,
        display_order: index + 1
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('category_notes')
          .update({ display_order: update.display_order })
          .eq('id', update.id);

        if (error) throw error;
      }

      setCategoryNotes(reorderedNotes.map((note, index) => ({
        ...note,
        display_order: index + 1
      })));

      toast.success("Ordine aggiornato con successo");
    } catch (error) {
      console.error('Errore nel riordinamento:', error);
      toast.error("Errore nel riordinamento delle note");
      throw error;
    }
  };

  useEffect(() => {
    fetchCategoryNotes();
  }, []);

  return {
    categoryNotes,
    isLoading,
    createCategoryNote,
    updateCategoryNote,
    deleteCategoryNote,
    reorderCategoryNotes,
    refetch: fetchCategoryNotes
  };
};
