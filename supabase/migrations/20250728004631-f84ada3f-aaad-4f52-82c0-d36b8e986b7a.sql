-- Add admin access policies for all tables
-- Create admin role check function if it doesn't exist
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN auth.email() = 'sheradsky@gmail.com';
END;
$$;

-- Add admin policies for predictions table
CREATE POLICY "Admins can view all predictions" ON predictions
FOR SELECT USING (public.is_admin());

-- Add admin policies for deposits table  
CREATE POLICY "Admins can view all deposits" ON deposits
FOR SELECT USING (public.is_admin());

-- Add admin policies for withdrawals table
CREATE POLICY "Admins can view all withdrawals" ON withdrawals
FOR SELECT USING (public.is_admin());

-- Add admin policies for user_balances table
CREATE POLICY "Admins can view all balances" ON user_balances
FOR SELECT USING (public.is_admin());

-- Add admin policies for subscribers table
CREATE POLICY "Admins can view all subscribers" ON subscribers
FOR SELECT USING (public.is_admin());

-- Add admin policies for platform_fees table (this table should allow admin access)
CREATE POLICY "Admins can view all platform fees" ON platform_fees
FOR SELECT USING (public.is_admin());

-- Add admin policies for profiles table
CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT USING (public.is_admin());