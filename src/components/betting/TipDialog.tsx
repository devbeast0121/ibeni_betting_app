import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign } from 'lucide-react';

interface TipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (amount: number) => void;
  posterName: string;
  loading?: boolean;
}

export const TipDialog = ({ open, onOpenChange, onConfirm, posterName, loading }: TipDialogProps) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    const tipAmount = parseFloat(amount);
    
    if (isNaN(tipAmount) || tipAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (tipAmount < 0.5) {
      setError('Minimum tip is $0.50');
      return;
    }

    if (tipAmount > 100) {
      setError('Maximum tip is $100');
      return;
    }

    setError('');
    onConfirm(tipAmount);
    setAmount('');
  };

  const quickTips = [1, 5, 10, 25];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tip {posterName}</DialogTitle>
          <DialogDescription>
            Show appreciation with Growth Cash. Tips convert to bonus bets after 48 hours.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Tip Amount (Growth Cash)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                className="pl-8"
                min="0.5"
                max="100"
                step="0.5"
              />
            </div>
            {error && <p className="text-xs md:text-sm text-destructive">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label>Quick Amounts</Label>
            <div className="grid grid-cols-4 gap-2">
              {quickTips.map((tip) => (
                <Button
                  key={tip}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setAmount(tip.toString());
                    setError('');
                  }}
                >
                  ${tip}
                </Button>
              ))}
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-xs md:text-sm">
            <p className="text-muted-foreground">
              💡 <strong>How it works:</strong> Your tip will be held for 48 hours, then converted to bonus bets for {posterName}.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={loading || !amount}>
            {loading ? 'Processing...' : 'Send Tip'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};