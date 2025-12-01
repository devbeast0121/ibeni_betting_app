
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserHeader from './account/UserHeader';
import ProfileTab from './account/ProfileTab';
import PaymentTab from './account/PaymentTab';
import NotificationsTab from './account/NotificationsTab';
import SettingsTab from './account/SettingsTab';
import AboutUsTab from './account/AboutUsTab';

const AccountSection = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <UserHeader />
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountSection;
