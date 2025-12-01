
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useDeposits } from "./useDeposits";
import { useWithdrawals } from "./useWithdrawals";
import { usePredictions } from "./usePredictions";
import { useBonusBets } from "./useBonusBets";
import { BalanceData } from "@/types/balance";

export const useBalance = () => {
  const [localBalance, setLocalBalance] = useState<BalanceData>({
    id: 'local-balance',
    available_balance: 0, // Start with real $0 instead of fake $100
    invested_balance: 0,
    growth_cash: 0,
    pending_withdrawal: 0,
    bonus_bets: 0 // Start with 0 bonus bets
  });

  const { data: balance, isLoading: isLoadingBalance } = useQuery({
    queryKey: ['balance'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return localBalance;

      const { data, error } = await supabase
        .from('user_balances')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error("Failed to fetch balance:", error);
        return localBalance;
      }

      // If data exists, return it with bonus_bets field
      if (data) {
        return {
          ...data,
          bonus_bets: 0 // Default bonus bets value until DB schema is updated
        } as BalanceData;
      }
      
      // Return real zero balance for new users instead of fake data
      return {
        id: 'no-balance',
        available_balance: 0,
        invested_balance: 0,
        growth_cash: 0,
        pending_withdrawal: 0,
        bonus_bets: 0
      };
    },
    initialData: localBalance
  });

  // Initialize the sub-hooks
  const { createDeposit } = useDeposits(localBalance, setLocalBalance);
  const { createWithdrawal } = useWithdrawals(balance, localBalance, setLocalBalance);
  const { createPrediction } = usePredictions(balance, localBalance, setLocalBalance);
  const { addBonusBets } = useBonusBets(balance, localBalance, setLocalBalance);

  // Clear any old localStorage mock data and don't load it
  useEffect(() => {
    // Clear any old mock data from localStorage
    localStorage.removeItem('user_balance');
  }, []);

  return {
    balance,
    isLoadingBalance,
    createDeposit,
    createWithdrawal,
    createPrediction,
    addBonusBets,
    refreshBalance: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data } = await supabase
        .from('user_balances')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (data) {
        setLocalBalance(data as BalanceData);
      }
    }
  };
};
