
import { fetchCategoriesOptimized } from "./fetchCategoriesOptimized";
import { fetchCategoryNotesOptimized } from "./fetchCategoryNotesOptimized";
import { fetchProductsOptimized } from "./fetchProductsOptimized";
import { fetchAllergensOptimized } from "./fetchAllergensOptimized";
import { clearCache } from "./cacheUtils";

export const fetchMenuDataOptimized = async (language: string) => {
  const startTime = Date.now();
  console.log('🚀 Starting optimized menu data fetch for language:', language);

  try {
    // 1. Carica categorie e note in parallelo
    const [categories, categoryNotes] = await Promise.all([
      fetchCategoriesOptimized(),
      fetchCategoryNotesOptimized()
    ]);

    console.log('📂 Categories loaded:', categories.length);

    // 2. Se non ci sono categorie, ritorna dati vuoti
    if (categories.length === 0) {
      return { categories, products: {}, allergens: [], categoryNotes };
    }

    // 3. Carica prodotti e allergeni in parallelo
    const categoryIds = categories.map(c => c.id);
    const [products, allergens] = await Promise.all([
      fetchProductsOptimized(categoryIds, language),
      fetchAllergensOptimized(language)
    ]);

    const endTime = Date.now();
    console.log(`✅ Menu data fetch completed in ${endTime - startTime}ms`);

    return {
      categories,
      products,
      allergens,
      categoryNotes
    };
  } catch (error) {
    console.error('❌ Errore nel caricamento ottimizzato dei dati menu:', error);
    throw error;
  }
};

// Funzione per pulire la cache quando necessario
export const clearMenuDataCache = () => {
  clearCache();
};
