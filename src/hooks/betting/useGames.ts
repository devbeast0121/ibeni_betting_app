
import { useState } from 'react';
import { Game } from '@/types/betting';
import { SAMPLE_GAMES } from '@/constants/sampleGames';
import { fetchLiveGames } from '@/services/sportsApi';
import { toast } from "@/components/ui/sonner";

export const useGames = () => {
  const [games, setGames] = useState<Game[]>(SAMPLE_GAMES);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [selectedSports, setSelectedSports] = useState<string[]>([]);

  const fetchLiveGamesData = async () => {
    setIsLoading(true);
    try {
      toast.info("Fetching upcoming games odds...");
      const liveGames = await fetchLiveGames();
      
      if (liveGames && liveGames.length > 0) {
        // Filter out games that have already started
        const now = new Date();
        const upcomingGames = liveGames.filter(game => {
          // Parse the game time to check if it's in the future
          const gameTime = parseGameTime(game.time);
          return gameTime && gameTime > now;
        });
        
        if (upcomingGames.length > 0) {
          setGames(upcomingGames);
          setLastRefreshed(new Date());
          console.log(`Filtered to ${upcomingGames.length} upcoming games from ${liveGames.length} total`);
          
          // Debug: Log game types to verify mapping
          const gameTypes = upcomingGames.reduce((acc, game) => {
            acc[game.type] = (acc[game.type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          console.log('Game types after conversion:', gameTypes);
        } else {
          toast.warning("No upcoming games available. Showing sample games.");
          setGames(SAMPLE_GAMES);
        }
      } else {
        toast.warning("No games data available. Showing sample games.");
        setGames(SAMPLE_GAMES);
      }
    } catch (error) {
      console.error("Failed to fetch live games:", error);
      toast.error("Error fetching odds. Showing sample data instead.");
      setGames(SAMPLE_GAMES);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to parse game time strings
  const parseGameTime = (timeStr: string): Date | null => {
    try {
      // Handle "Tonight at HH:MM" format
      if (timeStr.toLowerCase().includes('tonight')) {
        const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);
        if (timeMatch) {
          const now = new Date();
          const hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const gameTime = new Date(now);
          gameTime.setHours(hours, minutes, 0, 0);
          return gameTime;
        }
      }
      
      // Handle "HH:MM AM/PM MMM D" format
      const fullDateMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?\s*(\w+)\s*(\d+)/i);
      if (fullDateMatch) {
        const now = new Date();
        let hours = parseInt(fullDateMatch[1]);
        const minutes = parseInt(fullDateMatch[2]);
        const ampm = fullDateMatch[3];
        const month = fullDateMatch[4];
        const day = parseInt(fullDateMatch[5]);
        
        if (ampm && ampm.toUpperCase() === 'PM' && hours !== 12) {
          hours += 12;
        } else if (ampm && ampm.toUpperCase() === 'AM' && hours === 12) {
          hours = 0;
        }
        
        const monthMap: { [key: string]: number } = {
          'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
          'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        const monthNum = monthMap[month];
        
        if (monthNum !== undefined) {
          const gameTime = new Date(now.getFullYear(), monthNum, day, hours, minutes, 0, 0);
          return gameTime;
        }
      }
      
      return null;
    } catch (e) {
      console.error('Error parsing game time:', e);
      return null;
    }
  };

  const filteredGames = games.filter(game => {
    if (selectedSports.length === 0) return true;
    const included = selectedSports.includes(game.type);
    if (!included) {
      console.log(`Game ${game.teams[0]} vs ${game.teams[1]} (type: "${game.type}") filtered out by selectedSports:`, selectedSports);
    }
    return included;
  });

  return {
    games: filteredGames,
    allGames: games,
    isLoading,
    lastRefreshed,
    selectedSports,
    setSelectedSports,
    fetchLiveGamesData
  };
};
