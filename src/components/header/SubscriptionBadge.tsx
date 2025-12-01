
import React from 'react';
import { useNavigate } from 'react-router-dom';

type SubscriptionStatus = 'free' | 'monthly' | 'yearly';

interface SubscriptionBadgeProps {
  status: SubscriptionStatus;
}

const SubscriptionBadge = ({ status }: SubscriptionBadgeProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/subscription');
  };

  if (status === 'free') {
    return (
      <button 
        onClick={handleClick}
        className="hidden md:inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors cursor-pointer"
      >
        Free
      </button>
    );
  }
  
  if (status === 'monthly' || status === 'yearly') {
    return (
      <button 
        onClick={handleClick}
        className="hidden md:inline-flex items-center ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800 hover:bg-green-200 transition-colors cursor-pointer"
      >
        Premium
      </button>
    );
  }
  
  return null;
};

export default SubscriptionBadge;
