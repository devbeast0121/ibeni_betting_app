import React from 'react';
import Header from '@/components/Header';
import { SocialFeed } from '@/components/betting/SocialFeed';
import { useNavigate } from 'react-router-dom';
import { useIsNativeApp } from '@/hooks/use-mobile-app';
import { toast } from '@/components/ui/sonner';
import { Users } from 'lucide-react';

const Social = () => {
  const isNativeApp = useIsNativeApp();
  const navigate = useNavigate();
  
  const handleLoadTail = (selections: any[], amount: number, type: string) => {
    // Navigate to betting page and let the user manually add selections
    navigate('/betting');
    toast.info("Navigate to Sportsbook and select the same games to tail this bet");
  };
  
  const handleSaveTemplate = async (selections: any[], amount: number, type: string, name: string, description?: string) => {
    toast.success(`Template "${name}" saved! Access it from the Templates button on the betting page.`);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className={`container py-4 ${isNativeApp ? 'px-2' : 'py-6'} flex-1`}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-8 h-8 text-primary" />
              <h1 className={`${isNativeApp ? 'text-xl md:text-2xl' : 'text-3xl'} font-bold`}>
                Social Feed
              </h1>
            </div>
            <p className="text-muted-foreground">
              Discover and tail winning bets from the community
            </p>
          </div>
          
          <SocialFeed onLoadTail={handleLoadTail} onSaveTemplate={handleSaveTemplate} />
        </div>
      </div>
      
      <footer className={`py-4 border-t ${isNativeApp ? 'safe-area-bottom' : ''}`}>
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs md:text-sm text-muted-foreground mb-3 gap-4">
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

export default Social;
