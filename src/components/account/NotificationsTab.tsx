
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

const NotificationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Manage how and when you get notified</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Betting Notifications</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Bet Settlement</h4>
              <p className="text-sm text-muted-foreground">Receive notifications when your bets are settled</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Game Start Reminder</h4>
              <p className="text-sm text-muted-foreground">Get notified 15 minutes before games you bet on start</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">New Betting Opportunities</h4>
              <p className="text-sm text-muted-foreground">Receive notifications about new betting opportunities</p>
            </div>
            <Switch />
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Investment Notifications</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Portfolio Updates</h4>
              <p className="text-sm text-muted-foreground">Receive weekly updates on your investment portfolio</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Loss Reinvestment</h4>
              <p className="text-sm text-muted-foreground">Get notified when your betting losses are reinvested</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Market Insights</h4>
              <p className="text-sm text-muted-foreground">Receive market insights and investment opportunities</p>
            </div>
            <Switch />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationsTab;
