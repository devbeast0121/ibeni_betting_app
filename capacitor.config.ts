
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f49cb9fbffa74e91a13959de898a8439',
  appName: 'ibeni',
  webDir: 'dist',
  server: {
    url: 'https://f49cb9fb-ffa7-4e91-a139-59de898a8439.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'always',
    backgroundColor: '#ffffff',
    preferredStatusBarStyle: 'dark',
    webViewConfiguration: {
      allowsBackForwardNavigationGestures: true
    }
  },
  android: {
    backgroundColor: '#ffffff'
  }
};

export default config;
