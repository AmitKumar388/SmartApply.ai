import React, { useState } from 'react';
import { Bell, Settings, User, LogOut, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { NotificationCenter } from '@/components/NotificationCenter';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

export const DashboardHeader = ({ title, subtitle }: DashboardHeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
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
              variant="ghost" 
              size="sm" 
              className="text-foreground hover:text-primary relative"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full" />
              )}
            </Button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-foreground hover:text-primary flex items-center space-x-2"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </Button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border/50 rounded-lg shadow-glow z-50">
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-foreground">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user?.email?.split('@')[0] || 'User'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-2">
                  <div className="mb-2">
                    <p className="text-xs font-medium text-muted-foreground px-2 py-1">SETTINGS</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      navigate('/dashboard/profile-settings');
                      setShowUserMenu(false);
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      navigate('/dashboard/preferences');
                      setShowUserMenu(false);
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Preferences
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      navigate('/dashboard/settings');
                      setShowUserMenu(false);
                    }}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
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
          <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
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

      {/* Notification Center */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </header>
  );
};