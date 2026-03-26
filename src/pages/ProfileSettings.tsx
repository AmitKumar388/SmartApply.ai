import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '../components/DashboardHeader';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../hooks/useAuth';
import { profileApi } from '../lib/api';
import { Settings, Bell, Shield, Eye, Trash2 } from 'lucide-react';

export const ProfileSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Settings state
  const [settings, setSettings] = useState({
    email_notifications: true,
    interview_reminders: true,
    resume_optimization_alerts: true,
    profile_visibility: false,
    data_analytics: true,
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch user settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user?.id) return;

      try {
        const data = await profileApi.get();

        if (data) {
          setSettings({
            email_notifications: data.emailNotifications ?? true,
            interview_reminders: data.interviewReminders ?? true,
            resume_optimization_alerts: data.resumeOptimizationAlerts ?? true,
            profile_visibility: data.profileVisibility ?? false,
            data_analytics: data.dataAnalytics ?? true,
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast({
          title: "Error",
          description: "Failed to load your settings.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user?.id, toast]);

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    if (!user?.id) return;

    setSaving(true);
    try {
      await profileApi.updateSettings({
        emailNotifications: settings.email_notifications,
        interviewReminders: settings.interview_reminders,
        resumeOptimizationAlerts: settings.resume_optimization_alerts,
        profileVisibility: settings.profile_visibility,
        dataAnalytics: settings.data_analytics,
      });

      toast({
        title: "Settings saved",
        description: "Your profile settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <DashboardHeader 
        title="Profile Settings" 
        subtitle="Manage your account preferences and privacy settings"
      />
      
      <div className="p-4 lg:p-8">
        <div className="max-w-4xl space-y-6">
          {/* Notification Settings */}
          <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
            <div className="p-4 lg:p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Bell className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Notification Settings</h3>
              </div>
              
              <div className="space-y-4 lg:space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex-1 pr-4">
                      <Label className="text-sm lg:text-base">Email Notifications</Label>
                      <p className="text-xs lg:text-sm text-muted-foreground">
                        Receive notifications about new features and updates
                      </p>
                    </div>
                    <Switch 
                      checked={settings.email_notifications}
                      onCheckedChange={(checked) => handleSettingChange('email_notifications', checked)}
                      disabled={loading}
                    />
                  </div>
                
                <Separator />
                
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex-1 pr-4">
                      <Label className="text-sm lg:text-base">Interview Reminders</Label>
                      <p className="text-xs lg:text-sm text-muted-foreground">
                        Get reminded about upcoming interview sessions
                      </p>
                    </div>
                    <Switch 
                      checked={settings.interview_reminders}
                      onCheckedChange={(checked) => handleSettingChange('interview_reminders', checked)}
                      disabled={loading}
                    />
                  </div>
                
                <Separator />
                
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex-1 pr-4">
                      <Label className="text-sm lg:text-base">Resume Optimization Alerts</Label>
                      <p className="text-xs lg:text-sm text-muted-foreground">
                        Notifications when optimization results are ready
                      </p>
                    </div>
                    <Switch 
                      checked={settings.resume_optimization_alerts}
                      onCheckedChange={(checked) => handleSettingChange('resume_optimization_alerts', checked)}
                      disabled={loading}
                    />
                  </div>
              </div>
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
            <div className="p-4 lg:p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Privacy & Security</h3>
              </div>
              
              <div className="space-y-4 lg:space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex-1 pr-4">
                      <Label className="text-sm lg:text-base">Profile Visibility</Label>
                      <p className="text-xs lg:text-sm text-muted-foreground">
                        Make your profile visible to recruiters
                      </p>
                    </div>
                    <Switch 
                      checked={settings.profile_visibility}
                      onCheckedChange={(checked) => handleSettingChange('profile_visibility', checked)}
                      disabled={loading}
                    />
                  </div>
                
                <Separator />
                
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex-1 pr-4">
                      <Label className="text-sm lg:text-base">Data Analytics</Label>
                      <p className="text-xs lg:text-sm text-muted-foreground">
                        Allow anonymous usage analytics to improve the service
                      </p>
                    </div>
                    <Switch 
                      checked={settings.data_analytics}
                      onCheckedChange={(checked) => handleSettingChange('data_analytics', checked)}
                      disabled={loading}
                    />
                  </div>
              </div>
            </div>
          </Card>

          {/* Account Management */}
          <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
            <div className="p-4 lg:p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Account Management</h3>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 border border-border/50 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-foreground text-sm lg:text-base">Export Data</h4>
                      <p className="text-xs lg:text-sm text-muted-foreground">
                        Download all your profile data and interview history
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">
                      Export
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-foreground text-sm lg:text-base">Delete Account</h4>
                      <p className="text-xs lg:text-sm text-muted-foreground">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <Button 
              onClick={handleSaveSettings} 
              disabled={loading || saving}
              className="bg-gradient-primary text-primary-foreground w-full sm:w-auto"
            >
              {saving ? "Saving..." : "Save All Settings"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;