
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TrendingUp } from 'lucide-react';
import Header from '@/components/Header';
import CreateAdminUser from '@/components/admin/CreateAdminUser';
import { useAuth } from '@/contexts/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  // Check if user is already logged in and is admin
  useEffect(() => {
    console.log('AdminLogin: Auth state:', { user: user?.email, isAdmin });
    
    if (user) {
      if (isAdmin) {
        console.log('AdminLogin: User is admin, redirecting to admin dashboard');
        navigate('/admin');
      } else {
        console.log('AdminLogin: User is not admin, redirecting to dashboard');
        navigate('/dashboard');
      }
    }
  }, [user, isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      
      console.log('AdminLogin: Attempting login with:', { email });
      
      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('AdminLogin: Login error:', error);
        throw error;
      }
      
      if (data?.user) {
        console.log('AdminLogin: Login successful:', data.user.email);
        
        // Check if user is admin
        const adminEmails = ['sheradsky@gmail.com', 'ibenisportportfolio@gmail.com'];
        if (adminEmails.includes(data.user.email || '')) {
          console.log('AdminLogin: Admin user detected, will redirect to admin dashboard');
          toast.success('Admin login successful');
        } else {
          console.log('AdminLogin: Regular user detected, will redirect to dashboard');
          toast.success('Logged in successfully');
        }
        
        // Navigation will be handled by the useEffect above
      }
    } catch (error: any) {
      console.error('AdminLogin: Error details:', error);
      toast.error(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-accent mr-2" />
              <span className="font-bold text-xl md:text-2xl">Admin Portal</span>
            </div>
            <CardTitle className="text-xl md:text-2xl text-center">Sign in</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <CreateAdminUser />
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
};

export default AdminLogin;
