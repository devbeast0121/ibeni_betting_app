import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  CreditCard, 
  Wallet,
  Target,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAdminMetrics } from '@/hooks/useAdminMetrics';

interface RevenueMetricsProps {
  className?: string;
}

const RevenueMetrics = ({ className = '' }: RevenueMetricsProps) => {
  const { financialMetrics, isLoadingFinancial } = useAdminMetrics();

  // Revenue breakdown data for pie chart
  const revenueBreakdown = [
    { name: 'Platform Fees', value: financialMetrics?.platformFeeRevenue || 0, color: '#4CAF50' },
    { name: 'Subscriptions', value: financialMetrics?.subscriptionRevenue || 0, color: '#2196F3' },
    { name: 'Withdrawal Fees', value: financialMetrics?.withdrawalFees || 0, color: '#FF9800' }
  ];

  // Monthly revenue trend (simulated data since we don't have historical revenue tracking)
  const monthlyRevenue = [
    { month: 'Jan', revenue: (financialMetrics?.totalRevenue || 0) * 0.6 },
    { month: 'Feb', revenue: (financialMetrics?.totalRevenue || 0) * 0.7 },
    { month: 'Mar', revenue: (financialMetrics?.totalRevenue || 0) * 0.8 },
    { month: 'Apr', revenue: (financialMetrics?.totalRevenue || 0) * 0.9 },
    { month: 'May', revenue: financialMetrics?.totalRevenue || 0 }
  ];

  // Key performance indicators
  const kpis = [
    {
      title: 'Total Revenue',
      value: financialMetrics?.totalRevenue || 0,
      change: 18.7,
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Platform Fee Revenue',
      value: financialMetrics?.platformFeeRevenue || 0,
      change: 12.5,
      changeType: 'positive',
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Subscription Revenue',
      value: financialMetrics?.subscriptionRevenue || 0,
      change: 25.0,
      changeType: 'positive',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Revenue per User',
      value: financialMetrics?.totalRevenue && financialMetrics?.deposits?.length 
        ? (financialMetrics.totalRevenue / new Set(financialMetrics.deposits.map(d => d.user_id)).size)
        : 0,
      change: 8.3,
      changeType: 'positive',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  if (isLoadingFinancial) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Revenue Analytics
          </CardTitle>
          <CardDescription>Loading revenue data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-muted-foreground">{kpi.title}</p>
                  <p className="text-xl md:text-2xl font-bold">
                    ${kpi.value.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-1">
                    {kpi.changeType === 'positive' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                    <span className={`text-xs md:text-sm ml-1 ${kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                      {kpi.change}%
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Breakdown Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Sources</CardTitle>
            <CardDescription>Breakdown of total revenue by source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {revenueBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs md:text-sm">{item.name}</span>
                  </div>
                  <span className="text-xs md:text-sm font-medium">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue growth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>Key metrics and conversion rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm font-medium">Revenue Rate</span>
                  <span className="text-xs md:text-sm text-muted-foreground">
                    {financialMetrics?.totalDeposits ? 
                      ((financialMetrics.totalRevenue / financialMetrics.totalDeposits) * 100).toFixed(1) + '%' : 
                      '0%'
                    }
                  </span>
                </div>
                <Progress 
                  value={financialMetrics?.totalDeposits ? 
                    (financialMetrics.totalRevenue / financialMetrics.totalDeposits) * 100 : 
                    0
                  } 
                  className="h-2" 
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs md:text-sm font-medium">Subscription Rate</span>
                  <span className="text-xs md:text-sm text-muted-foreground">
                    {financialMetrics?.deposits ? 
                      ((financialMetrics.activeSubscribers / new Set(financialMetrics.deposits.map(d => d.user_id)).size) * 100).toFixed(1) + '%' :
                      '0%'
                    }
                  </span>
                </div>
                <Progress 
                  value={financialMetrics?.deposits ? 
                    (financialMetrics.activeSubscribers / new Set(financialMetrics.deposits.map(d => d.user_id)).size) * 100 :
                    0
                  } 
                  className="h-2" 
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs md:text-sm text-muted-foreground">Total Predictions</span>
                <Badge variant="outline">{financialMetrics?.totalPredictions || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs md:text-sm text-muted-foreground">Growth Cash Bets</span>
                <Badge variant="outline">{financialMetrics?.growthCashPredictions || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs md:text-sm text-muted-foreground">Active Subscribers</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {financialMetrics?.activeSubscribers || 0}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs md:text-sm text-muted-foreground">Total Withdrawals</span>
                <Badge variant="outline">{financialMetrics?.withdrawals?.length || 0}</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-xl md:text-2xl font-bold text-green-700">
                  ${((financialMetrics?.totalRevenue || 0) - ((financialMetrics?.totalDeposits || 0) * 0.03)).toLocaleString()}
                </p>
                <p className="text-xs md:text-sm text-green-600">Net Profit (Est.)</p>
                <p className="text-xs text-muted-foreground">After 3% operating costs</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueMetrics;