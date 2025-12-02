
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SportsFilter from './betting/SportsFilter';
import GamesList from './betting/GamesList';
import BetSlip from './betting/BetSlip';
import BettingHistory from './betting/BettingHistory';
import FreeEntryNotice from './betting/FreeEntryNotice';
import EntertainmentDisclaimer from './betting/EntertainmentDisclaimer';
import { useBettingState } from '@/hooks/useBettingState';
import { toast } from "@/components/ui/sonner";
import { DepositDialog } from './DepositDialog';
import { RefreshCw, Info, History, BarChart3 } from 'lucide-react';
import { BetTemplatesDialog } from './BetTemplatesDialog';
import { AdvancedAnalytics } from './AdvancedAnalytics';

const BettingInterface = () => {
  const [activeTab, setActiveTab] = useState('games');
  const {
    betAmount,
    setBetAmount,
    betSlip,
    games,
    isLoading,
    lastRefreshed,
    selectedSports,
    setSelectedSports,
    handleAddToBetSlip,
    handleAddPropToBetSlip,
    handleAddSpreadToBetSlip,
    handleAddTotalToBetSlip,
    handleRemoveFromBetSlip,
    calculatePotentialWinnings,
    fetchLiveGamesData,
    resetBetSlip,
    submitPrediction,
    MAX_WIN_AMOUNT,
    betType,
    setBetType,
    availableBalance
  } = useBettingState();

  // Check if we're in a potential off-season period
  const getSeasonalStatus = () => {
    const month = new Date().getMonth() + 1; // 1-12
    const isOffSeason = month >= 6 && month <= 8; // June-August is typically low season
    return { isOffSeason, month };
  };

  // Set up periodic refresh when component mounts
  useEffect(() => {
    fetchLiveGamesData();
  }, []); // Only fetch once on mount, removed the live tab dependencies
  
  const { isOffSeason } = getSeasonalStatus();
  
  return (
    <div className="animate-fade-in space-y-6">
      <FreeEntryNotice />
      
      {/* Seasonal Notice */}
      {isOffSeason && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <div className="text-xs md:text-sm text-blue-800">
            <strong>Off-Season Notice:</strong> Some major sports may be in their off-season. 
            Available games may be limited or showing recent/sample data for demonstration.
          </div>
        </div>
      )}
      
      {/* Modern Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Sportsbook</h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">Live odds from top sportsbooks</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchLiveGamesData} 
            className="flex items-center gap-2 px-4 py-2 text-xs md:text-sm border border-border hover:bg-muted rounded-lg transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
          
          <DepositDialog />
          
          <BetTemplatesDialog 
            betSlip={betSlip}
            betAmount={Number(betAmount)}
            betType={betType}
            onLoadTemplate={(template) => {
              toast.success("Template loaded!");
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 order-2 lg:order-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <TabsList className="h-10 bg-muted/30 p-1 rounded-lg">
                <TabsTrigger value="games" className="text-xs md:text-sm">Games</TabsTrigger>
                <TabsTrigger value="history" className="text-xs md:text-sm">
                  <History className="h-3 w-3 mr-1" />
                  History
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-xs md:text-sm">
                  <BarChart3 className="h-3 w-3 mr-1" />
                  Analytics
                </TabsTrigger>
              </TabsList>
              
              <SportsFilter 
                selectedSports={selectedSports}
                onValueChange={setSelectedSports}
              />
            </div>
            
            <TabsContent value="games" className="mt-0">
              <GamesList
                games={games}
                isLoading={isLoading}
                onSelectTeam={handleAddToBetSlip}
                onSelectProp={handleAddPropToBetSlip}
                onSelectSpread={handleAddSpreadToBetSlip}
                onSelectTotal={handleAddTotalToBetSlip}
                title="All Games"
              />
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <BettingHistory />
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <AdvancedAnalytics />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1 order-1 lg:order-2">
          <div className="sticky top-4 space-y-4">
            <EntertainmentDisclaimer />
            <BetSlip
              betSlip={betSlip}
              betAmount={betAmount}
              onRemoveBet={handleRemoveFromBetSlip}
              onBetAmountChange={setBetAmount}
              calculatePotentialWinnings={calculatePotentialWinnings}
              maxWin={MAX_WIN_AMOUNT}
              onSubmit={submitPrediction}
              betType={betType}
              onBetTypeChange={setBetType}
            />
          </div>
        </div>
      </div>
      
      {lastRefreshed && (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground py-2">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          Last updated: {lastRefreshed.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default BettingInterface;
