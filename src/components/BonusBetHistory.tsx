import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Calendar, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BonusBetAward {
  id: string;
  amount: number;
  awarded_at: string;
  award_period: string;
  subscription_tier: string;
}

const BonusBetHistory = () => {
  const { data: bonusAwards, isLoading } = useQuery({
    queryKey: ['bonus-awards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bonus_bet_awards')
        .select('*')
        .order('awarded_at', { ascending: false });
      
      if (error) throw error;
      return data as BonusBetAward[];
    },
  });

  const getNextAwardDate = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed
    
    let nextQuarter;
    let nextYear = currentYear;
    
    if (currentMonth <= 4) {
      nextQuarter = 5; // May (Q2)
    } else if (currentMonth <= 8) {
      nextQuarter = 9; // September (Q3)  
    } else {
      nextQuarter = 1; // January (Q1 next year)
      nextYear = currentYear + 1;
    }
    
    return new Date(nextYear, nextQuarter - 1, 1);
  };

  const formatPeriod = (period: string) => {
    const [year, quarter] = period.split('-');
    const quarterNum = quarter.replace('Q', '');
    const quarters = {
      '1': 'Jan-Apr',
      '2': 'May-Aug', 
      '3': 'Sep-Dec'
    };
    return `${quarters[quarterNum as keyof typeof quarters]} ${year}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Bonus Bet History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  const nextAward = getNextAwardDate();
  const daysUntilNext = Math.ceil((nextAward.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Bonus Bet History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Next Award Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-amber-600" />
            <span className="font-medium text-amber-800">Next $25 Bonus</span>
          </div>
          <p className="text-xs md:text-sm text-amber-700">
            Expected: {nextAward.toLocaleDateString()} ({daysUntilNext} days)
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Premium subscribers receive $25 every 4 months
          </p>
        </div>

        {/* Award History */}
        {bonusAwards && bonusAwards.length > 0 ? (
          <div className="space-y-3">
            <h4 className="font-medium text-xs md:text-sm text-muted-foreground">Previous Awards</h4>
            {bonusAwards.map((award) => (
              <div key={award.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Gift className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">${award.amount} Bonus Bets</p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {formatPeriod(award.award_period)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{award.subscription_tier}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(award.awarded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <Gift className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No bonus bets awarded yet</p>
            <p className="text-xs md:text-sm">Subscribe to Premium to start receiving $25 every 4 months</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BonusBetHistory;