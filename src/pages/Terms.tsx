
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'react-router-dom';
import TermsOfService from '@/components/terms/TermsOfService';
import SweepstakesRules from '@/components/terms/SweepstakesRules';
import PrivacyPolicy from '@/components/terms/PrivacyPolicy';
import TermsHeader from '@/components/terms/TermsHeader';
import TermsFooter from '@/components/terms/TermsFooter';

const Terms = () => {
  const location = useLocation();
  const hash = location.hash.substring(1);
  
  useEffect(() => {
    // Set default tab based on URL hash
    if (hash && ['terms', 'sweep', 'privacy'].includes(hash)) {
      const tabElement = document.getElementById(`tab-${hash}`);
      if (tabElement) {
        (tabElement as HTMLButtonElement).click();
      }
    }
    
    // Scroll to section if hash exists
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [hash]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <div className="container py-6 flex-1">
        <TermsHeader />
        
        <Tabs defaultValue="terms" className="space-y-6">
          <TabsList>
            <TabsTrigger id="tab-terms" value="terms">Terms of Service</TabsTrigger>
            <TabsTrigger id="tab-sweep" value="sweep">Sweepstakes Rules</TabsTrigger>
            <TabsTrigger id="tab-privacy" value="privacy">Privacy Policy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="terms" className="space-y-8">
            <TermsOfService />
          </TabsContent>
          
          <TabsContent value="sweep" className="space-y-8">
            <SweepstakesRules />
          </TabsContent>
          
          <TabsContent value="privacy" className="space-y-8">
            <PrivacyPolicy />
          </TabsContent>
        </Tabs>
      </div>
      
      <TermsFooter />
    </div>
  );
};

export default Terms;
