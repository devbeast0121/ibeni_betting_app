import React from 'react';
import { Game } from '@/types/betting';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ChevronRight } from 'lucide-react';
import PlayerPropsDisplay from './PlayerPropsDisplay';

interface GameCardProps {
  game: Game;
  onSelectTeam: (gameId: number, teamIndex: number) => void;
  onSelectProp: (gameId: number, propId: number, isOver: boolean) => void;
  onSelectSpread: (gameId: number, teamIndex: number) => void;
  onSelectTotal: (gameId: number, isOver: boolean) => void;
}

const formatOdds = (odds: string) => {
  const numOdds = parseInt(odds);
  if (isNaN(numOdds)) return odds;
  return numOdds > 0 ? `+${numOdds}` : `${numOdds}`;
};

const getSportBadge = (type: string) => {
  switch (type) {
    case 'NFL': return { icon: '🏈', color: 'bg-orange-600' };
    case 'NBA': return { icon: '🏀', color: 'bg-blue-600' };
    case 'MLB': return { icon: '⚾', color: 'bg-green-600' };
    case 'NHL': return { icon: '🏒', color: 'bg-slate-600' };
    default: return { icon: '🏆', color: 'bg-gray-600' };
  }
};

const GameCard = ({ game, onSelectTeam, onSelectProp, onSelectSpread, onSelectTotal }: GameCardProps) => {
  const hasProps = game.playerProps && game.playerProps.length > 0;
  const [propsOpen, setPropsOpen] = React.useState(false);
  const sportBadge = getSportBadge(game.type);

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-border bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className={`${sportBadge.color} text-white text-xs px-2 py-0.5`}>
            {sportBadge.icon} {game.type}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{game.time}</span>
          </div>
        </div>
        {hasProps && (
          <Badge variant="outline" className="text-xs">
            {game.playerProps?.length} Props
          </Badge>
        )}
      </div>

      {/* Single Clickable Game Box */}
      <div className="p-3">
        {/* Teams & Odds - Single Clickable Area */}
        <div
          className={`border border-border rounded-lg overflow-hidden ${hasProps ? 'cursor-pointer hover:bg-accent/5' : ''} transition-colors`}
          onClick={() => {
            if (hasProps) {
              setPropsOpen(!propsOpen);
            }
          }}
        >
          {/* Both Teams with Odds on Right */}
          <div className="flex items-stretch">
            {/* Left Side - Team Names */}
            <div className="flex-1 space-y-0">
              {game.teams.map((team, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center p-3 ${idx === 0 ? 'border-b border-border/50' : ''}`}
                >
                  <span className="font-semibold text-xs md:text-sm">{team}</span>
                </div>
              ))}
            </div>

            {/* Right Side - All Betting Options */}
            <div className="flex border-l border-border">
              {/* Spread Column */}
              {game.spreads && (
                <div className="flex flex-col border-r border-border">
                  {game.spreads.map((spread, idx) => (
                    <Button
                      key={idx}
                      variant="ghost"
                      size="sm"
                      className={`flex-1 h-auto px-3 rounded-none hover:bg-primary/10 flex-col justify-center ${idx === 0 ? 'border-b border-border/50' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSpread(game.id, idx);
                      }}
                    >
                      <span className="text-[9px] text-muted-foreground">SPD</span>
                      <span className="text-xs font-bold">{spread.points}</span>
                    </Button>
                  ))}
                </div>
              )}

              {/* Moneyline Column */}
              <div className="flex flex-col border-r border-border">
                {game.odds.map((odds, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    size="sm"
                    className={`flex-1 h-auto px-3 rounded-none hover:bg-primary/10 flex-col justify-center ${idx === 0 ? 'border-b border-border/50' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTeam(game.id, idx);
                    }}
                  >
                    <span className="text-[9px] text-muted-foreground">ML</span>
                    <span className="text-xs font-bold">{formatOdds(odds)}</span>
                  </Button>
                ))}
              </div>

              {/* Over/Under Column */}
              {game.totals && (
                <div className="flex flex-col">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-auto px-3 rounded-none hover:bg-primary/10 flex-col justify-center border-b border-border/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTotal(game.id, true);
                    }}
                  >
                    <span className="text-[9px] text-muted-foreground">O {game.totals.line}</span>
                    <span className="text-xs font-bold">{formatOdds(game.totals.overOdds)}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-auto px-3 rounded-none hover:bg-primary/10 flex-col justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTotal(game.id, false);
                    }}
                  >
                    <span className="text-[9px] text-muted-foreground">U {game.totals.line}</span>
                    <span className="text-xs font-bold">{formatOdds(game.totals.underOdds)}</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom - Arrow for Props */}
          {hasProps && (
            <div className="flex items-center justify-center px-3 py-2 bg-muted/20 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Player Props ({game.playerProps?.length})</span>
                <ChevronRight className={`h-3.5 w-3.5 transition-transform ${propsOpen ? 'rotate-90' : ''}`} />
              </div>
            </div>
          )}
        </div>

        {/* Player Props Section */}
        {hasProps && propsOpen && (
          <div className="mt-3 pt-3 border-t border-border animate-accordion-down">
            <PlayerPropsDisplay 
              props={game.playerProps || []}
              gameId={game.id}
              onSelectProp={onSelectProp}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCard;
