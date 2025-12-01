
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const useAdminMetrics = () => {
  const { data: userMetrics, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin-user-metrics'],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      return {
        totalUsers: profiles?.length || 0,
        profiles: profiles || []
      };
    }
  });

  const { data: financialMetrics, isLoading: isLoadingFinancial } = useQuery({
    queryKey: ['admin-financial-metrics'],
    queryFn: async () => {
      const [depositsResult, withdrawalsResult, balancesResult, predictionsResult, subscribersResult, platformFeesResult] = await Promise.all([
        supabase.from('deposits').select('*'),
        supabase.from('withdrawals').select('*'),
        supabase.from('user_balances').select('*'),
        supabase.from('predictions').select('*'),
        supabase.from('subscribers').select('*'),
        supabase.from('platform_fees').select('*')
      ]);

      const deposits = depositsResult.data || [];
      const withdrawals = withdrawalsResult.data || [];
      const balances = balancesResult.data || [];
      const predictions = predictionsResult.data || [];
      const subscribers = subscribersResult.data || [];
      const platformFees = platformFeesResult.data || [];

      const totalDeposits = deposits.reduce((sum, d) => sum + Number(d.amount), 0);
      const totalWithdrawals = withdrawals.reduce((sum, w) => sum + Number(w.amount), 0);
      const totalInvested = balances.reduce((sum, b) => sum + Number(b.invested_balance), 0);
      const totalGrowthCash = balances.reduce((sum, b) => sum + Number(b.growth_cash), 0);
      const totalAvailableBalance = balances.reduce((sum, b) => sum + Number(b.available_balance), 0);

      // Calculate platform fee revenue (10% on all Growth Cash bets)
      const growthCashPredictions = predictions.filter(p => p.bet_type === 'growth_cash');
      const platformFeeRevenue = growthCashPredictions.reduce((sum, p) => sum + (Number(p.amount) * 0.10), 0);

      // Calculate subscription revenue (annual subscriptions)
      const activeSubscribers = subscribers.filter(s => s.subscribed && s.subscription_end && new Date(s.subscription_end) > new Date()).length;
      const totalSubscribers = subscribers.filter(s => s.subscribed).length;
      const subscriptionRevenue = totalSubscribers * 150; // $150 per subscription

      // Calculate withdrawal fees
      const withdrawalFees = withdrawals.reduce((sum, w) => {
        const withdrawalDate = new Date(w.created_at);
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        
        // Apply fee based on timing (simplified calculation)
        const feeRate = withdrawalDate > oneYearAgo ? 0.50 : 0.05; // 50% before 1yr, 5% after
        return sum + (Number(w.amount) * feeRate);
      }, 0);

      // Total net revenue from all sources
      const totalRevenue = platformFeeRevenue + subscriptionRevenue + withdrawalFees;
      const netRevenue = totalRevenue - (totalDeposits * 0.03); // Estimate operating costs at 3%

      return {
        totalDeposits,
        totalWithdrawals,
        totalInvested,
        totalGrowthCash,
        totalAvailableBalance,
        platformFeeRevenue,
        subscriptionRevenue,
        withdrawalFees,
        totalRevenue,
        netRevenue,
        activeSubscribers,
        totalSubscribers,
        totalPredictions: predictions.length,
        growthCashPredictions: growthCashPredictions.length,
        deposits,
        withdrawals,
        balances,
        predictions,
        subscribers
      };
    }
  });

  return {
    userMetrics,
    financialMetrics,
    isLoadingUsers,
    isLoadingFinancial
  };
};
