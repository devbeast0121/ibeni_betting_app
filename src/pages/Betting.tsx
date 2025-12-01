
import React from 'react';
import Header from '@/components/Header';
import BettingInterface from '@/components/BettingInterface';
import { useIsNativeApp } from '@/hooks/use-mobile-app';

const Betting = () => {
  const isNativeApp = useIsNativeApp();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className={`container py-4 ${isNativeApp ? 'px-2' : 'py-6'} flex-1`}>
        <div className="max-w-7xl mx-auto">
          <h1 className={`${isNativeApp ? 'text-2xl mb-3' : 'text-3xl mb-6'} font-bold`}>
            Sports Predictions
          </h1>
          <BettingInterface />
        </div>
      </div>
      
      <footer className={`py-4 border-t ${isNativeApp ? 'safe-area-bottom' : ''}`}>
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-muted-foreground mb-3 gap-4">
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

export default Betting;
