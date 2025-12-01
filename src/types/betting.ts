
export interface Game {
  id: number;
  time: string;
  teams: string[];
  odds: string[];
  type: string;
  spreads?: { points: string; odds: string }[];
  totals?: { line: string; overOdds: string; underOdds: string };
  playerProps?: PlayerProp[];
}

export interface BookmakerOdds {
  bookmaker: string;
  overOdds: string;
  underOdds: string;
}

export interface PlayerProp {
  id: number;
  player: string;
  stat: string;
  line: number;
  overOdds: string; // Best odds (or single odds for yes/no props)
  underOdds: string; // Best odds (empty for yes/no props)
  allBookmakerOdds?: BookmakerOdds[]; // All available bookmakers
  propType?: 'over_under' | 'yes_no'; // Type of prop
}

export interface BetSlipItem {
  id: number;
  team?: string;
  odds: string;
  gameInfo: string;
  type: 'moneyline' | 'player_prop' | 'spread' | 'total';
  propInfo?: {
    player: string;
    stat: string;
    line: number;
    isOver: boolean;
  };
  spreadInfo?: {
    team: string;
    points: string;
  };
  totalInfo?: {
    line: string;
    isOver: boolean;
  };
}

// Import and re-export from balance.ts to maintain backward compatibility
import { PredictionSelection, PredictionData } from './balance';
export type { PredictionSelection, PredictionData };
