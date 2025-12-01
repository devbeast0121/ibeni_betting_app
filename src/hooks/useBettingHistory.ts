import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BettingHistoryItem {
  id: string;
  amount: number;
  bet_type: 'fun_tokens' | 'growth_cash' | 'bonus_bet';
  selections: any[];
  result: 'win' | 'loss' | 'pending';
  winnings: number;
  platform_fee: number;
  status: 'pending' | 'settled' | 'cancelled';
  created_at: string;
}

export const useBettingHistory = () => {
  const { data: bettingHistory, isLoading, refetch } = useQuery({
    queryKey: ['betting-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

        const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Failed to fetch betting history:", error);
        return [];
      }

      return (data || []).map(item => ({
        ...item,
        selections: typeof item.selections === 'string' ? JSON.parse(item.selections) : item.selections
      })) as BettingHistoryItem[];
    },
    enabled: true
  });

  // Calculate stats
  const stats = {
    totalBets: bettingHistory?.length || 0,
    totalWins: bettingHistory?.filter(bet => bet.result === 'win').length || 0,
    totalLosses: bettingHistory?.filter(bet => bet.result === 'loss').length || 0,
    totalPending: bettingHistory?.filter(bet => bet.result === 'pending').length || 0,
    totalWinnings: bettingHistory?.reduce((sum, bet) => sum + (bet.winnings || 0), 0) || 0,
    totalSpent: bettingHistory?.reduce((sum, bet) => sum + bet.amount, 0) || 0,
    winRate: bettingHistory?.filter(bet => bet.result !== 'pending').length ? 
      (bettingHistory.filter(bet => bet.result === 'win').length / bettingHistory.filter(bet => bet.result !== 'pending').length * 100) : 0
  };

  return {
    bettingHistory: bettingHistory || [],
    stats,
    isLoading,
    refetch
  };
};