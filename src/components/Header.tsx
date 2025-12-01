import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBalance } from '@/hooks/useBalance';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './header/Logo';
import WalletPopover from './header/WalletPopover';
import NotificationsPopover from './header/NotificationsPopover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { User, BookOpen, CreditCard, LayoutDashboard, Info, LogOut, Users, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { balance, isLoadingBalance } = useBalance();
  const { user, signOut } = useAuth();
  const { notifications, markAllAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    navigate(`/${value === 'dashboard' ? 'dashboard' : value}`);
    setMobileMenuOpen(false);
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
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col gap-6 mt-8">
                <div className="flex flex-col gap-2">
                  <Button
                    variant={getCurrentTab() === 'dashboard' ? 'default' : 'ghost'}
                    className="justify-start"
                    onClick={() => handleTabChange('dashboard')}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button
                    variant={getCurrentTab() === 'social' ? 'default' : 'ghost'}
                    className="justify-start"
                    onClick={() => handleTabChange('social')}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Social
                  </Button>
                  <Button
                    variant={getCurrentTab() === 'betting' ? 'default' : 'ghost'}
                    className="justify-start"
                    onClick={() => handleTabChange('betting')}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Sportsbook
                  </Button>
                  <Button
                    variant={getCurrentTab() === 'portfolio' ? 'default' : 'ghost'}
                    className="justify-start"
                    onClick={() => handleTabChange('portfolio')}
                  >
                    <Info className="mr-2 h-4 w-4" />
                    Portfolio
                  </Button>
                </div>

                <div className="border-t pt-4 flex flex-col gap-2">
                  <Button variant="ghost" className="justify-start" onClick={() => { navigate('/about'); setMobileMenuOpen(false); }}>
                    <Info className="mr-2 h-4 w-4" />
                    About Us
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={() => { navigate('/info'); setMobileMenuOpen(false); }}>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Learn
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={() => { navigate('/subscription'); setMobileMenuOpen(false); }}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Membership
                  </Button>
                  <Button variant="ghost" className="justify-start" onClick={() => { navigate('/account'); setMobileMenuOpen(false); }}>
                    <User className="mr-2 h-4 w-4" />
                    My Account
                  </Button>
                  {user?.email === 'sheradsky@gmail.com' && (
                    <Button variant="ghost" className="justify-start" onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Button>
                  )}
                  <Button variant="ghost" className="justify-start text-destructive" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Logo userSubscription={userSubscription} />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
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

        <div className="flex items-center gap-2 md:gap-6">
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
