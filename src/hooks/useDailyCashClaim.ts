import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export const useDailyCashClaim = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const claimDailyCash = async (): Promise<boolean> => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast({
          title: "Authentication Error",
          description: "Please log in to claim daily cash",
          variant: "destructive"
        });
        return false;
      }

      // Check if user has already claimed today
      const today = new Date().toDateString();
      const lastClaim = localStorage.getItem('lastDailyCashClaim');
      
      if (lastClaim === today) {
        toast({
          title: "Already Claimed",
          description: "You have already claimed your daily cash today",
          variant: "destructive"
        });
        return false;
      }

      // First get current balance, then update it
      const { data: currentBalance, error: fetchError } = await supabase
        .from('user_balances')
        .select('growth_cash')
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching current balance:', fetchError);
        toast({
          title: "Error",
          description: "Failed to fetch current balance. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      // Update user's growth_cash balance by adding $1
      const newGrowthCash = (currentBalance?.growth_cash || 0) + 1.00;
      
      const { data, error } = await supabase
        .from('user_balances')
        .update({ 
          growth_cash: newGrowthCash,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating balance:', error);
        toast({
          title: "Error",
          description: "Failed to claim daily cash. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      // Store claim in localStorage
      localStorage.setItem('lastDailyCashClaim', today);

      // Invalidate balance queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: ['balance'] });

      toast({
        title: "Success!",
        description: "Daily $1 Growth Cash claimed! Use it for sweepstakes entries.",
        variant: "default"
      });

      return true;
    } catch (error) {
      console.error('Error claiming daily cash:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return { claimDailyCash };
};