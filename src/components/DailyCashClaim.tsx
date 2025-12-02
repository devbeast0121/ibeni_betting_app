import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Clock } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface DailyCashClaimProps {
  onClaim: () => Promise<boolean>;
}

const DailyCashClaim = ({ onClaim }: DailyCashClaimProps) => {
  const [canClaim, setCanClaim] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    const checkClaimStatus = () => {
      const lastClaim = localStorage.getItem('lastDailyCashClaim');
      const now = new Date();
      const today = now.toDateString();
      
      if (!lastClaim || lastClaim !== today) {
        setCanClaim(true);
      } else {
        setCanClaim(false);
        // Calculate time until next claim (midnight)
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const diff = tomorrow.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    };

    checkClaimStatus();
    const interval = setInterval(checkClaimStatus, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleClaim = async () => {
    if (!canClaim || isClaiming) return;
    
    setIsClaiming(true);
    
    try {
      const success = await onClaim();
      
      if (success) {
        const today = new Date().toDateString();
        localStorage.setItem('lastDailyCashClaim', today);
        setCanClaim(false);
        
        // Recalculate time left for next claim
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const diff = tomorrow.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeLeft(`${hours}h ${minutes}m`);
      }
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-green-600" />
          Daily Growth Cash
        </CardTitle>
        <CardDescription>
          Claim your daily $1 Growth Cash for sweepstakes entries
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl md:text-2xl font-bold text-green-600">$1.00</p>
            <p className="text-xs md:text-sm text-muted-foreground">
              {canClaim ? 'Available to claim' : `Next claim in ${timeLeft}`}
            </p>
          </div>
          <Button 
            onClick={handleClaim} 
            disabled={!canClaim || isClaiming}
            className="bg-green-600 hover:bg-green-700"
          >
            {isClaiming ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Claiming...
              </>
            ) : canClaim ? (
              <>
                <Gift className="mr-2 h-4 w-4" />
                Claim Now
              </>
            ) : (
              <>
                <Clock className="mr-2 h-4 w-4" />
                Already Claimed
              </>
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Must be claimed daily - doesn't roll over if missed
        </p>
      </CardContent>
    </Card>
  );
};

export default DailyCashClaim;