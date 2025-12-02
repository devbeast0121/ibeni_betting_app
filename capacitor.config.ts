import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ibeni.app',
  appName: 'ibeni',
  webDir: 'dist',
  server: {
    url: 'http://192.168.143.121:8080',
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