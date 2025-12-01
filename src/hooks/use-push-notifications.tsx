import { useEffect, useState } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { useIsNativeApp } from './use-mobile-app';
import { useToast } from './use-toast';

export function usePushNotifications() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const isNative = useIsNativeApp();
  const { toast } = useToast();

  useEffect(() => {
    if (isNative) {
      initializePushNotifications();
    }
  }, [isNative]);

  const initializePushNotifications = async () => {
    try {
      // Request permission
      const permission = await PushNotifications.requestPermissions();
      
      if (permission.receive === 'granted') {
        // Register for push notifications
        await PushNotifications.register();
        
        // Listen for registration
        PushNotifications.addListener('registration', (token) => {
          console.log('Push registration success, token: ' + token.value);
          setToken(token.value);
          setIsRegistered(true);
        });

        // Listen for registration errors
        PushNotifications.addListener('registrationError', (error) => {
          console.error('Push registration error: ', error);
          toast({
            title: "Push Notifications",
            description: "Failed to register for notifications",
            variant: "destructive",
          });
        });

        // Listen for push notifications
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('Push notification received: ', notification);
          toast({
            title: notification.title || "New notification",
            description: notification.body,
          });
        });

        // Listen for notification actions
        PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
          console.log('Push notification action performed: ', notification);
          // Handle notification tap
        });
      }
    } catch (error) {
      console.error('Push notification setup failed:', error);
    }
  };

  const sendTestNotification = () => {
    if (isNative && isRegistered) {
      // This would typically be done from your backend
      console.log('Test notification would be sent to token:', token);
      toast({
        title: "Test Notification",
        description: "Push notification system is working!",
      });
    }
  };

  return {
    isRegistered,
    token,
    sendTestNotification,
  };
}