import { useEffect } from 'react';
import { useStatusBar, useSplashScreen } from '@/hooks/use-mobile-features';
import { Style } from '@capacitor/status-bar';
import { useIsNativeApp } from '@/hooks/use-mobile-app';

export function MobileAppInit() {
  const { setStyle } = useStatusBar();
  const { hideSplash } = useSplashScreen();
  const isNative = useIsNativeApp();

  useEffect(() => {
    if (isNative) {
      // Set status bar style
      setStyle(Style.Default);
      
      // Hide splash screen after a short delay
      const timer = setTimeout(() => {
        hideSplash();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isNative, setStyle, hideSplash]);

  // Add native app class to body
  useEffect(() => {
    if (isNative) {
      document.body.classList.add('native-app');
    }
    
    return () => {
      document.body.classList.remove('native-app');
    };
  }, [isNative]);

  return null;
}