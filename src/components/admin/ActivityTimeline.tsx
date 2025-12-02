
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Sample activity data
const activityItems = [
  {
    id: 1,
    type: 'deposit',
    user: 'User #123',
    amount: '$250.00',
    time: '10 minutes ago',
    status: 'completed'
  },
  {
    id: 2,
    type: 'withdrawal',
    user: 'User #087',
    amount: '$120.50',
    time: '25 minutes ago',
    status: 'pending'
  },
  {
    id: 3,
    type: 'bet',
    user: 'User #231',
    amount: '$75.00',
    time: '42 minutes ago',
    status: 'completed'
  },
  {
    id: 4,
    type: 'signup',
    user: 'User #342',
    time: '1 hour ago',
    status: 'completed'
  },
  {
    id: 5,
    type: 'subscription',
    user: 'User #156',
    amount: '$149.99',
    time: '2 hours ago',
    status: 'completed'
  },
  {
    id: 6,
    type: 'deposit',
    user: 'User #098',
    amount: '$500.00',
    time: '3 hours ago',
    status: 'completed'
  },
  {
    id: 7,
    type: 'withdrawal',
    user: 'User #201',
    amount: '$350.00',
    time: '5 hours ago',
    status: 'rejected'
  }
];

// Additional activity data for expanded view
const extendedActivityItems = [
  {
    id: 8,
    type: 'bet',
    user: 'User #175',
    amount: '$125.00',
    time: '6 hours ago',
    status: 'completed'
  },
  {
    id: 9,
    type: 'signup',
    user: 'User #343',
    time: '8 hours ago',
    status: 'completed'
  },
  {
    id: 10,
    type: 'deposit',
    user: 'User #112',
    amount: '$200.00',
    time: '10 hours ago',
    status: 'completed'
  }
];

interface ActivityTimelineProps {
  expanded?: boolean;
  className?: string;
}

const ActivityTimeline = ({ expanded = false, className = '' }: ActivityTimelineProps) => {
  // Choose which activity items to display based on whether the view is expanded
  const displayItems = expanded ? [...activityItems, ...extendedActivityItems] : activityItems.slice(0, 5);
  
  // Function to get the appropriate badge color based on activity type
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'bg-green-100 text-green-800';
      case 'withdrawal':
        return 'bg-amber-100 text-amber-800';
      case 'bet':
        return 'bg-blue-100 text-blue-800';
      case 'signup':
        return 'bg-purple-100 text-purple-800';
      case 'subscription':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Function to get the appropriate status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest transactions and user actions on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {displayItems.map((item) => (
            <div key={item.id} className="flex items-start justify-between pb-4 border-b last:border-0 last:pb-0">
              <div className="flex items-start space-x-4">
                <Badge className={getBadgeColor(item.type)} variant="secondary">
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </Badge>
                <div>
                  <p className="font-medium">{item.user}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{item.time}</p>
                </div>
              </div>
              <div className="text-right">
                {item.amount && <p className="font-medium">{item.amount}</p>}
                <Badge className={getStatusBadge(item.status)} variant="secondary">
                  {item.status}
                </Badge>
              </div>
            </div>
          ))}
          
          {!expanded && (
            <div className="text-center">
              <a href="/admin?tab=activity" className="text-xs md:text-sm text-blue-600 hover:underline">
                View All Activity
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
