import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Target, Zap, Calendar, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Area, AreaChart } from 'recharts';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';

export const AdvancedAnalytics = () => {
  const { analyticsData, isLoading } = useAdvancedAnalytics();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analyticsData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Analytics Data</h3>
          <p className="text-muted-foreground">
            Place some bets to see your advanced analytics.
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Key Metrics */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Total ROI</p>
                <p className={`text-xl md:text-2xl font-bold ${analyticsData.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(analyticsData.roi)}
                </p>
              </div>
              {analyticsData.roi >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Win Rate</p>
                <p className="text-xl md:text-2xl font-bold">{formatPercentage(analyticsData.winRate)}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Longest Win Streak</p>
                <p className="text-xl md:text-2xl font-bold text-green-600">{analyticsData.longestWinStreak}</p>
              </div>
              <Zap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-muted-foreground">Favorite Sport</p>
                <p className="text-lg font-bold">{analyticsData.favoriteSport || 'N/A'}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList>
          <TabsTrigger value="daily">Daily Performance</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily ROI Trend</CardTitle>
              <CardDescription>Your return on investment over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    formatter={(value) => [`${Number(value).toFixed(1)}%`, 'ROI']}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="roi" 
                    stroke="#3b82f6" 
                    fill="url(#roiGradient)" 
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily Wagered vs Winnings</CardTitle>
              <CardDescription>Amount wagered vs winnings per day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tickFormatter={formatCurrency} />
                  <Tooltip 
                    formatter={(value, name) => [formatCurrency(Number(value)), name === 'wagered' ? 'Wagered' : 'Winnings']}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Bar dataKey="wagered" fill="#f59e0b" />
                  <Bar dataKey="winnings" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Your betting performance by month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" tickFormatter={formatCurrency} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'winRate') return [`${Number(value).toFixed(1)}%`, 'Win Rate'];
                      return [formatCurrency(Number(value)), name === 'totalWagered' ? 'Total Wagered' : 'Total Winnings'];
                    }}
                  />
                  <Bar yAxisId="left" dataKey="totalWagered" fill="#f59e0b" />
                  <Bar yAxisId="left" dataKey="totalWinnings" fill="#10b981" />
                  <Line yAxisId="right" type="monotone" dataKey="winRate" stroke="#ef4444" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Bets</span>
                  <Badge variant="secondary">{analyticsData.totalBets}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Wagered</span>
                  <span className="font-medium">{formatCurrency(analyticsData.totalWagered)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Winnings</span>
                  <span className="font-medium">{formatCurrency(analyticsData.totalWinnings)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Net Profit/Loss</span>
                  <span className={`font-medium ${(analyticsData.totalWinnings - analyticsData.totalWagered) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(analyticsData.totalWinnings - analyticsData.totalWagered)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Streak Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Longest Win Streak</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {analyticsData.longestWinStreak} wins
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Longest Loss Streak</span>
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    {analyticsData.longestLossStreak} losses
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Overall Win Rate</span>
                  <span className="font-medium">{formatPercentage(analyticsData.winRate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Favorite Sport</span>
                  <Badge variant="outline">{analyticsData.favoriteSport || 'N/A'}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};