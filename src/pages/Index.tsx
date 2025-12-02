
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import { toast } from "@/components/ui/sonner";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import TermsFooter from '@/components/terms/TermsFooter';

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { refreshSubscription } = useAuth();

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    if (success === 'true') {
      toast.success("Payment successful! Verifying and updating your account...");

      // Verify payment and update balances
      const verifyPayment = async () => {
        try {
          const { data, error } = await supabase.functions.invoke('verify-payment');
          if (error) throw error;

          if (data.updated) {
            toast.success("Your balance has been updated successfully!");
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          toast.error("Payment received but balance update failed. Please contact support.");
        }
      };

      verifyPayment();
      refreshSubscription();
      setSearchParams(new URLSearchParams());
    } else if (canceled === 'true') {
      toast.error("Payment was canceled. You can try again anytime.");
      setSearchParams(new URLSearchParams());
    }
  }, [searchParams, setSearchParams, refreshSubscription]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="container py-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
        <Dashboard />
      </div>

      <TermsFooter />
    </div>
  );
};

export default Index;
