
import React, { useState, useMemo } from 'react';
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
import { Input } from "@/components/ui/input";
import { Wallet, ExternalLink, Clock, AlertCircle, AlertTriangle, Ban } from "lucide-react";
import { useBalance } from '@/hooks/useBalance';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/components/ui/sonner";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const WithdrawDialog = () => {
  const [amount, setAmount] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { createWithdrawal, balance } = useBalance();
  const { subscriptionData } = useAuth();

  // Calculate eligibility for Growth Cash only
  const eligibilityInfo = useMemo(() => {
    const growthCash = balance?.growth_cash || 0;
    const isSubscriber = subscriptionData?.subscribed || false;
    
    // For Growth Cash: Must be subscriber and wait 3 months (simulated as always eligible if subscriber)
    const eligibleGrowthCash = isSubscriber ? growthCash : 0;
    const hasEligibleFunds = eligibleGrowthCash > 0;
    
    return {
      hasEligibleFunds,
      eligibleGrowthCash,
      totalEligible: eligibleGrowthCash,
      isSubscriber,
      growthCash
    };
  }, [balance, subscriptionData]);

  const handleWithdraw = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (!eligibilityInfo.hasEligibleFunds) {
      toast.error("You don't have any eligible funds to withdraw");
      return;
    }
    
    if (numAmount > eligibilityInfo.totalEligible) {
      toast.error(`Amount exceeds eligible balance of $${eligibilityInfo.totalEligible.toFixed(2)}`);
      return;
    }
    
    createWithdrawal.mutate({ amount: numAmount });
    setIsOpen(false);
    setAmount('');
    toast.success(`Withdrawal request for $${numAmount.toFixed(2)} submitted!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Wallet className="mr-2 h-4 w-4" /> 
          Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Growth Cash Withdrawal</DialogTitle>
          <DialogDescription>
            Request to withdraw eligible Growth Cash rewards.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {!eligibilityInfo.hasEligibleFunds ? (
            <Alert className="border-red-200 bg-red-50">
              <Ban className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 text-sm">
                <strong>NO ELIGIBLE FUNDS:</strong> You currently don't have any Growth Cash eligible for withdrawal. Growth Cash requires premium subscription and 3-month waiting period.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="border-green-200 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 text-sm">
                <strong>ELIGIBLE FUNDS:</strong> You have $${eligibilityInfo.totalEligible.toFixed(2)} available for withdrawal.
              </AlertDescription>
            </Alert>
          )}
          
          <div>
            <label htmlFor="amount" className="text-sm font-medium">
              Withdrawal Amount
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500">$</span>
              </div>
              <Input
                id="amount"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
                type="number"
                min="0"
                max={eligibilityInfo.totalEligible}
                step="0.01"
              />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Maximum eligible: $${eligibilityInfo.totalEligible.toFixed(2)}
            </div>
          </div>
          
          <div className="text-sm bg-muted/50 p-3 rounded-lg space-y-2">
            <div className="text-xs">
              <div>
                <p className="font-medium">Growth Cash:</p>
                <p className="text-muted-foreground">${eligibilityInfo.growthCash.toFixed(2)} total</p>
                <p className={eligibilityInfo.eligibleGrowthCash > 0 ? "text-green-600" : "text-red-600"}>
                  ${eligibilityInfo.eligibleGrowthCash.toFixed(2)} eligible
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center bg-amber-50 border border-amber-200 p-3 rounded-md">
            <Clock className="h-4 w-4 text-amber-500 mr-2 flex-shrink-0" />
            <p className="text-xs text-amber-800">
              <span className="font-medium">Rules: </span>
              Growth Cash requires premium subscription + 3-month waiting period.
            </p>
          </div>
        </div>
        <DialogFooter className="flex-col space-y-2">
          <Button 
            onClick={handleWithdraw} 
            disabled={!eligibilityInfo.hasEligibleFunds || !amount || parseFloat(amount) <= 0}
            className="w-full"
          >
            {eligibilityInfo.hasEligibleFunds ? "Submit Withdrawal Request" : "No Eligible Funds"}
          </Button>
          {eligibilityInfo.hasEligibleFunds && (
            <div className="text-xs text-center text-muted-foreground">
              By proceeding, you agree to our <Link to="/terms" className="underline hover:text-primary inline-flex items-center">Terms & Conditions <ExternalLink className="h-3 w-3 ml-0.5" /></Link>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
