import React, { useState } from 'react';
import { ResponsiveSidebar, HamburgerButton } from './ResponsiveSidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { Footer } from './Footer';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <ResponsiveSidebar isOpen={true} onToggle={() => {}} />
      </div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <ResponsiveSidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Mobile Header with Hamburger */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-30">
          <HamburgerButton onClick={toggleSidebar} />
          <h1 className="text-lg font-bold text-foreground">SmartApply.AI</h1>
          <div className="w-8" /> {/* Spacer for centering */}
        </div>

        {/* Page Content */}
        <div className="flex-1 pb-20 md:pb-0">
          {children}
        </div>
        
        {/* Desktop Footer */}
        <div className="hidden md:block">
          <Footer />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};