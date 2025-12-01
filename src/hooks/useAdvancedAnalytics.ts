import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBettingHistory } from "./useBettingHistory";

export interface AnalyticsData {
  totalBets: number;
  totalWagered: number;
  totalWinnings: number;
  winRate: number;
  roi: number;
  longestWinStreak: number;
  longestLossStreak: number;
  favoriteSport?: string;
  dailyData: Array<{
    date: string;
    bets: number;
    wagered: number;
    winnings: number;
    roi: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    totalWagered: number;
    totalWinnings: number;
    winRate: number;
  }>;
}

export const useAdvancedAnalytics = () => {
  const { bettingHistory, stats } = useBettingHistory();

  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['advanced-analytics'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Get daily analytics for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: dailyAnalytics, error } = await supabase
        .from('betting_analytics')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) {
        console.error("Failed to fetch analytics:", error);
      }

      // Calculate analytics from betting history if no daily analytics exist
      const calculateAnalytics = (): AnalyticsData => {
        if (!bettingHistory || bettingHistory.length === 0) {
          return {
            totalBets: 0,
            totalWagered: 0,
            totalWinnings: 0,
            winRate: 0,
            roi: 0,
            longestWinStreak: 0,
            longestLossStreak: 0,
            dailyData: [],
            monthlyTrends: []
          };
        }

        // Calculate streaks
        let currentWinStreak = 0;
        let currentLossStreak = 0;
        let longestWinStreak = 0;
        let longestLossStreak = 0;

        bettingHistory.forEach(bet => {
          if (bet.result === 'win') {
            currentWinStreak++;
            currentLossStreak = 0;
            longestWinStreak = Math.max(longestWinStreak, currentWinStreak);
          } else if (bet.result === 'loss') {
            currentLossStreak++;
            currentWinStreak = 0;
            longestLossStreak = Math.max(longestLossStreak, currentLossStreak);
          }
        });

        // Group by date for daily data
        const dailyMap = new Map();
        bettingHistory.forEach(bet => {
          const date = new Date(bet.created_at).toISOString().split('T')[0];
          if (!dailyMap.has(date)) {
            dailyMap.set(date, { bets: 0, wagered: 0, winnings: 0 });
          }
          const day = dailyMap.get(date);
          day.bets++;
          day.wagered += bet.amount;
          day.winnings += bet.winnings || 0;
        });

        const dailyData = Array.from(dailyMap.entries()).map(([date, data]) => ({
          date,
          bets: data.bets,
          wagered: data.wagered,
          winnings: data.winnings,
          roi: data.wagered > 0 ? ((data.winnings - data.wagered) / data.wagered) * 100 : 0
        }));

        // Group by month for monthly trends
        const monthlyMap = new Map();
        bettingHistory.forEach(bet => {
          const month = new Date(bet.created_at).toISOString().substring(0, 7);
          if (!monthlyMap.has(month)) {
            monthlyMap.set(month, { wagered: 0, winnings: 0, wins: 0, total: 0 });
          }
          const monthData = monthlyMap.get(month);
          monthData.wagered += bet.amount;
          monthData.winnings += bet.winnings || 0;
          monthData.total++;
          if (bet.result === 'win') monthData.wins++;
        });

        const monthlyTrends = Array.from(monthlyMap.entries()).map(([month, data]) => ({
          month,
          totalWagered: data.wagered,
          totalWinnings: data.winnings,
          winRate: data.total > 0 ? (data.wins / data.total) * 100 : 0
        }));

        // Find favorite sport
        const sportsCount = new Map();
        bettingHistory.forEach(bet => {
          if (bet.selections && Array.isArray(bet.selections)) {
            bet.selections.forEach((selection: any) => {
              if (selection.sport) {
                sportsCount.set(selection.sport, (sportsCount.get(selection.sport) || 0) + 1);
              }
            });
          }
        });

        const favoriteSport = sportsCount.size > 0 
          ? Array.from(sportsCount.entries()).reduce((a, b) => a[1] > b[1] ? a : b)[0]
          : undefined;

        return {
          totalBets: stats.totalBets,
          totalWagered: stats.totalSpent,
          totalWinnings: stats.totalWinnings,
          winRate: stats.winRate,
          roi: stats.totalSpent > 0 ? ((stats.totalWinnings - stats.totalSpent) / stats.totalSpent) * 100 : 0,
          longestWinStreak,
          longestLossStreak,
          favoriteSport,
          dailyData,
          monthlyTrends
        };
      };

      return calculateAnalytics();
    },
    enabled: !!bettingHistory
  });

  return {
    analyticsData,
    isLoading
  };
};