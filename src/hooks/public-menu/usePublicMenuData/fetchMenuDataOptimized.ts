
import { fetchCategoriesOptimized } from "./fetchCategoriesOptimized";
import { fetchCategoryNotesOptimized } from "./fetchCategoryNotesOptimized";
import { fetchProductsOptimized } from "./fetchProductsOptimized";
import { fetchAllergensOptimized } from "./fetchAllergensOptimized";
import { clearCache } from "./cacheUtils";

export const fetchMenuDataOptimized = async (
  language: string, 
  signal?: AbortSignal
) => {
  const startTime = Date.now();
  console.log('🚀 Starting optimized menu data fetch for language:', language);

  try {
    // Controlla se la richiesta è stata cancellata prima di iniziare
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    // 1. Carica categorie e note in parallelo
    const [categories, categoryNotes] = await Promise.all([
      fetchCategoriesOptimized(language, signal),
      fetchCategoryNotesOptimized(signal)
    ]);

    console.log('📂 Categories loaded:', categories.length);

    // Controlla se la richiesta è stata cancellata dopo il primo caricamento
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    // 2. Se non ci sono categorie, ritorna dati vuoti
    if (categories.length === 0) {
      return { categories, products: {}, allergens: [], categoryNotes };
    }

    // 3. Carica prodotti e allergeni in parallelo
    const categoryIds = categories.map(c => c.id);
    const [products, allergens] = await Promise.all([
      fetchProductsOptimized(categoryIds, language, signal),
      fetchAllergensOptimized(language, signal)
    ]);

    // Controlla se la richiesta è stata cancellata dopo il caricamento completo
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const endTime = Date.now();
    console.log(`✅ Menu data fetch completed for language "${language}" in ${endTime - startTime}ms`);

    return {
      categories,
      products,
      allergens,
      categoryNotes
    };
  } catch (error: any) {
    // Rilancia gli errori di abort senza loggare
    if (error.name === 'AbortError') {
      throw error;
    }
    
    console.error('❌ Errore nel caricamento ottimizzato dei dati menu:', error);
    throw error;
  }
};

// Funzione per pulire la cache quando necessario
export const clearMenuDataCache = () => {
  console.log('🗑️ Clearing all menu cache');
  clearCache();
};
