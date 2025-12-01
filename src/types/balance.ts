
export interface BalanceData {
  id: string;
  available_balance: number;
  invested_balance: number;
  growth_cash: number;
  pending_withdrawal: number;
  bonus_bets: number;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export type DepositType = 'sweepstakes' | 'growth_cash';

export interface DepositData {
  amount: number;
  depositType: DepositType;
  status: string;
  created_at?: string;
  id?: string;
  payment_method?: string;
  updated_at?: string;
  user_id?: string;
  deposit_type?: string;
}

export interface WithdrawalData {
  amount: number;
  status: string;
  created_at?: string;
  id?: string;
  updated_at?: string;
  user_id?: string;
}

export type BetType = 'fun_tokens' | 'growth_cash' | 'bonus_bet';

export interface PredictionSelection {
  odds: string;
  selection: string;
  gameInfo: string;
}

export interface PredictionData {
  amount: number;
  selections: PredictionSelection[];
  betType: BetType;
}

export interface BonusBetData {
  amount: number;
  status: string;
}
