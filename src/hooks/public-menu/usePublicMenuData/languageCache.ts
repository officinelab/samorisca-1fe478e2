
// Cache separata per lingua con strategia ottimizzata
const languageCache = new Map<string, {
  categories: any[];
  products: Record<string, any[]>;
  allergens: any[];
  categoryNotes: any[];
  timestamp: number;
  translationsOnly?: boolean; // Flag per cache che contiene solo traduzioni
}>();

const CACHE_DURATION = 10 * 60 * 1000; // 10 minuti per dati completi
const TRANSLATION_CACHE_DURATION = 30 * 60 * 1000; // 30 minuti per sole traduzioni

export const getLanguageCachedData = (language: string) => {
  const cached = languageCache.get(language);
  if (!cached) return null;
  
  const maxAge = cached.translationsOnly ? TRANSLATION_CACHE_DURATION : CACHE_DURATION;
  if (Date.now() - cached.timestamp > maxAge) {
    languageCache.delete(language);
    return null;
  }
  
  return cached;
};

export const setLanguageCachedData = (
  language: string, 
  data: {
    categories: any[];
    products: Record<string, any[]>;
    allergens: any[];
    categoryNotes: any[];
  },
  translationsOnly = false
) => {
  languageCache.set(language, {
    ...data,
    timestamp: Date.now(),
    translationsOnly
  });
};

export const clearLanguageCache = (language?: string) => {
  if (language) {
    languageCache.delete(language);
    console.log(`🧹 Cache cleared for language: ${language}`);
  } else {
    languageCache.clear();
    console.log('🧹 All language cache cleared');
  }
};

export const preloadLanguageData = async (
  language: string,
  fetchFunction: (lang: string, signal?: AbortSignal) => Promise<any>
) => {
  if (getLanguageCachedData(language)) {
    console.log(`⚡ Language ${language} already cached`);
    return;
  }

  try {
    console.log(`🔄 Preloading data for language: ${language}`);
    const data = await fetchFunction(language);
    setLanguageCachedData(language, data);
    console.log(`✅ Preloaded data for language: ${language}`);
  } catch (error) {
    console.warn(`⚠️ Failed to preload language ${language}:`, error);
  }
};
