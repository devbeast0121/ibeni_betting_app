
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import SubscriptionBadge from './SubscriptionBadge';

interface LogoProps {
  userSubscription: {
    status: 'free' | 'monthly' | 'yearly';
  };
}

const Logo = ({ userSubscription }: LogoProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-accent" />
        <Link to="/" className="font-bold text-xl hover:text-accent transition-colors">
          ibeni
        </Link>
        <SubscriptionBadge 
          status={userSubscription.status} 
        />
      </div>
    </div>
  );
};

export default Logo;
