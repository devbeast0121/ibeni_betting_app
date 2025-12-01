// Separate cache manager for player props
class PropsCacheManager {
  private cache: Map<string, { data: any, timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
  
  // Get cached props for a specific game
  get(gameId: string): any | null {
    const cached = this.cache.get(gameId);
    
    if (!cached) {
      return null;
    }
    
    const now = Date.now();
    const age = now - cached.timestamp;
    
    // Return cached data if still valid
    if (age < this.CACHE_DURATION) {
      console.log(`Using cached player props for game ${gameId} (age: ${Math.floor(age / 1000)}s)`);
      return cached.data;
    }
    
    // Cache expired, remove it
    console.log(`Player props cache expired for game ${gameId}`);
    this.cache.delete(gameId);
    return null;
  }
  
  // Set cached props for a specific game
  set(gameId: string, data: any): void {
    this.cache.set(gameId, {
      data,
      timestamp: Date.now()
    });
    console.log(`Cached player props for game ${gameId}`);
  }
  
  // Check if we should refresh props (cache is getting old)
  shouldRefresh(gameId: string): boolean {
    const cached = this.cache.get(gameId);
    
    if (!cached) {
      return true;
    }
    
    const age = Date.now() - cached.timestamp;
    const refreshThreshold = 20 * 60 * 1000; // Refresh after 20 minutes
    
    return age > refreshThreshold;
  }
  
  // Clear all cached props
  clear(): void {
    console.log(`Clearing player props cache (${this.cache.size} entries)`);
    this.cache.clear();
  }
  
  // Get cache stats
  getStats(): { size: number, oldestAge: number } {
    const now = Date.now();
    let oldestAge = 0;
    
    this.cache.forEach(entry => {
      const age = now - entry.timestamp;
      if (age > oldestAge) {
        oldestAge = age;
      }
    });
    
    return {
      size: this.cache.size,
      oldestAge: Math.floor(oldestAge / 1000)
    };
  }
}

export const propsCacheManager = new PropsCacheManager();
