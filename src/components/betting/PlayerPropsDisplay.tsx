import React, { useState } from 'react';
import { PlayerProp } from '@/types/betting';
import { Button } from '@/components/ui/button';
import { ChevronDown, TrendingUp, Footprints, Target, Trophy, Shield, Activity, Circle } from 'lucide-react';

interface PlayerPropsDisplayProps {
  props: PlayerProp[];
  gameId: number;
  onSelectProp: (gameId: number, propId: number, isOver: boolean) => void;
}

const formatOdds = (odds: string) => {
  const numOdds = parseInt(odds);
  if (isNaN(numOdds)) return odds;
  return numOdds > 0 ? `+${numOdds}` : `${numOdds}`;
};

const formatStatName = (stat: string) => {
  return stat
    .replace(/_/g, ' ')
    .replace(/player /gi, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .replace(/\bTd\b/g, 'TD')
    .replace(/\bFg\b/g, 'FG')
    .replace(/\bRbi\b/g, 'RBI');
};

// Categorize props by type
const categorizeProps = (props: PlayerProp[]) => {
  const categories: Record<string, { props: PlayerProp[]; icon: any; label: string }> = {
    passing: { props: [], icon: TrendingUp, label: 'Passing' },
    rushing: { props: [], icon: Footprints, label: 'Rushing' },
    receiving: { props: [], icon: Target, label: 'Receiving' },
    touchdowns: { props: [], icon: Trophy, label: 'Touchdowns' },
    kicking: { props: [], icon: Circle, label: 'Kicking' },
    defense: { props: [], icon: Shield, label: 'Defense' },
    points: { props: [], icon: Activity, label: 'Points' },
    rebounds: { props: [], icon: Activity, label: 'Rebounds' },
    assists: { props: [], icon: Activity, label: 'Assists' },
    threes: { props: [], icon: Activity, label: 'Three-Pointers' },
    defensive: { props: [], icon: Shield, label: 'Defensive' },
  };

  props.forEach((prop) => {
    const stat = prop.stat.toLowerCase();
    
    // Football - Passing (includes passing TDs)
    if (stat.includes('pass')) {
      categories.passing.props.push(prop);
    } 
    // Football - Rushing (includes rushing TDs)
    else if (stat.includes('rush')) {
      categories.rushing.props.push(prop);
    } 
    // Football - Receiving (includes receiving TDs)
    else if (stat.includes('recep')) {
      categories.receiving.props.push(prop);
    } 
    // Football - Touchdown Scoring (only TD scorer props: 1st, Last, Anytime)
    else if (stat.includes('1st td') || stat.includes('last td') || stat.includes('anytime td')) {
      categories.touchdowns.props.push(prop);
    }
    // Football - Kicking & Field Goals
    else if (stat.includes('kicking') || stat.includes('field_goal') || stat.includes('turnover') || 
             stat.includes('batter') || stat.includes('pitcher') || stat.includes('hit') || 
             stat.includes('home_run') || stat.includes('rbi') || stat.includes('strikeout')) {
      categories.kicking.props.push(prop);
    } 
    // Football - Defense
    else if (stat.includes('tackle') || stat.includes('sack') || stat.includes('interception')) {
      categories.defense.props.push(prop);
    }
    // Basketball - Points
    else if (stat.includes('point')) {
      categories.points.props.push(prop);
    }
    // Basketball - Rebounds
    else if (stat.includes('rebound')) {
      categories.rebounds.props.push(prop);
    }
    // Basketball - Assists
    else if (stat.includes('assist')) {
      categories.assists.props.push(prop);
    }
    // Basketball - Three-Pointers
    else if (stat.includes('three')) {
      categories.threes.props.push(prop);
    }
    // Basketball - Defensive (blocks, steals)
    else if (stat.includes('block') || stat.includes('steal')) {
      categories.defensive.props.push(prop);
    }
  });

  // Filter out empty categories and return in order
  return Object.entries(categories)
    .filter(([_, data]) => data.props.length > 0)
    .map(([key, data]) => ({
      id: key,
      ...data,
    }));
};

// Group props by player within a category
const groupPropsByPlayer = (props: PlayerProp[]) => {
  const grouped = new Map<string, PlayerProp[]>();
  
  props.forEach(prop => {
    if (!grouped.has(prop.player)) {
      grouped.set(prop.player, []);
    }
    grouped.get(prop.player)!.push(prop);
  });
  
  // Sort players by name
  return Array.from(grouped.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([player, props]) => ({ player, props }));
};

const PlayerPropsDisplay = ({ props, gameId, onSelectProp }: PlayerPropsDisplayProps) => {
  const categorizedProps = categorizeProps(props);
  const [activeCategory, setActiveCategory] = useState<string>('');

  // Initialize with first category when props change
  React.useEffect(() => {
    if (categorizedProps.length > 0 && !activeCategory) {
      setActiveCategory(categorizedProps[0].id);
    }
  }, [categorizedProps.length]);

  if (categorizedProps.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No player props available for this game
      </div>
    );
  }

  const selectCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  const visibleProps = categorizedProps
    .find(category => category.id === activeCategory)?.props || [];

  return (
    <div className="space-y-2">
      {/* Horizontal Category Buttons - Single Select */}
      <div className="flex flex-wrap gap-1 pb-1.5 border-b border-border/50">
        {categorizedProps.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => selectCategory(category.id)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                transition-all duration-200
                ${isActive 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              <span>{category.label}</span>
              <span className={`
                px-1.5 py-0.5 rounded-full text-[10px] font-semibold
                ${isActive ? 'bg-primary-foreground/20' : 'bg-background/50'}
              `}>
                {category.props.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Props Display - Grouped by Player */}
      <div className="space-y-3">
        {visibleProps.length > 0 ? (
          groupPropsByPlayer(visibleProps).map(({ player, props }) => (
            <PlayerPropsGroup
              key={player}
              player={player}
              props={props}
              gameId={gameId}
              onSelectProp={onSelectProp}
            />
          ))
        ) : (
          <div className="text-center py-4 text-xs md:text-sm text-muted-foreground">
            No props in this category
          </div>
        )}
      </div>
    </div>
  );
};

interface PlayerPropsGroupProps {
  player: string;
  props: PlayerProp[];
  gameId: number;
  onSelectProp: (gameId: number, propId: number, isOver: boolean) => void;
}

const PlayerPropsGroup = ({ player, props, gameId, onSelectProp }: PlayerPropsGroupProps) => {
  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      {/* Player Header */}
      <div className="bg-muted/30 px-3 py-2 border-b border-border/50">
        <span className="font-semibold text-xs md:text-sm">{player}</span>
        <span className="text-xs text-muted-foreground ml-2">
          {props.length} {props.length === 1 ? 'prop' : 'props'}
        </span>
      </div>
      
      {/* Props List - Compact */}
      <div className="divide-y divide-border/30">
        {props.map(prop => (
          <CompactPropRow
            key={prop.id}
            prop={prop}
            gameId={gameId}
            onSelectProp={onSelectProp}
          />
        ))}
      </div>
    </div>
  );
};

interface CompactPropRowProps {
  prop: PlayerProp;
  gameId: number;
  onSelectProp: (gameId: number, propId: number, isOver: boolean) => void;
}

const CompactPropRow = ({ prop, gameId, onSelectProp }: CompactPropRowProps) => {
  const [showBookmakers, setShowBookmakers] = useState(false);
  const hasMultipleBookmakers = prop.allBookmakerOdds && prop.allBookmakerOdds.length > 1;
  
  return (
    <div className="group hover:bg-accent/20 transition-colors">
      <div className="flex items-center justify-between gap-2 px-3 py-3">
        {/* Stat & Line - No Player Name */}
        <div className="flex items-center gap-2 flex-1 min-w-0 py-0.5">
          <span className="text-xs md:text-sm font-medium truncate">
            {formatStatName(prop.stat)}
          </span>
          <span className="text-xs md:text-sm font-bold text-primary">{prop.line}</span>
          
          {/* Bookmaker indicator */}
          {hasMultipleBookmakers && (
            <button
              onClick={() => setShowBookmakers(!showBookmakers)}
              className="text-[9px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronDown className={`h-3 w-3 transition-transform ${showBookmakers ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        {/* Over/Under or Yes Buttons - Compact */}
        <div className="flex gap-1">
          {prop.propType === 'yes_no' ? (
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-16 flex-col gap-0.5 p-1 hover:bg-primary/10 hover:border-primary hover:text-primary"
              onClick={() => onSelectProp(gameId, prop.id, true)}
            >
              <span className="text-[8px] uppercase text-muted-foreground">Yes</span>
              <span className="text-xs font-bold">{formatOdds(prop.overOdds)}</span>
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-9 w-14 flex-col gap-0.5 p-1 hover:bg-green-500/10 hover:border-green-500 hover:text-green-600 dark:hover:text-green-400"
                onClick={() => onSelectProp(gameId, prop.id, true)}
              >
                <span className="text-[8px] uppercase text-muted-foreground">O</span>
                <span className="text-xs font-bold">{formatOdds(prop.overOdds)}</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="h-9 w-14 flex-col gap-0.5 p-1 hover:bg-red-500/10 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400"
                onClick={() => onSelectProp(gameId, prop.id, false)}
              >
                <span className="text-[8px] uppercase text-muted-foreground">U</span>
                <span className="text-xs font-bold">{formatOdds(prop.underOdds)}</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Bookmaker Comparison Dropdown */}
      {showBookmakers && hasMultipleBookmakers && (
        <div className="px-3 pb-2 pt-1 bg-muted/10">
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Header Row */}
            <div className="grid grid-cols-[1fr,80px,80px] gap-2 px-2 py-1 text-[10px] uppercase font-semibold text-muted-foreground border-b border-border/50">
              <span>Bookmaker</span>
              <span className="text-center">Over</span>
              <span className="text-center">Under</span>
            </div>
            
            {/* Bookmaker Rows */}
            <div className="space-y-0.5 mt-1">
              {prop.allBookmakerOdds?.map((bm, idx) => (
                <div 
                  key={idx}
                  className="grid grid-cols-[1fr,80px,80px] gap-2 px-2 py-1 rounded-md hover:bg-accent/30 transition-colors"
                  style={{ backgroundColor: idx % 2 === 0 ? 'transparent' : 'hsl(var(--muted) / 0.3)' }}
                >
                  <span className="text-xs font-medium truncate">{bm.bookmaker}</span>
                  <span className="text-xs font-bold text-center text-green-600 dark:text-green-400">
                    {formatOdds(bm.overOdds)}
                  </span>
                  {bm.underOdds ? (
                    <span className="text-xs font-bold text-center text-red-600 dark:text-red-400">
                      {formatOdds(bm.underOdds)}
                    </span>
                  ) : (
                    <span className="text-xs text-center text-muted-foreground">-</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerPropsDisplay;
