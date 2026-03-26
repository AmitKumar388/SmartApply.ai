import React from 'react';
import { Card } from '@/components/ui/card';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-primary rounded-md"></div>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">SmartApply.AI</h1>
          <p className="text-sm text-muted-foreground">AI Resume Assistant</p>
        </div>
        
        <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            {children}
          </div>
        </Card>
      </div>
    </div>
  );
};