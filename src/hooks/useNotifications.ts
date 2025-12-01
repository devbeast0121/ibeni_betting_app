import { useState, useEffect } from 'react';

export interface Notification {
  id: number;
  title: string;
  description: string;
  read: boolean;
  timestamp: string;
  type: 'bet_win' | 'bet_loss' | 'portfolio_allocation' | 'general';
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const addBetWinNotification = (amount: number, betType: string, winnings: number) => {
    addNotification({
      title: '🎉 Prediction Won!',
      description: `Your ${betType} prediction of $${amount} won $${winnings.toFixed(2)}!`,
      type: 'bet_win'
    });
  };

  const addBetLossNotification = (amount: number, betType: string, portfolioAmount: number) => {
    if (betType === 'growth_cash') {
      addNotification({
        title: '📊 Prediction Lost - Portfolio Updated',
        description: `Your prediction lost, but $${portfolioAmount.toFixed(2)} (90%) was added to your simulated portfolio.`,
        type: 'portfolio_allocation'
      });
    } else {
      addNotification({
        title: '😔 Prediction Lost',
        description: `Your ${betType} prediction of $${amount} didn't win this time.`,
        type: 'bet_loss'
      });
    }
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    addBetWinNotification,
    addBetLossNotification
  };
};