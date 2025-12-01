
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBalance } from '@/hooks/useBalance';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './header/Logo';
import WalletPopover from './header/WalletPopover';
import NotificationsPopover from './header/NotificationsPopover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User, Settings, BookOpen, CreditCard, LayoutDashboard, Info, LogOut, Users } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { balance, isLoadingBalance } = useBalance();
  const { user, signOut } = useAuth();
  const { notifications, markAllAsRead } = useNotifications();

  const handleSignOut = async () => {
    await signOut();
    navigate('/welcome');
  };
  
  // Updated subscription status - removed trial status
  const userSubscription = {
    status: 'free' as const
  };


  // Function to handle navigation based on tab selection
  const handleTabChange = (value: string) => {
    // Use navigate instead of directly updating the activeTab state
    // This will actually change the route
    navigate(`/${value === 'dashboard' ? 'dashboard' : value}`);
  };

  // Determine current active tab based on location
  const getCurrentTab = () => {
    const path = location.pathname.substring(1); // Remove leading slash
    
    if (path === 'dashboard') return 'dashboard';
    if (path === 'social') return 'social';
    if (path === 'betting') return 'betting';
    if (path === 'portfolio') return 'portfolio';
    
    return 'dashboard'; // Default to dashboard
  };

  // Check if user is admin (in a real app, this would check auth)
  const isAdmin = () => {
    // This is a temporary check, in a real app you would check user roles
    // For this demo, we assume admin has logged in via /admin/login
    return true; // Always show admin option for this demo
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Logo userSubscription={userSubscription} />

        <div className="flex-1 flex justify-center">
          <Tabs value={getCurrentTab()} onValueChange={handleTabChange}>
            <TabsList className="bg-transparent px-0 mb-0 gap-6">
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none data-[state=active]:shadow-none px-4 text-sm"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="social" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none data-[state=active]:shadow-none px-4 text-sm flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                Social
              </TabsTrigger>
              <TabsTrigger 
                value="betting" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none data-[state=active]:shadow-none px-4 text-sm"
              >
                Sportsbook
              </TabsTrigger>
              <TabsTrigger 
                value="portfolio" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-accent rounded-none data-[state=active]:shadow-none px-4 text-sm"
              >
                Portfolio
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="flex items-center gap-6">
          <WalletPopover isLoadingBalance={isLoadingBalance} balance={balance} />
          <NotificationsPopover notifications={notifications} onMarkAllAsRead={markAllAsRead} />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback className="bg-navy text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/about')}>
                <Info className="mr-2 h-4 w-4" />
                <span>About Us</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/info')}>
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Learn</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/subscription')}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Membership</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/account')}>
                <User className="mr-2 h-4 w-4" />
                <span>My Account</span>
              </DropdownMenuItem>
              {user?.email === 'sheradsky@gmail.com' && (
                <DropdownMenuItem onClick={() => navigate('/admin')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Admin Dashboard</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
