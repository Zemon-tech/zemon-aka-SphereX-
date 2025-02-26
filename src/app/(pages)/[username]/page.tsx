"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Github, Linkedin, Mail, MapPin, BookOpen, Wrench, Archive } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { API_BASE_URL } from "@/lib/api";

interface UserProfile {
  _id: string;
  id?: string;
  name: string;
  displayName?: string;
  email: string;
  avatar: string;
  college?: string;
  course?: string;
  github?: string;
  linkedin?: string;
  personalWebsite?: string;
  bio?: string;
  company?: string;
  role?: string;
  education?: {
    university?: string;
    graduationYear?: number;
  };
  createdAt: string;
}

interface UserStats {
  totalRepos: number;
  totalTools: number;
  totalContributions: number;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const params = useParams();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalRepos: 0,
    totalTools: 0,
    totalContributions: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!params.username || Array.isArray(params.username)) {
          throw new Error('Invalid username');
        }

        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Try to get the profile directly first
        const response = await fetch(`${API_BASE_URL}/api/auth/users/${params.username}`, {
          headers,
          cache: 'no-store'
        });

        let profileData = null;
        let correctUsername = '';

        // If not found, try with lowercase
        if (response.status === 404) {
          const lowercaseResponse = await fetch(`${API_BASE_URL}/api/auth/users/${params.username.toLowerCase()}`, {
            headers,
            cache: 'no-store'
          });

          // If still not found with lowercase, user doesn't exist
          if (lowercaseResponse.status === 404) {
            throw new Error('User not found');
          }

          if (!lowercaseResponse.ok) {
            throw new Error('Failed to fetch user profile');
          }

          const data = await lowercaseResponse.json();
          if (data.success) {
            profileData = data.data;
            correctUsername = data.data.displayName || data.data.name;
            setProfile(profileData);
          } else {
            throw new Error(data.message || 'Failed to fetch user profile');
          }
        } else if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        } else {
          const data = await response.json();
          if (data.success) {
            profileData = data.data;
            correctUsername = data.data.displayName || data.data.name;
            setProfile(profileData);
          } else {
            throw new Error(data.message || 'Failed to fetch user profile');
          }
        }

        // Store the correct username for future use
        if (correctUsername) {
          localStorage.setItem(`username_case_${params.username.toLowerCase()}`, correctUsername);
        }

        return { profileData, correctUsername };
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load user profile",
          variant: "destructive",
        });
        setProfile(null);
        return null;
      }
    };

    const fetchUserStats = async (username: string) => {
      try {
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        // Fetch repos count
        const reposResponse = await fetch(`${API_BASE_URL}/api/repos/user/${username}`, {
          headers,
          cache: 'no-store'
        });

        if (!reposResponse.ok) {
          if (reposResponse.status === 404) {
            throw new Error('User not found');
          }
          throw new Error('Failed to fetch repositories');
        }

        const reposData = await reposResponse.json();

        // Fetch tools count
        const toolsResponse = await fetch(`${API_BASE_URL}/api/store/user/${username}`, {
          headers,
          cache: 'no-store'
        });

        if (!toolsResponse.ok) {
          if (toolsResponse.status === 404) {
            throw new Error('User not found');
          }
          throw new Error('Failed to fetch tools');
        }

        const toolsData = await toolsResponse.json();
        
        setStats({
          totalRepos: reposData.success ? reposData.data.repos.length : 0,
          totalTools: toolsData.success ? toolsData.data.tools.length : 0,
          totalContributions: (reposData.success ? reposData.data.repos.length : 0) + 
                            (toolsData.success ? toolsData.data.tools.length : 0)
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load user stats",
          variant: "destructive",
        });
        setStats({
          totalRepos: 0,
          totalTools: 0,
          totalContributions: 0
        });
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!params.username || Array.isArray(params.username)) {
          throw new Error('Invalid username');
        }

        // First fetch profile to get correct username
        const profileResult = await fetchUserProfile();
        
        if (profileResult && profileResult.correctUsername) {
          // Use the correct username for stats
          await fetchUserStats(profileResult.correctUsername);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.username) {
      fetchData();
    }
  }, [params.username, toast]);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="max-w-4xl mx-auto py-8">
          <div className="animate-pulse space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 rounded-full bg-muted" />
              <div className="space-y-4 flex-1">
                <div className="h-8 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-24 bg-muted rounded" />
              <div className="h-24 bg-muted rounded" />
              <div className="h-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!profile) {
    return (
      <PageContainer>
        <div className="max-w-4xl mx-auto py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">User not found</h1>
          <p className="text-muted-foreground">The user you're looking for doesn't exist.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        {/* Profile Header */}
        <div className="flex items-start gap-6 flex-col sm:flex-row">
          <Avatar className="w-32 h-32">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className="text-2xl">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
            <p className="text-xl text-muted-foreground mb-4">@{profile.displayName || profile.name}</p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              {profile.education?.university && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.education.university}</span>
                </div>
              )}
              {profile.education?.graduationYear && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  <span>Class of {profile.education.graduationYear}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {profile.github && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  asChild
                >
                  <a 
                    href={profile.github.startsWith('http') ? profile.github : `https://github.com/${profile.github}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </Button>
              )}
              {profile.linkedin && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  asChild
                >
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                asChild
              >
                <a href={`mailto:${profile.email}`}>
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="bg-card border rounded-lg p-6">
            <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Archive className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Repositories</h3>
            </div>
            <p className="text-2xl font-bold">{stats.totalRepos}</p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Wrench className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Tools</h3>
            </div>
            <p className="text-2xl font-bold">{stats.totalTools}</p>
          </div>

          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Archive className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Total Contributions</h3>
            </div>
            <p className="text-2xl font-bold">{stats.totalContributions}</p>
          </div>
        </div>

        {/* Member Since */}
        <div className="text-sm text-muted-foreground">
          Member since {new Date(profile.createdAt).toLocaleDateString()}
        </div>
      </div>
    </PageContainer>
  );
} 