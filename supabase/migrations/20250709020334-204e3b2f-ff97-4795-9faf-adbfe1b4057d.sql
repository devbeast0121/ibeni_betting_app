-- Create plaid_accounts table to track linked bank accounts
CREATE TABLE public.plaid_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plaid_access_token TEXT NOT NULL,
  plaid_item_id TEXT NOT NULL,
  account_id TEXT NOT NULL,
  account_name TEXT,
  account_type TEXT,
  account_subtype TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.plaid_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own plaid accounts" ON public.plaid_accounts
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own plaid accounts" ON public.plaid_accounts
FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own plaid accounts" ON public.plaid_accounts
FOR UPDATE
USING (user_id = auth.uid());

-- Create ach_transfers table to track transfers
CREATE TABLE public.ach_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plaid_account_id UUID NOT NULL REFERENCES plaid_accounts(id),
  amount NUMERIC NOT NULL,
  transfer_type TEXT NOT NULL CHECK (transfer_type IN ('deposit', 'withdrawal')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  plaid_transfer_id TEXT,
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ach_transfers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own transfers" ON public.ach_transfers
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own transfers" ON public.ach_transfers
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Drop the old subscribers table since we're not using Stripe subscriptions
DROP TABLE IF EXISTS public.subscribers;