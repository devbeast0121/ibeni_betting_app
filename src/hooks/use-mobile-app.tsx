
import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

export function useIsNativeApp() {
  const [isNative, setIsNative] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if running in a native Capacitor environment
    setIsNative(Capacitor.isNativePlatform());
  }, []);
  
  return isNative;
}

export function useIosApp() {
  const [isIos, setIsIos] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if running on iOS
    setIsIos(Capacitor.getPlatform() === 'ios');
  }, []);
  
  return isIos;
}

export function useAndroidApp() {
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if running on Android
    setIsAndroid(Capacitor.getPlatform() === 'android');
  }, []);
  
  return isAndroid;
}

export function useMobileAppPlatform() {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'web'>('web');
  
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      setPlatform(Capacitor.getPlatform() as 'ios' | 'android');
    }
  }, []);
  
  return platform;
}

export function useSafeAreaInsets() {
  const [insets, setInsets] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  });
  
  useEffect(() => {
    // Only relevant for iOS devices
    if (Capacitor.getPlatform() === 'ios') {
      // Add listener for safe area insets changes
      document.addEventListener('ionSafeAreaInsetsChange', updateInsets);
      
      // Initial update
      updateInsets();
    }
    
    return () => {
      document.removeEventListener('ionSafeAreaInsetsChange', updateInsets);
    };
  }, []);
  
  function updateInsets() {
    // Get variables from CSS
    const style = getComputedStyle(document.documentElement);
    setInsets({
      top: parseInt(style.getPropertyValue('--ion-safe-area-top') || '0', 10),
      bottom: parseInt(style.getPropertyValue('--ion-safe-area-bottom') || '0', 10),
      left: parseInt(style.getPropertyValue('--ion-safe-area-left') || '0', 10),
      right: parseInt(style.getPropertyValue('--ion-safe-area-right') || '0', 10)
    });
  }
  
  return insets;
}
