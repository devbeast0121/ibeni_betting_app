
import React from 'react';
import Header from '@/components/Header';
import PortfolioTracker from '@/components/PortfolioTracker';
import DailyInvestingLearning from '@/components/DailyInvestingLearning';
import { PortfolioRedeemDialog } from '@/components/PortfolioRedeemDialog';
import { AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Portfolio = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="container py-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Your ibeni Prize Simulation</h1>
        
        {/* Legal Disclaimer Section */}
        <div className="space-y-4 mb-8">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>IMPORTANT LEGAL NOTICE:</strong> No actual investing occurs. This simulation shows potential prize amounts you may redeem with fees: 5% after one year, 50% before one year. This is a sweepstakes platform, not an investment service.
            </AlertDescription>
          </Alert>
          
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>WITHDRAWAL RULES:</strong> Growth Cash winnings may be withdrawn by subscribers after a 3-month waiting period. Non-subscribers cannot withdraw Growth Cash winnings. Portfolio losses are withdrawable by all members with fees: 5% after one year, 50% before one year.
            </AlertDescription>
          </Alert>
        </div>
        
        {/* Portfolio Redeem Button */}
        <div className="mb-8">
          <PortfolioRedeemDialog />
        </div>
        
        {/* Portfolio Tracker Section */}
        <div className="mb-8">
          <PortfolioTracker />
        </div>
        
        {/* Daily Learning Section */}
        <div className="mb-8">
          <DailyInvestingLearning />
        </div>
      </div>
      
      <footer className="py-4 border-t">
        <div className="container">
          <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground mb-3">
            <div>© 2025 ibeni. All rights reserved.</div>
            <div className="flex gap-4">
              <a href="/terms" className="hover:text-foreground">Terms</a>
              <a href="/terms#privacy" className="hover:text-foreground">Privacy</a>
              <a href="/terms#sweep" className="hover:text-foreground">Sweepstakes Rules</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
