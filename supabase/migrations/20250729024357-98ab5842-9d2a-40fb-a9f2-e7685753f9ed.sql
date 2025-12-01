-- Create KYC verification table
CREATE TABLE public.kyc_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  document_type TEXT NOT NULL,
  document_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on KYC table
ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;

-- KYC policies
CREATE POLICY "Users can view their own KYC status"
ON public.kyc_verifications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can submit KYC documents"
ON public.kyc_verifications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all KYC submissions"
ON public.kyc_verifications
FOR ALL
USING (is_admin());

-- Create bet templates table
CREATE TABLE public.bet_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  selections JSONB NOT NULL,
  bet_amount NUMERIC NOT NULL,
  bet_type TEXT NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT false,
  times_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on bet templates
ALTER TABLE public.bet_templates ENABLE ROW LEVEL SECURITY;

-- Bet templates policies
CREATE POLICY "Users can manage their own templates"
ON public.bet_templates
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Everyone can view public templates"
ON public.bet_templates
FOR SELECT
USING (is_public = true);

-- Create auto betting settings table
CREATE TABLE public.auto_betting_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  follow_user_id UUID,
  max_bet_amount NUMERIC NOT NULL DEFAULT 10,
  bet_multiplier NUMERIC NOT NULL DEFAULT 1.0,
  sports_filter TEXT[],
  min_odds NUMERIC DEFAULT 1.5,
  max_odds NUMERIC DEFAULT 5.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on auto betting
ALTER TABLE public.auto_betting_settings ENABLE ROW LEVEL SECURITY;

-- Auto betting policies
CREATE POLICY "Users can manage their own auto betting settings"
ON public.auto_betting_settings
FOR ALL
USING (auth.uid() = user_id);

-- Create expert traders table for copy trading
CREATE TABLE public.expert_traders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  followers_count INTEGER NOT NULL DEFAULT 0,
  win_rate NUMERIC NOT NULL DEFAULT 0,
  total_profit NUMERIC NOT NULL DEFAULT 0,
  subscription_fee NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on expert traders
ALTER TABLE public.expert_traders ENABLE ROW LEVEL SECURITY;

-- Expert traders policies
CREATE POLICY "Everyone can view expert traders"
ON public.expert_traders
FOR SELECT
USING (true);

CREATE POLICY "Users can manage their own expert profile"
ON public.expert_traders
FOR ALL
USING (auth.uid() = user_id);

-- Create analytics tracking table
CREATE TABLE public.betting_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  total_bets INTEGER NOT NULL DEFAULT 0,
  total_wagered NUMERIC NOT NULL DEFAULT 0,
  total_winnings NUMERIC NOT NULL DEFAULT 0,
  win_rate NUMERIC NOT NULL DEFAULT 0,
  roi NUMERIC NOT NULL DEFAULT 0,
  longest_win_streak INTEGER NOT NULL DEFAULT 0,
  longest_loss_streak INTEGER NOT NULL DEFAULT 0,
  favorite_sport TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS on analytics
ALTER TABLE public.betting_analytics ENABLE ROW LEVEL SECURITY;

-- Analytics policies
CREATE POLICY "Users can view their own analytics"
ON public.betting_analytics
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can update analytics"
ON public.betting_analytics
FOR ALL
USING (true);

-- Add triggers for updated_at columns
CREATE TRIGGER update_kyc_verifications_updated_at
BEFORE UPDATE ON public.kyc_verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bet_templates_updated_at
BEFORE UPDATE ON public.bet_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_auto_betting_settings_updated_at
BEFORE UPDATE ON public.auto_betting_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_expert_traders_updated_at
BEFORE UPDATE ON public.expert_traders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_betting_analytics_updated_at
BEFORE UPDATE ON public.betting_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();