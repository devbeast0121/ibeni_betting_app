import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './capacitor.css'
import { Capacitor } from '@capacitor/core'
import { StatusBar, Style } from '@capacitor/status-bar'

// Fix for mobile vh issues
const setVhProperty = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Detect if running as native app
const isNative = Capacitor.isNativePlatform();

if (isNative) {
    // Configure StatusBar
    StatusBar.setStyle({ style: Style.Dark }).catch(() => { });
    StatusBar.setBackgroundColor({ color: '#1e3a8a' }).catch(() => { });
    StatusBar.setOverlaysWebView({ overlay: false }).catch(() => { });

    // Add capacitor class to body
    document.body.classList.add('capacitor');
    document.body.classList.add('native-app');
    document.body.classList.add(`platform-${Capacitor.getPlatform()}`);

    // Set initial vh
    setVhProperty();

    // Update on resize and orientation change
    window.addEventListener('resize', setVhProperty);
    window.addEventListener('orientationchange', () => {
        setTimeout(setVhProperty, 100);
    });
}

createRoot(document.getElementById("root")!).render(<App />);