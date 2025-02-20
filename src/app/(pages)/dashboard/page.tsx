"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Github, Mail, Phone, Edit2, Star, GitFork, 
  GitBranch, Users, Activity, BookOpen, Link as LinkIcon,
  Calendar, Clock, Award, Check, GitCommit,
  Box, Upload, Code, BookMarked, Plus,
  ExternalLink, Eye
} from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ProfileEditForm from "@/components/dashboard/ProfileEditForm";
import GitHubStats from "@/components/dashboard/GitHubStats";
import ProjectsList from "@/components/dashboard/ProjectsList";
import ContributionGraph from "@/components/dashboard/ContributionGraph";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import AchievementsList from "@/components/dashboard/AchievementsList";
import { Progress } from "@/components/ui/progress";
import AvatarUpload from "@/components/dashboard/AvatarUpload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LineChart, BarChart } from "@/components/charts";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  github_username?: string;
  phone?: string;
  role: string;
}

interface GitHubData {
  repos: number;
  followers: number;
  following: number;
  contributions: number;
  stars: number;
  forks: number;
}

interface UserStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  followers: number;
  following: number;
  contributions: number;
}

interface Repository {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  isPublic: boolean;
  lastUpdated: string;
  isPublished: boolean;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          // Fetch additional user data from API if needed
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await response.json();
          if (data.success) {
            setUser(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [toast]);

  const handlePublishRepo = async (repoId: string) => {
    // Will be implemented later
    console.log("Publishing repo:", repoId);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="animate-pulse space-y-8">
          {/* Loading skeleton */}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl border bg-card p-8">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-start gap-8">
            <Avatar className="w-28 h-28 border-4 border-background">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-4xl font-bold">{user?.name}</h1>
                  <p className="text-lg text-muted-foreground mt-1">{user?.role}</p>
                  {user?.github_username && (
                    <a 
                      href={`https://github.com/${user.github_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mt-2"
                    >
                      <Github className="w-4 h-4" />
                      {user.github_username}
                    </a>
                  )}
                </div>
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              </div>

              <div className="flex items-center gap-6 mt-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{stats?.followers || 0}</span>
                  <span className="text-muted-foreground">followers</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{stats?.totalRepos || 0}</span>
                  <span className="text-muted-foreground">repositories</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  <span className="font-semibold">{stats?.totalStars || 0}</span>
                  <span className="text-muted-foreground">stars earned</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
              <GitCommit className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{githubData?.contributions || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Repository Views</CardTitle>
              <Eye className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.4k</div>
              <p className="text-xs text-muted-foreground mt-1">+20.1% from last month</p>
            </CardContent>
          </Card>
          {/* Add more stat cards */}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-background border-b rounded-none p-0 h-12">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="repositories"
              className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12"
            >
              Repositories
            </TabsTrigger>
            <TabsTrigger 
              value="projects"
              className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12"
            >
              Projects
            </TabsTrigger>
            <TabsTrigger 
              value="tools"
              className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-12"
            >
              Tools
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Activity Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Contribution Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <LineChart 
                    data={[]} // Will be populated with actual data
                    categories={["Commits", "Pull Requests"]}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add activity items here */}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="repositories" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Repositories</h2>
              <Button variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                New Repository
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {repos.map((repo) => (
                <Card key={repo.id} className="hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                          {repo.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {repo.description}
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                          <Badge variant="secondary">{repo.language}</Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Star className="w-4 h-4" />
                            {repo.stars}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <GitFork className="w-4 h-4" />
                            {repo.forks}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={repo.isPublished ? "secondary" : "default"}
                        size="sm"
                        onClick={() => handlePublishRepo(repo.id)}
                        className="gap-2"
                      >
                        {repo.isPublished ? (
                          <>
                            <ExternalLink className="w-4 h-4" />
                            View
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Publish
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Other tab contents remain similar but styled consistently */}
        </Tabs>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <ProfileEditForm 
          user={user} 
          onClose={() => setIsEditing(false)}
          onUpdate={(updatedUser) => {
            setUser(updatedUser);
            setIsEditing(false);
          }}
        />
      )}
    </PageContainer>
  );
} 