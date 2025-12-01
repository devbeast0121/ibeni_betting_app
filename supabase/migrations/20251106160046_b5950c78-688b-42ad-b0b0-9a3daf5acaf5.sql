-- Fix search_path for process_pending_tips function
DROP FUNCTION IF EXISTS public.process_pending_tips();

CREATE OR REPLACE FUNCTION public.process_pending_tips()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tip_record RECORD;
BEGIN
  -- Find all pending tips older than 48 hours, grouped by receiver
  FOR tip_record IN 
    SELECT 
      receiver_user_id,
      SUM(amount) as total_tips,
      ARRAY_AGG(id) as tip_ids
    FROM public.tips
    WHERE status = 'pending' 
    AND created_at <= now() - INTERVAL '48 hours'
    GROUP BY receiver_user_id
  LOOP
    -- Add bonus bets to the receiver
    UPDATE public.user_balances 
    SET bonus_bets = COALESCE(bonus_bets, 0) + tip_record.total_tips
    WHERE user_id = tip_record.receiver_user_id;

    -- Mark tips as processed
    UPDATE public.tips 
    SET status = 'completed', processed_at = now()
    WHERE id = ANY(tip_record.tip_ids);

    -- Create notification
    INSERT INTO public.notifications (user_id, title, description, type, metadata)
    VALUES (
      tip_record.receiver_user_id,
      'Tips Converted to Bonus Bets! 💰',
      'You received $' || tip_record.total_tips || ' in bonus bets from tips on your posts.',
      'tip_reward',
      jsonb_build_object(
        'amount', tip_record.total_tips,
        'tip_count', array_length(tip_record.tip_ids, 1)
      )
    );
  END LOOP;
END;
$$;