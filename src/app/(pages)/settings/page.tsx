"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Building, GraduationCap, MapPin, Link as LinkIcon, Save } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  github_username?: string;
  linkedin_url?: string;
  college?: string;
  graduation_year?: string;
  location?: string;
  bio?: string;
  website?: string;
  company?: string;
  role?: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Not authenticated');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        if (data.success) {
          setProfile(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        
        // Update local storage
        localStorage.setItem('user', JSON.stringify(data.data));
        
        // Dispatch auth state change event
        const event = new CustomEvent('auth-state-change', { detail: data.data });
        window.dispatchEvent(event);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-1/4" />
          <div className="space-y-4">
            <div className="h-32 bg-muted rounded" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Update your basic profile information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={profile?.avatar} />
                      <AvatarFallback>{profile?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline">Change Avatar</Button>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile?.name || ''}
                        onChange={e => setProfile(prev => ({ ...prev!, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile?.email || ''}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        value={profile?.role || ''}
                        onChange={e => setProfile(prev => ({ ...prev!, role: e.target.value }))}
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={profile?.company || ''}
                        onChange={e => setProfile(prev => ({ ...prev!, company: e.target.value }))}
                        placeholder="Where do you work?"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>
                    Add your educational background
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="college">College/University</Label>
                      <Input
                        id="college"
                        value={profile?.college || ''}
                        onChange={e => setProfile(prev => ({ ...prev!, college: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="graduation">Graduation Year</Label>
                      <Input
                        id="graduation"
                        value={profile?.graduation_year || ''}
                        onChange={e => setProfile(prev => ({ ...prev!, graduation_year: e.target.value }))}
                        placeholder="e.g. 2024"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                  <CardDescription>
                    Connect your social profiles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Github className="w-5 h-5" />
                      <Input
                        value={profile?.github_username || ''}
                        onChange={e => setProfile(prev => ({ ...prev!, github_username: e.target.value }))}
                        placeholder="GitHub username"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <Linkedin className="w-5 h-5" />
                      <Input
                        value={profile?.linkedin_url || ''}
                        onChange={e => setProfile(prev => ({ ...prev!, linkedin_url: e.target.value }))}
                        placeholder="LinkedIn profile URL"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <LinkIcon className="w-5 h-5" />
                      <Input
                        value={profile?.website || ''}
                        onChange={e => setProfile(prev => ({ ...prev!, website: e.target.value }))}
                        placeholder="Personal website"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving} className="gap-2">
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="account">
            {/* Account settings content */}
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your account preferences and security
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add account settings fields here */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            {/* Integrations content */}
            <Card>
              <CardHeader>
                <CardTitle>Connected Services</CardTitle>
                <CardDescription>
                  Manage your connected services and integrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Add integrations settings here */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
} 