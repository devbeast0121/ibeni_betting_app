
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import AdminPanelHeader from '@/components/admin/AdminPanelHeader';
import UsersMetrics from '@/components/admin/UsersMetrics';
import FinancialMetrics from '@/components/admin/FinancialMetrics';
import RevenueMetrics from '@/components/admin/RevenueMetrics';
import LocationAnalytics from '@/components/admin/LocationAnalytics';
import ActivityTimeline from '@/components/admin/ActivityTimeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading, isAdmin } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    console.log('AdminDashboard: Auth state:', { user: user?.email, loading, isAdmin });
    
    if (!loading) {
      if (!user) {
        console.log('AdminDashboard: No user, redirecting to login');
        toast.error("You must be logged in to access the admin dashboard");
        navigate('/admin/login');
        return;
      }
      
      if (!isAdmin) {
        console.log('AdminDashboard: User not admin, redirecting to dashboard');
        toast.error("You don't have admin access");
        navigate('/dashboard');
        return;
      }
      
      console.log('AdminDashboard: Admin access granted');
      setChecking(false);
    }
  }, [user, loading, isAdmin, navigate]);

  if (loading || checking) {
    return (
      <>
        <Header />
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-muted-foreground">Checking admin permissions...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container py-8">
        <AdminPanelHeader />
        
        <Tabs defaultValue="overview" className="mt-8">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="location">Geographic Data</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="finances">Finances</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <UsersMetrics />
              <FinancialMetrics />
              <ActivityTimeline className="md:col-span-2" />
            </div>
          </TabsContent>
          
          <TabsContent value="revenue">
            <RevenueMetrics />
          </TabsContent>
          
          <TabsContent value="location">
            <LocationAnalytics />
          </TabsContent>
          
          <TabsContent value="users">
            <UsersMetrics expanded={true} />
          </TabsContent>
          
          <TabsContent value="finances">
            <FinancialMetrics expanded={true} />
          </TabsContent>
          
          <TabsContent value="activity">
            <ActivityTimeline expanded={true} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default AdminDashboard;
