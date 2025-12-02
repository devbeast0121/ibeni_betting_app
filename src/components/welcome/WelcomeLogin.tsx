
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';

const WelcomeLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [ageVerified, setAgeVerified] = useState(false);
  const [jurisdictionConfirmed, setJurisdictionConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAgeVerification = () => {
    if (!birthDate) {
      toast.error('Please enter your date of birth');
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age < 18) {
      toast.error('You must be 18 or older to use this service');
      return;
    }

    // Store verification in localStorage
    localStorage.setItem('ageVerified', JSON.stringify({
      verified: true,
      timestamp: Date.now(),
      birthDate: birthDate
    }));

    setAgeVerified(true);
    toast.success('Age verification complete');
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!ageVerified) {
      toast.error('Please verify your age first');
      return;
    }

    if (!jurisdictionConfirmed) {
      toast.error('Please confirm sports predictions are legal in your jurisdiction');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        throw error;
      }

      toast.success('Account created! Please check your email to confirm your registration.');
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success('Logged in successfully');

      // Determine if the user is an admin (sheradsky@gmail.com)
      if (email === 'sheradsky@gmail.com') {
        // If admin user, provide a choice for navigation
        toast.success('Admin access detected', {
          action: {
            label: 'Go to Admin',
            onClick: () => navigate('/admin')
          }
        });
      }

      // Navigate to dashboard in all cases
      navigate('/dashboard');

    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold mb-2">Create an Account</h2>
        <p className="text-muted-foreground">Sign up or login to start using ibeni</p>
      </div>

      <Tabs defaultValue="signup" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger className="flex-1" value="signup">Sign Up</TabsTrigger>
          <TabsTrigger className="flex-1" value="login">Login</TabsTrigger>
        </TabsList>

        <TabsContent value="signup">
          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Age Verification Section */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4" />
                <p className="font-semibold">Age Verification Required</p>
              </div>
              <p className="text-xs md:text-sm">
                You must be 18 years or older to participate in sports predictions and sweepstakes.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Date of Birth</Label>
              <div className="flex gap-2">
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAgeVerification}
                  disabled={!birthDate || ageVerified}
                >
                  {ageVerified ? '✓ Verified' : 'Verify'}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="jurisdiction"
                checked={jurisdictionConfirmed}
                onCheckedChange={(checked) => setJurisdictionConfirmed(checked === true)}
              />
              <Label htmlFor="jurisdiction" className="text-xs md:text-sm cursor-pointer">
                I confirm that sports predictions are legal in my jurisdiction and I understand this is for entertainment purposes.
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 sm:h-10"
              disabled={loading || !ageVerified || !jurisdictionConfirmed}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="login">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 sm:h-10"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WelcomeLogin;
