import React, { useState } from 'react';
import { DashboardHeader } from '../components/DashboardHeader';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { useToast } from '../hooks/use-toast';
import { Bell, Mail, Smartphone, Calendar } from 'lucide-react';

export const NotificationSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    applicationReminders: true,
    interviewAlerts: true,
    marketingEmails: false,
  });

  const handleSavePreferences = () => {
    toast({
      title: "Preferences saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <div>
      <DashboardHeader 
        title="Notification Settings" 
        subtitle="Control how and when you receive notifications"
      />
      
      <div className="p-8">
        <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm max-w-2xl">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Notifications
                </h4>
                
                <div className="space-y-4 ml-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">General Email Notifications</Label>
                      <p className="text-xs text-muted-foreground">Receive important updates via email</p>
                    </div>
                    <Switch 
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Application Reminders</Label>
                      <p className="text-xs text-muted-foreground">Follow-up reminders for your applications</p>
                    </div>
                    <Switch 
                      checked={settings.applicationReminders}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, applicationReminders: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Interview Alerts</Label>
                      <p className="text-xs text-muted-foreground">Notifications about upcoming interviews</p>
                    </div>
                    <Switch 
                      checked={settings.interviewAlerts}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, interviewAlerts: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Push Notifications
                </h4>
                
                <div className="space-y-4 ml-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Browser Push Notifications</Label>
                      <p className="text-xs text-muted-foreground">Real-time notifications in your browser</p>
                    </div>
                    <Switch 
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Reports & Summaries
                </h4>
                
                <div className="space-y-4 ml-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Weekly Reports</Label>
                      <p className="text-xs text-muted-foreground">Weekly summaries of your job search activity</p>
                    </div>
                    <Switch 
                      checked={settings.weeklyReports}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, weeklyReports: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium text-foreground">Marketing Emails</Label>
                      <p className="text-xs text-muted-foreground">Product updates and career tips</p>
                    </div>
                    <Switch 
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, marketingEmails: checked }))}
                    />
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSavePreferences} className="bg-gradient-primary text-primary-foreground">
                Save Preferences
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NotificationSettings;