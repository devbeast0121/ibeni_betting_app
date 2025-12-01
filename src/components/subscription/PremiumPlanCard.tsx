import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PremiumPlanCardProps {
  selectedPlan: string;
  onPlanSelect: (value: 'annual' | '') => void;
  isCurrentPlan?: boolean;
}

const PremiumPlanCard: React.FC<PremiumPlanCardProps> = ({ selectedPlan, onPlanSelect, isCurrentPlan = false }) => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      toast.success('Premium membership is now pay-per-use! Simply deposit Growth Cash when needed.');
      // Note: Premium features are unlocked based on deposits rather than subscriptions
    } catch (error: any) {
      console.error('Error:', error);
      toast.error('Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`border-2 ${isCurrentPlan ? 'border-green-500 bg-green-50' : 'border-primary'}`}>
      <div className={`absolute -top-3 right-4 px-3 py-1 text-xs font-medium rounded-full ${
        isCurrentPlan 
          ? 'bg-green-500 text-white' 
          : 'bg-primary text-primary-foreground'
      }`}>
        {isCurrentPlan ? 'Current Plan' : 'Premium'}
      </div>
      <CardHeader>
        <CardTitle>Annual Premium</CardTitle>
        <CardDescription>Full access with yearly billing</CardDescription>
        <div className="text-3xl font-bold mt-2">$150<span className="text-lg text-muted-foreground">/year</span></div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-2">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            <span>Make sports predictions</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            <span>Automatic entry allocation</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            <span className="font-medium">Redeem prizes anytime</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            <span className="font-medium">Premium customer support</span>
          </div>
          <div className="flex items-center text-green-600 font-medium">
            <Clock className="h-4 w-4 mr-2 text-green-500" />
            <span>Withdraw Growth Cash after 3-month waiting period</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-1 ml-6">
            <span>Standard withdrawal fees still apply (50% before one year, 5% after one year)</span>
          </div>
          <div className="flex items-center text-amber-600 font-medium">
            <Award className="h-4 w-4 mr-2 text-amber-600" />
            <span>$25 Bonus Bets Every 4 Months</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-1 ml-6">
            <span>Receive $75 total per year ($25 x 3) - Zero fees on bonus bet winnings</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        <Button 
          className="w-full" 
          onClick={() => !isCurrentPlan && onPlanSelect('annual')}
          disabled={isCurrentPlan}
          variant={isCurrentPlan ? "secondary" : "default"}
        >
          {isCurrentPlan ? 'Active' : 'Select Plan'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PremiumPlanCard;