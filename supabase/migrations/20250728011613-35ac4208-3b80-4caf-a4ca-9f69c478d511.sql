-- Create account deletions table to track deletion requests and final withdrawals
CREATE TABLE public.account_deletions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  email TEXT NOT NULL,
  final_withdrawal_amount NUMERIC DEFAULT 0,
  portfolio_balance NUMERIC DEFAULT 0,
  growth_cash_balance NUMERIC DEFAULT 0,
  withdrawal_fees_applied NUMERIC DEFAULT 0,
  account_age_days INTEGER DEFAULT 0,
  deletion_reason TEXT,
  withdrawal_processed BOOLEAN DEFAULT false,
  stripe_transfer_id TEXT,
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.account_deletions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own deletion requests" 
ON public.account_deletions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create deletion requests" 
ON public.account_deletions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all deletion requests" 
ON public.account_deletions 
FOR SELECT 
USING (is_admin());

CREATE POLICY "System can update deletion requests" 
ON public.account_deletions 
FOR UPDATE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_account_deletions_updated_at
BEFORE UPDATE ON public.account_deletions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();