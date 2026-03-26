import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useLocation, Link } from 'react-router-dom';
import { 
  FileText, 
  MessageSquare, 
  BarChart3, 
  User,
  Zap,
  ChevronUp,
  ChevronDown,
  Home
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Overview & analytics' },
  { name: 'Resume Optimizer', href: '/dashboard/resume-optimizer', icon: FileText, description: 'AI-powered resume tailoring' },
  { name: 'Interview Practice', href: '/dashboard/interview-practice', icon: MessageSquare, description: 'STAR method practice' },
  { name: 'Application Tracker', href: '/dashboard/application-tracker', icon: BarChart3, description: 'Track your applications' },
];

export const Sidebar = () => {
  const location = useLocation();
  const [proTipsVisible, setProTipsVisible] = useState(true);

  return (
    <div className="w-80 h-screen bg-background border-r border-border/50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <Link to="/dashboard" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <div className="w-6 h-6 bg-primary-foreground rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-primary rounded-sm"></div>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">SmartApply.AI</h1>
            <p className="text-sm text-muted-foreground">AI Resume Assistant</p>
          </div>
        </Link>
      </div>

      {/* Tools Section */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-sm font-medium text-foreground mb-4 tracking-wide">TOOLS</h2>
          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-start space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-glow" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 mt-0.5 flex-shrink-0",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <div>
                    <div className={cn(
                      "font-medium",
                      isActive ? "text-primary-foreground" : "text-foreground"
                    )}>
                      {item.name}
                    </div>
                    <div className={cn(
                      "text-xs mt-0.5",
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Pro Tips Section */}
      <div className="p-6 border-t border-border/50">
        <div className="bg-gradient-primary rounded-xl p-4 text-primary-foreground">
          <button 
            onClick={() => setProTipsVisible(!proTipsVisible)}
            className="flex items-center justify-between w-full mb-3 group"
          >
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span className="font-medium text-sm">Pro Tips</span>
            </div>
            {proTipsVisible ? (
              <ChevronUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
            ) : (
              <ChevronDown className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
          </button>
          {proTipsVisible && (
            <p className="text-xs leading-relaxed text-primary-foreground/90 animate-in slide-in-from-top-2 duration-200">
              Upload your resume and paste job descriptions for AI-powered optimization
            </p>
          )}
        </div>
      </div>
    </div>
  );
};