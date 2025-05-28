
// Cache per evitare ricaricamenti inutili
const dataCache = new Map<string, any>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuti

export const getCachedData = <T>(cacheKey: string): T | null => {
  const cached = dataCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

export const setCachedData = <T>(cacheKey: string, data: T): void => {
  dataCache.set(cacheKey, { data, timestamp: Date.now() });
};

export const clearCache = (): void => {
  dataCache.clear();
  console.log('🧹 Menu data cache cleared');
};
