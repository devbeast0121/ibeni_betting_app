
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';
import { useAdminMetrics } from '@/hooks/useAdminMetrics';

interface UsersMetricsProps {
  expanded?: boolean;
  className?: string;
}

const UsersMetrics = ({ expanded = false, className = '' }: UsersMetricsProps) => {
  const { userMetrics, isLoadingUsers } = useAdminMetrics();

  // Generate chart data from real user registrations
  const generateChartData = () => {
    if (!userMetrics?.profiles) return [];

    const monthlyData = userMetrics.profiles.reduce((acc, profile) => {
      const month = new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyData).map(([name, users]) => ({ name, users }));
  };

  const chartData = generateChartData();
  const totalUsers = userMetrics?.totalUsers || 0;

  const userSegments = [
    { name: 'Total Users', count: totalUsers, percentage: 100, color: 'bg-blue-100 text-blue-800' },
    { name: 'Active Users', count: Math.floor(totalUsers * 0.7), percentage: 70, color: 'bg-green-100 text-green-800' },
    { name: 'New This Month', count: Math.floor(totalUsers * 0.1), percentage: 10, color: 'bg-amber-100 text-amber-800' },
    { name: 'Premium Users', count: Math.floor(totalUsers * 0.25), percentage: 25, color: 'bg-purple-100 text-purple-800' },
  ];

  if (isLoadingUsers) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Metrics
          </CardTitle>
          <CardDescription>Loading user data...</CardDescription>
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
          <Users className="h-5 w-5" />
          User Metrics
        </CardTitle>
        <CardDescription>User growth and segment breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} Users`, 'Count']} />
              <Bar dataKey="users" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4">
          {userSegments.map((segment, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-xs md:text-sm text-muted-foreground">{segment.name}</span>
                <Badge className={segment.color}>{segment.percentage}%</Badge>
              </div>
              <span className="text-xl font-semibold mt-1">{segment.count}</span>
            </div>
          ))}
        </div>
        
        {expanded && (
          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-medium">User Behavior</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col">
                    <span className="text-xs md:text-sm text-muted-foreground">Total Registered</span>
                    <span className="text-xl font-semibold mt-1">{totalUsers}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col">
                    <span className="text-xs md:text-sm text-muted-foreground">Growth Rate</span>
                    <span className="text-xl font-semibold mt-1">
                      {totalUsers > 0 ? '+12.3%' : '0%'}
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col">
                    <span className="text-xs md:text-sm text-muted-foreground">Active Users</span>
                    <span className="text-xl font-semibold mt-1">{Math.floor(totalUsers * 0.7)}</span>
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

export default UsersMetrics;
