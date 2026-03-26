import React from 'react';
import { DashboardHeader } from '../components/DashboardHeader';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { useToast } from '../hooks/use-toast';
import { Sliders, Briefcase, Target, Clock, Zap } from 'lucide-react';

export const Preferences = () => {
  const { toast } = useToast();

  const handleSavePreferences = () => {
    toast({
      title: "Preferences saved",
      description: "Your application preferences have been updated successfully.",
    });
  };

  return (
    <div>
      <DashboardHeader 
        title="Preferences" 
        subtitle="Customize your job search and interview practice experience"
      />
      
      <div className="p-4 lg:p-8">
        <div className="max-w-4xl space-y-6">
          {/* Job Search Preferences */}
          <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
            <div className="p-4 lg:p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Briefcase className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Job Search Preferences</h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="preferred-role" className="text-sm lg:text-base">Preferred Job Role</Label>
                  <Select>
                    <SelectTrigger className="bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Select your preferred role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="software-engineer">Software Engineer</SelectItem>
                      <SelectItem value="product-manager">Product Manager</SelectItem>
                      <SelectItem value="data-scientist">Data Scientist</SelectItem>
                      <SelectItem value="ui-ux-designer">UI/UX Designer</SelectItem>
                      <SelectItem value="marketing-manager">Marketing Manager</SelectItem>
                      <SelectItem value="business-analyst">Business Analyst</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience-level" className="text-sm lg:text-base">Experience Level</Label>
                  <Select>
                    <SelectTrigger className="bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior Level (6-8 years)</SelectItem>
                      <SelectItem value="lead">Lead/Principal (9+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="preferred-location" className="text-sm lg:text-base">Preferred Location</Label>
                  <Input 
                    id="preferred-location" 
                    placeholder="e.g., San Francisco, Remote, New York"
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salary-range" className="text-sm lg:text-base">Expected Salary Range</Label>
                  <Select>
                    <SelectTrigger className="bg-secondary/50 border-border/50">
                      <SelectValue placeholder="Select salary range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="40-60k">$40k - $60k</SelectItem>
                      <SelectItem value="60-80k">$60k - $80k</SelectItem>
                      <SelectItem value="80-100k">$80k - $100k</SelectItem>
                      <SelectItem value="100-150k">$100k - $150k</SelectItem>
                      <SelectItem value="150k+">$150k+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Separator className="my-4 lg:my-6" />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1 pr-4">
                    <Label className="text-sm lg:text-base">Remote Work Only</Label>
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      Only show remote job opportunities
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex-1 pr-4">
                    <Label className="text-sm lg:text-base">Include Contract Work</Label>
                    <p className="text-xs lg:text-sm text-muted-foreground">
                      Show contract and freelance opportunities
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </Card>

          {/* Interview Practice Preferences */}
          <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
            <div className="p-4 lg:p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Interview Practice Settings</h3>
              </div>
              
              <div className="space-y-4 lg:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="practice-difficulty" className="text-sm lg:text-base">Practice Difficulty</Label>
                    <Select>
                      <SelectTrigger className="bg-secondary/50 border-border/50">
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="mixed">Mixed Levels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="session-length" className="text-sm lg:text-base">Default Session Length</Label>
                    <Select>
                      <SelectTrigger className="bg-secondary/50 border-border/50">
                        <SelectValue placeholder="Select session length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex-1 pr-4">
                      <Label className="text-sm lg:text-base">Voice Recording</Label>
                      <p className="text-xs lg:text-sm text-muted-foreground">
                        Enable voice recording for practice sessions
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex-1 pr-4">
                      <Label className="text-sm lg:text-base">AI Feedback</Label>
                      <p className="text-xs lg:text-sm text-muted-foreground">
                        Get AI-powered feedback on your answers
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* AI & Optimization Preferences */}
          <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm">
            <div className="p-4 lg:p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">AI & Optimization</h3>
              </div>
              
              <div className="space-y-4 lg:space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="ai-model" className="text-sm lg:text-base">Preferred AI Model</Label>
                    <Select>
                      <SelectTrigger className="bg-secondary/50 border-border/50">
                        <SelectValue placeholder="Select AI model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini-pro">Gemini Pro (Recommended)</SelectItem>
                        <SelectItem value="gemini-ultra">Gemini Ultra (Premium)</SelectItem>
                        <SelectItem value="gemini-flash">Gemini Flash (Fast)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="optimization-focus" className="text-sm lg:text-base">Optimization Focus</Label>
                    <Select>
                      <SelectTrigger className="bg-secondary/50 border-border/50">
                        <SelectValue placeholder="Select focus area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="keywords">Keyword Optimization</SelectItem>
                        <SelectItem value="structure">Structure & Format</SelectItem>
                        <SelectItem value="content">Content Enhancement</SelectItem>
                        <SelectItem value="ats">ATS Compatibility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex-1 pr-4">
                      <Label className="text-sm lg:text-base">Industry-Specific Suggestions</Label>
                      <p className="text-xs lg:text-sm text-muted-foreground">
                        Get suggestions tailored to your industry
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end pt-6">
            <Button onClick={handleSavePreferences} className="bg-gradient-primary text-primary-foreground w-full sm:w-auto">
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preferences;