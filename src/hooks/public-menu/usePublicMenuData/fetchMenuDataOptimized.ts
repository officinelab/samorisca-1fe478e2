
import { supabase } from "@/integrations/supabase/client";
import { Category, Product, Allergen } from "@/types/database";
import { CategoryNote } from "@/types/categoryNotes";
import { fetchCategories } from "./fetchCategories";
import { fetchProductsForCategories } from "./fetchProductsByCategory";
import { fetchAllergens } from "./fetchAllergens";

// Funzione per recuperare le features e labels
const fetchFeaturesAndLabels = async (language: string) => {
  try {
    const [featuresResponse, labelsResponse] = await Promise.all([
      supabase
        .from('product_features')
        .select('*')
        .order('display_order'),
      supabase
        .from('product_labels')
        .select('*')
        .order('display_order')
    ]);

    return {
      features: featuresResponse.data || [],
      labels: labelsResponse.data || []
    };
  } catch (error) {
    console.error('Errore nel caricamento di features e labels:', error);
    return { features: [], labels: [] };
  }
};

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
      fetchProductsForCategories([category.id], language, features, labels, allergens)
        .then(results => results[category.id] || [])
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
