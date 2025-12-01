
import { propsManager } from "./propsManager.ts";
import { propsCacheManager } from "./propsCacheManager.ts";
import { SAMPLE_API_RESPONSE } from "./sampleData.ts";

export async function fetchOddsData(): Promise<any[]> {
  // Get API key from environment
  const API_KEY = Deno.env.get('NEW_ODDS_API_KEY')
  
  if (!API_KEY) {
    console.error("API key environment variable is not set")
    throw new Error('API key is not configured')
  }

  console.log('Attempting to fetch live odds with API key:', API_KEY.substring(0, 8) + '...')
  
  // Test API key with a simple request first
  console.log('Testing API key validity...')
  try {
    const testResponse = await fetch(
      `https://api.the-odds-api.com/v4/sports?apiKey=${API_KEY}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.error(`API key test failed: ${testResponse.status} - ${testResponse.statusText}`);
      console.error('Error details:', errorText);
      
      if (testResponse.status === 401) {
        throw new Error('Invalid API key - please verify your NEW_ODDS_API_KEY in Supabase secrets. The key may be invalid, expired, or have insufficient permissions.');
      } else if (testResponse.status === 429) {
        throw new Error('API rate limit exceeded - please check your usage limits at the-odds-api.com');
      } else if (testResponse.status === 403) {
        throw new Error('API access forbidden - your API key may not have permission to access odds data. Check your subscription plan.');
      }
      
      throw new Error(`API test failed with status ${testResponse.status}: ${errorText}`);
    }
    
    const testData = await testResponse.json();
    console.log(`API key test successful! Found ${testData.length} available sports`);
    
    // Log remaining requests
    const remainingRequests = testResponse.headers.get('x-requests-remaining');
    if (remainingRequests) {
      console.log(`Remaining API requests: ${remainingRequests}`);
      
      // If no requests remaining, throw specific error
      if (parseInt(remainingRequests) === 0) {
        console.error(`API usage quota exceeded! 0 requests remaining.`);
        throw new Error('API_QUOTA_EXCEEDED: Your odds API usage quota has been reached. Please upgrade your plan at the-odds-api.com or wait for quota renewal.');
      }
      
      // Warn if running low on requests
      if (parseInt(remainingRequests) < 10) {
        console.warn(`Warning: Only ${remainingRequests} API requests remaining!`);
      }
    }
    
  } catch (error) {
    console.error('API key test error:', error);
    
    // Handle specific quota exceeded error
    if (error.message && error.message.includes('OUT_OF_USAGE_CREDITS')) {
      throw new Error('API_QUOTA_EXCEEDED: Your odds API usage quota has been reached. Please upgrade your plan at the-odds-api.com or wait for quota renewal.');
    }
    
    throw error;
  }
  
  // Get current month to prioritize in-season sports
  const currentMonth = new Date().getMonth() + 1;
  const seasonalInfo = getSeasonalInfo(currentMonth);
  
  // Smart seasonal filtering - only fetch sports likely to have games
  let sports = getActiveSportsForMonth(currentMonth);
  console.log(`Focusing on active sports for month ${currentMonth}:`, sports);
  
  // Try different time strategies
  const strategies = [
    {
      name: 'today_and_tomorrow',
      getTimeParam: () => {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + (48 * 60 * 60 * 1000));
        return `&commenceTimeFrom=${now.toISOString()}&commenceTimeTo=${tomorrow.toISOString()}`;
      }
    },
    {
      name: 'upcoming_only',
      getTimeParam: () => {
        // Add 15 minutes buffer to ensure we don't get games that just started
        const futureTime = new Date(Date.now() + (15 * 60 * 1000)).toISOString();
        return `&commenceTimeFrom=${futureTime}`;
      }
    },
    {
      name: 'recent_and_upcoming',
      getTimeParam: () => {
        const oneDayAgo = new Date(Date.now() - (24 * 60 * 60 * 1000)).toISOString();
        const threeDaysFromNow = new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)).toISOString();
        return `&commenceTimeFrom=${oneDayAgo}&commenceTimeTo=${threeDaysFromNow}`;
      }
    },
    {
      name: 'no_time_filter',
      getTimeParam: () => ''
    }
  ];

  for (const strategy of strategies) {
    console.log(`Trying strategy: ${strategy.name}`);
    const allGames = [];
    let hasAnyData = false;

    // Fetch odds for each sport with current strategy and throttling
    for (let i = 0; i < sports.length; i++) {
      const sport = sports[i];
      
      // Add delay between requests to avoid rate limiting (except for first request)
      if (i > 0) {
        console.log(`Waiting 1 second before fetching ${sport} to avoid rate limits...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      try {
        const timeParam = strategy.getTimeParam();
        const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds?apiKey=${API_KEY}&regions=us&oddsFormat=american&markets=h2h,spreads,totals${timeParam}&dateFormat=iso`;
        
        console.log(`Fetching ${sport} with URL: ${url.replace(API_KEY, 'API_KEY_HIDDEN')}`);
        
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const gamesData = await response.json();
          console.log(`${strategy.name} - Successfully fetched ${gamesData.length} games for ${sport}`);
          
          // Log remaining requests if available
          const remainingRequests = response.headers.get('x-requests-remaining');
          if (remainingRequests) {
            console.log(`Remaining API requests after ${sport}: ${remainingRequests}`);
          }
          
          if (gamesData.length > 0) {
            hasAnyData = true;
            
            // Filter out games that started more than 15 minutes ago (15-minute buffer for games about to start)
            const now = new Date();
            const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
            const filteredGames = gamesData.filter(game => new Date(game.commence_time) > fifteenMinutesAgo);
            
            console.log(`After filtering (15min buffer): ${filteredGames.length} games for ${sport} (original: ${gamesData.length})`);
            allGames.push(...filteredGames);
          }
        } else {
          const errorText = await response.text();
          console.error(`${strategy.name} - Failed to fetch ${sport}: ${response.status} - ${response.statusText}`);
          console.error(`Error details: ${errorText}`);
          
          if (response.status === 401) {
            throw new Error(`API authentication failed for ${sport}. Please verify your NEW_ODDS_API_KEY in Supabase secrets.`);
          } else if (response.status === 429) {
            console.error(`Rate limit hit for ${sport}, continuing with other sports...`);
            
            // For rate limits, try exponential backoff for remaining sports
            const remainingSports = sports.slice(sports.indexOf(sport) + 1);
            if (remainingSports.length > 0) {
              console.log(`Will wait 5 seconds before trying remaining ${remainingSports.length} sports`);
              await new Promise(resolve => setTimeout(resolve, 5000));
            }
          }
        }
      } catch (error) {
        console.error(`${strategy.name} - Error fetching ${sport}:`, error.message);
        
        // If it's an auth error, stop trying other sports
        if (error.message.includes('authentication failed')) {
          throw error;
        }
      }
    }

    // If we found games with this strategy, process and return them
    if (allGames.length > 0) {
      console.log(`Strategy ${strategy.name} succeeded with ${allGames.length} total games`);
      
      // Add metadata about the strategy used
      const gamesWithMetadata = allGames.map(game => ({
        ...game,
        _fetchStrategy: strategy.name,
        _isUpcoming: new Date(game.commence_time) > new Date()
      }));
      
      // Fetch player props synchronously to ensure they're included in response
      const processedGames = await propsManager.fetchPlayerPropsForGames(API_KEY, gamesWithMetadata);
      
      return processedGames;
    }

    console.log(`Strategy ${strategy.name} found no games, trying next strategy...`);
  }

  // If no strategy worked, provide detailed seasonal information
  console.log('No games found with any strategy. Checking if this is due to seasonal timing...')
  
  // Check current date and provide seasonal context
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const currentSeasonalInfo = getSeasonalInfo(month);
  
  console.log('Seasonal context:', currentSeasonalInfo);
  console.log('Falling back to sample data with seasonal awareness');
  
  // Return sample data with seasonal context
  throw new Error(`No upcoming games found for any sport. ${currentSeasonalInfo.message}`);
}

function getActiveSportsForMonth(month: number): string[] {
  // Only fetch NFL and NBA - sports with player props support
  const seasons = {
    americanfootball_nfl: [9, 10, 11, 12, 1, 2], // Sept-Feb
    basketball_nba: [10, 11, 12, 1, 2, 3, 4, 5, 6], // Oct-June
  };
  
  const activeSports = [];
  const inactiveSports = [];
  
  for (const [sport, activeMonths] of Object.entries(seasons)) {
    if (activeMonths.includes(month)) {
      activeSports.push(sport);
    } else {
      inactiveSports.push(sport);
    }
  }
  
  // Return both NFL and NBA regardless of season (for demo purposes)
  return ['americanfootball_nfl', 'basketball_nba'];
}

function getSeasonalInfo(month: number): { message: string, activeSports: string[] } {
  // Define rough sport seasons (US-centric)
  const seasons = {
    nfl: [9, 10, 11, 12, 1, 2], // Sept-Feb
    nba: [10, 11, 12, 1, 2, 3, 4, 5, 6], // Oct-June  
    mlb: [3, 4, 5, 6, 7, 8, 9, 10], // March-Oct
    soccer: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // Year-round
    mls: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // Feb-Nov
    nhl: [10, 11, 12, 1, 2, 3, 4, 5, 6] // Oct-June
  };
  
  const activeSports = [];
  if (seasons.nfl.includes(month)) activeSports.push('NFL');
  if (seasons.nba.includes(month)) activeSports.push('NBA');
  if (seasons.mlb.includes(month)) activeSports.push('MLB');
  if (seasons.soccer.includes(month)) activeSports.push('Soccer');
  if (seasons.mls.includes(month)) activeSports.push('MLS');
  if (seasons.nhl.includes(month)) activeSports.push('NHL');
  
  let message;
  if (activeSports.length === 0) {
    message = 'This appears to be during a major sports off-season period.';
  } else if (activeSports.length < 3) {
    message = `Currently in ${activeSports.join(' and ')} season, but other major sports may be in off-season.`;
  } else {
    message = `Currently in active season for ${activeSports.join(', ')}.`;
  }
  
  return { message, activeSports };
}
