
import React from 'react';

interface TrialNotificationProps {
  trialActive: boolean;
}

const TrialNotification: React.FC<TrialNotificationProps> = ({ trialActive }) => {
  // Since there's no trial anymore, we'll always return null
  return null;
};

export default TrialNotification;
