import React, { useState } from 'react';
import { DashboardHeader } from '../components/DashboardHeader';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import { User, Bell, Lock, Palette, Download, Trash2, Eye, EyeOff } from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    darkMode: false,
    autoSave: true,
    shareData: false,
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleSavePreferences = () => {
    toast({
      title: "Preferences saved",
      description: "Your preferences have been updated.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account deletion requested",
      description: "Please check your email for confirmation.",
      variant: "destructive",
    });
  };

  return (
    <div>
      <DashboardHeader 
        title="Settings" 
        subtitle="Manage your account settings and preferences"
      />
      
      <div className="p-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                        {user?.user_metadata?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">Change Photo</Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input 
                        id="fullName" 
                        defaultValue={user?.user_metadata?.full_name || ''} 
                        className="bg-secondary/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        defaultValue={user?.email || ''} 
                        className="bg-secondary/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+1 (555) 123-4567"
                        className="bg-secondary/50 border-border/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        placeholder="San Francisco, CA"
                        className="bg-secondary/50 border-border/50"
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleSaveProfile} className="bg-gradient-primary text-primary-foreground">
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Bell className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch 
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Push Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive browser push notifications</p>
                    </div>
                    <Switch 
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Weekly Reports</Label>
                      <p className="text-xs text-muted-foreground">Get weekly summaries of your activity</p>
                    </div>
                    <Switch 
                      checked={settings.weeklyReports}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, weeklyReports: checked }))}
                    />
                  </div>
                  
                  <Button onClick={handleSavePreferences} className="bg-gradient-primary text-primary-foreground">
                    Save Preferences
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Lock className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Privacy & Security</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium text-foreground">Auto-save documents</Label>
                        <p className="text-xs text-muted-foreground">Automatically save your work</p>
                      </div>
                      <Switch 
                        checked={settings.autoSave}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSave: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium text-foreground">Share usage data</Label>
                        <p className="text-xs text-muted-foreground">Help improve our service</p>
                      </div>
                      <Switch 
                        checked={settings.shareData}
                        onCheckedChange={(checked) => setSettings(prev => ({ ...prev, shareData: checked }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-foreground">Change Password</h4>
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
                    <Button className="bg-gradient-primary text-primary-foreground">
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <User className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Account Management</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Account Status</Label>
                      <p className="text-xs text-muted-foreground">Your account is active</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                      Active
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Download className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Export your data</span>
                    </div>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Download Account Data
                    </Button>
                  </div>
                  
                  <div className="border-t border-border/50 pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 text-destructive">
                        <Trash2 className="w-4 h-4" />
                        <span className="text-sm font-medium">Danger Zone</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                        className="w-full justify-start"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;