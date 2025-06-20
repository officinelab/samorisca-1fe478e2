
// Cache system for measurement results
interface MeasurementCacheEntry {
  height: number;
  timestamp: number;
  layoutHash: string;
}

class MeasurementCache {
  private cache = new Map<string, MeasurementCacheEntry>();
  private readonly CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  generateContentHash(content: any, layout: any): string {
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    const layoutStr = JSON.stringify({
      fontSize: layout?.fontSize,
      fontFamily: layout?.fontFamily,
      margin: layout?.margin,
      spacing: layout?.spacing
    });
    
    // Simple hash function
    let hash = 0;
    const str = contentStr + layoutStr;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return hash.toString(36);
  }

  get(key: string, layoutHash: string): number | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // Check if cache is expired or layout changed
    if (Date.now() - entry.timestamp > this.CACHE_EXPIRY || entry.layoutHash !== layoutHash) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.height;
  }

  set(key: string, height: number, layoutHash: string): void {
    this.cache.set(key, {
      height,
      timestamp: Date.now(),
      layoutHash
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const measurementCache = new MeasurementCache();
