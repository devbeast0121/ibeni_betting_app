import { Game } from '@/types/betting';
import { Loader2, Zap, TrendingUp } from 'lucide-react';
import GameCard from './GameCard';
import { Badge } from '@/components/ui/badge';
import { PullToRefresh } from '@/components/mobile/PullToRefresh';

interface GamesListProps {
  games: Game[];
  isLoading?: boolean;
  lastRefreshed?: Date | null;
  onRefresh?: () => void;
  onSelectTeam: (gameId: number, teamIndex: number) => void;
  onSelectProp: (gameId: number, propId: number, isOver: boolean) => void;
  onSelectSpread: (gameId: number, teamIndex: number) => void;
  onSelectTotal: (gameId: number, isOver: boolean) => void;
  showRefresh?: boolean;
  title?: string;
}

const GamesList = ({
  games,
  isLoading,
  lastRefreshed,
  onRefresh,
  onSelectTeam,
  onSelectProp,
  onSelectSpread,
  onSelectTotal,
  showRefresh,
  title
}: GamesListProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center p-20 space-y-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-primary/20 animate-pulse"></div>
        </div>
        <div className="text-center space-y-2">
          <div className="text-lg font-medium">Loading Live Odds</div>
          <div className="text-sm text-muted-foreground">Fetching the latest betting lines...</div>
        </div>
      </div>
    );
  }

  const liveGames = games.filter(game => 
    game.time.toLowerCase().includes('tonight') || 
    game.time.toLowerCase().includes('live')
  );
  
  const upcomingGames = games.filter(game => 
    game.time.toLowerCase().includes('tomorrow') || 
    (!game.time.toLowerCase().includes('tonight') && !game.time.toLowerCase().includes('live'))
  );

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-6">
      {title && (
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold">{title}</h3>
          <Badge variant="outline" className="text-xs">
            {games.length} Games
          </Badge>
        </div>
      )}
      
      {games.length > 0 ? (
        <div className="space-y-8">
          {/* Live/Tonight Games */}
          {liveGames.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-red-500" />
                  <h4 className="text-lg font-semibold">Live & Tonight</h4>
                </div>
                <Badge variant="destructive" className="animate-pulse">
                  {liveGames.length} Active
                </Badge>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {liveGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onSelectTeam={onSelectTeam}
                    onSelectProp={onSelectProp}
                    onSelectSpread={onSelectSpread}
                    onSelectTotal={onSelectTotal}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Games */}
          {upcomingGames.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <h4 className="text-lg font-semibold">Upcoming Games</h4>
                </div>
                <Badge variant="outline">
                  {upcomingGames.length} Scheduled
                </Badge>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {upcomingGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onSelectTeam={onSelectTeam}
                    onSelectProp={onSelectProp}
                    onSelectSpread={onSelectSpread}
                    onSelectTotal={onSelectTotal}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center border-2 border-dashed border-muted rounded-xl bg-muted/10">
          <div className="space-y-4">
            <div className="text-6xl">🎯</div>
            <div>
              <h3 className="text-lg font-medium">No Games Available</h3>
              <p className="text-muted-foreground">Check back soon for new betting opportunities!</p>
            </div>
            {showRefresh && onRefresh && (
              <button 
                onClick={onRefresh}
                className="mt-6 px-6 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              >
                Refresh Games
              </button>
            )}
          </div>
        </div>
      )}
      </div>
    </PullToRefresh>
  );
};

export default GamesList;