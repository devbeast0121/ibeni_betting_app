import { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useIsNativeApp } from '@/hooks/use-mobile-app';
import { useHapticFeedback } from '@/hooks/use-mobile-features';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  threshold?: number;
}

export function PullToRefresh({ onRefresh, children, threshold = 60 }: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  const startY = useRef(0);
  const isNative = useIsNativeApp();
  const { success } = useHapticFeedback();

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (window.scrollY === 0 && startY.current > 0) {
      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - startY.current);
      
      if (distance > 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance, threshold * 1.5));
        setCanRefresh(distance >= threshold);
      }
    }
  };

  const handleTouchEnd = async () => {
    if (canRefresh && !isRefreshing) {
      setIsRefreshing(true);
      success();
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
    setCanRefresh(false);
    startY.current = 0;
  };

  useEffect(() => {
    if (isNative) {
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);

      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isNative, canRefresh, isRefreshing]);

  const refreshOpacity = Math.min(pullDistance / threshold, 1);
  const iconRotation = pullDistance * 2;

  return (
    <div className="relative">
      {isNative && (
        <div 
          className="fixed top-0 left-0 right-0 flex items-center justify-center z-50 bg-background/80 backdrop-blur-sm transition-all duration-200"
          style={{
            height: `${pullDistance}px`,
            opacity: refreshOpacity,
          }}
        >
          <RefreshCw 
            className={`h-6 w-6 text-primary transition-transform duration-200 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{
              transform: `rotate(${iconRotation}deg)`,
            }}
          />
          {pullDistance > threshold * 0.8 && (
            <span className="ml-2 text-sm text-primary font-medium">
              {canRefresh ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          )}
        </div>
      )}
      
      <div style={{ paddingTop: isNative ? `${pullDistance}px` : 0 }}>
        {children}
      </div>
    </div>
  );
}