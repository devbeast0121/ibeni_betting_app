
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, DollarSign, TrendingUp } from 'lucide-react';
import { useAdminMetrics } from '@/hooks/useAdminMetrics';

const AdminPanelHeader = () => {
  const { userMetrics, financialMetrics, isLoadingUsers, isLoadingFinancial } = useAdminMetrics();

  const totalUsers = userMetrics?.totalUsers || 0;
  const totalDeposits = financialMetrics?.totalDeposits || 0;
  const totalInvested = financialMetrics?.totalInvested || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor platform performance, user statistics, and financial metrics
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-blue-100 mr-4">
                <User className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <h3 className="text-2xl font-bold">
                  {isLoadingUsers ? '...' : totalUsers}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-green-100 mr-4">
                <DollarSign className="h-5 w-5 text-green-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Deposits</p>
                <h3 className="text-2xl font-bold">
                  {isLoadingFinancial ? '...' : `$${totalDeposits.toLocaleString()}`}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-amber-100 mr-4">
                <TrendingUp className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invested</p>
                <h3 className="text-2xl font-bold">
                  {isLoadingFinancial ? '...' : `$${totalInvested.toLocaleString()}`}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanelHeader;
