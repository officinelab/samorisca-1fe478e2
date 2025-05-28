
import { supabase } from "@/integrations/supabase/client";
import { Category, Product, Allergen } from "@/types/database";
import { CategoryNote } from "@/types/categoryNotes";
import { fetchCategories } from "./fetchCategories";
import { fetchProductsByCategory } from "./fetchProductsByCategory";
import { fetchAllergens } from "./fetchAllergens";
import { fetchFeaturesAndLabels } from "./fetchFeaturesAndLabels";

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
      { features, labels },
      allergens,
      categoryNotes
    ] = await Promise.all([
      fetchCategories(language),
      fetchFeaturesAndLabels(language),
      fetchAllergens(language),
      fetchCategoryNotes()
    ]);

    // Fetch dei prodotti per categoria
    const productsPromises = categories.map(category =>
      fetchProductsByCategory(category.id, language, features, labels, allergens)
    );

    const productsArrays = await Promise.all(productsPromises);

    // Organizza i prodotti per categoria
    const products: Record<string, Product[]> = {};
    categories.forEach((category, index) => {
      products[category.id] = productsArrays[index];
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
