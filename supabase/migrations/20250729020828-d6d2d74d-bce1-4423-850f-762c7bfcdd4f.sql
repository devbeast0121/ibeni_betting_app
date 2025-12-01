-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL, -- 'bet_win', 'bet_loss', 'portfolio_deposit', 'withdrawal', 'deposit'
  is_read BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all notifications" 
ON public.notifications 
FOR SELECT 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create notifications for bet results
CREATE OR REPLACE FUNCTION public.notify_bet_result()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification when status changes to 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    IF NEW.result = 'win' THEN
      INSERT INTO public.notifications (user_id, title, description, type, metadata)
      VALUES (
        NEW.user_id,
        'Bet Won! 🎉',
        'Congratulations! You won $' || NEW.winnings || ' on your bet.',
        'bet_win',
        jsonb_build_object(
          'bet_id', NEW.id,
          'winnings', NEW.winnings,
          'original_amount', NEW.amount
        )
      );
    ELSIF NEW.result = 'loss' THEN
      INSERT INTO public.notifications (user_id, title, description, type, metadata)
      VALUES (
        NEW.user_id,
        'Bet Lost 😔',
        'Sorry, your bet of $' || NEW.amount || ' did not win this time.',
        'bet_loss',
        jsonb_build_object(
          'bet_id', NEW.id,
          'amount_lost', NEW.amount
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notifications for portfolio deposits
CREATE OR REPLACE FUNCTION public.notify_portfolio_deposit()
RETURNS TRIGGER AS $$
DECLARE
  growth_cash_change NUMERIC;
BEGIN
  -- Check if growth cash increased (indicating a deposit to portfolio)
  growth_cash_change := NEW.growth_cash - OLD.growth_cash;
  
  IF growth_cash_change > 0 THEN
    INSERT INTO public.notifications (user_id, title, description, type, metadata)
    VALUES (
      NEW.user_id,
      'Growth Cash Added 💰',
      '$' || growth_cash_change || ' has been added to your portfolio growth cash.',
      'portfolio_deposit',
      jsonb_build_object(
        'amount', growth_cash_change,
        'new_balance', NEW.growth_cash
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notifications for deposits
CREATE OR REPLACE FUNCTION public.notify_deposit_completed()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify when status changes to 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO public.notifications (user_id, title, description, type, metadata)
    VALUES (
      NEW.user_id,
      'Deposit Completed ✅',
      'Your deposit of $' || NEW.amount || ' has been successfully processed.',
      'deposit',
      jsonb_build_object(
        'deposit_id', NEW.id,
        'amount', NEW.amount,
        'deposit_type', NEW.deposit_type
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notifications for withdrawals
CREATE OR REPLACE FUNCTION public.notify_withdrawal_completed()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify when status changes to 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    INSERT INTO public.notifications (user_id, title, description, type, metadata)
    VALUES (
      NEW.user_id,
      'Withdrawal Completed 💸',
      'Your withdrawal of $' || NEW.amount || ' has been successfully processed.',
      'withdrawal',
      jsonb_build_object(
        'withdrawal_id', NEW.id,
        'amount', NEW.amount
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER predictions_result_notification
  AFTER UPDATE ON public.predictions
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_bet_result();

CREATE TRIGGER user_balances_growth_cash_notification
  AFTER UPDATE ON public.user_balances
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_portfolio_deposit();

CREATE TRIGGER deposits_completed_notification
  AFTER UPDATE ON public.deposits
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_deposit_completed();

CREATE TRIGGER withdrawals_completed_notification
  AFTER UPDATE ON public.withdrawals
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_withdrawal_completed();