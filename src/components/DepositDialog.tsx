// DepositDialog component - authentication removed
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { DollarSign, ExternalLink, AlertCircle, Gift, Building2 } from "lucide-react";
import { useBalance } from '@/hooks/useBalance';
import { toast } from "@/components/ui/sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePlaidLink } from 'react-plaid-link';

export const DepositDialog = () => {
  const [amount, setAmount] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [depositType, setDepositType] = useState<'sweepstakes' | 'growth_cash'>('sweepstakes');
  const { createDeposit } = useBalance();
  const [lastFreeTokenDate, setLastFreeTokenDate] = useState<Date | null>(null);
  const [canClaimFreeTokens, setCanClaimFreeTokens] = useState(false);
  const [loading, setLoading] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [linkedAccounts, setLinkedAccounts] = useState<any[]>([]);

  // Check if user can claim free tokens (once per day)
  useEffect(() => {
    const checkFreeTokenEligibility = () => {
      const lastClaimDateStr = localStorage.getItem('lastFreeTokenClaim');
      
      if (!lastClaimDateStr) {
        setCanClaimFreeTokens(true);
        return;
      }
      
      const lastClaimDate = new Date(lastClaimDateStr);
      setLastFreeTokenDate(lastClaimDate);
      
      const now = new Date();
      const lastClaimDay = lastClaimDate.toDateString();
      const currentDay = now.toDateString();
      
      const canClaim = (currentDay !== lastClaimDay);
      setCanClaimFreeTokens(canClaim);
    };
    
    checkFreeTokenEligibility();
  }, [isOpen]);

  // For now, disable Plaid functionality without authentication
  useEffect(() => {
    // Plaid functionality disabled without authentication
  }, [isOpen, depositType]);

  // Simplified for no authentication - disable Plaid features
  const onSuccess = useCallback(async (public_token: string, metadata: any) => {
    toast.error("Authentication required for bank transfers");
  }, []);

  const onExit = useCallback((err: any, metadata: any) => {
    console.log('Plaid link exit:', err, metadata);
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit,
  });

  const handleDeposit = async () => {
    const numAmount = parseFloat(amount);
    
    if (depositType === 'sweepstakes') {
      // For free tokens, always use fixed amount of 100
      createDeposit.mutate({ 
        amount: 100, 
        depositType: 'sweepstakes' 
      });
      
      // Update the last claim date
      const now = new Date();
      localStorage.setItem('lastFreeTokenClaim', now.toISOString());
      setLastFreeTokenDate(now);
      setCanClaimFreeTokens(false);
      
      setIsOpen(false);
      toast.success(`100 Free Fun Tokens added to your account!`);
      return;
    }
    
    // For growth_cash deposits - use Stripe checkout
    if (isNaN(numAmount) || numAmount < 10) {
      toast.error("Minimum deposit amount is $10");
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          mode: 'deposit',
          amount: numAmount
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      toast.success("Redirecting to secure payment...");
      setIsOpen(false);
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error("Failed to create deposit session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <DollarSign className="mr-2 h-4 w-4" /> Deposit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make a Deposit</DialogTitle>
          <DialogDescription>
            Choose between Fun Tokens for entertainment purposes only and Growth Cash for investment portfolio value
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="sweepstakes" onValueChange={(value) => setDepositType(value as 'sweepstakes' | 'growth_cash')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sweepstakes">Fun Tokens</TabsTrigger>
            <TabsTrigger value="growth_cash">Growth Cash</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sweepstakes" className="space-y-4">
            <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg bg-muted/20">
              <Gift className="h-10 w-10 text-blue-500 mb-2" />
              <h3 className="font-medium text-lg">Daily Free Fun Tokens</h3>
              <p className="text-center text-muted-foreground text-xs md:text-sm mb-4">
                Claim 100 free Fun Tokens once per day
              </p>
              
              {!canClaimFreeTokens && lastFreeTokenDate && (
                <div className="bg-amber-50 text-amber-800 p-3 rounded-md text-xs md:text-sm mb-4 w-full">
                  <p className="font-medium">You've already claimed your free tokens today</p>
                  <p className="text-xs">
                    Last claimed: {lastFreeTokenDate.toLocaleDateString()} at {lastFreeTokenDate.toLocaleTimeString()}
                  </p>
                  <p className="text-xs mt-1">
                    Next claim available: Tomorrow
                  </p>
                </div>
              )}
            </div>
            
            <div className="text-xs space-y-2 text-muted-foreground">
              <p><strong>Note:</strong> Fun Tokens are for entertainment purposes only and have no monetary value.</p>
              <p>Fun Tokens can only be used for making predictions in our games.</p>
              <p className="font-medium text-green-600">FREE DAILY ENTRY - Get 100 Fun Tokens + $1 Growth Cash daily. No purchase necessary for sweepstakes participation.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="growth_cash" className="space-y-4">
            <div>
              <label htmlFor="growth-amount" className="text-xs md:text-sm font-medium">
                Deposit Amount (Minimum $10)
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500">$</span>
                </div>
                <Input
                  id="growth-amount"
                  placeholder="10.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7"
                  type="number"
                  min="10"
                  step="1"
                />
              </div>
            </div>
            
            <div className="flex items-center bg-blue-50 border border-blue-200 p-3 rounded-md">
              <Building2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
              <p className="text-xs md:text-sm text-blue-800">
                <span className="font-medium">Secure Payment via Stripe: </span>
                Fast, secure deposits using Stripe's industry-leading payment processing.
              </p>
            </div>
            
            <div className="text-xs md:text-sm bg-muted/50 p-4 rounded-lg space-y-3">
              <div>
                <p className="font-medium">Sports Betting Entertainment Information:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                  <li>Growth Cash winnings: Subscribers can withdraw after 3-month waiting period</li>
                  <li>Portfolio losses: All members can withdraw with fees (5% after 1yr, 50% before)</li>
                  <li>Non-subscribers cannot withdraw Growth Cash winnings</li>
                </ul>
              </div>
              <div className="border-t pt-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div className="text-xs text-amber-600">
                    <p className="font-medium">Subscription Benefits:</p>
                    <p>Subscribers can withdraw Growth Cash winnings after 3-month waiting period. Non-subscribers can only withdraw portfolio losses with fees.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>Track your portfolio simulation in real-time. No actual investing occurs - values are for entertainment and withdrawable with fees.</p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex-col space-y-2">
          <Button 
            onClick={handleDeposit} 
            disabled={
              loading ||
              (depositType === 'sweepstakes' && !canClaimFreeTokens) || 
              (depositType === 'growth_cash' && (!amount || parseFloat(amount) < 10))
            }
          >
            {loading ? 'Processing...' : (depositType === 'sweepstakes' ? 'Claim Daily Free Tokens' : 'Deposit via Stripe')}
          </Button>
          <div className="text-xs text-center text-muted-foreground">
            By proceeding, you agree to our <Link to="/terms" className="underline hover:text-primary">Terms & Conditions</Link>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};