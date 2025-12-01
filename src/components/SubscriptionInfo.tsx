
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, DollarSign, Lock, ArrowRight, Clock } from 'lucide-react';

const SubscriptionInfo = () => {
  const navigate = useNavigate();
  
  // Updated user state - removed trial status
  const userSubscription = {
    status: 'free', // 'free' or 'annual'
  };

  const renderSubscriptionStatus = () => {
    if (userSubscription.status === 'annual') {
      return (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
          <div>
            <h3 className="font-medium text-green-800">Premium Membership Active</h3>
            <p className="text-green-700">
              You have full access to all ibeni features, including prize redemptions and bonus bets.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start">
        <Lock className="h-5 w-5 text-amber-500 mt-0.5 mr-2" />
        <div>
          <h3 className="font-medium text-amber-800">Free Membership Active</h3>
          <p className="text-amber-700">
            You're on the free membership. Upgrade to unlock prize redemptions and premium features.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {renderSubscriptionStatus()}
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="relative">
          <div className="absolute -top-3 right-4 px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full">
            Current
          </div>
          <CardHeader>
            <CardTitle>Free Membership</CardTitle>
            <CardDescription>Basic features only</CardDescription>
            <div className="text-3xl font-bold mt-2">$0</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Make sports predictions</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Automatic entry allocation</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Track sweepstakes portfolio</span>
              </li>
              <li className="flex items-center text-muted-foreground">
                <Lock className="h-4 w-4 mr-2" />
                <span>No prize redemptions</span>
              </li>
              <li className="flex items-center text-muted-foreground">
                <Lock className="h-4 w-4 mr-2" />
                <span>Only reinvest or keep entries</span>
              </li>
              <li className="flex items-center text-amber-600 font-medium">
                <Clock className="h-4 w-4 mr-2" />
                <span>Growth Cash locked for 1 full year</span>
              </li>
              <li className="flex items-center text-xs text-muted-foreground mt-1 ml-6">
                <span>Any deposits to your investment portfolio cannot be withdrawn for 1 year</span>
              </li>
              <li className="flex items-center text-muted-foreground">
                <Lock className="h-4 w-4 mr-2" />
                <span>No bonus bets</span>
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-primary">
          <div className="absolute -top-3 right-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
            Premium
          </div>
          <CardHeader>
            <CardTitle>Annual Premium</CardTitle>
            <CardDescription>Full access with yearly billing</CardDescription>
            <div className="text-3xl font-bold mt-2">$150<span className="text-base text-muted-foreground">/year</span></div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Make sports predictions</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Automatic entry allocation</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span className="font-medium">Redeem prizes anytime</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span className="font-medium">Premium customer support</span>
              </li>
              <li className="flex items-center text-green-600 font-medium">
                <Clock className="h-4 w-4 mr-2 text-green-500" />
                <span>Withdraw Growth Cash after 3 months</span>
              </li>
              <li className="flex items-center text-xs text-muted-foreground mt-1 ml-6">
                <span>Standard withdrawal fees still apply (50% before one year, 5% after one year)</span>
              </li>
              <li className="flex items-center text-amber-600 font-medium">
                <DollarSign className="h-4 w-4 mr-2 text-amber-600" />
                <span>$25 Bonus Bets Every 4 Months</span>
              </li>
              <li className="flex items-center text-xs text-muted-foreground mt-1 ml-6">
                <span>Total $75 per year - Zero fees on bonus bet winnings</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/subscription')}>
              Choose Plan
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="p-4 bg-muted rounded-lg text-sm">
        <p className="font-medium mb-2">Platform Operation Fees:</p>
        <ul className="space-y-1 text-muted-foreground">
          <li>• All membership fees are non-refundable</li>
          <li>• 50% withdrawal fee applies to all investment portfolio withdrawals before one year</li>
          <li>• 5% withdrawal fee applies to all investment portfolio withdrawals after one year</li>
          <li>• 10% platform fee on winnings when you win, 10% on bet amount when you lose</li>
          <li>• Free membership Growth Cash is locked for 1 year from purchase date</li>
          <li>• Premium membership Growth Cash is locked for 3 months from purchase date</li>
          <li>• Bonus prediction rewards have no fee and go directly into your portfolio</li>
        </ul>
      </div>

      <div className="flex justify-center mt-8">
        <Button 
          onClick={() => navigate('/subscription')} 
          className="group"
          size="lg"
        >
          View All Membership Details 
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default SubscriptionInfo;
