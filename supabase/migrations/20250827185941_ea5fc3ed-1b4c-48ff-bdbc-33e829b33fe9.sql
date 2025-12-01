-- Add bonus_bets column to user_balances table
ALTER TABLE public.user_balances ADD COLUMN IF NOT EXISTS bonus_bets NUMERIC DEFAULT 0.00;

-- Create table to track bonus bet awards
CREATE TABLE IF NOT EXISTS public.bonus_bet_awards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 25.00,
  awarded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  award_period TEXT NOT NULL, -- '2024-Q1', '2024-Q2', etc.
  subscription_tier TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on bonus_bet_awards table
ALTER TABLE public.bonus_bet_awards ENABLE ROW LEVEL SECURITY;

-- Create policies for bonus_bet_awards
CREATE POLICY "Users can view their own bonus awards" 
ON public.bonus_bet_awards 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create bonus awards" 
ON public.bonus_bet_awards 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all bonus awards" 
ON public.bonus_bet_awards 
FOR SELECT 
USING (is_admin());

-- Create function to award bonus bets to premium subscribers
CREATE OR REPLACE FUNCTION public.award_premium_bonus_bets()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_period TEXT;
  subscriber_record RECORD;
BEGIN
  -- Calculate current award period (Q1, Q2, Q3 based on 4-month cycles)
  current_period := EXTRACT(YEAR FROM now()) || '-Q' || 
    CASE 
      WHEN EXTRACT(MONTH FROM now()) BETWEEN 1 AND 4 THEN '1'
      WHEN EXTRACT(MONTH FROM now()) BETWEEN 5 AND 8 THEN '2'
      ELSE '3'
    END;

  -- Award bonus bets to eligible premium subscribers
  FOR subscriber_record IN 
    SELECT s.user_id, s.subscription_tier, s.email
    FROM public.subscribers s
    WHERE s.subscribed = true 
    AND s.subscription_end > now()
    AND NOT EXISTS (
      -- Check if they already received bonus for this period
      SELECT 1 FROM public.bonus_bet_awards b 
      WHERE b.user_id = s.user_id 
      AND b.award_period = current_period
    )
  LOOP
    -- Award $25 bonus bets
    UPDATE public.user_balances 
    SET bonus_bets = bonus_bets + 25.00
    WHERE user_id = subscriber_record.user_id;

    -- Record the award
    INSERT INTO public.bonus_bet_awards (user_id, amount, award_period, subscription_tier)
    VALUES (subscriber_record.user_id, 25.00, current_period, subscriber_record.subscription_tier);

    -- Create notification
    INSERT INTO public.notifications (user_id, title, description, type, metadata)
    VALUES (
      subscriber_record.user_id,
      'Bonus Bets Awarded! 🎁',
      'You have received $25 in bonus bets as part of your premium subscription benefits.',
      'bonus_award',
      jsonb_build_object(
        'amount', 25.00,
        'award_period', current_period
      )
    );
  END LOOP;
END;
$$;

-- Create function to award bonus bets when user subscribes
CREATE OR REPLACE FUNCTION public.award_subscription_bonus()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_period TEXT;
BEGIN
  -- Only award if user just became subscribed
  IF NEW.subscribed = true AND (OLD.subscribed = false OR OLD.subscribed IS NULL) THEN
    -- Calculate current award period
    current_period := EXTRACT(YEAR FROM now()) || '-Q' || 
      CASE 
        WHEN EXTRACT(MONTH FROM now()) BETWEEN 1 AND 4 THEN '1'
        WHEN EXTRACT(MONTH FROM now()) BETWEEN 5 AND 8 THEN '2'
        ELSE '3'
      END;

    -- Check if they haven't already received bonus for this period
    IF NOT EXISTS (
      SELECT 1 FROM public.bonus_bet_awards 
      WHERE user_id = NEW.user_id 
      AND award_period = current_period
    ) THEN
      -- Award $25 bonus bets
      UPDATE public.user_balances 
      SET bonus_bets = COALESCE(bonus_bets, 0) + 25.00
      WHERE user_id = NEW.user_id;

      -- Record the award
      INSERT INTO public.bonus_bet_awards (user_id, amount, award_period, subscription_tier)
      VALUES (NEW.user_id, 25.00, current_period, NEW.subscription_tier);

      -- Create notification
      INSERT INTO public.notifications (user_id, title, description, type, metadata)
      VALUES (
        NEW.user_id,
        'Welcome Bonus Bets! 🎉',
        'Welcome to Premium! You have received $25 in bonus bets. You will receive $25 more every 4 months.',
        'subscription_bonus',
        jsonb_build_object(
          'amount', 25.00,
          'award_period', current_period
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for subscription bonus
DROP TRIGGER IF EXISTS award_subscription_bonus_trigger ON public.subscribers;
CREATE TRIGGER award_subscription_bonus_trigger
  AFTER INSERT OR UPDATE ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.award_subscription_bonus();

-- Update existing user balances to include bonus_bets column with default 0
UPDATE public.user_balances 
SET bonus_bets = 0.00 
WHERE bonus_bets IS NULL;