
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import { toast } from "@/components/ui/sonner";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
      
      <footer className="py-4 border-t">
        <div className="container">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div>© 2025 ibeni. All rights reserved.</div>
            <div className="flex gap-4">
              <a href="/terms" className="hover:text-foreground">Terms</a>
              <a href="/terms#privacy" className="hover:text-foreground">Privacy</a>
              <a href="/terms#sweep" className="hover:text-foreground">Sweepstakes Rules</a>
            </div>
          </div>
          <div className="text-xs text-muted-foreground border-t pt-3">
            <p className="mb-1">DISCLAIMER: This is a sweepstakes platform. No purchase necessary to enter or win. Void where prohibited. A purchase will not increase your chances of winning. Participation constitutes entrant's full and unconditional agreement to and acceptance of these Official Rules.</p>
            <p className="mb-1">FINANCIAL DISCLAIMER: Any investment and performance information shown is for illustrative and educational purposes only and is not intended to be investment advice. Past performance is not indicative of future results. Investing involves risk including the possible loss of principal.</p>
            <p className="mb-1">SPORTS PREDICTIONS DISCLAIMER: The sports predictions offered on this platform are for entertainment purposes only. ibeni is not affiliated with any professional sports leagues or teams.</p>
            <p>NO REAL MONEY GAMBLING: ibeni does not offer real money gambling services. Tokens and entries have no cash value and cannot be exchanged for real money.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
