
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Notification } from '@/hooks/useNotifications';

interface NotificationsPopoverProps {
  notifications: Notification[];
  onMarkAllAsRead: () => void;
}

const NotificationsPopover = ({ notifications, onMarkAllAsRead }: NotificationsPopoverProps) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[calc(100vw-2rem)] sm:w-80 p-0" align="end">
        <div className="p-3 sm:p-4 border-b">
          <h4 className="font-medium text-xs md:text-sm sm:text-base">Notifications</h4>
        </div>
        <div className="max-h-[60vh] sm:max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-xs md:text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-3 sm:p-4 border-b last:border-b-0 hover:bg-accent/50 cursor-pointer transition-colors",
                    !notification.read && "bg-accent/20"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h5 className="font-medium text-xs md:text-sm">{notification.title}</h5>
                      <p className="text-xs sm:text-xs md:text-sm text-muted-foreground mt-1 line-clamp-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.timestamp}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0 mt-1"></span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="p-2 border-t">
          <Button
            variant="ghost"
            className="w-full text-xs sm:text-xs md:text-sm justify-center"
            size="sm"
            onClick={onMarkAllAsRead}
          >
            Mark all as read
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
