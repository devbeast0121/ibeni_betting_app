import React, { useState } from 'react';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Gift, ExternalLink, Clock, AlertCircle, AlertTriangle } from "lucide-react";
import { useBalance } from '@/hooks/useBalance';
import { toast } from "@/components/ui/sonner";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const PortfolioRedeemDialog = () => {
  const [amount, setAmount] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);
  const { createWithdrawal, balance } = useBalance();

  const portfolioBalance = balance?.invested_balance || 0;
  const maxRedeemableAmount = portfolioBalance;

  const handleRedeem = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (numAmount > maxRedeemableAmount) {
      toast.error("Amount exceeds available portfolio balance");
      return;
    }

    if (!agreedToTerms || !agreedToRules) {
      toast.error("Please agree to all terms and rules before proceeding");
      return;
    }
    
    createWithdrawal.mutate({ amount: numAmount });
    setIsOpen(false);
    setAmount('');
    setAgreedToTerms(false);
    setAgreedToRules(false);
    toast.success(`Portfolio redemption request for $${numAmount.toFixed(2)} submitted!`);
  };

  const canProceed = agreedToTerms && agreedToRules && amount && parseFloat(amount) > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size="lg">
          <Gift className="mr-2 h-4 w-4" /> Redeem Portfolio
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Portfolio Prize Redemption</DialogTitle>
          <DialogDescription>
            Redeem your portfolio simulation balance as sweepstakes prizes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-xs md:text-sm">
              <strong>PORTFOLIO REDEMPTION:</strong> You are redeeming your simulated portfolio balance. This is not an investment withdrawal but a sweepstakes prize redemption.
            </AlertDescription>
          </Alert>

          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-xs md:text-sm">
              <strong>REDEMPTION FEES:</strong> Portfolio redemptions include withdrawal fees: 5% after one year, 50% before one year from initial portfolio funding.
            </AlertDescription>
          </Alert>
          
          <div>
            <label htmlFor="amount" className="text-xs md:text-sm font-medium">
              Redemption Amount (Portfolio Balance Only)
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
                max={maxRedeemableAmount}
                step="0.01"
              />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Maximum available: ${maxRedeemableAmount.toFixed(2)}
            </div>
          </div>
          
          <div className="flex items-center bg-amber-50 border border-amber-200 p-3 rounded-md">
            <Clock className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
            <p className="text-xs md:text-sm text-amber-800">
              <span className="font-medium">Important: </span>
              Portfolio redemptions are subject to withdrawal fees and waiting periods. This is a sweepstakes prize redemption, not an investment withdrawal.
            </p>
          </div>
          
          <div className="text-xs md:text-sm bg-muted/50 p-4 rounded-lg space-y-3">
            <div>
              <p className="font-medium">Portfolio Redemption Rules:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                <li>Available to all members regardless of subscription status</li>
                <li>Withdrawal fees apply: 5% after one year, 50% before one year</li>
                <li>Processing time: 1-3 business days after approval</li>
                <li>Funds must have been in portfolio for minimum period</li>
              </ul>
            </div>
            <div>
              <p className="font-medium">Legal Requirements:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                <li>Must agree to sweepstakes terms and conditions</li>
                <li>Must acknowledge this is entertainment, not investment</li>
                <li>Subject to verification and compliance requirements</li>
                <li>Redemption constitutes acceptance of all platform rules</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 border-t pt-4">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              />
              <label htmlFor="terms" className="text-xs md:text-sm leading-relaxed">
                I acknowledge that this is a sweepstakes prize redemption, not an investment withdrawal. I understand that no actual investing has occurred and this represents simulated portfolio values only. I agree to the <Link to="/terms" className="underline hover:text-primary inline-flex items-center">Terms & Conditions <ExternalLink className="h-3 w-3 ml-0.5" /></Link>.
              </label>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="rules" 
                checked={agreedToRules}
                onCheckedChange={(checked) => setAgreedToRules(checked === true)}
              />
              <label htmlFor="rules" className="text-xs md:text-sm leading-relaxed">
                I understand and agree to the redemption fees (5% after one year, 50% before one year) and acknowledge that this platform is for entertainment purposes only. I agree to the <Link to="/terms#sweep" className="underline hover:text-primary inline-flex items-center">Sweepstakes Rules <ExternalLink className="h-3 w-3 ml-0.5" /></Link>.
              </label>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
            <p className="font-medium mb-1">Available for Redemption:</p>
            <p>Portfolio Balance: ${portfolioBalance.toFixed(2)}</p>
            <p className="mt-2">Growth Cash winnings are subject to separate withdrawal rules and are not included in portfolio redemption.</p>
          </div>
        </div>
        <DialogFooter className="flex-col space-y-2">
          <Button 
            onClick={handleRedeem} 
            disabled={!canProceed}
            className="w-full"
          >
            Submit Portfolio Redemption Request
          </Button>
          <div className="text-xs text-center text-muted-foreground">
            By proceeding, you confirm agreement to all terms and acknowledge this is entertainment-based sweepstakes participation.
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};