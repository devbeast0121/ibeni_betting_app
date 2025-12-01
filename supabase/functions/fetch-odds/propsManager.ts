
import { propsCacheManager } from "./propsCacheManager.ts";

// Helper functions for handling player props
class PropsManager {
  // Filter for supported sports that generally have player props
  private supportedSports = ['basketball_nba', 'americanfootball_nfl', 'baseball_mlb'];
  
  async fetchPlayerPropsWithCache(apiKey: string, gamesData: any[]): Promise<any[]> {
    const processedGames = [...gamesData];
    
    // Filter for supported games
    const gamesForProps = gamesData.filter(game => this.supportedSports.includes(game.sport_key));
    
    console.log(`Processing ${gamesForProps.length} games for player props (with caching)`);
    
    // First pass: attach cached props immediately
    for (const game of gamesForProps) {
      const cachedProps = propsCacheManager.get(game.id);
      if (cachedProps) {
        const index = processedGames.findIndex(g => g.id === game.id);
        if (index !== -1) {
          processedGames[index].bookmakers = processedGames[index].bookmakers || [];
          if (processedGames[index].bookmakers[0]) {
            processedGames[index].bookmakers[0].markets = [
              ...(processedGames[index].bookmakers[0].markets || []),
              ...cachedProps
            ];
          }
        }
      }
    }
    
    // Second pass: refresh stale or missing props in background
    const gamesToRefresh = gamesForProps
      .filter(game => propsCacheManager.shouldRefresh(game.id))
      .slice(0, 6); // Refresh up to 6 games per request
    
    if (gamesToRefresh.length > 0) {
      console.log(`Background refresh for ${gamesToRefresh.length} games`);
      
      // Start background refresh (non-blocking)
      this.refreshPropsInBackground(apiKey, gamesToRefresh, processedGames);
    }
    
    return processedGames;
  }
  
  private async refreshPropsInBackground(apiKey: string, games: any[], processedGames: any[]) {
    // This runs in the background and doesn't block the response
    for (const game of games) {
      try {
        // Add delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const propMarkets = this.getPropsMarketsForSport(game.sport_key);
        if (propMarkets.length === 0) continue;
        
        const marketsParam = propMarkets.join(',');
        
        console.log(`Background fetching props for game ${game.id}`);
        
        const propsResponse = await fetch(
          `https://api.the-odds-api.com/v4/sports/${game.sport_key}/events/${game.id}/odds?apiKey=${apiKey}&regions=us&markets=${marketsParam}&oddsFormat=american`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (propsResponse.ok) {
          const propsData = await propsResponse.json();
          
          if (propsData.bookmakers?.[0]?.markets) {
            // Cache the props
            propsCacheManager.set(game.id, propsData.bookmakers[0].markets);
            console.log(`Cached ${propsData.bookmakers[0].markets.length} prop markets for game ${game.id}`);
          }
        } else {
          const errorText = await propsResponse.text();
          console.warn(`Background props fetch failed for game ${game.id}: ${errorText}`);
        }
      } catch (error) {
        console.error(`Error in background props refresh for game ${game.id}:`, error);
      }
    }
  }

  async fetchPlayerPropsForGames(apiKey: string, gamesData: any[]): Promise<any[]> {
    // Process games in batches to avoid rate limits
    const processedGames = [...gamesData];
    const propsRequests = [];
    
    // Fetch player props for supported games (all games, no limit)
    const gamesForProps = gamesData
      .filter(game => this.supportedSports.includes(game.sport_key));
    
    console.log(`Fetching player props for ${gamesForProps.length} games (${gamesForProps.map(g => g.sport_key).join(', ')})`);
    
    for (const game of gamesForProps) {
      propsRequests.push(
        this.fetchPlayerPropsForGame(apiKey, game)
          .then(gameWithProps => {
            // Replace the original game with the enhanced version containing props
            const index = processedGames.findIndex(g => g.id === game.id);
            if (index !== -1) {
              processedGames[index] = gameWithProps;
            }
            return gameWithProps;
          })
          .catch(error => {
            console.error(`Error fetching player props for game ${game.id}:`, error);
            return game; // Return original game if props fetch fails
          })
      );
    }
    
    // Wait for all props requests to complete
    await Promise.all(propsRequests);
    
    return processedGames;
  }

  async fetchPlayerPropsForGame(apiKey: string, game: any): Promise<any> {
    // Only fetch props for supported sports
    if (!this.supportedSports.includes(game.sport_key)) {
      return game;
    }
    
    try {
      // Add a small delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Determine which player prop markets to fetch based on the sport
      const propMarkets = this.getPropsMarketsForSport(game.sport_key);
      
      // Skip if no relevant markets for this sport
      if (propMarkets.length === 0) {
        return game;
      }
      
      // Create a comma-separated string of prop markets
      const marketsParam = propMarkets.join(',');
      
      console.log(`[PROPS] Fetching ${propMarkets.length} prop markets for game ${game.id} (${game.sport_key}): ${game.home_team} vs ${game.away_team}`);
      console.log(`[PROPS] Markets: ${marketsParam}`);
      
      const startTime = Date.now();
      const propsResponse = await fetch(
        `https://api.the-odds-api.com/v4/sports/${game.sport_key}/events/${game.id}/odds?apiKey=${apiKey}&regions=us&markets=${marketsParam}&oddsFormat=american`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      const fetchDuration = Date.now() - startTime;
      
      if (!propsResponse.ok) {
        const errorText = await propsResponse.text();
        console.warn(`[PROPS] ❌ Failed to fetch player props for game ${game.id} (took ${fetchDuration}ms): ${errorText}`);
        return game;
      }

      const propsData = await propsResponse.json();
      console.log(`[PROPS] ✅ Successfully fetched props for game ${game.id} (took ${fetchDuration}ms)`);
      
      // Merge player props into the original game data
      return this.mergePlayerPropsIntoGame(game, propsData);
    } catch (error) {
      console.error(`Error fetching player props for game ${game.id}:`, error);
      return game; // Return original game if props fetch fails
    }
  }

  private getPropsMarketsForSport(sportKey: string): string[] {
    let propMarkets: string[] = [];
    
    if (sportKey === 'basketball_nba') {
      console.log('[PROPS] Setting up NBA player prop markets');
      propMarkets = [
        'player_points',
        'player_rebounds', 
        'player_assists',
        'player_threes',
        'player_blocks',
        'player_steals',
        'player_turnovers',
        'player_points_rebounds_assists',
        'player_double_double',
        'player_triple_double'
      ];
      console.log(`[PROPS] NBA markets to fetch: ${propMarkets.join(', ')}`);
    } else if (sportKey === 'americanfootball_nfl') {
      propMarkets = [
        'player_pass_tds',
        'player_pass_yds',
        'player_pass_completions',
        'player_pass_attempts',
        'player_pass_interceptions',
        'player_pass_longest_completion',
        'player_rush_yds',
        'player_rush_attempts',
        'player_rush_longest',
        'player_receptions',
        'player_reception_yds',
        'player_reception_longest',
        'player_kicking_points',
        'player_field_goals',
        'player_tackles_assists',
        // Touchdown Scoring Markets
        'player_1st_td',
        'player_last_td',
        'player_anytime_td',
        'player_rush_tds',
        'player_reception_tds'
      ];
    } else if (sportKey === 'baseball_mlb') {
      propMarkets = [
        'batter_home_runs',
        'batter_hits',
        'batter_total_bases',
        'batter_rbis',
        'batter_runs_scored',
        'batter_hits_runs_rbis',
        'batter_singles',
        'batter_doubles',
        'batter_triples',
        'batter_walks',
        'batter_strikeouts',
        'batter_stolen_bases',
        'pitcher_strikeouts',
        'pitcher_hits_allowed',
        'pitcher_walks',
        'pitcher_earned_runs',
        'pitcher_outs'
      ];
    }
    
    return propMarkets;
  }

  private mergePlayerPropsIntoGame(game: any, propsData: any): any {
    if (propsData.bookmakers?.[0]?.markets) {
      // If the original game doesn't have markets or bookmakers, initialize them
      if (!game.bookmakers) {
        game.bookmakers = [];
      }
      
      if (game.bookmakers.length === 0) {
        game.bookmakers.push({
          key: propsData.bookmakers[0].key,
          markets: []
        });
      }
      
      // Add player props markets to the first bookmaker
      if (!game.bookmakers[0].markets) {
        game.bookmakers[0].markets = [];
      }
      
      // Add the prop markets
      game.bookmakers[0].markets.push(...propsData.bookmakers[0].markets);
      console.log(`Added ${propsData.bookmakers[0].markets.length} prop markets to game ${game.id}`);
    }
    
    return game;
  }
}

export const propsManager = new PropsManager();
