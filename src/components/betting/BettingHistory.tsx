import React from 'react';
import { useBettingHistory } from '@/hooks/useBettingHistory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';
import { format } from 'date-fns';

const BettingHistory = () => {
  const { bettingHistory, stats, isLoading } = useBettingHistory();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-8 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getBetTypeLabel = (betType: string) => {
    switch (betType) {
      case 'fun_tokens': return 'Fun Tokens';
      case 'growth_cash': return 'Growth Cash';
      case 'bonus_bet': return 'Bonus Bet';
      default: return betType;
    }
  };

  const getBetTypeVariant = (betType: string) => {
    switch (betType) {
      case 'fun_tokens': return 'secondary';
      case 'growth_cash': return 'default';
      case 'bonus_bet': return 'outline';
      default: return 'default';
    }
  };

  const getResultVariant = (result: string) => {
    switch (result) {
      case 'win': return 'default';
      case 'loss': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const getResultDisplay = (result: string) => {
    switch (result) {
      case 'win': return 'WON';
      case 'loss': return 'LOST';
      case 'pending': return 'PENDING';
      default: return result.toUpperCase();
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bets</p>
                <p className="text-2xl font-bold">{stats.totalBets}</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</p>
                {stats.totalPending > 0 && (
                  <p className="text-xs text-muted-foreground">{stats.totalPending} pending</p>
                )}
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Winnings</p>
                <p className="text-2xl font-bold">${stats.totalWinnings.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net P&L</p>
                <p className={`text-2xl font-bold ${stats.totalWinnings - stats.totalSpent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${(stats.totalWinnings - stats.totalSpent).toFixed(2)}
                </p>
              </div>
              {stats.totalWinnings - stats.totalSpent >= 0 ? (
                <TrendingUp className="h-8 w-8 text-green-500" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Betting History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Betting History</CardTitle>
          <CardDescription>
            Your complete betting history with results and winnings
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bettingHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No betting history yet. Place your first bet to see it here!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Selections</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Winnings</TableHead>
                  <TableHead>P&L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bettingHistory.map((bet) => (
                  <TableRow key={bet.id}>
                    <TableCell>
                      {format(new Date(bet.created_at), 'MMM d, yyyy HH:mm')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBetTypeVariant(bet.bet_type) as any}>
                        {getBetTypeLabel(bet.bet_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>${bet.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        {bet.selections.map((selection: any, index: number) => (
                          <div key={index} className="text-sm">
                            <span className="font-medium">{selection.selection}</span>
                            <span className="text-muted-foreground"> ({selection.odds})</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getResultVariant(bet.result) as any}>
                        {getResultDisplay(bet.result)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {bet.result === 'win' ? `$${bet.winnings.toFixed(2)}` : 
                       bet.result === 'pending' ? 'TBD' : '-'}
                    </TableCell>
                    <TableCell>
                      {bet.result === 'pending' ? (
                        <span className="text-yellow-500">Pending</span>
                      ) : (
                        <span className={bet.result === 'win' ? 'text-green-500' : 'text-red-500'}>
                          {bet.result === 'win' 
                            ? `+$${(bet.winnings - bet.amount).toFixed(2)}`
                            : `-$${bet.amount.toFixed(2)}`
                          }
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BettingHistory;