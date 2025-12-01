
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ibeni.app',
  appName: 'ibeni',
  webDir: 'dist',
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
