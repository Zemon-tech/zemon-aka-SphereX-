"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Github, Star, GitFork, 
  GitBranch, Users, GitCommit,
  Plus, ExternalLink, Eye, Linkedin
} from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LineChart } from "@/components/charts";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { fetchGitHubProfile } from "@/lib/github";
import Link from "next/link";
import NextImage from "next/image";
import StatCard from "@/components/dashboard/StatCard";
import { validateUserData } from '@/utils/auth';
import RepoCard from "@/components/repos/RepoCard";
import StoreCard from "@/components/store/StoreCard";

interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  github_username?: string;
  github?: string;
  phone?: string;
  role?: string;
  linkedin?: string;
  personalWebsite?: string;
}

interface UserStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  followers: number;
  following: number;
  contributions: number;
}

interface GitHubUserData {
  username: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  total_stars: number;
  organizations: Array<{
    login: string;
    avatar_url: string;
  }>;
  pinnedRepos: Array<{
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
  }>;
  contributionStats: {
    totalContributions: number;
    currentStreak: number;
    longestStreak: number;
  };
  repositories: Array<{
    name: string;
    description: string;
    stars: number;
    forks: number;
    language: string;
    html_url: string;
    isPrivate: boolean;
    updatedAt: string;
  }>;
}

interface PublishedProject {
  _id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  github_url: string;
  githubUrl: string;
  updatedAt: string;
  createdAt: string;
  added_by: {
    _id: string;
    name: string;
  };
}

interface Tool {
  _id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  tags: string[];
  url: string;
  github_url?: string;
  dev_docs?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [stats, setStats] = useState<UserStats | null>(null);
  const router = useRouter();
  const [githubProfile, setGithubProfile] = useState<GitHubUserData | null>(null);
  const [publishedProjects, setPublishedProjects] = useState<PublishedProject[]>([]);
  const [userTools, setUserTools] = useState<Tool[]>([]);
  const [isGithubLinked, setIsGithubLinked] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (!storedUser || !token) {
          console.log('No user found in localStorage');
          router.push('/login');
          return;
        }

        // First set the user from localStorage
        const userData = JSON.parse(storedUser);
        if (!validateUserData(userData)) {
          console.error('Invalid user data structure:', userData);
          router.push('/login');
          return;
        }
        setUser(userData);

        // Then fetch the complete profile from API
        try {
          console.log('Fetching complete profile...');
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await response.json();
          console.log('Complete profile data:', data);

          if (data.success) {
            // Update user data with complete profile
            const completeUserData = {
              ...userData,
              ...data.data,
              github: data.data.github || data.data.github_username,
              github_username: data.data.github_username || data.data.github,
              linkedin: data.data.linkedin || userData.linkedin || '',
              personalWebsite: data.data.personalWebsite || userData.personalWebsite || ''
            };
            console.log('Complete user data:', completeUserData);

            setUser(completeUserData);
            localStorage.setItem('user', JSON.stringify(completeUserData));

            // Check GitHub username from the complete profile
            const githubUsername = completeUserData.github || completeUserData.github_username;
            console.log('GitHub username found:', githubUsername);
            
            // Update GitHub link status
            const hasGithubLink = Boolean(githubUsername);
            console.log('Has GitHub link:', hasGithubLink);
            setIsGithubLinked(hasGithubLink);

            if (hasGithubLink) {
              try {
                console.log("Fetching GitHub profile for:", githubUsername);
                const githubData = await fetchGitHubProfile(githubUsername);
                console.log("GitHub profile loaded:", githubData);
                setGithubProfile(githubData);
                
                setStats({
                  totalRepos: githubData.public_repos,
                  totalStars: githubData.total_stars,
                  totalForks: 0,
                  followers: githubData.followers,
                  following: githubData.following,
                  contributions: githubData.contributionStats.totalContributions
                });
              } catch (githubError) {
                console.error("GitHub fetch error:", githubError);
                toast({
                  title: "Error",
                  description: githubError instanceof Error ? githubError.message : "Failed to load GitHub data",
                  variant: "destructive",
                });
                setIsGithubLinked(true);
              }
            } else {
              console.log('No GitHub username found in profile');
              setIsGithubLinked(false);
            }
          } else {
            throw new Error(data.message || 'Failed to fetch complete profile');
          }
        } catch (error) {
          console.error('Error fetching complete profile:', error);
          toast({
            title: "Error",
            description: "Failed to load complete profile",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error in dashboard:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();

    // Add event listener for profile updates
    const handleProfileUpdate = (event: CustomEvent) => {
      const updatedUser = event.detail;
      setUser(updatedUser);
      
      // Refetch all data when profile is updated
      fetchUserData();
      fetchPublishedProjects();
      fetchUserTools();
    };

    window.addEventListener('auth-state-change', handleProfileUpdate as EventListener);

    return () => {
      window.removeEventListener('auth-state-change', handleProfileUpdate as EventListener);
    };
  }, [router, toast]);

  const fetchPublishedProjects = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found for fetching projects');
        return;
      }

      console.log('Fetching published projects...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/repos/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch published projects');
      }

      const data = await response.json();
      if (data.success) {
        console.log('Fetched projects:', data.data.repos?.length || 0);
        setPublishedProjects(data.data.repos || []);
      } else {
        throw new Error(data.message || 'Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error fetching published projects:', error);
      // Don't show error toast if it's just that there are no projects
      if (error instanceof Error && !error.message.includes('no projects')) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch projects",
          variant: "destructive",
        });
      }
      setPublishedProjects([]); // Set empty array on error
    }
  }, [toast]);

  const fetchUserTools = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found for fetching tools');
        return;
      }

      console.log('Fetching user tools...');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch tools');
      }

      const data = await response.json();
      if (data.success) {
        console.log('Fetched tools:', data.data.tools?.length || 0);
        setUserTools(data.data.tools || []);
      } else {
        throw new Error(data.message || 'Failed to fetch tools');
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
      // Don't show error toast if it's just that there are no tools
      if (error instanceof Error && !error.message.includes('no tools')) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch tools",
          variant: "destructive",
        });
      }
      setUserTools([]); // Set empty array on error
    }
  }, [toast]);

  useEffect(() => {
    // Fetch projects and tools as soon as we have a token, regardless of user._id
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token found, fetching projects and tools');
      fetchPublishedProjects();
      fetchUserTools();
    }
  }, [fetchPublishedProjects, fetchUserTools]);

  if (error) {
    return (
      <PageContainer className="py-8">
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-destructive">Error Loading Dashboard</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </Card>
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer className="py-8">
        <div className="space-y-4">
          <div className="h-40 bg-muted/10 animate-pulse rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-muted/10 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer className="py-8">
        <Card className="p-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Please Log In</h2>
            <p className="text-muted-foreground">You need to be logged in to view your dashboard.</p>
            <Button onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          </div>
        </Card>
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
                  <div className="flex items-center gap-4 mt-2">
                    {user?.github && (
                      <a 
                        href={`https://github.com/${user.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                      >
                        <Github className="w-4 h-4" />
                        {user.github}
                      </a>
                    )}
                    {user?.linkedin && (
                      <a 
                        href={user.linkedin.startsWith('http') ? user.linkedin : `https://linkedin.com/in/${user.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </a>
                    )}
                    {user?.personalWebsite && (
                      <a 
                        href={user.personalWebsite.startsWith('http') ? user.personalWebsite : `https://${user.personalWebsite}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
                <Button onClick={() => router.push('/settings')}>Edit Profile</Button>
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

        {/* Main Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
            </div>
          </div>
        ) : !isGithubLinked ? (
          <Card className="mt-6">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Github className="w-12 h-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Connect Your GitHub Account</h2>
              <p className="text-muted-foreground text-center max-w-md mb-6">
                Link your GitHub account to unlock powerful features, track your contributions, and showcase your projects.
              </p>
              <Button 
                onClick={() => router.push('/settings')} 
                className="gap-2"
              >
                <Github className="w-4 h-4" />
                Link GitHub Account
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* GitHub Profile Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="w-5 h-5" />
                  GitHub Profile
                  {!githubProfile && (
                    <Badge variant="outline" className="ml-2">
                      Loading...
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              {githubProfile ? (
                <CardContent className="space-y-6">
                  {/* GitHub Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                      title="Repositories"
                      value={githubProfile.public_repos}
                      icon={<GitBranch className="w-4 h-4" />}
                    />
                    <StatCard
                      title="Total Stars"
                      value={githubProfile.total_stars}
                      icon={<Star className="w-4 h-4" />}
                    />
                    <StatCard
                      title="Followers"
                      value={githubProfile.followers}
                      icon={<Users className="w-4 h-4" />}
                    />
                    <StatCard
                      title="Contributions"
                      value={githubProfile.contributionStats.totalContributions}
                      icon={<GitCommit className="w-4 h-4" />}
                    />
                  </div>

                  {/* Pinned Repositories */}
                  {githubProfile.pinnedRepos.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Pinned Repositories</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {githubProfile.pinnedRepos.map((repo) => (
                          <Card key={repo.name}>
                            <CardContent className="p-4">
                              <h4 className="font-medium">{repo.name}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {repo.description}
                              </p>
                              <div className="flex items-center gap-4 mt-4">
                                <span className="text-sm text-muted-foreground">
                                  {repo.language}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Star className="w-4 h-4" />
                                  {repo.stars}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <GitFork className="w-4 h-4" />
                                  {repo.forks}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Organizations */}
                  {githubProfile.organizations.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-4">Organizations</h3>
                      <div className="flex flex-wrap gap-4">
                        {githubProfile.organizations.map((org) => (
                          <Link
                            key={org.login}
                            href={`https://github.com/${org.login}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 rounded-lg border hover:border-primary transition-colors"
                          >
                            <NextImage
                              src={org.avatar_url}
                              alt={org.login}
                              width={24}
                              height={24}
                              className="rounded-sm"
                            />
                            <span className="text-sm font-medium">{org.login}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              ) : (
                <CardContent>
                  <div className="text-center text-muted-foreground py-4">
                    Loading GitHub data...
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="hover:border-primary/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
                  <GitCommit className="w-4 h-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.contributions || 0}</div>
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
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => window.open(`https://github.com/new`, '_blank')}
                  >
                    <Plus className="w-4 h-4" />
                    New Repository
                  </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {githubProfile?.repositories.map((repo) => (
                    <Card key={repo.name} className="hover:border-primary/50 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <a
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-lg font-semibold hover:text-primary transition-colors"
                            >
                              {repo.name}
                            </a>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {repo.description || 'No description provided'}
                            </p>
                            <div className="flex items-center gap-4 mt-4">
                              {repo.language && (
                                <Badge variant="secondary">{repo.language}</Badge>
                              )}
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Star className="w-4 h-4" />
                                {repo.stars}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <GitFork className="w-4 h-4" />
                                {repo.forks}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Updated {new Date(repo.updatedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(repo.html_url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Published Projects</h2>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => router.push('/repos')}
                  >
                    <Plus className="w-4 h-4" />
                    Publish New Project
                  </Button>
                </div>
                {/* Published Projects Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Published Projects</h3>
                    <Button variant="outline" size="sm" onClick={() => router.push('/repos')}>
                      View All
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {publishedProjects.map((project) => (
                      <RepoCard
                        key={project._id}
                        id={project._id}
                        name={project.name}
                        description={project.description}
                        stars={project.stars}
                        forks={project.forks}
                        language={project.language || 'Unknown'}
                        githubUrl={project.github_url || project.githubUrl}
                        updatedAt={project.updatedAt || project.createdAt}
                        creator={{ 
                          name: project.added_by?.name || 'Unknown Developer',
                          id: project.added_by?._id
                        }}
                        onGitHubClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.preventDefault();
                          window.open(project.github_url || project.githubUrl, '_blank');
                        }}
                      />
                    ))}
                    {publishedProjects.length === 0 && (
                      <div className="col-span-full text-center py-8 text-muted-foreground">
                        No published projects yet
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tools" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Your Tools</h2>
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={() => router.push('/store/submit')}
                  >
                    <Plus className="w-4 h-4" />
                    Submit New Tool
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userTools.map((tool) => (
                    <StoreCard
                      key={tool._id}
                      tool={{
                        id: tool._id,
                        title: tool.name,
                        description: tool.description,
                        thumbnail: tool.thumbnail,
                        url: tool.url,
                        developer: {
                          _id: user?._id || 'unknown',
                          name: user?.name || 'Unknown Developer'
                        }
                      }}
                      currentUserId={user?._id || null}
                      onDelete={() => fetchUserTools()}
                    />
                  ))}
                  {userTools.length === 0 && (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                      No tools published yet
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </PageContainer>
  );
} 