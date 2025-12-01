import { useSwipeable } from 'react-swipeable';
import { useHapticFeedback } from '@/hooks/use-mobile-features';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useIsNativeApp } from '@/hooks/use-mobile-app';

interface MobileEnhancedBetSlipProps {
  children: React.ReactNode;
  onRemove?: () => void;
  onSwipeAction?: () => void;
}

export function MobileEnhancedBetSlip({ children, onRemove, onSwipeAction }: MobileEnhancedBetSlipProps) {
  const { warning } = useHapticFeedback();
  const isNative = useIsNativeApp();

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (onSwipeAction) {
        warning();
        onSwipeAction();
      }
    },
    onSwipedRight: () => {
      if (onRemove) {
        warning();
        onRemove();
      }
    },
    trackMouse: !isNative, // Only track mouse on web
    preventScrollOnSwipe: true,
  });

  return (
    <div {...handlers} className="relative">
      <Card className="p-4 border-l-4 border-l-primary transition-transform duration-200 active:scale-[0.98]">
        {onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              warning();
              onRemove();
            }}
            className="absolute top-2 right-2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        {children}
      </Card>
      
      {isNative && (
        <div className="text-xs text-muted-foreground mt-1 text-center">
          Swipe left for options, right to remove
        </div>
      )}
    </div>
  );
}