
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gift, Clock } from 'lucide-react';
import { DepositDialog } from '../DepositDialog';

const FreeEntryNotice = () => {
  return (
    <Card className="bg-green-50 border-green-200 mb-4">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Gift className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-bold text-green-800 text-xs md:text-sm">FREE DAILY ENTRY - NO PURCHASE NECESSARY</h3>
            <p className="text-xs text-green-700 mt-1">
              Get 100 free Fun Tokens + $1 Growth Cash every day to participate in our sweepstakes predictions! 
              Simply claim your daily bonus to start making predictions and potentially win prizes.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">
                Resets daily at midnight
              </span>
            </div>
          </div>
          <div className="flex-shrink-0">
            <DepositDialog />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreeEntryNotice;
