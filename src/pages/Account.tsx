import React from 'react';
import { DashboardHeader } from '../components/DashboardHeader';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import { User, Download, Trash2, CreditCard, Calendar } from 'lucide-react';
import { Label } from '@radix-ui/react-label';

export const Account = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleExportData = () => {
    toast({
      title: "Data export requested",
      description: "Your data export will be ready shortly. Check your email for the download link.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion requested",
      description: "Please check your email for confirmation instructions.",
      variant: "destructive",
    });
  };

  return (
    <div>
      <DashboardHeader 
        title="Account Settings" 
        subtitle="Manage your account, billing, and data"
      />
      
      <div className="p-8 space-y-8">
        <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm max-w-2xl">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Account Information</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-foreground">Account Status</Label>
                  <p className="text-xs text-muted-foreground">Your account is active and in good standing</p>
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                  Active
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-foreground">Plan</Label>
                  <p className="text-xs text-muted-foreground">Free plan with basic features</p>
                </div>
                <Badge variant="outline">Free</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-foreground">Member Since</Label>
                  <p className="text-xs text-muted-foreground">Account creation date</p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {new Date(user?.created_at || '').toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm max-w-2xl">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Billing & Subscription</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border border-border/50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-foreground">Current Plan</h4>
                  <Badge variant="outline">Free</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-4">
                  Upgrade to Premium for unlimited resume optimizations and advanced features.
                </p>
                <Button className="bg-gradient-primary text-primary-foreground">
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm max-w-2xl">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Download className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Data Management</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Download className="w-5 h-5 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-foreground">Export your data</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Download all your resumes, applications, and generated content
                  </p>
                  <Button variant="outline" onClick={handleExportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Request Data Export
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm max-w-2xl">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Trash2 className="w-5 h-5 text-destructive" />
              <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <h4 className="text-sm font-medium text-foreground mb-2">Delete Account</h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  className="w-full justify-start"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account Permanently
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Account;