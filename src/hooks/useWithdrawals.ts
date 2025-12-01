
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { WithdrawalData } from "@/types/balance";

export const useWithdrawals = (balance: any, localBalance: any, setLocalBalance: React.Dispatch<React.SetStateAction<any>>) => {
  const queryClient = useQueryClient();

  const createWithdrawal = useMutation({
    mutationFn: async ({ amount }: { amount: number }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Insert withdrawal record
      const { data: withdrawalData, error: withdrawalError } = await supabase
        .from('withdrawals')
        .insert([
          { 
            user_id: user.id,
            amount,
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (withdrawalError) throw withdrawalError;
      
      // Update user balance after successful withdrawal request
      const { error: updateError } = await supabase
        .from('user_balances')
        .update({
          growth_cash: (balance?.growth_cash || 0) - amount,
          pending_withdrawal: (balance?.pending_withdrawal || 0) + amount
        })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      return withdrawalData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
    },
    onError: (error) => {
      toast.error("Failed to process withdrawal request");
      console.error("Withdrawal error:", error);
    }
  });

  return { createWithdrawal };
};
