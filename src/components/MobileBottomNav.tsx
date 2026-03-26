import React from 'react';
import { cn } from '@/lib/utils';
import { useLocation, Link } from 'react-router-dom';
import { 
  Home,
  FileText, 
  MessageSquare, 
  BarChart3, 
  User
} from 'lucide-react';

const mobileNavigation = [
  { name: 'Home', href: '/dashboard', icon: Home },
  { name: 'Resume', href: '/dashboard/resume-optimizer', icon: FileText },
  { name: 'Interview', href: '/dashboard/interview-practice', icon: MessageSquare },
  { name: 'Tracker', href: '/dashboard/application-tracker', icon: BarChart3 },
];

export const MobileBottomNav = () => {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 z-50">
      <div className="flex items-center justify-around py-2">
        {mobileNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex flex-col items-center px-3 py-2 rounded-xl transition-all duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 mb-1",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};