
import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { useBalance } from '@/hooks/useBalance';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SharePopover from './SharePopover';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PortfolioTracker = () => {
  const { balance, isLoadingBalance } = useBalance();
  const portfolioRef = useRef<HTMLDivElement>(null);

  // Always show a graph - with placeholder data if no investments
  const getTransactionHistory = () => {
    const portfolioValue = balance?.invested_balance || 0; // Use invested_balance, not growth_cash
    
    // Show current portfolio value (from lost bets) in the chart
    return [
      {
        date: 'Current',
        value: portfolioValue
      }
    ];
  };

  // Only show invested balance (from lost bets) as portfolio value
  const generateInvestmentSources = () => {
    const portfolioAmount = balance?.invested_balance || 0; // Use invested_balance
    
    return [
      { 
        name: 'Portfolio Losses (From Lost Bets)', 
        amount: portfolioAmount, 
        date: 'From losing predictions that go to portfolio', 
        percentage: 100
      }
    ];
  };

  const transactionHistory = getTransactionHistory();
  const investmentSources = generateInvestmentSources();
  const totalInvestmentValue = balance?.invested_balance || 0; // Portfolio shows invested_balance
  
  console.log('PortfolioTracker debug v2:', { transactionHistory, totalInvestmentValue });

  if (isLoadingBalance) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold">Your ibeni Investment Portfolio</h2>
          <SharePopover portfolioRef={portfolioRef} />
        </div>
        
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Your ibeni Portfolio Simulation</h2>
        <SharePopover portfolioRef={portfolioRef} />
      </div>
      
      <Card ref={portfolioRef}>
        <CardHeader>
          <CardTitle>Portfolio Prize Simulation</CardTitle>
          <CardDescription>
            Simulated portfolio showing potential prize amounts based on our investment strategy - no actual investing occurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-xs md:text-sm">
              <strong>Prize Simulation:</strong> This shows simulated prize amounts you could redeem after one year (with 5% fee) or before one year (with 50% fee). No actual investing occurs - these are potential prize values only.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col md:flex-row">
            <div className="w-full">
              <h3 className="text-xl font-semibold mb-4">Prize Simulation Activity</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={transactionHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Simulated Prize Value']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#4CAF50" 
                      strokeWidth={2} 
                      dot={{ stroke: '#4CAF50', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6">
                <h4 className="text-lg font-medium mb-4">Prize Value Distribution</h4>
                <div className="space-y-4">
                  {investmentSources.map((source, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-xs md:text-sm">
                        <span>{source.name}</span>
                        <span className="font-medium">${source.amount.toFixed(2)}</span>
                      </div>
                      <Progress value={source.percentage} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{source.date}</span>
                        <span>{source.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs md:text-sm font-medium">Total Prize Value</span>
                      <div className="text-profit flex items-center">
                        <ArrowUp className="mr-1 h-4 w-4" />
                        <span className="font-bold">${totalInvestmentValue.toFixed(2)}*</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {totalInvestmentValue > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs md:text-sm font-medium">Account Status</span>
                        <div className="text-profit flex items-center">
                          <TrendingUp className="mr-1 h-4 w-4" />
                          <span className="font-bold">Active*</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                <div className="text-xs text-muted-foreground mt-2">
                  *Simulated prize values for entertainment. Redeemable after 1 year (5% fee) or before 1 year (50% fee).
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            <strong>LEGAL DISCLAIMER:</strong> No actual investing occurs. Values shown are simulated prize amounts you may redeem subject to withdrawal fees: 5% after one year, 50% before one year. This is not investment advice and does not represent securities ownership.
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Information</CardTitle>
          <CardDescription>Your balance breakdown and withdrawal eligibility</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-xs md:text-sm">
              <strong>WITHDRAWAL RULES:</strong> Growth Cash winnings may be withdrawn by subscribers after a 3-month waiting period. Non-subscribers cannot withdraw Growth Cash winnings. Portfolio losses are withdrawable by all members with fees: 5% after one year, 50% before one year.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Portfolio Losses (From Lost Bets)</div>
                <div className="text-xl md:text-2xl font-bold">
                  ${totalInvestmentValue.toFixed(2)}
                </div>
              </div>
              <Badge className="bg-profit text-white">Withdrawable</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <div className="text-xs md:text-sm text-muted-foreground">Growth Cash (From Wins)</div>
                <div className="text-lg font-semibold text-muted-foreground">${(balance?.growth_cash || 0).toFixed(2)}</div>
                <div className="text-xs text-muted-foreground mt-1">Subscribers: 3mo wait period to withdraw</div>
              </div>
              <div className="text-center">
                <div className="text-xs md:text-sm text-muted-foreground">Portfolio Losses (From Lost Bets)</div>
                <div className="text-lg font-semibold">${(balance?.invested_balance || 0).toFixed(2)}</div>
                <div className="text-xs text-profit mt-1">Withdrawable: 5% fee after 1yr, 50% before</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            <strong>Withdrawal Rules:</strong> Growth Cash may be withdrawn by subscribers after a 3-month waiting period. Portfolio Balance is withdrawable with fees: 5% after one year, 50% before one year.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PortfolioTracker;
