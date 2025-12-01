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
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, DollarSign, Clock, Trash2 } from "lucide-react";
import { useBalance } from '@/hooks/useBalance';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/components/ui/sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

export const DeleteAccountDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { balance } = useBalance();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Calculate withdrawal amounts based on platform rules
  const calculateWithdrawal = () => {
    if (!balance || !user) return { withdrawable: 0, fees: 0, breakdown: [] };

    const portfolioBalance = balance.invested_balance || 0;
    const growthCashBalance = balance.growth_cash || 0;

    // Calculate account age
    const accountCreated = new Date(user.created_at);
    const now = new Date();
    const accountAgeDays = Math.floor((now.getTime() - accountCreated.getTime()) / (1000 * 60 * 60 * 24));
    const isUnderOneYear = accountAgeDays < 365;

    // Portfolio losses: 50% fee before 1 year, 5% after 1 year
    const portfolioFeeRate = isUnderOneYear ? 0.50 : 0.05;
    const portfolioWithdrawable = portfolioBalance * (1 - portfolioFeeRate);
    const portfolioFees = portfolioBalance * portfolioFeeRate;

    // Growth Cash (simplified - assume withdrawable for this example)
    const growthCashWithdrawable = growthCashBalance;

    const breakdown = [
      {
        type: 'Portfolio Losses',
        balance: portfolioBalance,
        feeRate: portfolioFeeRate,
        fees: portfolioFees,
        withdrawable: portfolioWithdrawable,
        ageRestriction: isUnderOneYear ? 'Under 1 year' : 'Over 1 year'
      },
      {
        type: 'Growth Cash',
        balance: growthCashBalance,
        feeRate: 0,
        fees: 0,
        withdrawable: growthCashWithdrawable,
        ageRestriction: 'None'
      }
    ];

    return {
      withdrawable: portfolioWithdrawable + growthCashWithdrawable,
      fees: portfolioFees,
      breakdown,
      accountAgeDays,
      isUnderOneYear
    };
  };

  const withdrawalInfo = calculateWithdrawal();

  const handleDeleteAccount = async () => {
    if (confirmText.toLowerCase() !== 'delete my account') {
      toast.error('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }

    if (!reason.trim()) {
      toast.error('Please provide a reason for account deletion');
      return;
    }

    setIsDeleting(true);
    try {
      const { data, error } = await supabase.functions.invoke('delete-account', {
        body: { reason: reason.trim() }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(`Account deleted successfully. ${data.withdrawal_amount > 0 ? `$${data.withdrawal_amount.toFixed(2)} has been transferred to your account.` : ''}`);
        // User will be automatically logged out since account is deleted
        navigate('/welcome');
      } else {
        toast.warning(data.message);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. All your data will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Withdrawal Preview */}
          {withdrawalInfo.withdrawable > 0 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <DollarSign className="h-5 w-5" />
                  Final Withdrawal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">
                    ${withdrawalInfo.withdrawable.toFixed(2)}
                  </div>
                  <div className="text-sm text-green-600">
                    Will be transferred to your account before deletion
                  </div>
                </div>

                <div className="space-y-3">
                  {withdrawalInfo.breakdown.map((item, index) => (
                    <div key={index} className="bg-white/50 p-3 rounded border">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{item.type}</span>
                        <span className="text-sm text-muted-foreground">{item.ageRestriction}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <div className="text-xs text-muted-foreground">Balance</div>
                          <div>${item.balance.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Fees ({(item.feeRate * 100).toFixed(0)}%)
                          </div>
                          <div>${item.fees.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">You Get</div>
                          <div className="font-medium">${item.withdrawable.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-sm text-green-700">
                  <Clock className="h-4 w-4" />
                  Account age: {withdrawalInfo.accountAgeDays} days 
                  {withdrawalInfo.isUnderOneYear && ' (Higher fees apply - under 1 year)'}
                </div>
              </CardContent>
            </Card>
          )}

          {withdrawalInfo.withdrawable === 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No funds available for withdrawal. Your account has a zero balance.
              </AlertDescription>
            </Alert>
          )}

          {/* Reason Input */}
          <div>
            <label htmlFor="reason" className="text-sm font-medium">
              Reason for Account Deletion (Required)
            </label>
            <Textarea
              id="reason"
              placeholder="Please tell us why you're deleting your account..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Confirmation Input */}
          <div>
            <label htmlFor="confirm" className="text-sm font-medium">
              Type "DELETE MY ACCOUNT" to confirm
            </label>
            <Input
              id="confirm"
              placeholder="DELETE MY ACCOUNT"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="mt-1"
            />
          </div>

          <Alert className="border-destructive/50 bg-destructive/10">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-destructive">
              <strong>Warning:</strong> This action is permanent and cannot be undone. 
              {withdrawalInfo.withdrawable > 0 && ' Your final withdrawal will be processed automatically before account deletion.'}
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount}
            disabled={isDeleting || confirmText.toLowerCase() !== 'delete my account' || !reason.trim()}
          >
            {isDeleting ? 'Deleting Account...' : 'Delete Account & Process Withdrawal'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};