import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useBalance } from './useBalance';

export const useTipping = () => {
  const [loading, setLoading] = useState(false);
  const { balance, refreshBalance } = useBalance();

  const sendTip = async (postId: string, receiverUserId: string, amount: number) => {
    try {
      setLoading(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to send tips');
        return false;
      }

      // Check if user has enough growth cash
      if ((balance?.growth_cash || 0) < amount) {
        toast.error('Insufficient Growth Cash balance');
        return false;
      }

      // Deduct from tipper's growth cash
      const { error: balanceError } = await supabase
        .from('user_balances')
        .update({ 
          growth_cash: (balance?.growth_cash || 0) - amount 
        })
        .eq('user_id', user.id);

      if (balanceError) throw balanceError;

      // Create tip record
      const { error: tipError } = await supabase
        .from('tips')
        .insert({
          post_id: postId,
          tipper_user_id: user.id,
          receiver_user_id: receiverUserId,
          amount: amount,
          status: 'pending'
        });

      if (tipError) throw tipError;

      // Update total tips on the post
      const { data: postData } = await supabase
        .from('social_posts')
        .select('total_tips')
        .eq('id', postId)
        .single();

      if (postData) {
        await supabase
          .from('social_posts')
          .update({ total_tips: (postData.total_tips || 0) + amount })
          .eq('id', postId);
      }

      if (refreshBalance) {
        await refreshBalance();
      }
      
      toast.success(`Tip of $${amount.toFixed(2)} sent! It will convert to bonus bets in 48 hours.`);
      return true;

    } catch (error: any) {
      console.error('Error sending tip:', error);
      toast.error('Failed to send tip. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendTip,
    loading
  };
};