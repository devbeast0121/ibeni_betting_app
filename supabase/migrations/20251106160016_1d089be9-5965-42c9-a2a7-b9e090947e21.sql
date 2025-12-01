-- Create tips table to track individual tips
CREATE TABLE public.tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL,
  tipper_user_id UUID NOT NULL,
  receiver_user_id UUID NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Add total_tips column to social_posts
ALTER TABLE public.social_posts 
ADD COLUMN total_tips NUMERIC NOT NULL DEFAULT 0;

-- Enable RLS on tips table
ALTER TABLE public.tips ENABLE ROW LEVEL SECURITY;

-- RLS policies for tips
CREATE POLICY "Users can create tips" 
ON public.tips 
FOR INSERT 
WITH CHECK (auth.uid() = tipper_user_id);

CREATE POLICY "Users can view tips they gave or received" 
ON public.tips 
FOR SELECT 
USING (auth.uid() = tipper_user_id OR auth.uid() = receiver_user_id);

CREATE POLICY "Admins can view all tips" 
ON public.tips 
FOR SELECT 
USING (is_admin());

-- Indexes for performance
CREATE INDEX idx_tips_post_id ON public.tips(post_id);
CREATE INDEX idx_tips_receiver ON public.tips(receiver_user_id);
CREATE INDEX idx_tips_status_created ON public.tips(status, created_at);

-- Function to process tips older than 48 hours
CREATE OR REPLACE FUNCTION public.process_pending_tips()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  tip_record RECORD;
  total_amount NUMERIC;
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