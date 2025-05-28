
import { supabase } from "@/integrations/supabase/client";
import { Category, Product, Allergen } from "@/types/database";
import { CategoryNote } from "@/types/categoryNotes";
import { fetchCategories } from "./fetchCategories";
import { fetchProductsForCategories } from "./fetchProductsByCategory";
import { fetchAllergens } from "./fetchAllergens";
import { fetchProductFeatures, fetchProductLabels } from "./fetchFeaturesAndLabels";

// Funzione per recuperare le note categorie
const fetchCategoryNotes = async (): Promise<CategoryNote[]> => {
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

    // Trasforma i dati per includere l'array di categorie
    const notesWithCategories = data?.map(note => ({
      ...note,
      categories: note.category_notes_categories?.map((cnc: any) => cnc.category_id) || []
    })) || [];

    return notesWithCategories;
  } catch (error) {
    console.error('Errore nel fetch delle note categorie:', error);
    return [];
  }
};

export const fetchMenuDataOptimized = async (language: string) => {
  try {
    // Fetch parallelo di tutti i dati necessari
    const [
      categories,
      features,
      labels,
      allergens,
      categoryNotes
    ] = await Promise.all([
      fetchCategories(),
      fetchProductFeatures(language),
      fetchProductLabels(language),
      fetchAllergens(language),
      fetchCategoryNotes()
    ]);

    // Prepara le traduzioni per features e labels
    let featuresTranslations: Record<string, any[]> = {};
    let labelsTranslations: Record<string, any[]> = {};

    if (language !== 'it') {
      // Fetch traduzioni features
      if (features.length > 0) {
        const { data: featureTrans } = await supabase
          .from('translations')
          .select('*')
          .in('entity_id', features.map(f => f.id))
          .eq('entity_type', 'product_features')
          .eq('language', language);
        
        (featureTrans || []).forEach(tr => {
          if (!featuresTranslations[tr.entity_id]) featuresTranslations[tr.entity_id] = [];
          featuresTranslations[tr.entity_id].push(tr);
        });
      }

      // Fetch traduzioni labels
      if (labels.length > 0) {
        const { data: labelTrans } = await supabase
          .from('translations')
          .select('*')
          .in('entity_id', labels.map(l => l.id))
          .eq('entity_type', 'product_labels')
          .eq('language', language);
        
        (labelTrans || []).forEach(tr => {
          if (!labelsTranslations[tr.entity_id]) labelsTranslations[tr.entity_id] = [];
          labelsTranslations[tr.entity_id].push(tr);
        });
      }
    }

    // Fetch dei prodotti per tutte le categorie
    const products = await fetchProductsForCategories({
      categories,
      featuresTranslations,
      labelsTranslations,
      language
    });

    return {
      categories,
      products,
      allergens,
      categoryNotes
    };
  } catch (error) {
    console.error('Errore nel caricamento ottimizzato dei dati menu:', error);
    throw error;
  }
};
