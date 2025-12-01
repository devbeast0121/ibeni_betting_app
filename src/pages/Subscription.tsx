
import React, { useState, useEffect } from 'react';
import { useBonusBets } from '@/hooks/useBonusBets';
import { useBalance } from '@/hooks/useBalance';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import FreePlanCard from '@/components/subscription/FreePlanCard';
import PremiumPlanCard from '@/components/subscription/PremiumPlanCard';
import SubscriptionFooter from '@/components/subscription/SubscriptionFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState<'annual' | ''>('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  const { subscriptionData, refreshSubscription } = useAuth();
  const { balance, addBonusBets } = useBalance();

  useEffect(() => {
    // Auto-refresh subscription status on mount
    refreshSubscription();
  }, []);

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      toast({
        title: "Please select a plan",
        description: "Choose the annual membership to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { mode: 'subscription' }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      
      toast({
        title: "Redirecting to checkout",
        description: "Please complete your subscription in the new tab.",
      });
    } catch (error) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription failed",
        description: "There was an issue creating your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) {
        throw new Error(error.message);
      }

      // Open Stripe customer portal in a new tab
      window.open(data.url, '_blank');
      
      toast({
        title: "Redirecting to manage subscription",
        description: "Please manage your subscription in the new tab.",
      });
    } catch (error) {
      console.error('Customer portal error:', error);
      toast({
        title: "Failed to open management portal",
        description: "There was an issue accessing your subscription management. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    try {
      await refreshSubscription();
      toast({
        title: "Status refreshed",
        description: "Your subscription status has been updated.",
      });
    } catch (error) {
      console.error('Refresh error:', error);
      toast({
        title: "Refresh failed",
        description: "There was an issue refreshing your status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container max-w-5xl py-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-4">Membership Plans</h1>
          <p className="text-lg text-muted-foreground">
            Choose the membership that works best for you. Premium subscribers get $25 in bonus bets every 4 months (total $75/year).
          </p>
        </div>

        {/* Current Subscription Status */}
        {subscriptionData && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">Current Subscription</h3>
                  <p className="text-muted-foreground">
                    {subscriptionData.subscribed 
                      ? `Premium ${subscriptionData.subscription_tier} - Active until ${new Date(subscriptionData.subscription_end || '').toLocaleDateString()}`
                      : 'Free Plan - No active subscription'
                    }
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleRefreshStatus} 
                    variant="outline" 
                    disabled={refreshing}
                  >
                    {refreshing ? 'Refreshing...' : 'Refresh Status'}
                  </Button>
                  {subscriptionData.subscribed && (
                    <Button 
                      onClick={handleManageSubscription} 
                      disabled={loading}
                    >
                      Manage Subscription
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <FreePlanCard isSelected={!subscriptionData?.subscribed} />
          <PremiumPlanCard 
            selectedPlan={selectedPlan} 
            onPlanSelect={setSelectedPlan}
            isCurrentPlan={subscriptionData?.subscribed || false}
          />
        </div>

        {!subscriptionData?.subscribed && (
          <SubscriptionFooter 
            selectedPlan={selectedPlan} 
            loading={loading} 
            onSubscribe={handleSubscribe} 
          />
        )}
      </div>
    </>
  );
};

export default Subscription;
