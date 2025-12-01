
-- Add RLS policies for deposits table to allow user operations
CREATE POLICY "Users can create deposits" ON public.deposits
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deposits" ON public.deposits  
FOR UPDATE USING (auth.uid() = user_id);

-- Add RLS policies for user_balances table to allow user operations
CREATE POLICY "Users can create their own balance" ON public.user_balances
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own balance" ON public.user_balances
FOR UPDATE USING (auth.uid() = user_id);

-- Add RLS policies for withdrawals table to allow updates
CREATE POLICY "Users can update their own withdrawals" ON public.withdrawals
FOR UPDATE USING (auth.uid() = user_id);

-- Create function to automatically create user balance when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_balance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Create user balance record with default values
  INSERT INTO public.user_balances (user_id, available_balance, invested_balance, growth_cash, pending_withdrawal)
  VALUES (NEW.id, 100.00, 0.00, 0.00, 0.00);
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create balance for new users
CREATE TRIGGER on_auth_user_created_balance
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_balance();
