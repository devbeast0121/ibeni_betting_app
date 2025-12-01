
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { DepositData, DepositType } from "@/types/balance";

export const useDeposits = (localBalance: any, setLocalBalance: React.Dispatch<React.SetStateAction<any>>) => {
  const queryClient = useQueryClient();

  const createDeposit = useMutation({
    mutationFn: async ({ amount, depositType = 'sweepstakes' }: { amount: number, depositType?: DepositType }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Insert deposit record
      const { data: depositData, error: depositError } = await supabase
        .from('deposits')
        .insert([
          { 
            user_id: user.id,
            amount, 
            deposit_type: depositType,
            status: 'completed'
          }
        ])
        .select()
        .single();

      if (depositError) throw depositError;
      
      // Update user balance after successful deposit
      const { error: updateError } = await supabase
        .from('user_balances')
        .update({
          available_balance: depositType === 'sweepstakes' ? localBalance.available_balance + amount : localBalance.available_balance,
          growth_cash: depositType === 'growth_cash' ? localBalance.growth_cash + amount : localBalance.growth_cash
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      return depositData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      
      const newBalance = {
        ...localBalance,
        available_balance: data.deposit_type === 'sweepstakes' ? localBalance.available_balance + data.amount : localBalance.available_balance,
        growth_cash: data.deposit_type === 'growth_cash' ? localBalance.growth_cash + data.amount : localBalance.growth_cash
      };
      setLocalBalance(newBalance);
      localStorage.setItem('user_balance', JSON.stringify(newBalance));
    },
    onError: (error) => {
      toast.error("Failed to process deposit");
      console.error("Deposit error:", error);
    }
  });

  return { createDeposit };
};
