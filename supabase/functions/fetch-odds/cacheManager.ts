
// Enhanced cache storage with TTL management and rate limit tracking
class CacheManager {
  private data: any = null;
  private lastFetched: number | null = null;
  private ttl: number = 20 * 60 * 1000; // Extended cache validity to 20 minutes
  private rateLimitHits: number = 0;
  private lastRateLimitTime: number | null = null;

  hasValidCache(): boolean {
    const now = Date.now();
    return !!(this.data && this.lastFetched && (now - this.lastFetched) < this.ttl);
  }

  hasCachedData(): boolean {
    return this.data !== null;
  }

  getCachedData(): any {
    return this.data;
  }

  getLastFetchedTime(): number {
    return this.lastFetched || 0;
  }

  updateCache(data: any): void {
    this.data = data;
    this.lastFetched = Date.now();
  }

  recordRateLimitHit(): void {
    this.rateLimitHits++;
    this.lastRateLimitTime = Date.now();
  }

  getRateLimitInfo(): { hits: number, lastHit: number | null } {
    return { hits: this.rateLimitHits, lastHit: this.lastRateLimitTime };
  }

  // Return cached data even if stale when we're hitting rate limits
  getCachedDataIfRateLimited(): any {
    const timeSinceLastRateLimit = this.lastRateLimitTime ? 
      Date.now() - this.lastRateLimitTime : 
      Infinity;
    
    // If we hit rate limit in the last hour, use cached data even if stale
    if (timeSinceLastRateLimit < 60 * 60 * 1000 && this.data) {
      return this.data;
    }
    
    return null;
  }

  clear(): void {
    this.data = null;
    this.lastFetched = null;
    console.log('Cache cleared');
  }
}

export const cacheManager = new CacheManager();
