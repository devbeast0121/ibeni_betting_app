import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertCircle, XCircle, Lock } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubscriptionFooterProps {
  selectedPlan: string;
  loading: boolean;
  onSubscribe: () => void;
}

const SubscriptionFooter: React.FC<SubscriptionFooterProps> = ({ selectedPlan, loading, onSubscribe }) => {
  const [stripeLoading, setStripeLoading] = useState(false);

  const handleManageSubscription = async () => {
    toast.error("Authentication required for subscription management");
  };

  return (
    <div className="mt-8 text-center">
      <div className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg max-w-2xl mx-auto">
        <div className="flex items-start gap-3">
          <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="text-left">
            <h3 className="font-medium text-red-800">No Refunds Policy</h3>
            <p className="text-sm text-red-700 mt-1">
              <strong>ALL PAYMENTS ARE FINAL AND NON-REFUNDABLE.</strong> This includes membership fees, Growth Cash deposits, and all platform operation fees.
            </p>
            <ul className="text-sm text-red-700 mt-2 list-disc pl-5 space-y-1">
              <li>No refunds for any reason including account termination</li>
              <li>No refunds for service changes or discontinuation</li>
              <li>No refunds for technical issues or user dissatisfaction</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-6 bg-amber-50 border border-amber-200 p-4 rounded-lg max-w-2xl mx-auto">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="text-left">
            <h3 className="font-medium text-amber-800">Withdrawal Policy</h3>
            <p className="text-sm text-amber-700 mt-1">
              Clear withdrawal rules for Growth Cash winnings and portfolio losses:
            </p>
            <ul className="text-sm text-amber-700 mt-2 list-disc pl-5 space-y-1">
              <li><strong>Growth Cash winnings:</strong> Subscribers may withdraw after a 3-month waiting period, non-subscribers cannot withdraw</li>
              <li><strong>Portfolio losses:</strong> All members may withdraw with fees (5% after one year, 50% before one year)</li>
              <li>10% platform fee on winnings when you win, 10% on bet amount when you lose</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Button 
          variant="outline" 
          size="lg"
          className="w-full sm:w-auto"
          onClick={handleManageSubscription}
          disabled={stripeLoading}
        >
          <Lock className="mr-2 h-4 w-4" />
          {stripeLoading ? 'Loading...' : 'Manage Subscription'}
        </Button>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        You can cancel your membership at any time through your account settings. <strong>No refunds will be provided.</strong>
      </p>
      <div className="mt-6 text-xs text-muted-foreground border-t pt-4 max-w-lg mx-auto">
        <p>NO PURCHASE NECESSARY. Void where prohibited. See terms for details. The sports predictions offered are for entertainment purposes only. Tokens and entries have no cash value and cannot be exchanged for real money. <strong>All payments are final and non-refundable.</strong></p>
      </div>
    </div>
  );
};

export default SubscriptionFooter;