
import React, { useState } from 'react';
import Header from '@/components/Header';
import HowItWorks from '@/components/HowItWorks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Info = () => {
  const [activeTab, setActiveTab] = useState('learn');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="container py-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Learn</h1>
        
        <div className="space-y-6">
          <HowItWorks />
        </div>
      </div>
      
      <footer className="py-4 border-t">
        <div className="container">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
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

export default Info;
