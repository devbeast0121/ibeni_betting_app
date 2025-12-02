import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link2, Building2, DollarSign } from 'lucide-react';
import { toast } from "@/components/ui/sonner";
import { supabase } from '@/integrations/supabase/client';
import { usePlaidLink } from 'react-plaid-link';

const PaymentTab = () => {
  const [isLinkingBank, setIsLinkingBank] = useState(false);
  const [linkToken, setLinkToken] = useState<string | null>(null);

  // Simplified without authentication
  const getLinkToken = async () => {
    toast.error("Authentication required for bank linking");
    return null;
  };

  const onSuccess = async (public_token: string, metadata: any) => {
    toast.error("Authentication required for bank linking");
  };

  const onExit = (err: any, metadata: any) => {
    console.log('Plaid link exit:', err, metadata);
    setIsLinkingBank(false);
  };

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit,
  });

  const handlePlaidLink = async () => {
    setIsLinkingBank(true);
    const token = await getLinkToken();
    if (token && ready) {
      open();
    } else {
      setIsLinkingBank(false);
      toast.error('Unable to initialize bank linking. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
        <CardDescription>Manage your bank accounts for secure ACH transfers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Linked Bank Accounts</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div>Chase Bank Checking Account</div>
                  <div className="text-xs md:text-sm text-muted-foreground">••••3456</div>
                </div>
              </div>
              <Button variant="outline" size="sm">Remove</Button>
            </div>
          </div>
          
          <Button 
            className="mt-6"
            onClick={handlePlaidLink}
            disabled={isLinkingBank}
          >
            {isLinkingBank ? "Connecting..." : (
              <span className="flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Link Bank Account
              </span>
            )}
          </Button>
          
          <p className="mt-4 text-xs md:text-sm text-muted-foreground">
            We securely connect your bank accounts using bank-level encryption to keep your information safe.
          </p>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Transfer Methods</h3>
          <p className="text-xs md:text-sm text-muted-foreground mb-4">
            All transfers are processed via secure ACH through your linked bank accounts. No fees for deposits or withdrawals.
          </p>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-medium">ACH Bank Transfer</h4>
                <p className="text-xs md:text-sm text-muted-foreground">Free transfers • 1-3 business days</p>
              </div>
            </div>
            <div className="text-xs md:text-sm text-green-600 font-medium">No Fees</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentTab;