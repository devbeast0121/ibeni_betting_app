import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const FinancialAnalysis = () => {
  const [selectedScenario, setSelectedScenario] = useState('conservative');

  // Monthly costs
  const monthlyCosts = {
    api: 200,
    hosting: 0, // Assuming free tier initially
    other: 0
  };

  const totalMonthlyCosts = Object.values(monthlyCosts).reduce((a, b) => a + b, 0);
  const developmentCost = 3600; // One-time

  // Revenue assumptions
  const revenueModel = {
    platformFeeRate: 0.10, // 10% on Growth Cash bets
    subscriptionPrice: 150, // Annual
    withdrawalFeeRate: 0.02, // 2% on withdrawals
    avgBetPerUser: 25, // Average bet amount
    avgBetsPerMonth: 8, // Per active user
    subscriptionConversion: 0.25 // 25% of active users become premium
  };

  // User growth scenarios
  const scenarios = {
    conservative: {
      name: 'Conservative Growth',
      months: [1, 3, 6, 12, 18, 24],
      activeUsers: [50, 150, 300, 800, 1500, 2500],
      description: 'Slow, organic growth'
    },
    moderate: {
      name: 'Moderate Growth',
      months: [1, 3, 6, 12, 18, 24],
      activeUsers: [100, 400, 1000, 3000, 6000, 10000],
      description: 'Steady marketing and referrals'
    },
    aggressive: {
      name: 'Aggressive Growth',
      months: [1, 3, 6, 12, 18, 24],
      activeUsers: [200, 800, 2500, 8000, 15000, 25000],
      description: 'Viral growth or strong marketing'
    }
  };

  const calculateRevenue = (activeUsers: number) => {
    // Platform fees from betting
    const monthlyBettingVolume = activeUsers * revenueModel.avgBetPerUser * revenueModel.avgBetsPerMonth;
    const platformFees = monthlyBettingVolume * revenueModel.platformFeeRate;

    // Subscription revenue (annual, so divide by 12)
    const premiumUsers = activeUsers * revenueModel.subscriptionConversion;
    const monthlySubscriptionRevenue = (premiumUsers * revenueModel.subscriptionPrice) / 12;

    // Withdrawal fees (estimate 30% of growth cash is withdrawn monthly)
    const withdrawalVolume = monthlyBettingVolume * 0.3;
    const withdrawalFees = withdrawalVolume * revenueModel.withdrawalFeeRate;

    return {
      platformFees,
      subscriptionRevenue: monthlySubscriptionRevenue,
      withdrawalFees,
      total: platformFees + monthlySubscriptionRevenue + withdrawalFees,
      bettingVolume: monthlyBettingVolume,
      premiumUsers
    };
  };

  const scenario = scenarios[selectedScenario];

  const projections = scenario.months.map((month, index) => {
    const users = scenario.activeUsers[index];
    const revenue = calculateRevenue(users);
    const profit = revenue.total - totalMonthlyCosts;
    const cumulativeProfit = profit * month - (month === 1 ? developmentCost : 0);

    return {
      month,
      users,
      ...revenue,
      costs: totalMonthlyCosts,
      profit,
      cumulativeProfit,
      roi: cumulativeProfit / (developmentCost + (totalMonthlyCosts * month))
    };
  });

  const breakEvenUsers = Math.ceil(totalMonthlyCosts / (
    (revenueModel.avgBetPerUser * revenueModel.avgBetsPerMonth * revenueModel.platformFeeRate) +
    (revenueModel.subscriptionPrice * revenueModel.subscriptionConversion / 12) +
    (revenueModel.avgBetPerUser * revenueModel.avgBetsPerMonth * 0.3 * revenueModel.withdrawalFeeRate)
  ));

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Ibeni Financial Analysis</h1>
        <p className="text-muted-foreground">Ultra-lean cost structure projections</p>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Cost Structure
            <Badge variant="secondary">Ultra-Lean</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs md:text-sm font-medium">Development (One-time)</p>
              <p className="text-xl md:text-2xl font-bold text-primary">${developmentCost.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm font-medium">Monthly Operating</p>
              <p className="text-xl md:text-2xl font-bold text-primary">${totalMonthlyCosts}</p>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Sports API</span>
              <span>${monthlyCosts.api}</span>
            </div>
            <div className="flex justify-between">
              <span>Hosting & Infrastructure</span>
              <span>${monthlyCosts.hosting} (Free tier)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Break-Even Analysis</CardTitle>
          <CardDescription>Minimum users needed to cover costs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-4xl font-bold text-green-600 mb-2">{breakEvenUsers}</p>
            <p className="text-muted-foreground">Active users needed for profitability</p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedScenario} onValueChange={setSelectedScenario}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="conservative">Conservative</TabsTrigger>
          <TabsTrigger value="moderate">Moderate</TabsTrigger>
          <TabsTrigger value="aggressive">Aggressive</TabsTrigger>
        </TabsList>

        {Object.entries(scenarios).map(([key, scenario]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{scenario.name}</CardTitle>
                <CardDescription>{scenario.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs md:text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Month</th>
                        <th className="text-left p-2">Users</th>
                        <th className="text-left p-2">Revenue</th>
                        <th className="text-left p-2">Profit</th>
                        <th className="text-left p-2">Cumulative</th>
                        <th className="text-left p-2">ROI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projections.map((proj, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 font-medium">{proj.month}</td>
                          <td className="p-2">{proj.users.toLocaleString()}</td>
                          <td className="p-2">${proj.total.toLocaleString()}</td>
                          <td className={`p-2 ${proj.profit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${proj.profit.toLocaleString()}
                          </td>
                          <td className={`p-2 font-medium ${proj.cumulativeProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${proj.cumulativeProfit.toLocaleString()}
                          </td>
                          <td className="p-2">{(proj.roi * 100).toFixed(0)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projections.slice(-1).map((proj) => (
                <React.Fragment key="final">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Monthly Revenue @ 24mo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs md:text-sm">
                          <span>Platform Fees</span>
                          <span>${proj.platformFees.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs md:text-sm">
                          <span>Subscriptions</span>
                          <span>${proj.subscriptionRevenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs md:text-sm">
                          <span>Withdrawal Fees</span>
                          <span>${proj.withdrawalFees.toLocaleString()}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>${proj.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Key Metrics @ 24mo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-xs md:text-sm">
                        <div className="flex justify-between">
                          <span>Monthly Betting Volume</span>
                          <span>${proj.bettingVolume.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Premium Users</span>
                          <span>{proj.premiumUsers.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Conversion Rate</span>
                          <span>25%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Profitability</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <p className="text-xl md:text-2xl font-bold text-green-600">
                          ${proj.cumulativeProfit.toLocaleString()}
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">Total profit after 24 months</p>
                        <p className="text-xs md:text-sm mt-2">
                          <span className="font-medium">{(proj.roi * 100).toFixed(0)}%</span> ROI
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </React.Fragment>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs md:text-sm">• <strong>Break-even:</strong> Only {breakEvenUsers} active users needed for profitability</p>
          <p className="text-xs md:text-sm">• <strong>Ultra-low costs:</strong> $200/month operating expenses make this extremely lean</p>
          <p className="text-xs md:text-sm">• <strong>High margins:</strong> 10% platform fee + subscriptions create strong unit economics</p>
          <p className="text-xs md:text-sm">• <strong>Quick payback:</strong> $3,600 development cost recovered within 2-6 months depending on growth</p>
          <p className="text-xs md:text-sm">• <strong>Scalability:</strong> Minimal infrastructure costs mean profits scale directly with users</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialAnalysis;