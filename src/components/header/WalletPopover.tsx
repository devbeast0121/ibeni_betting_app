
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { DepositDialog } from '../DepositDialog';
import { WithdrawDialog } from '../WithdrawDialog';

interface WalletPopoverProps {
  isLoadingBalance: boolean;
  balance: {
    available_balance: number;
    growth_cash: number;
    bonus_bets: number;
    invested_balance: number;
  } | null;
}

const WalletPopover = ({ isLoadingBalance, balance }: WalletPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          <span className="font-medium">
            {isLoadingBalance ? "..." : `$${balance?.growth_cash.toFixed(2)}`}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Your Balances</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Fun Tokens:</span>
                <span className="font-medium">{isLoadingBalance ? "..." : balance?.available_balance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Growth Cash:</span>
                <span className="font-medium">${isLoadingBalance ? "..." : balance?.growth_cash.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Bonus Bets:</span>
                <span className="font-medium">${isLoadingBalance ? "..." : balance?.bonus_bets.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Invested Balance:</span>
                <span className="font-medium">${isLoadingBalance ? "..." : balance?.invested_balance.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <DepositDialog />
            <WithdrawDialog />
          </div>
          
          <div className="text-xs text-muted-foreground">
            Note: Withdrawals are subject to waiting periods based on your membership level.
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WalletPopover;
