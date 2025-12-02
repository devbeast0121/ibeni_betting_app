
import React from 'react';
import { BetSlipItem } from '@/types/betting';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, Ticket, BadgeDollarSign, ExternalLink, Award } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Toggle } from '@/components/ui/toggle';
import { Link } from 'react-router-dom';
import { MobileEnhancedBetSlip } from '@/components/mobile/MobileEnhancedBetSlip';
import { MobileShareButton } from '@/components/mobile/MobileShareButton';
import { useHapticFeedback } from '@/hooks/use-mobile-features';
import { useIsNativeApp } from '@/hooks/use-mobile-app';

interface BetSlipProps {
  betSlip: BetSlipItem[];
  betAmount: string;
  maxWin: number;
  betType: 'fun_tokens' | 'growth_cash' | 'bonus_bet';
  onRemoveBet: (id: number) => void;
  onBetAmountChange: (amount: string) => void;
  calculatePotentialWinnings: () => string;
  onSubmit: () => void;
  onBetTypeChange: (type: 'fun_tokens' | 'growth_cash' | 'bonus_bet') => void;
}

const BetSlip = ({ 
  betSlip, 
  betAmount, 
  maxWin,
  betType,
  onRemoveBet, 
  onBetAmountChange,
  calculatePotentialWinnings,
  onSubmit,
  onBetTypeChange
}: BetSlipProps) => {
  const total = (parseFloat(calculatePotentialWinnings()) + parseFloat(betAmount || "0")).toFixed(2);
  const { success } = useHapticFeedback();
  const isNative = useIsNativeApp();

  const handleSubmit = () => {
    success();
    onSubmit();
  };

  const handleBetTypeChange = (type: 'fun_tokens' | 'growth_cash' | 'bonus_bet') => {
    success();
    onBetTypeChange(type);
  };

  const renderBetInfo = (bet: BetSlipItem) => {
    if (bet.type === 'moneyline') {
      return (
        <div className="font-medium">{bet.team}</div>
      );
    } else if (bet.type === 'player_prop' && bet.propInfo) {
      return (
        <div>
          <div className="font-medium">{bet.propInfo.player}</div>
          <div className="text-xs text-muted-foreground">
            {bet.propInfo.stat} {bet.propInfo.isOver ? 'Over' : 'Under'} {bet.propInfo.line}
          </div>
        </div>
      );
    } else if (bet.type === 'spread' && bet.spreadInfo) {
      return (
        <div>
          <div className="font-medium">{bet.spreadInfo.team}</div>
          <div className="text-xs text-muted-foreground">
            Spread {bet.spreadInfo.points}
          </div>
        </div>
      );
    } else if (bet.type === 'total' && bet.totalInfo) {
      return (
        <div>
          <div className="font-medium">{bet.totalInfo.isOver ? 'Over' : 'Under'} {bet.totalInfo.line}</div>
          <div className="text-xs text-muted-foreground">
            Total Points
          </div>
        </div>
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {betType === 'fun_tokens' ? (
            <Ticket className="h-5 w-5" />
          ) : betType === 'growth_cash' ? (
            <BadgeDollarSign className="h-5 w-5" />
          ) : (
            <Award className="h-5 w-5" />
          )}
          Prediction Slip
        </CardTitle>
        <CardDescription>
          {betSlip.length === 0 
            ? "Select odds to add to your prediction slip" 
            : `${betSlip.length} ${betSlip.length === 1 ? 'selection' : 'selections'}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {betSlip.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Your prediction slip is empty
          </div>
        ) : (
          <>
            <div className="flex justify-center gap-2 p-2 bg-muted/50 rounded-lg">
              <Toggle
                pressed={betType === 'fun_tokens'}
                onPressedChange={() => handleBetTypeChange('fun_tokens')}
                size="sm"
                className="data-[state=on]:bg-blue-600 data-[state=on]:text-white"
              >
                Fun Tokens
              </Toggle>
              <Toggle
                pressed={betType === 'growth_cash'}
                onPressedChange={() => handleBetTypeChange('growth_cash')}
                size="sm"
                className="data-[state=on]:bg-green-600 data-[state=on]:text-white"
              >
                Growth Cash
              </Toggle>
              <Toggle
                pressed={betType === 'bonus_bet'}
                onPressedChange={() => handleBetTypeChange('bonus_bet')}
                size="sm"
                className="data-[state=on]:bg-amber-600 data-[state=on]:text-white"
              >
                Bonus Bet
              </Toggle>
            </div>
            
            {betSlip.map((bet) => (
              <MobileEnhancedBetSlip
                key={bet.id}
                onRemove={() => onRemoveBet(bet.id)}
                onSwipeAction={() => {
                  // Could add quick actions here like changing bet amount
                }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {renderBetInfo(bet)}
                    <div className="text-xs text-muted-foreground mt-1">{bet.gameInfo}</div>
                    <Badge variant="outline" className="mt-2">{bet.odds}</Badge>
                  </div>
                </div>
              </MobileEnhancedBetSlip>
            ))}
            
            <Separator />
            
            <div className="space-y-4">
              <div>
                <label className="text-xs md:text-sm font-medium">
                  Entry Amount ({betType === 'fun_tokens' ? 'Fun Tokens' : betType === 'growth_cash' ? 'Growth Cash' : 'Bonus Bet'})
                </label>
                <div className="mt-1 flex">
                  <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted">
                    {betType === 'fun_tokens' ? (
                      <Ticket className="h-4 w-4 text-muted-foreground" />
                    ) : betType === 'growth_cash' ? (
                      <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Award className="h-4 w-4 text-amber-600" />
                    )}
                  </div>
                  <Input 
                    type="number"
                    value={betAmount}
                    onChange={(e) => onBetAmountChange(e.target.value)}
                    className="rounded-l-none"
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                  <span>Maximum prize: {maxWin.toLocaleString()} {betType === 'fun_tokens' ? 'tokens' : 'USD'}</span>
                  {betType === 'fun_tokens' && (
                    <Link to="/terms#sweep" className="text-xs text-blue-600 hover:underline inline-flex items-center">
                      Free entry method <ExternalLink className="h-3 w-3 ml-0.5" />
                    </Link>
                  )}
                </div>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-md">
                <div className="flex justify-between text-xs md:text-sm">
                  <span>Potential Prize:</span>
                  <span className="font-medium">
                    {calculatePotentialWinnings()} {betType === 'fun_tokens' ? 'tokens' : 'USD'}
                  </span>
                </div>
                {betType !== 'bonus_bet' && (
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Platform fee:</span>
                    <span>10% on winnings (win) or bet (loss)</span>
                  </div>
                )}
                <div className="flex justify-between mt-2">
                  <span className="font-medium">Total Return:</span>
                  <span className="font-bold">
                    {total} {betType === 'fun_tokens' ? 'tokens' : 'USD'}
                  </span>
                </div>
                {betType === 'bonus_bet' && (
                  <div className="mt-2 text-xs text-green-600 font-medium">
                    All prediction rewards will be added directly to your sweepstakes portfolio with no fees!
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleSubmit}>
                  <Check className="mr-2 h-4 w-4" /> Submit Prediction
                </Button>
                {isNative && (
                  <MobileShareButton 
                    title="My Bet Slip"
                    text={`Check out my prediction: ${betSlip.map(b => b.team || b.propInfo?.player).join(', ')}`}
                  />
                )}
              </div>
              
              <div className="text-xs text-center text-muted-foreground space-y-1">
                {betType === 'fun_tokens' ? (
                  <>
                    <p className="font-medium text-blue-600">Entertainment platform with sweepstakes prizes</p>
                    <p>Fun Tokens are for entertainment only and have no monetary value</p>
                    <p className="font-medium">NO PURCHASE NECESSARY. Void where prohibited.</p>
                  </>
                ) : betType === 'growth_cash' ? (
                  <>
                    <p className="font-medium text-green-600">Sweepstakes entry for portfolio growth simulation</p>
                    <p>Growth Cash predictions create sweepstakes entries</p>
                    <p>Premium membership required for redemptions</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-amber-600">Premium subscribers: $25 bonus bets every 4 months</p>
                    <p>All prediction rewards go directly to your sweepstakes portfolio</p>
                  </>
                )}
                <p>By submitting, you agree to our <Link to="/terms" className="underline hover:text-primary">Sweepstakes Terms & Conditions</Link></p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BetSlip;
