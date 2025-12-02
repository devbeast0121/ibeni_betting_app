
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Wallet } from 'lucide-react';
import { useAdminMetrics } from '@/hooks/useAdminMetrics';

interface FinancialMetricsProps {
  expanded?: boolean;
  className?: string;
}

const FinancialMetrics = ({ expanded = false, className = '' }: FinancialMetricsProps) => {
  const { financialMetrics, isLoadingFinancial } = useAdminMetrics();

  // Generate chart data from real transactions
  const generateChartData = () => {
    if (!financialMetrics?.deposits || !financialMetrics?.withdrawals) return [];

    const monthlyData: Record<string, { deposits: number; withdrawals: number; invested: number }> = {};
    
    financialMetrics.deposits.forEach(deposit => {
      const month = new Date(deposit.created_at).toLocaleDateString('en-US', { month: 'short' });
      if (!monthlyData[month]) monthlyData[month] = { deposits: 0, withdrawals: 0, invested: 0 };
      monthlyData[month].deposits += Number(deposit.amount);
    });

    financialMetrics.withdrawals.forEach(withdrawal => {
      const month = new Date(withdrawal.created_at).toLocaleDateString('en-US', { month: 'short' });
      if (!monthlyData[month]) monthlyData[month] = { deposits: 0, withdrawals: 0, invested: 0 };
      monthlyData[month].withdrawals += Number(withdrawal.amount);
    });

    if (financialMetrics.balances) {
      financialMetrics.balances.forEach(balance => {
        const month = new Date(balance.created_at).toLocaleDateString('en-US', { month: 'short' });
        if (!monthlyData[month]) monthlyData[month] = { deposits: 0, withdrawals: 0, invested: 0 };
        monthlyData[month].invested += Number(balance.invested_balance);
      });
    }

    return Object.entries(monthlyData).map(([name, data]) => ({ name, ...data }));
  };

  const chartData = generateChartData();
  
  const metrics = [
    { 
      name: 'Platform Fee Revenue', 
      value: `$${(financialMetrics?.platformFeeRevenue || 0).toLocaleString()}`, 
      change: '+12.5%', 
      changeType: 'positive' 
    },
    { 
      name: 'Subscription Revenue', 
      value: `$${(financialMetrics?.subscriptionRevenue || 0).toLocaleString()}`, 
      change: '+25.0%', 
      changeType: 'positive' 
    },
    { 
      name: 'Total Net Revenue', 
      value: `$${(financialMetrics?.totalRevenue || 0).toLocaleString()}`, 
      change: '+18.7%', 
      changeType: 'positive' 
    },
    { 
      name: 'User Deposits', 
      value: `$${(financialMetrics?.totalDeposits || 0).toLocaleString()}`, 
      change: '+5.1%', 
      changeType: 'positive' 
    },
  ];

  if (isLoadingFinancial) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Financial Metrics
          </CardTitle>
          <CardDescription>Loading financial data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Financial Metrics
        </CardTitle>
        <CardDescription>Deposits, withdrawals, and revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
              <Line type="monotone" dataKey="deposits" stroke="#4CAF50" name="Deposits" dot={false} />
              <Line type="monotone" dataKey="invested" stroke="#3B82F6" name="Portfolio" dot={false} />
              <Line type="monotone" dataKey="withdrawals" stroke="#F59E0B" name="Withdrawals" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col">
              <span className="text-xs md:text-sm text-muted-foreground">{metric.name}</span>
              <div className="flex items-baseline">
                <span className="text-xl font-semibold mr-2">{metric.value}</span>
                <span className={metric.changeType === 'positive' ? 'text-green-600 text-xs' : 'text-red-600 text-xs'}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {expanded && (
          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Revenue Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-green-100 mr-4">
                        <Wallet className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">Platform Fees (10%)</p>
                        <h3 className="text-xl font-semibold">
                          ${(financialMetrics?.platformFeeRevenue || 0).toLocaleString()}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          From {financialMetrics?.growthCashPredictions || 0} Growth Cash bets
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-blue-100 mr-4">
                        <TrendingUp className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">Subscriptions</p>
                        <h3 className="text-xl font-semibold">
                          ${(financialMetrics?.subscriptionRevenue || 0).toLocaleString()}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {financialMetrics?.activeSubscribers || 0} active subscribers
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center">
                      <div className="p-2 rounded-md bg-purple-100 mr-4">
                        <DollarSign className="h-5 w-5 text-purple-700" />
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-muted-foreground">Withdrawal Fees</p>
                        <h3 className="text-xl font-semibold">
                          ${(financialMetrics?.withdrawalFees || 0).toLocaleString()}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          From {financialMetrics?.withdrawals?.length || 0} withdrawals
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Platform Health Metrics</h3>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Total Predictions</p>
                      <p className="text-xl font-semibold">
                        {financialMetrics?.totalPredictions || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {financialMetrics?.growthCashPredictions || 0} with Growth Cash
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">User Balances</p>
                      <p className="text-xl font-semibold">
                        ${((financialMetrics?.totalGrowthCash || 0) + (financialMetrics?.totalAvailableBalance || 0)).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Growth Cash + Fun Tokens
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Portfolio Simulation</p>
                      <p className="text-xl font-semibold">
                        ${(financialMetrics?.totalInvested || 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Simulated portfolio values
                      </p>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-muted-foreground">Revenue Rate</p>
                      <p className="text-xl font-semibold text-green-600">
                        {financialMetrics?.totalDeposits ? 
                          ((financialMetrics.totalRevenue / financialMetrics.totalDeposits) * 100).toFixed(1) + '%' : 
                          '0%'
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Revenue per dollar deposited
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FinancialMetrics;
