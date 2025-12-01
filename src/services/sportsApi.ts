import { Game, PlayerProp } from "@/types/betting";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export async function fetchLiveGames(forceRefresh = false): Promise<Game[]> {
  try {
    console.log("Fetching live games with forceRefresh:", forceRefresh);
    
    // Add timestamp to prevent frontend caching when forcing refresh
    const body = forceRefresh 
      ? { forceRefresh: true, timestamp: Date.now() }
      : { forceRefresh: false };
    
    const { data, error } = await supabase.functions.invoke('fetch-odds', {
      body
    });
    
    if (error) {
      console.error("Error fetching odds:", error);
      
      // Try to extract seasonal information from error message
      if (error.message && error.message.includes('season')) {
        toast.warning("Using sample data - " + error.message);
      } else {
        toast.error("Failed to fetch live odds - using sample data");
      }
      
      return convertToGameFormat(SAMPLE_API_RESPONSE);
    }

    // Handle new response format with metadata
    let gameData = data;
    let warningMessage = null;

    // Check if response has new format with games array and warning/error
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      if (data.games) {
        gameData = data.games;
      }
      
      // Handle API quota exceeded
      if (data.error === 'API_QUOTA_EXCEEDED' || data.warning === 'API_QUOTA_EXCEEDED') {
        toast.error("⚠️ Odds API quota exceeded - using cached data. Real-time updates unavailable until quota resets.");
        warningMessage = data.message;
      }
      // Handle cached data usage
      else if (data.warning === 'USING_CACHED_DATA') {
        toast.warning("📊 Using cached odds data - API temporarily unavailable");
        warningMessage = data.message;
      }
      // Handle sample data fallback
      else if (data.warning === 'USING_SAMPLE_DATA' || data.is_sample_data) {
        toast.warning("🎮 Showing sample games for demonstration purposes");
        warningMessage = data.message;
      }
    }

    // Check if data is empty or not an array
    if (!gameData || !Array.isArray(gameData)) {
      console.warn("Invalid data format received from API");
      toast.warning("🎮 No live games available - showing sample data");
      return convertToGameFormat(SAMPLE_API_RESPONSE);
    }

    // Check if we got data with strategy metadata (before processing into gameData)
    const hasStrategyInfo = gameData.length > 0 && gameData[0]._fetchStrategy;
    if (hasStrategyInfo && forceRefresh && !data.error && !data.warning) {
      const strategy = gameData[0]._fetchStrategy;
      const upcomingCount = gameData.filter(game => game._isUpcoming).length;
      const totalCount = gameData.length;
      
      if (strategy === 'upcoming_only' && upcomingCount === totalCount) {
        toast.success(`✅ Live odds updated - ${totalCount} upcoming games found`);
      } else if (strategy === 'recent_and_upcoming') {
        toast.info(`📊 Live odds updated - showing recent and upcoming games (${upcomingCount} upcoming, ${totalCount - upcomingCount} recent)`);
      } else if (strategy === 'no_time_filter') {
        toast.warning("⚠️ Live odds updated - showing all available games (some sports may be in off-season)");
      }
    }
    
    console.log("Received data from API:", gameData.slice(0, 2));
    console.log("Total games by sport:", gameData.reduce((acc, game) => {
      acc[game.sport_key] = (acc[game.sport_key] || 0) + 1;
      return acc;
    }, {}));
    
    return convertToGameFormat(gameData);
  } catch (error) {
    console.error("Error fetching live games:", error);
    
    // Check if error contains seasonal information
    if (error.message && error.message.includes('season')) {
      toast.warning("Sports may be in off-season - showing sample games");
    } else {
      toast.error("Could not load the latest odds. Using sample data instead.");
    }
    
    return convertToGameFormat(SAMPLE_API_RESPONSE);
  }
}

function convertToGameFormat(apiGames: any[]): Game[] {
  try {
    console.log("Converting games to format. Total games:", apiGames.length);
    
    const convertedGames = apiGames.map((game, index) => {
      // Map sport string to our sport types
      let sportType = mapSportType(game.sport_key);
      
      console.log(`Game ${index}: sport_key="${game.sport_key}" -> mapped to "${sportType}"`);
      
      // Get the first bookmaker with odds data
      const bookmaker = game.bookmakers && game.bookmakers[0];
      
      // Extract moneyline odds if available
      const moneylineMarket = bookmaker?.markets?.find(m => m.key === "h2h");
      let odds = ["+100", "-110"]; // Default odds
      
      if (moneylineMarket?.outcomes) {
        odds = moneylineMarket.outcomes.map(outcome => outcome.price.toString());
      }

      // Extract spreads
      const spreadsMarket = bookmaker?.markets?.find(m => m.key === "spreads");
      let spreads = undefined;
      if (spreadsMarket?.outcomes) {
        spreads = spreadsMarket.outcomes.map(outcome => ({
          points: outcome.point > 0 ? `+${outcome.point}` : outcome.point.toString(),
          odds: outcome.price.toString()
        }));
      }

      // Extract totals (over/under)
      const totalsMarket = bookmaker?.markets?.find(m => m.key === "totals");
      let totals = undefined;
      if (totalsMarket?.outcomes && totalsMarket.outcomes.length >= 2) {
        const overOutcome = totalsMarket.outcomes.find(o => o.name === "Over");
        const underOutcome = totalsMarket.outcomes.find(o => o.name === "Under");
        if (overOutcome && underOutcome) {
          totals = {
            line: overOutcome.point.toString(),
            overOdds: overOutcome.price.toString(),
            underOdds: underOutcome.price.toString()
          };
        }
      }

      // Extract player props markets (like player_points, player_rebounds, etc.)
      let playerProps: PlayerProp[] = extractPlayerProps(game, index);
      
      return {
        id: index + 1,
        time: formatGameTime(game.commence_time),
        teams: [game.home_team || "Home Team", game.away_team || "Away Team"],
        odds: odds,
        spreads,
        totals,
        type: sportType,
        playerProps: playerProps.length > 0 ? playerProps : undefined
      };
    });
    
    // Log final sport distribution
    const sportDistribution = convertedGames.reduce((acc, game) => {
      acc[game.type] = (acc[game.type] || 0) + 1;
      return acc;
    }, {});
    
    console.log("Final converted games by sport type:", sportDistribution);
    console.log("Sample converted games:", convertedGames.slice(0, 3));
    
    return convertedGames;
  } catch (conversionError) {
    console.error("Error converting API data:", conversionError);
    return SAMPLE_API_RESPONSE.map((game, index) => ({
      id: index + 1,
      time: "Today",
      teams: [game.home_team || "Home Team", game.away_team || "Away Team"],
      odds: ["+100", "-110"],
      type: "Other",
      playerProps: undefined
    }));
  }
}

function mapSportType(sportKey: string): string {
  console.log(`[SPORT MAPPING] Input: "${sportKey}"`);
  
  if (!sportKey) {
    console.warn("[SPORT MAPPING] ⚠️ Empty sport key!");
    return "Other";
  }
  
  // More precise mapping based on actual API sport keys
  const mapping = {
    'americanfootball_nfl': 'NFL',
    'basketball_nba': 'NBA', 
    'baseball_mlb': 'MLB',
    'soccer_epl': 'Soccer',
    'icehockey_nhl': 'NHL'
  };
  
  const mappedType = mapping[sportKey.toLowerCase()];
  if (mappedType) {
    console.log(`[SPORT MAPPING] ✅ Direct match: "${sportKey}" -> "${mappedType}"`);
    return mappedType;
  }
  
  // Fallback to substring matching
  const lowerKey = sportKey.toLowerCase();
  if (lowerKey.includes("football")) {
    console.log(`[SPORT MAPPING] ✅ Substring match: "${sportKey}" -> "NFL"`);
    return "NFL";
  }
  if (lowerKey.includes("basketball")) {
    console.log(`[SPORT MAPPING] ✅ Substring match: "${sportKey}" -> "NBA"`);
    return "NBA";
  }
  if (lowerKey.includes("baseball")) {
    console.log(`[SPORT MAPPING] ✅ Substring match: "${sportKey}" -> "MLB"`);
    return "MLB";
  }
  if (lowerKey.includes("soccer")) {
    console.log(`[SPORT MAPPING] ✅ Substring match: "${sportKey}" -> "Soccer"`);
    return "Soccer";
  }
  if (lowerKey.includes("hockey")) {
    console.log(`[SPORT MAPPING] ✅ Substring match: "${sportKey}" -> "NHL"`);
    return "NHL";
  }
  
  console.warn(`[SPORT MAPPING] ⚠️ No match for "${sportKey}", using fallback "Other"`);
  return "Other";
}

function formatGameTime(timestamp: string): string {
  if (!timestamp) return "TBD";
  
  try {
    const gameDate = new Date(timestamp);
    const now = new Date();
    
    // Check if game is today
    const isToday = gameDate.toDateString() === now.toDateString();
    
    // Format the time
    const timeStr = gameDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // If today, just show the time with "Today"
    if (isToday) {
      return `${timeStr} Today`;
    }
    
    // Otherwise, show time + date
    const dateStr = gameDate.toLocaleDateString([], {month: 'short', day: 'numeric'});
    return `${timeStr} ${dateStr}`;
  } catch (e) {
    console.error("Error formatting game time:", e);
    return "TBD";
  }
}

function extractPlayerProps(apiGame: any, gameIndex: number): PlayerProp[] {
  const sportKey = apiGame.sport_key;
  console.log(`[PROPS DEBUG] ====== Game ${gameIndex}: ${apiGame.home_team} vs ${apiGame.away_team} ======`);
  console.log(`[PROPS DEBUG] Sport: ${sportKey}`);
  console.log(`[PROPS DEBUG] Bookmakers: ${apiGame?.bookmakers?.length || 0}`);
  
  if (!apiGame?.bookmakers || apiGame.bookmakers.length === 0) {
    console.log(`[DEBUG] No bookmakers found for game ${gameIndex}`);
    return [];
  }
  
  // Log all market keys to see what's available
  const allMarketKeys = apiGame.bookmakers.flatMap((bm: any) => 
    bm?.markets?.map((m: any) => m.key) || []
  );
  const uniqueMarkets = [...new Set(allMarketKeys)] as string[];
  console.log(`[PROPS DEBUG] Total markets: ${uniqueMarkets.length}`);
  console.log(`[PROPS DEBUG] All markets:`, uniqueMarkets);
  
  // Count player prop markets specifically
  const playerPropMarkets = uniqueMarkets.filter(k => k.startsWith('player_'));
  console.log(`[PROPS DEBUG] Player prop markets found: ${playerPropMarkets.length}`, playerPropMarkets);
  
  // Collect props from all bookmakers
  const propsMap = new Map<string, {
    player: string;
    stat: string;
    line: number;
    bookmakerOdds: Map<string, { over: string; under: string }>;
    propType?: 'over_under' | 'yes_no';
  }>();
  
  // Process each bookmaker
  for (const bookmaker of apiGame.bookmakers) {
    if (!bookmaker?.markets) continue;
    
    // Filter for player prop markets
    const propMarkets = bookmaker.markets.filter((market: any) => 
      market.key.startsWith('player_')
    );
    
    for (const market of propMarkets) {
      if (!market.outcomes || !Array.isArray(market.outcomes)) continue;
      
      // Detect TD scorer markets (yes/no format)
      const isTDScorerMarket = market.key.includes('1st_td') || 
                               market.key.includes('last_td') || 
                               market.key.includes('anytime_td');
      
      // Group outcomes by player
      const playerGroups = {};
      
      for (const outcome of market.outcomes) {
        const player = outcome.description || outcome.name;
        if (!player || player === "Under" || player === "Over") continue;
        
        if (!playerGroups[player]) {
          playerGroups[player] = {
            player,
            stat: market.key.replace('player_', '').replace(/_/g, ' '),
            line: outcome.point || 0,
            overOdds: null,
            underOdds: null,
            propType: isTDScorerMarket ? 'yes_no' : 'over_under'
          };
        }
        
        if (isTDScorerMarket) {
          // For TD scorer props, store the "Yes" odds in overOdds
          const isYes = outcome.name.toLowerCase().includes('yes') || 
                        !outcome.name.toLowerCase().includes('no');
          if (isYes) {
            playerGroups[player].overOdds = outcome.price.toString();
          }
        } else {
          // Regular over/under props
          const isOver = !outcome.name.toLowerCase().includes('under');
          if (isOver) {
            playerGroups[player].overOdds = outcome.price.toString();
          } else {
            playerGroups[player].underOdds = outcome.price.toString();
          }
        }
      }
      
      // Add to main props map
      for (const player in playerGroups) {
        const prop = playerGroups[player];
        // For yes/no props, only overOdds is required; for over/under, both are required
        if (!prop.overOdds && !prop.underOdds) continue;
        
        const propKey = `${player}_${prop.stat}_${prop.line}`;
        
        if (!propsMap.has(propKey)) {
          propsMap.set(propKey, {
            player: prop.player,
            stat: prop.stat,
            line: prop.line,
            bookmakerOdds: new Map(),
            propType: prop.propType
          });
        }
        
        const propData = propsMap.get(propKey)!;
        propData.bookmakerOdds.set(bookmaker.title || bookmaker.key, {
          over: prop.overOdds,
          under: prop.underOdds
        });
      }
    }
  }
  
  console.log(`[PROPS DEBUG] Processed ${propsMap.size} unique player props for game ${gameIndex}`);
  
  // Log a sample prop to verify structure
  if (propsMap.size > 0) {
    const firstProp = Array.from(propsMap.values())[0];
    console.log(`[PROPS DEBUG] Sample prop:`, {
      player: firstProp.player,
      stat: firstProp.stat,
      line: firstProp.line,
      bookmakers: firstProp.bookmakerOdds.size
    });
  }
  
  // Convert to PlayerProp array
  const props: PlayerProp[] = [];
  let propId = 0;
  
  propsMap.forEach((propData) => {
    // Find best odds - for American odds, "better" means:
    // - For negative odds: closer to 0 (e.g., -110 is better than -150)
    // - For positive odds: higher number (e.g., +150 is better than +110)
    const isBetterOdds = (newOdds: number, currentBest: number | null): boolean => {
      if (currentBest === null) return true;
      
      if (newOdds >= 0 && currentBest >= 0) {
        return newOdds > currentBest; // Higher positive is better
      }
      if (newOdds < 0 && currentBest < 0) {
        return newOdds > currentBest; // -110 > -150 (closer to 0)
      }
      // If one is positive and one is negative, positive is always better for the bettor
      return newOdds > currentBest;
    };
    
    let bestOverOdds = null;
    let bestUnderOdds = null;
    const allBookmakerOdds: any[] = [];
    
    propData.bookmakerOdds.forEach((odds, bookmaker) => {
      const overNum = parseInt(odds.over);
      const underNum = parseInt(odds.under);
      
      if (isBetterOdds(overNum, bestOverOdds ? parseInt(bestOverOdds) : null)) {
        bestOverOdds = odds.over;
      }
      if (isBetterOdds(underNum, bestUnderOdds ? parseInt(bestUnderOdds) : null)) {
        bestUnderOdds = odds.under;
      }
      
      allBookmakerOdds.push({
        bookmaker,
        overOdds: odds.over,
        underOdds: odds.under
      });
    });
    
    // For yes/no props, only overOdds is required; for over/under, both are required
    if (bestOverOdds && (bestUnderOdds || propData.propType === 'yes_no')) {
      props.push({
        id: gameIndex * 1000 + propId++,
        player: propData.player,
        stat: propData.stat,
        line: propData.line,
        overOdds: bestOverOdds,
        underOdds: bestUnderOdds || '',
        allBookmakerOdds,
        propType: propData.propType || 'over_under'
      });
    }
  });
  
  console.log(`[PROPS DEBUG] ✅ Returning ${props.length} player props for game ${gameIndex}`);
  
  if (props.length > 0 && sportKey === 'basketball_nba') {
    console.log(`[PROPS DEBUG] NBA Props Summary for game ${gameIndex}:`, {
      totalProps: props.length,
      players: [...new Set(props.map(p => p.player))],
      statTypes: [...new Set(props.map(p => p.stat))]
    });
  }
  
  return props;
}

// Sample API response for development when no API key is provided
const SAMPLE_API_RESPONSE = [
  {
    id: "1",
    sport_key: "americanfootball_nfl",
    home_team: "Philadelphia Eagles",
    away_team: "Dallas Cowboys",
    commence_time: new Date(Date.now() + 3600000).toISOString(),
    bookmakers: [{
      markets: [{
        key: "h2h",
        outcomes: [
          { name: "Philadelphia Eagles", price: 150 },
          { name: "Dallas Cowboys", price: -175 }
        ]
      }, {
        key: "player_passing_yards",
        outcomes: [
          { name: "Over", price: 110, point: 255.5, description: "Jalen Hurts" },
          { name: "Under", price: -130, point: 255.5, description: "Jalen Hurts" }
        ]
      }, {
        key: "player_rushing_yards",
        outcomes: [
          { name: "Over", price: -115, point: 45.5, description: "Jalen Hurts" },
          { name: "Under", price: -105, point: 45.5, description: "Jalen Hurts" }
        ]
      }]
    }]
  },
  {
    id: "2",
    sport_key: "basketball_nba",
    home_team: "Los Angeles Lakers",
    away_team: "Boston Celtics",
    commence_time: new Date(Date.now() + 7200000).toISOString(),
    bookmakers: [{
      markets: [{
        key: "h2h",
        outcomes: [
          { name: "Los Angeles Lakers", price: -120 },
          { name: "Boston Celtics", price: 110 }
        ]
      }, {
        key: "player_points",
        outcomes: [
          { name: "Over", price: -115, point: 28.5, description: "LeBron James" },
          { name: "Under", price: -105, point: 28.5, description: "LeBron James" }
        ]
      }, {
        key: "player_rebounds",
        outcomes: [
          { name: "Over", price: -120, point: 12.5, description: "Anthony Davis" },
          { name: "Under", price: -110, point: 12.5, description: "Anthony Davis" }
        ]
      }]
    }]
  },
  {
    id: "3",
    sport_key: "baseball_mlb",
    home_team: "New York Yankees",
    away_team: "Boston Red Sox", 
    commence_time: new Date(Date.now() + 86400000).toISOString(),
    bookmakers: [{
      markets: [{
        key: "h2h",
        outcomes: [
          { name: "New York Yankees", price: -135 },
          { name: "Boston Red Sox", price: 125 }
        ]
      }, {
        key: "player_strikeouts",
        outcomes: [
          { name: "Over", price: -115, point: 7.5, description: "Gerrit Cole" },
          { name: "Under", price: -105, point: 7.5, description: "Gerrit Cole" }
        ]
      }]
    }]
  },
  {
    id: "4",
    sport_key: "soccer_epl",
    home_team: "Manchester United",
    away_team: "Liverpool",
    commence_time: new Date(Date.now() + 172800000).toISOString(),
    bookmakers: [{
      markets: [{
        key: "h2h",
        outcomes: [
          { name: "Manchester United", price: 165 },
          { name: "Liverpool", price: -150 }
        ]
      }]
    }]
  }
];
