
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { fetchOddsData } from "./oddsService.ts";
import { corsHeaders } from "./corsUtils.ts";
import { cacheManager } from "./cacheManager.ts";
import { propsCacheManager } from "./propsCacheManager.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { forceRefresh } = await req.json();
    
    // Clear caches only on force refresh
    if (forceRefresh) {
      console.log('Force refresh requested - clearing all caches');
      cacheManager.clear();
      propsCacheManager.clear();
    }
    
    // Check if we have valid cached data
    if (!forceRefresh && cacheManager.hasValidCache()) {
      const propsStats = propsCacheManager.getStats();
      console.log('Returning cached odds data from', new Date(cacheManager.getLastFetchedTime()).toISOString());
      console.log(`Player props cache: ${propsStats.size} entries, oldest ${propsStats.oldestAge}s`);
      return new Response(JSON.stringify(cacheManager.getCachedData()), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Check if we've been hitting rate limits recently - if so, use stale cache
    const rateLimitedCache = cacheManager.getCachedDataIfRateLimited();
    if (!forceRefresh && rateLimitedCache) {
      console.log('Returning stale cached data due to recent rate limiting');
      return new Response(JSON.stringify(rateLimitedCache), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Fetch fresh odds data with updated API key
    const processedGames = await fetchOddsData();
    
    // Update cache
    cacheManager.updateCache(processedGames);

    console.log('Successfully processed odds data with player props');
    console.log('Number of games returned:', processedGames.length);

    return new Response(JSON.stringify(processedGames), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in edge function:', error)
    
    // Handle specific API quota exceeded error
    if (error.message && error.message.includes('API_QUOTA_EXCEEDED')) {
      console.log('API quota exceeded - checking for cached data...');
      
      // If we have any cached data (even stale), return it with quota warning
      if (cacheManager.hasCachedData()) {
        console.log('Returning stale cached data due to API quota exceeded');
        const cachedData = cacheManager.getCachedData();
        
        return new Response(JSON.stringify({
          games: cachedData,
          warning: 'API_QUOTA_EXCEEDED',
          message: 'Using cached data - API usage quota exceeded. Please upgrade your plan at the-odds-api.com',
          cached_at: new Date(cacheManager.getLastFetchedTime()).toISOString()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      // No cache available - return quota error with sample data
      const { SAMPLE_API_RESPONSE } = await import("./sampleData.ts");
      return new Response(JSON.stringify({
        games: SAMPLE_API_RESPONSE,
        error: 'API_QUOTA_EXCEEDED',
        message: 'API usage quota exceeded. Using sample data. Please upgrade your plan at the-odds-api.com',
        is_sample_data: true
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Track if this was a rate limit error
    if (error.message.includes('rate limit') || error.message.includes('429')) {
      cacheManager.recordRateLimitHit();
      console.log('Recorded rate limit hit');
    }
    
    // If we have stale cache data, return that instead of sample data
    if (cacheManager.hasCachedData()) {
      console.log('Returning stale cached data due to fetch error');
      const rateLimitInfo = cacheManager.getRateLimitInfo();
      console.log(`Rate limit stats: ${rateLimitInfo.hits} hits, last hit: ${rateLimitInfo.lastHit ? new Date(rateLimitInfo.lastHit).toISOString() : 'never'}`);
      
      return new Response(JSON.stringify({
        games: cacheManager.getCachedData(),
        warning: 'USING_CACHED_DATA',
        message: 'API temporarily unavailable - using cached data',
        cached_at: new Date(cacheManager.getLastFetchedTime()).toISOString(),
        error_details: error.message
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Fall back to sample data if no cache is available
    const { SAMPLE_API_RESPONSE } = await import("./sampleData.ts");
    return new Response(
      JSON.stringify({ 
        games: SAMPLE_API_RESPONSE,
        error: error.message, 
        warning: 'USING_SAMPLE_DATA',
        message: 'API unavailable - using sample data for demonstration',
        is_sample_data: true
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
