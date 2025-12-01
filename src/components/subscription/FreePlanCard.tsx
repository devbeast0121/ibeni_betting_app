
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Lock, Clock } from 'lucide-react';

interface FreePlanCardProps {
  isSelected: boolean;
}

const FreePlanCard: React.FC<FreePlanCardProps> = ({ isSelected }) => {
  return (
    <Card className="relative">
      <div className="absolute -top-3 right-4 px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
        Current
      </div>
      <CardHeader>
        <CardTitle>Free Membership</CardTitle>
        <CardDescription>Basic features only</CardDescription>
        <div className="text-3xl font-bold mt-2">$0</div>
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
            <span>Track sweepstakes portfolio</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Lock className="h-4 w-4 mr-2" />
            <span>Growth Cash winnings cannot be withdrawn</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-1 ml-6">
            <span>Any Growth Cash you win from predictions stays locked permanently</span>
          </div>
          <div className="flex items-center text-amber-600 font-medium">
            <Clock className="h-4 w-4 mr-2" />
            <span>Portfolio losses withdrawable after one year</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-1 ml-6">
            <span>Losing bets that go to portfolio can be withdrawn after one year with fees (50% before one year, 5% after)</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Lock className="h-4 w-4 mr-2" />
            <span>No bonus bets (Premium: $25 every 4 months)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreePlanCard;
