
// Cache per evitare ricaricamenti inutili.
// Le chiavi sono prefissate con la versione di build, cos\u00ec ogni deploy
// invalida automaticamente i dati cached lato client.
declare const __BUILD_VERSION__: string;
const BUILD_VERSION: string =
  typeof __BUILD_VERSION__ !== 'undefined' ? __BUILD_VERSION__ : 'dev';

const dataCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuti

const versionedKey = (key: string) => `${BUILD_VERSION}::${key}`;

export const getCachedData = <T>(cacheKey: string): T | null => {
  const cached = dataCache.get(versionedKey(cacheKey));
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  return null;
};

export const setCachedData = <T>(cacheKey: string, data: T): void => {
  dataCache.set(versionedKey(cacheKey), { data, timestamp: Date.now() });
};

export const clearCache = (): void => {
  dataCache.clear();
  console.log('🧹 Menu data cache cleared');
};
