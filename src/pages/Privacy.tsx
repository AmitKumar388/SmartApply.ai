import React, { useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Lock, Eye, EyeOff, Shield, Database } from 'lucide-react';

export const Privacy = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    autoSave: true,
    shareData: false,
    profileVisibility: 'private',
    dataRetention: '1year',
  });

  const handleUpdatePassword = () => {
    toast({
      title: "Password updated",
      description: "Your password has been successfully changed.",
    });
  };

  const handleSavePrivacySettings = () => {
    toast({
      title: "Privacy settings saved",
      description: "Your privacy preferences have been updated.",
    });
  };

  return (
    <div>
      <DashboardHeader 
        title="Privacy & Security" 
        subtitle="Manage your privacy settings and account security"
      />
      
      <div className="p-8 space-y-8">
        <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm max-w-2xl">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Lock className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Password & Security</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input 
                      id="currentPassword" 
                      type={showPassword ? "text" : "password"}
                      className="bg-secondary/50 border-border/50 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
              </div>
              <Button onClick={handleUpdatePassword} className="bg-gradient-primary text-primary-foreground">
                Update Password
              </Button>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm max-w-2xl">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Privacy Preferences</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Auto-save documents</Label>
                  <p className="text-xs text-muted-foreground">Automatically save your work as you type</p>
                </div>
                <Switch 
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSave: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-foreground">Share usage data</Label>
                  <p className="text-xs text-muted-foreground">Help improve our service with anonymous usage analytics</p>
                </div>
                <Switch 
                  checked={settings.shareData}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, shareData: checked }))}
                />
              </div>
              
              <Button onClick={handleSavePrivacySettings} className="bg-gradient-primary text-primary-foreground">
                Save Privacy Settings
              </Button>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm max-w-2xl">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Database className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Data Management</h3>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border border-border/50 rounded-lg">
                <h4 className="text-sm font-medium text-foreground mb-2">Data Retention</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Your data is automatically deleted after the selected period of inactivity
                </p>
                <select className="w-full p-2 bg-secondary/50 border border-border/50 rounded text-foreground text-sm">
                  <option value="6months">6 months</option>
                  <option value="1year" selected>1 year</option>
                  <option value="2years">2 years</option>
                  <option value="never">Never delete</option>
                </select>
              </div>
              
              <div className="p-4 border border-border/50 rounded-lg">
                <h4 className="text-sm font-medium text-foreground mb-2">Profile Visibility</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Control who can see your profile information
                </p>
                <select className="w-full p-2 bg-secondary/50 border border-border/50 rounded text-foreground text-sm">
                  <option value="private" selected>Private (only you)</option>
                  <option value="team">Team members only</option>
                  <option value="public">Public</option>
                </select>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;