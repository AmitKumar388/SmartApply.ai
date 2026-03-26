import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '../components/DashboardHeader';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import { profileApi } from '../lib/api';
import { User, Camera, Loader2 } from 'lucide-react';

interface ProfileData {
  full_name?: string;
  phone?: string;
  location?: string;
  professional_title?: string;
  company?: string;
  bio?: string;
  avatar_url?: string;
}

export const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({});

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const data = await profileApi.get();
      if (data) {
        setProfileData({
          full_name: data.fullName,
          phone: data.phone,
          location: data.location,
          professional_title: data.professionalTitle,
          company: data.company,
          bio: data.bio,
          avatar_url: data.avatarUrl,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const data = await profileApi.uploadAvatar(file);
      setProfileData(prev => ({ ...prev, avatar_url: data.avatarUrl }));

      toast({
        title: "Success",
        description: "Profile picture uploaded successfully.",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      await profileApi.update({
        fullName: profileData.full_name,
        phone: profileData.phone,
        location: profileData.location,
        professionalTitle: profileData.professional_title,
        company: profileData.company,
        bio: profileData.bio,
        avatarUrl: profileData.avatar_url,
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Save failed",
        description: "Failed to save profile changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader 
        title="Profile" 
        subtitle="Manage your personal information and preferences"
      />
      
      <div className="p-4 lg:p-8">
        <Card className="bg-gradient-card border-border/50 shadow-glow backdrop-blur-sm max-w-2xl">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Profile Information</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profileData.avatar_url} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                    {profileData.full_name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <label htmlFor="avatar-upload">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2" disabled={isUploading} asChild>
                      <span>
                        {isUploading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Camera className="w-4 h-4" />
                        )}
                        <span>{isUploading ? 'Uploading...' : 'Change Photo'}</span>
                      </span>
                    </Button>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    value={profileData.full_name || ''} 
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user?.email || ''} 
                    className="bg-secondary/50 border-border/50"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+1 (555) 123-4567"
                    value={profileData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    placeholder="San Francisco, CA"
                    value={profileData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input 
                    id="title" 
                    placeholder="Software Engineer"
                    value={profileData.professional_title || ''}
                    onChange={(e) => handleInputChange('professional_title', e.target.value)}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input 
                    id="company" 
                    placeholder="Current Company"
                    value={profileData.company || ''}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    className="bg-secondary/50 border-border/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell us about yourself..."
                  value={profileData.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="bg-secondary/50 border-border/50"
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={handleSaveProfile} 
                disabled={isSaving}
                className="bg-gradient-primary text-primary-foreground"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;