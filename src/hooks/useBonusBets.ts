
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BonusBetData } from "@/types/balance";

export const useBonusBets = (balance: any, localBalance: any, setLocalBalance: React.Dispatch<React.SetStateAction<any>>) => {
  const queryClient = useQueryClient();

  // Fetch bonus bet awards history
  const { data: bonusAwards } = useQuery({
    queryKey: ['bonus-awards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bonus_bet_awards')
        .select('*')
        .order('awarded_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const addBonusBets = useMutation({
    mutationFn: async ({ amount }: { amount: number }) => {
      try {
        // Update balance in database
        const { data, error } = await supabase
          .from('user_balances')
          .update({ 
            bonus_bets: (balance?.bonus_bets || 0) + amount 
          })
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
          .select()
          .single();
        
        if (error) throw error;
        return { amount, status: 'added', data };
      } catch (err) {
        console.log("Database update failed, using local fallback:", err);
        const newBalance = {
          ...localBalance,
          bonus_bets: (localBalance.bonus_bets || 0) + amount
        };
        setLocalBalance(newBalance);
        localStorage.setItem('user_balance', JSON.stringify(newBalance));
        return { amount, status: 'local_fallback' };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['bonus-awards'] });
      toast.success("Bonus bets added to your account!");
    },
    onError: (error) => {
      toast.error("Failed to add bonus bets");
      console.error("Bonus bets error:", error);
    }
  });

  return { addBonusBets, bonusAwards };
};
