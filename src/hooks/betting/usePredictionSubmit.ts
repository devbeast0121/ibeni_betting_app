
import { BetSlipItem } from '@/types/betting';
import { BetType } from '@/types/balance';
import { useBalance } from '@/hooks/useBalance';
import { toast } from "@/components/ui/sonner";

export const usePredictionSubmit = (
  betSlip: BetSlipItem[], 
  betAmount: string, 
  betType: BetType,
  resetBetSlip: () => void
) => {
  const { balance, createPrediction } = useBalance();

  const submitPrediction = () => {
    if (betSlip.length === 0 || !betAmount) {
      toast.error("Please add selections and entry amount");
      return;
    }

    // For bonus bets, allow any odds (removed restriction)
    if (betType === 'bonus_bet') {
      // Check bonus bet balance
      const bonusBetsBalance = balance?.bonus_bets || 0;
      const amount = parseFloat(betAmount);
      if (amount > bonusBetsBalance) {
        toast.error(`Not enough Bonus Bet funds. You have ${bonusBetsBalance} available.`);
        return;
      }
    } else {
      // Regular prediction balance check
      const amount = parseFloat(betAmount);
      const availableFunds = betType === 'fun_tokens' ? 
        (balance?.available_balance || 0) : 
        (balance?.growth_cash || 0);

      if (amount > availableFunds) {
        toast.error(`Not enough ${betType === 'fun_tokens' ? 'Fun Tokens' : 'Growth Cash'} in your account`);
        return;
      }
    }

    // Show entertainment-focused confirmation
    const confirmationMessage = betType === 'fun_tokens' 
      ? "Making prediction for entertainment and potential sweepstakes entry..."
      : betType === 'growth_cash'
      ? "Creating sweepstakes entry and portfolio simulation..."
      : "Using bonus bet for sweepstakes entry...";
    
    toast.info(confirmationMessage);

    createPrediction.mutate({ 
      amount: parseFloat(betAmount),
      betType,
      selections: betSlip.map(bet => ({
        odds: bet.odds,
        selection: bet.type === 'moneyline' ? bet.team : 
          `${bet.propInfo?.player} ${bet.propInfo?.stat} ${bet.propInfo?.isOver ? 'Over' : 'Under'} ${bet.propInfo?.line}`,
        gameInfo: bet.gameInfo
      }))
    });
    
    resetBetSlip();
  };

  const getAvailableBalance = () => {
    return betType === 'fun_tokens' ? 
      balance?.available_balance || 0 : 
      betType === 'growth_cash' ?
      balance?.growth_cash || 0 :
      balance?.bonus_bets || 0;
  };

  return {
    submitPrediction,
    availableBalance: getAvailableBalance()
  };
};
