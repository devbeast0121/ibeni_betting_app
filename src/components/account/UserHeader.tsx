
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const UserHeader = () => {
  return (
    <div className="flex items-center">
      <Avatar className="h-16 w-16 mr-4">
        <AvatarFallback className="text-lg bg-navy text-white">JD</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold">John Doe</h1>
        <p className="text-muted-foreground">Member since March 2023</p>
      </div>
    </div>
  );
};

export default UserHeader;
