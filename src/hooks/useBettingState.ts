
import { useState } from 'react';
import { useBetSlip } from '@/hooks/betting/useBetSlip';
import { useGames } from '@/hooks/betting/useGames';
import { usePredictionSubmit } from '@/hooks/betting/usePredictionSubmit';
import { BetType } from '@/types/balance';
import { UseBettingStateReturn } from '@/types/bettingState';

export const useBettingState = (): UseBettingStateReturn => {
  const [betType, setBetType] = useState<BetType>('fun_tokens');
  
  // Use the smaller hooks
  const { 
    games, 
    isLoading, 
    lastRefreshed, 
    selectedSports, 
    setSelectedSports,
    fetchLiveGamesData,
    allGames
  } = useGames();
  
  const {
    betSlip,
    betAmount,
    setBetAmount,
    handleAddToBetSlip,
    handleAddPropToBetSlip,
    handleAddSpreadToBetSlip,
    handleAddTotalToBetSlip,
    handleRemoveFromBetSlip,
    calculatePotentialWinnings,
    resetBetSlip,
    MAX_WIN_AMOUNT
  } = useBetSlip(allGames, betType);
  
  const {
    submitPrediction,
    availableBalance
  } = usePredictionSubmit(betSlip, betAmount, betType, resetBetSlip);

  // Return a combined state object
  return {
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
  };
};
