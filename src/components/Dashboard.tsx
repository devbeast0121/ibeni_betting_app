
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, ChartPie, TrendingUp, Wallet, Info } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SharePopover from './SharePopover';
import DailyCashClaim from './DailyCashClaim';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBalance } from '@/hooks/useBalance';
import { useDailyCashClaim } from '@/hooks/useDailyCashClaim';

const Dashboard = () => {
  const { balance, isLoadingBalance } = useBalance();
  const { claimDailyCash } = useDailyCashClaim();

  // Generate portfolio data based on user's actual balance
  const generatePortfolioData = () => {
    const baseValue = balance?.invested_balance || 0;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    
    return months.map((month, index) => ({
      name: month,
      value: Math.max(0, baseValue + (index * 200) + Math.random() * 500)
    }));
  };

  // Generate betting data - simulated for entertainment
  const generateBettingData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      name: day,
      wins: Math.floor(Math.random() * 200) + 50,
      losses: Math.floor(Math.random() * 150) + 30
    }));
  };

  const portfolioData = generatePortfolioData();
  const bettingData = generateBettingData();

  const currentBalance = balance?.invested_balance || 0;
  const growthCash = balance?.growth_cash || 0;
  // Only track growth cash in dashboard - fun tokens are just for entertainment
  const totalValue = currentBalance + growthCash;

  if (isLoadingBalance) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Simulated Portfolio Overview</h2>
          <SharePopover />
        </div>
        
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Simulated Portfolio Overview</h2>
        <SharePopover />
      </div>
      
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>ENTERTAINMENT ONLY:</strong> All portfolio values are simulated for entertainment purposes and do not represent actual investments or securities.
        </AlertDescription>
      </Alert>
      
      {/* Daily Cash Claim Section */}
      <div className="mb-8">
        <DailyCashClaim onClaim={claimDailyCash} />
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Wallet className="h-5 w-5 text-navy" />
              Simulated Portfolio Value
            </CardTitle>
            <CardDescription>Based on your ibeni balance for entertainment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">${totalValue.toFixed(2)}*</div>
              <div className="flex items-center text-profit">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>+{totalValue > 0 ? '8.2' : '0.0'}%*</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              *Simulated values for entertainment purposes only
            </div>
            <div className="h-[200px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Portfolio Value']} />
                  <Area type="monotone" dataKey="value" stroke="#4CAF50" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <ChartPie className="h-5 w-5 text-navy" />
              Prediction Performance
            </CardTitle>
            <CardDescription>Weekly prediction results for entertainment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">+${Math.floor(totalValue * 0.1).toFixed(2)}*</div>
              <div className="flex items-center">
                <span className="text-profit flex items-center mr-2">
                  <ArrowUp className="mr-1 h-4 w-4" />
                  {Math.floor(totalValue / 50)} W
                </span>
                <span className="text-loss flex items-center">
                  <ArrowDown className="mr-1 h-4 w-4" />
                  {Math.floor(totalValue / 80)} L
                </span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              *Entertainment values, not real money
            </div>
            <div className="h-[200px] mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bettingData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                  <YAxis stroke="#888888" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="wins" fill="#4CAF50" />
                  <Bar dataKey="losses" fill="#FF5252" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Growth Cash</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <div className="text-2xl font-bold">${growthCash.toFixed(2)}*</div>
              <div className="text-muted-foreground text-profit flex items-center">
                <TrendingUp className="mr-1 h-4 w-4" />
                {growthCash > 0 ? '+5.2' : '0.0'}%*
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              *Simulated growth for entertainment
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Invested Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-2">
              <div className="text-2xl font-bold">${currentBalance.toFixed(2)}*</div>
              <div className="text-muted-foreground text-profit flex items-center">
                <TrendingUp className="mr-1 h-4 w-4" />
                {currentBalance > 0 ? '+12.3' : '0.0'}%*
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              *Simulated investment performance
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
