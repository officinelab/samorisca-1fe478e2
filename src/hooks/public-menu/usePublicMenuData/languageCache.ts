
interface LanguageCacheEntry {
  data: any;
  timestamp: number;
}

class LanguageCache {
  private cache = new Map<string, LanguageCacheEntry>();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > this.TTL;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const isExpired = Date.now() - entry.timestamp > this.TTL;
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

export const languageCache = new LanguageCache();

// Funzioni helper per compatibilità con il codice esistente
export const getLanguageCachedData = (language: string): any | null => {
  return languageCache.get(language);
};

export const setLanguageCachedData = (language: string, data: any): void => {
  languageCache.set(language, data);
};

export const clearLanguageCache = (language?: string): void => {
  if (language) {
    // Per una lingua specifica, non implementiamo più questa funzionalità
    // ma manteniamo la funzione per compatibilità
    console.log(`Clearing cache for language: ${language}`);
  } else {
    languageCache.clear();
  }
};

export const preloadLanguageData = async (
  language: string, 
  fetchFunction: (language: string) => Promise<any>
): Promise<void> => {
  try {
    // Controlla se i dati sono già in cache
    if (languageCache.has(language)) {
      return;
    }

    console.log(`Preloading data for language: ${language}`);
    const data = await fetchFunction(language);
    languageCache.set(language, data);
  } catch (error) {
    console.error(`Error preloading data for language ${language}:`, error);
  }
};
