import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Bell, X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Resume Optimized',
    message: 'Your resume for Software Engineer position has been optimized with 85% match score.',
    type: 'success',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: '2',
    title: 'Interview Questions Generated',
    message: '5 new interview questions generated for Product Manager role.',
    type: 'info',
    timestamp: '1 day ago',
    read: false
  },
  {
    id: '3',
    title: 'Application Reminder',
    message: 'Follow up on your application to Google - it has been 1 week.',
    type: 'warning',
    timestamp: '3 days ago',
    read: true
  }
];

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg h-[80vh] bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm flex flex-col">
        <div className="p-6 border-b border-border/50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground flex items-center gap-3">
              <Bell className="w-6 h-6 text-primary" />
              All Notifications
            </h3>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {notifications.filter(n => !n.read).length} unread notifications
          </p>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto p-6 space-y-4">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Bell className="w-16 h-16 text-muted-foreground/50 mb-4" />
                <h4 className="text-lg font-medium text-foreground mb-2">No notifications</h4>
                <p className="text-muted-foreground">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg border cursor-pointer hover:bg-secondary/50 transition-all duration-200 ${
                    notification.read 
                      ? 'bg-secondary/20 border-border/30' 
                      : 'bg-primary/5 border-primary/20 shadow-sm'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-semibold text-foreground leading-tight">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                          {notification.timestamp}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="p-6 border-t border-border/50 flex-shrink-0">
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-sm"
              onClick={() => {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
              }}
            >
              Mark all as read
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-sm"
              onClick={() => setNotifications([])}
            >
              Clear all
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};