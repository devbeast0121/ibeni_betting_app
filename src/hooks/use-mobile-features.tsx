import { useEffect, useState, useCallback } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { App } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';
import { useIsNativeApp } from './use-mobile-app';

export function useHapticFeedback() {
  const isNative = useIsNativeApp();

  const impact = useCallback(async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (isNative) {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        console.log('Haptics not available:', error);
      }
    }
  }, [isNative]);

  const success = useCallback(() => impact(ImpactStyle.Light), [impact]);
  const warning = useCallback(() => impact(ImpactStyle.Medium), [impact]);
  const error = useCallback(() => impact(ImpactStyle.Heavy), [impact]);

  return { impact, success, warning, error };
}

export function useNativeShare() {
  const isNative = useIsNativeApp();

  const share = useCallback(async (options: { title?: string; text?: string; url?: string }) => {
    if (isNative) {
      try {
        await Share.share(options);
        return true;
      } catch (error) {
        console.log('Share not available:', error);
        return false;
      }
    } else {
      // Fallback to Web Share API
      if (navigator.share) {
        try {
          await navigator.share(options);
          return true;
        } catch (error) {
          console.log('Web share failed:', error);
        }
      }
      return false;
    }
  }, [isNative]);

  return { share };
}

export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const isNative = useIsNativeApp();

  useEffect(() => {
    if (isNative) {
      Device.getInfo().then(setDeviceInfo);
    }
  }, [isNative]);

  return deviceInfo;
}

export function useNetworkStatus() {
  const [status, setStatus] = useState<any>(null);
  const isNative = useIsNativeApp();

  useEffect(() => {
    if (isNative) {
      Network.getStatus().then(setStatus);
      
      Network.addListener('networkStatusChange', setStatus).then(listener => {
        return () => {
          listener.remove();
        };
      });
    }
  }, [isNative]);

  return status;
}

export function useAppState() {
  const [isActive, setIsActive] = useState(true);
  const isNative = useIsNativeApp();

  useEffect(() => {
    if (isNative) {
      App.addListener('appStateChange', ({ isActive }) => {
        setIsActive(isActive);
      }).then(listener => {
        return () => {
          listener.remove();
        };
      });
    }
  }, [isNative]);

  return { isActive };
}

export function useStatusBar() {
  const isNative = useIsNativeApp();

  const setStyle = useCallback(async (style: Style) => {
    if (isNative && Capacitor.getPlatform() === 'ios') {
      try {
        await StatusBar.setStyle({ style });
      } catch (error) {
        console.log('StatusBar not available:', error);
      }
    }
  }, [isNative]);

  const hide = useCallback(async () => {
    if (isNative) {
      try {
        await StatusBar.hide();
      } catch (error) {
        console.log('StatusBar not available:', error);
      }
    }
  }, [isNative]);

  const show = useCallback(async () => {
    if (isNative) {
      try {
        await StatusBar.show();
      } catch (error) {
        console.log('StatusBar not available:', error);
      }
    }
  }, [isNative]);

  return { setStyle, hide, show };
}

export function useSplashScreen() {
  const isNative = useIsNativeApp();

  const hideSplash = useCallback(async () => {
    if (isNative) {
      try {
        await SplashScreen.hide();
      } catch (error) {
        console.log('SplashScreen not available:', error);
      }
    }
  }, [isNative]);

  return { hideSplash };
}