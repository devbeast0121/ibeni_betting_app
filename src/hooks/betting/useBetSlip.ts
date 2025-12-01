
import { useState } from 'react';
import { BetSlipItem, Game } from '@/types/betting';
import { toast } from "@/components/ui/sonner";
import { BetType } from '@/types/balance';

export const useBetSlip = (games: Game[], betType: BetType) => {
  const [betSlip, setBetSlip] = useState<BetSlipItem[]>([]);
  const [betAmount, setBetAmount] = useState<string>(betType === 'growth_cash' ? "1" : "50");
  const MAX_WIN_AMOUNT = 1000;

  const handleAddToBetSlip = (gameId: number, teamIndex: number) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;
    
    // Check if it's a bonus bet and validate the odds
    if (betType === 'bonus_bet') {
      const odds = parseInt(game.odds[teamIndex]);
      if (odds <= 0) {
        toast.error("Bonus bets can only be used on positive (+) odds markets");
        return;
      }
    }
    
    const newBet = {
      id: Math.random(),
      team: game.teams[teamIndex],
      odds: game.odds[teamIndex],
      gameInfo: `${game.teams[0]} vs ${game.teams[1]} - ${game.type}`,
      type: 'moneyline' as const
    };
    
    setBetSlip([...betSlip, newBet]);
    toast.success(`Added ${game.teams[teamIndex]} to your prediction slip`);
  };

  const handleAddPropToBetSlip = (gameId: number, propId: number, isOver: boolean) => {
    const game = games.find(g => g.id === gameId);
    if (!game || !game.playerProps) return;
    
    const prop = game.playerProps.find(p => p.id === propId);
    if (!prop) return;

    // Check if it's a bonus bet and validate the odds
    if (betType === 'bonus_bet') {
      const odds = parseInt(isOver ? prop.overOdds : prop.underOdds);
      if (odds <= 0) {
        toast.error("Bonus bets can only be used on positive (+) odds markets");
        return;
      }
    }

    const newBet = {
      id: Math.random(),
      odds: isOver ? prop.overOdds : prop.underOdds,
      gameInfo: `${game.teams[0]} vs ${game.teams[1]} - ${game.type}`,
      type: 'player_prop' as const,
      propInfo: {
        player: prop.player,
        stat: prop.stat,
        line: prop.line,
        isOver
      }
    };
    
    setBetSlip([...betSlip, newBet]);
    toast.success(`Added ${prop.player} prop to your prediction slip`);
  };

  const handleAddSpreadToBetSlip = (gameId: number, teamIndex: number) => {
    const game = games.find(g => g.id === gameId);
    if (!game || !game.spreads || !game.spreads[teamIndex]) return;
    
    const spread = game.spreads[teamIndex];
    
    // Check if it's a bonus bet and validate the odds
    if (betType === 'bonus_bet') {
      const odds = parseInt(spread.odds);
      if (odds <= 0) {
        toast.error("Bonus bets can only be used on positive (+) odds markets");
        return;
      }
    }
    
    const newBet = {
      id: Math.random(),
      odds: spread.odds,
      gameInfo: `${game.teams[0]} vs ${game.teams[1]} - ${game.type}`,
      type: 'spread' as const,
      spreadInfo: {
        team: game.teams[teamIndex],
        points: spread.points
      }
    };
    
    setBetSlip([...betSlip, newBet]);
    toast.success(`Added ${game.teams[teamIndex]} ${spread.points} to your prediction slip`);
  };

  const handleAddTotalToBetSlip = (gameId: number, isOver: boolean) => {
    const game = games.find(g => g.id === gameId);
    if (!game || !game.totals) return;
    
    const odds = isOver ? game.totals.overOdds : game.totals.underOdds;
    
    // Check if it's a bonus bet and validate the odds
    if (betType === 'bonus_bet') {
      const oddsNum = parseInt(odds);
      if (oddsNum <= 0) {
        toast.error("Bonus bets can only be used on positive (+) odds markets");
        return;
      }
    }
    
    const newBet = {
      id: Math.random(),
      odds,
      gameInfo: `${game.teams[0]} vs ${game.teams[1]} - ${game.type}`,
      type: 'total' as const,
      totalInfo: {
        line: game.totals.line,
        isOver
      }
    };
    
    setBetSlip([...betSlip, newBet]);
    toast.success(`Added ${isOver ? 'Over' : 'Under'} ${game.totals.line} to your prediction slip`);
  };

  const handleRemoveFromBetSlip = (id: number) => {
    setBetSlip(betSlip.filter(bet => bet.id !== id));
    toast.info("Selection removed from prediction slip");
  };

  const calculatePotentialWinnings = () => {
    if (betSlip.length === 0 || !betAmount) return "0";
    
    const bet = betSlip[0];
    const odds = parseFloat(bet.odds);
    const amount = parseFloat(betAmount);
    
    let winnings = 0;
    if (odds > 0) {
      winnings = (odds / 100) * amount;
    } else {
      winnings = (100 / Math.abs(odds)) * amount;
    }

    return Math.min(winnings, MAX_WIN_AMOUNT).toFixed(2);
  };

  const resetBetSlip = () => {
    setBetSlip([]);
    setBetAmount(betType === 'growth_cash' ? "1" : "50");
  };

  return {
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
  };
};
