
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { PredictionData, BetType } from "@/types/balance";

export const usePredictions = (balance: any, localBalance: any, setLocalBalance: React.Dispatch<React.SetStateAction<any>>) => {
  const queryClient = useQueryClient();

  // Simulate entertainment-based prediction outcomes (more varied, less predictable)
  const simulatePredictionOutcome = () => {
    // Use a more entertainment-focused algorithm
    // 35% base chance, but varies based on "entertainment factors"
    const baseChance = 0.35;
    const randomVariation = (Math.random() - 0.5) * 0.3; // ±15% variation
    const entertainmentFactor = Math.random() * 0.2; // Additional randomness for entertainment
    
    const finalChance = Math.max(0.1, Math.min(0.6, baseChance + randomVariation + entertainmentFactor));
    return Math.random() < finalChance;
  };

  const createPrediction = useMutation({
    mutationFn: async ({ amount, selections, betType }: PredictionData) => {
      try {
        console.log("Creating prediction with amount:", amount, "and selections:", selections);
        console.log("Bet type:", betType);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");
        
        // First, save the prediction as pending
        const { data: predictionData, error: predictionError } = await supabase
          .from('predictions')
          .insert({
            user_id: user.id,
            amount,
            bet_type: betType,
            selections: JSON.stringify(selections),
            result: 'pending',
            winnings: 0,
            platform_fee: 0,
            status: 'pending'
          })
          .select()
          .single();

        if (predictionError) {
          throw new Error("Failed to save prediction: " + predictionError.message);
        }
        // Deduct the bet amount from user's balance immediately
        if (betType === 'fun_tokens') {
          const newAvailableBalance = (balance?.available_balance || 0) - amount;
          
          const { error: updateError } = await (supabase as any)
            .from('user_balances')
            .update({
              available_balance: newAvailableBalance
            })
            .eq('id', balance?.id);

          if (updateError) throw updateError;
        } else if (betType === 'growth_cash') {
          const newGrowthCash = (balance?.growth_cash || 0) - amount;
          
          const { error: updateError } = await (supabase as any)
            .from('user_balances')
            .update({
              growth_cash: newGrowthCash
            })
            .eq('id', balance?.id);

          if (updateError) throw updateError;
        } else if (betType === 'bonus_bet') {
          const newBonusBets = (balance?.bonus_bets || 0) - amount;
          
          const { error: updateError } = await (supabase as any)
            .from('user_balances')
            .update({
              bonus_bets: newBonusBets
            })
            .eq('id', balance?.id);

          if (updateError) throw updateError;
        }

        // Schedule the bet to be settled after a random delay (30 seconds to 3 minutes)
        const settlementDelay = Math.random() * (180000 - 30000) + 30000; // 30s to 3 min
        setTimeout(async () => {
          await settleBet(predictionData.id, betType, amount, selections);
        }, settlementDelay);
        
        return { 
          amount, 
          selections, 
          betType, 
          status: 'pending',
          result: 'pending',
          message: `Bet placed successfully! Your prediction is pending and will be settled when the game completes.`
        };
      } catch (err) {
        console.log("Using local balance fallback for predictions");
        
        // For local fallback, still save as pending but deduct amount
        let newBalance = { ...localBalance };
        
        if (betType === 'fun_tokens') {
          newBalance.available_balance -= amount;
        } else if (betType === 'growth_cash') {
          newBalance.growth_cash -= amount;
        } else if (betType === 'bonus_bet') {
          newBalance.bonus_bets -= amount;
        }
        
        setLocalBalance(newBalance);
        localStorage.setItem('user_balance', JSON.stringify(newBalance));
        
        return { 
          amount, 
          selections, 
          betType, 
          status: 'pending',
          result: 'pending',
          message: `Bet placed successfully! Your prediction is pending and will be settled when the game completes.`
        };
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['betting-history'] });
      
      // Always show success message for placed bets
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error("Failed to place prediction");
      console.error("Prediction error:", error);
    }
  });

  // Function to settle a bet after delay
  const settleBet = async (predictionId: string, betType: BetType, amount: number, selections: any[]) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Simulate the prediction outcome
      const isWin = simulatePredictionOutcome();
      let winnings = 0;
      let platformFee = 0;
      let resultMessage = "";

      if (isWin) {
        // Calculate winnings
        const odds = parseFloat(selections[0].odds);
        if (odds > 0) {
          winnings = (odds / 100) * amount;
        } else {
          winnings = (100 / Math.abs(odds)) * amount;
        }
        
        platformFee = betType === 'bonus_bet' ? 0 : winnings * 0.1;
        const netWinnings = winnings - platformFee;

        // Add winnings to balance
        if (betType === 'fun_tokens') {
          const { data: currentBalance } = await supabase
            .from('user_balances')
            .select('available_balance')
            .eq('user_id', user.id)
            .single();

          if (currentBalance) {
            await supabase
              .from('user_balances')
              .update({
                available_balance: currentBalance.available_balance + netWinnings
              })
              .eq('user_id', user.id);
          }
          resultMessage = `Great prediction! We've added ${netWinnings.toFixed(2)} Fun Tokens to your balance.`;
        } else if (betType === 'growth_cash') {
          // For growth cash wins: 10% platform fee on the winnings only
          const winningsFee = winnings * 0.1;
          const netWinnings = winnings - winningsFee;
          
          const { data: currentBalance } = await supabase
            .from('user_balances')
            .select('growth_cash')
            .eq('user_id', user.id)
            .single();

          if (currentBalance) {
            // Return original bet + net winnings (winnings minus 10% fee)
            const netReturn = amount + netWinnings;
            await supabase
              .from('user_balances')
              .update({
                growth_cash: currentBalance.growth_cash + netReturn
              })
              .eq('user_id', user.id);
            resultMessage = `Excellent prediction! We've added $${netReturn.toFixed(2)} to your Growth Cash balance (10% platform fee on winnings: $${winningsFee.toFixed(2)} applied).`;
          }
        } else if (betType === 'bonus_bet') {
          const { data: currentBalance } = await supabase
            .from('user_balances')
            .select('invested_balance')
            .eq('user_id', user.id)
            .single();

          if (currentBalance) {
            await supabase
              .from('user_balances')
              .update({
                invested_balance: currentBalance.invested_balance + winnings
              })
              .eq('user_id', user.id);
          }
          resultMessage = `Fantastic! Your Bonus Bet won and we've added $${winnings.toFixed(2)} to your portfolio with no fees.`;
        }
      } else {
        // Handle losses
        if (betType === 'growth_cash') {
          // CRITICAL: When growth cash bet loses, 90% goes to invested_balance (portfolio)
          // 10% is the platform fee (already deducted since we took the full bet amount)
          const portfolioAmount = amount * 0.9; // 90% to portfolio
          const platformFee = amount * 0.1;     // 10% to ibeni
          
          const { data: currentBalance } = await supabase
            .from('user_balances')
            .select('invested_balance')
            .eq('user_id', user.id)
            .single();

          if (currentBalance) {
            // Add 90% of the bet to the invested_balance (portfolio)
            await supabase
              .from('user_balances')
              .update({
                invested_balance: currentBalance.invested_balance + portfolioAmount
              })
              .eq('user_id', user.id);
          }
          resultMessage = `Your prediction didn't win, but $${portfolioAmount.toFixed(2)} (90% of your bet) has been automatically invested in your portfolio. Platform fee: $${platformFee.toFixed(2)} (10%).`;
        }
        // For fun_tokens and bonus_bet losses, nothing happens (they just lose the tokens)
      }

      // Update the prediction record with correct fee
      const finalPlatformFee = betType === 'growth_cash' 
        ? (isWin ? winnings * 0.1 : amount * 0.1) 
        : (isWin ? platformFee : 0);
      
      await supabase
        .from('predictions')
        .update({
          result: isWin ? 'win' : 'loss',
          winnings: isWin ? winnings : 0,
          platform_fee: finalPlatformFee,
          status: 'settled'
        })
        .eq('id', predictionId);

      // Show notification
      if (isWin) {
        toast.success(resultMessage);
      } else {
        toast.info(resultMessage);
      }

      // Refresh queries
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['betting-history'] });

    } catch (error) {
      console.error('Error settling bet:', error);
    }
  };

  return { createPrediction };
};
