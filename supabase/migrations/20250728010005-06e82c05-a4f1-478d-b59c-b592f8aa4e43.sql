-- Create table to track user locations for compliance
CREATE TABLE public.user_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  ip_address INET,
  country_code TEXT,
  state_code TEXT,
  city TEXT,
  is_restricted BOOLEAN DEFAULT false,
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own location data" 
ON public.user_locations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own location data" 
ON public.user_locations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all location data" 
ON public.user_locations 
FOR SELECT 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_locations_updated_at
BEFORE UPDATE ON public.user_locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create restricted states configuration table
CREATE TABLE public.restricted_states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state_code TEXT NOT NULL UNIQUE,
  state_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for restricted states (read-only for users)
ALTER TABLE public.restricted_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Restricted states are viewable by everyone" 
ON public.restricted_states 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify restricted states" 
ON public.restricted_states 
FOR ALL
USING (is_admin());

-- Insert Idaho and Washington as restricted states
INSERT INTO public.restricted_states (state_code, state_name, reason) VALUES 
('ID', 'Idaho', 'Legal compliance - sweepstakes restrictions'),
('WA', 'Washington', 'Legal compliance - sweepstakes restrictions');

-- Create trigger for restricted states timestamp updates
CREATE TRIGGER update_restricted_states_updated_at
BEFORE UPDATE ON public.restricted_states
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();