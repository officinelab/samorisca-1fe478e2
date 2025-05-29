
import { fetchCategoriesOptimized } from "./fetchCategoriesOptimized";
import { fetchCategoryNotesOptimized } from "./fetchCategoryNotesOptimized";
import { fetchProductsOptimized } from "./fetchProductsOptimized";
import { fetchAllergensOptimized } from "./fetchAllergensOptimized";
import { getLanguageCachedData, setLanguageCachedData } from "./languageCache";

export const fetchMenuDataOptimized = async (
  language: string, 
  signal?: AbortSignal
) => {
  const startTime = Date.now();
  console.log('🚀 Starting optimized menu data fetch for language:', language);

  // Controlla cache per lingua specifica
  const cachedData = getLanguageCachedData(language);
  if (cachedData) {
    console.log(`📦 Menu data loaded from cache for language: ${language}`);
    return cachedData;
  }

  try {
    // Controlla se la richiesta è stata cancellata prima di iniziare
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    // 1. Carica categorie e note in parallelo
    const [categories, categoryNotes] = await Promise.all([
      fetchCategoriesOptimized(language, signal),
      fetchCategoryNotesOptimized(language, signal)
    ]);

    console.log('📂 Categories loaded:', categories.length);

    // Controlla se la richiesta è stata cancellata dopo il primo caricamento
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    // 2. Se non ci sono categorie, ritorna dati vuoti ma li salva comunque in cache
    if (categories.length === 0) {
      const emptyData = { categories, products: {}, allergens: [], categoryNotes };
      setLanguageCachedData(language, emptyData);
      return emptyData;
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

    const result = {
      categories,
      products,
      allergens,
      categoryNotes
    };

    // Salva in cache per lingua specifica
    setLanguageCachedData(language, result);

    const endTime = Date.now();
    console.log(`✅ Menu data fetch completed for language "${language}" in ${endTime - startTime}ms`);

    return result;
  } catch (error: any) {
    // Rilancia gli errori di abort senza loggare
    if (error.name === 'AbortError') {
      throw error;
    }
    
    console.error('❌ Errore nel caricamento ottimizzato dei dati menu:', error);
    throw error;
  }
};

// Funzione per pulire solo la cache di una lingua specifica
export const clearMenuDataCache = (language?: string) => {
  if (language) {
    console.log(`🗑️ Clearing cache for language: ${language}`);
    // Non implementiamo più clearCache globale, usiamo languageCache
  } else {
    console.log('🗑️ Clearing all menu cache');
  }
};
