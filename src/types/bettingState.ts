
import { BetSlipItem, Game } from '@/types/betting';
import { BetType } from '@/types/balance';

export interface UseBettingStateReturn {
  betAmount: string;
  setBetAmount: (amount: string) => void;
  betSlip: BetSlipItem[];
  games: Game[];
  isLoading: boolean;
  lastRefreshed: Date | null;
  selectedSports: string[];
  setSelectedSports: (sports: string[]) => void;
  handleAddToBetSlip: (gameId: number, teamIndex: number) => void;
  handleAddPropToBetSlip: (gameId: number, propId: number, isOver: boolean) => void;
  handleAddSpreadToBetSlip: (gameId: number, teamIndex: number) => void;
  handleAddTotalToBetSlip: (gameId: number, isOver: boolean) => void;
  handleRemoveFromBetSlip: (id: number) => void;
  calculatePotentialWinnings: () => string;
  fetchLiveGamesData: () => Promise<void>;
  resetBetSlip: () => void;
  submitPrediction: () => void;
  MAX_WIN_AMOUNT: number;
  betType: BetType;
  setBetType: (type: BetType) => void;
  availableBalance: number;
}
