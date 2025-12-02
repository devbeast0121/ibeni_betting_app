
import React, { useEffect, useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Betting from "./pages/Betting";
import Social from "./pages/Social";
import Portfolio from "./pages/Portfolio";
import Info from "./pages/Info";
import About from "./pages/About";
import Account from "./pages/Account";
import Subscription from "./pages/Subscription";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import Terms from '@/pages/Terms';
import { useIsNativeApp } from './hooks/use-mobile-app';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Welcome from './pages/Welcome';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import LegalDisclaimerBanner from '@/components/LegalDisclaimerBanner';
import GeographicRestriction from '@/components/GeographicRestriction';
import { MobileAppInit } from '@/components/mobile/MobileAppInit';

const queryClient = new QueryClient();


// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/welcome" replace />;
  
  return <>{children}</>;
}

// Public route wrapper (redirect authenticated users)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/dashboard" replace />;
  
  return <>{children}</>;
}

function AppContent() {
  const isNativeApp = useIsNativeApp();
  const [locationVerified, setLocationVerified] = useState(false);

  const handleLocationVerification = () => {
    setLocationVerified(true);
  };
  
  // Show geographic restriction first
  if (!locationVerified) {
    return <GeographicRestriction onLocationVerified={handleLocationVerification} />;
  }

  return (
    <AuthProvider>
      <MobileAppInit />
      <AppRoutes />
    </AuthProvider>
  );
}

// New component that contains the routes and uses auth context
function AppRoutes() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      {/* Legal disclaimer banner - shows for authenticated users */}
      {user && <LegalDisclaimerBanner />}
      
      <Routes>
        <Route path="/terms" element={<Terms />} />
        <Route path="/terms/:section" element={<Terms />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/welcome" element={<PublicRoute><Welcome /></PublicRoute>} />
        <Route path="/admin/login" element={<PublicRoute><AdminLogin /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/social" element={<ProtectedRoute><Social /></ProtectedRoute>} />
        <Route path="/betting" element={<ProtectedRoute><Betting /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        <Route path="/info" element={<ProtectedRoute><Info /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Sonner />
    </BrowserRouter>
  );
}

function App() {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider>
            <AppContent />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export default App;
