import React, { useState } from 'react';
import { Bell, Settings, User, LogOut, Search, Menu } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  const { user, signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'Interview question generated', message: 'New questions for Software Engineer role', time: '2 mins ago', unread: true },
    { id: 2, title: 'Resume optimized', message: 'Your resume match score: 85%', time: '1 hour ago', unread: true },
    { id: 3, title: 'Welcome to SmartApply.AI', message: 'Complete your profile to get started', time: '2 hours ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-background border-b border-border/50 px-8 py-4 sticky top-0 z-40 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <div className="w-5 h-5 bg-primary-foreground rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-primary rounded-xs"></div>
              </div>
            </div>
            <span className="text-lg font-bold text-foreground">SmartApply.AI</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs, questions, optimizations..."
              className="pl-10 bg-secondary/50 border-border/50 text-foreground"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative">
            <Button  
              size="sm" 
              className="text-gray-300 hover:text-gray-400"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5" />
              
            </Button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border/50 rounded-lg shadow-glow z-50">
                <div className="p-4 border-b border-border/50">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`p-4 border-b border-border/30 hover:bg-secondary/30 cursor-pointer ${notification.unread ? 'bg-secondary/20' : ''}`}>
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-primary' : 'bg-muted-foreground'}`} />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-foreground">{notification.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                          <span className="text-xs text-muted-foreground mt-2 block">{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border/50">
                <Link to="/dashboard/notifications"> 
                  <Button variant="ghost" size="sm" className="w-full text-sm text-muted-foreground">
                    View all notifications
                  </Button>
                </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <Button 
              size="sm" 
              className="text-foreground hover:text-gray-400"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <User className="w-5 h-5" />
            </Button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border/50 rounded-lg shadow-glow z-50">
                <div className="p-3 border-b border-border/50">
                  <p className="text-sm font-medium text-foreground">{user?.email?.split('@')[0] || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <div className="p-2"> 
                  <Link to="/dashboard/profile-settings">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Button>
                  </Link>
                  <Link to="/dashboard/preferences">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Preferences
                  </Button>
                  </Link>
                  <div className="border-t border-border/50 my-2" />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={signOut}
                    className="w-full justify-start text-sm text-destructive hover:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {subtitle && (
        <div className="mt-4">
          <h1 className="text-3xl font-bold text-gray-300 mb-2">{title}</h1>
          <p className="text-gray-400">{subtitle}</p>
        </div>
      )}

      {/* Click outside handlers */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="fixed inset-0 z-30" 
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};