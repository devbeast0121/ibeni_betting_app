import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { useBalance } from '@/hooks/useBalance';

const HypotheticalInvestmentComparison = () => {
  const { balance } = useBalance();
  // Use mock data for now to demo the feature
  const portfolioAmount = balance?.invested_balance || 250; // Mock $250 portfolio

  // Get current date string for daily rotation (resets at midnight)
  const getCurrentDateKey = () => {
    const now = new Date();
    return now.toDateString(); // Returns format like "Mon Oct 30 2023"
  };

  // Convert date string to number for array indexing
  const getDateBasedIndex = (dateString: string) => {
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  // Sample ETFs/stocks with their historical performance data (more realistic returns)
  const investments = [
    {
      name: 'S&P 500 (SPY)',
      description: 'Large Cap US Stocks',
      annualReturns: {
        '1year': 0.16,   // 16% (realistic 1-year return)
        '5year': 0.11,   // 11% annualized
        '10year': 0.13   // 13% annualized
      }
    },
    {
      name: 'Nasdaq 100 (QQQ)',
      description: 'Tech-Heavy Index',
      annualReturns: {
        '1year': 0.18,   // 18%
        '5year': 0.13,   // 13% annualized
        '10year': 0.17   // 17% annualized
      }
    },
    {
      name: 'Total Stock Market (VTI)',
      description: 'All US Stocks',
      annualReturns: {
        '1year': 0.15,   // 15%
        '5year': 0.10,   // 10% annualized
        '10year': 0.12   // 12% annualized
      }
    },
    {
      name: 'Emerging Markets (VWO)',
      description: 'International Developing Markets',
      annualReturns: {
        '1year': 0.08,   // 8%
        '5year': 0.05,   // 5% annualized
        '10year': 0.04   // 4% annualized
      }
    },
    {
      name: 'REIT Index (VNQ)',
      description: 'Real Estate Investment Trusts',
      annualReturns: {
        '1year': 0.12,   // 12%
        '5year': 0.08,   // 8% annualized
        '10year': 0.09   // 9% annualized
      }
    },
    {
      name: 'Gold ETF (GLD)',
      description: 'Precious Metals',
      annualReturns: {
        '1year': 0.06,   // 6%
        '5year': 0.04,   // 4% annualized
        '10year': 0.03   // 3% annualized
      }
    },
    {
      name: 'International Developed (VEA)',
      description: 'International Stocks',
      annualReturns: {
        '1year': 0.11,   // 11%
        '5year': 0.06,   // 6% annualized
        '10year': 0.07   // 7% annualized
      }
    },
    {
      name: 'Small Cap Value (VBR)',
      description: 'Small Company Stocks',
      annualReturns: {
        '1year': 0.14,   // 14%
        '5year': 0.09,   // 9% annualized
        '10year': 0.11   // 11% annualized
      }
    }
  ];

  // Get today's investment based on date
  const currentDateKey = getCurrentDateKey();
  const dateIndex = getDateBasedIndex(currentDateKey);
  const todaysInvestmentIndex = dateIndex % investments.length;
  const todaysInvestment = investments[todaysInvestmentIndex];

  const calculateValue = (amount: number, annualReturn: number, years: number) => {
    return amount * Math.pow(1 + annualReturn, years);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (portfolioAmount === 0) {
    // Show a placeholder version even with no portfolio amount
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500 text-white rounded-lg shadow-sm">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Hypothetical Investment Comparison
              </CardTitle>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Start building your portfolio to see investment comparisons!
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-white/50 dark:border-gray-700/50 backdrop-blur-sm">
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">Place some bets to start building your portfolio</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Once you have a portfolio balance, we'll show you how it would have performed in different investments over time.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-500 text-white rounded-lg shadow-sm">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Hypothetical Investment Comparison
            </CardTitle>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              If you invested {formatCurrency(portfolioAmount)} into {todaysInvestment.name}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-white/70 dark:bg-gray-800/70 rounded-xl p-4 border border-white/50 dark:border-gray-700/50 backdrop-blur-sm">
          <div className="text-xs text-gray-600 dark:text-gray-400 mb-4 p-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
            <strong>Disclaimer:</strong> This is for educational purposes only. Past performance does not guarantee future results. These are hypothetical calculations based on historical averages.
          </div>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">{todaysInvestment.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{todaysInvestment.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">1 Year</span>
                  </div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(calculateValue(portfolioAmount, todaysInvestment.annualReturns['1year'], 1))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatPercentage(todaysInvestment.annualReturns['1year'])} return
                  </div>
                </div>
                
                <div className="text-center p-3 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-800 dark:to-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Calendar className="h-3 w-3 text-blue-500" />
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">5 Years</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(calculateValue(portfolioAmount, todaysInvestment.annualReturns['5year'], 5))}
                  </div>
                  <div className="text-xs text-blue-500">
                    {formatPercentage(todaysInvestment.annualReturns['5year'])} annual
                  </div>
                </div>
                
                <div className="text-center p-3 bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-800 dark:to-purple-900 rounded-lg border border-purple-200 dark:border-purple-700">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Calendar className="h-3 w-3 text-purple-500" />
                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400">10 Years</span>
                  </div>
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    {formatCurrency(calculateValue(portfolioAmount, todaysInvestment.annualReturns['10year'], 10))}
                  </div>
                  <div className="text-xs text-purple-500">
                    {formatPercentage(todaysInvestment.annualReturns['10year'])} annual
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-2">
              <TrendingUp className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-800 dark:text-amber-200">
                <p className="font-medium mb-1">Key Takeaway:</p>
                <p>These calculations show the power of time in the market. The longer your money is invested, the more compound growth can work in your favor. Remember, all investments carry risk and past performance doesn't predict future results.</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HypotheticalInvestmentComparison;