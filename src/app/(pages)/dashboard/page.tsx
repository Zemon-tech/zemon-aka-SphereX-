"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Github, Mail, Phone, Edit2, Star, GitFork, 
  GitBranch, Users, Activity, BookOpen, Link as LinkIcon,
  Calendar, Clock, Award, Check, GitCommit
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

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  if (isLoading) {
    return (
      <PageContainer>
        <div className="animate-pulse space-y-4 py-8">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-48 bg-muted rounded-lg"></div>
            <div className="h-48 bg-muted rounded-lg"></div>
            <div className="h-48 bg-muted rounded-lg"></div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pt-2">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border rounded-lg p-6 mb-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <AvatarUpload
                currentAvatar={user?.avatar}
                onUpload={(url) => {
                  setUser(prev => prev ? { ...prev, avatar: url } : null);
                  // Add API call to update avatar in backend
                }}
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
              <div className="flex flex-col gap-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                {user?.github_username && (
                  <div className="flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    <a 
                      href={`https://github.com/${user.github_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      {user.github_username}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2">
              <LinkIcon className="w-4 h-4" />
              Share Profile
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Projects", value: "12", icon: BookOpen },
          { label: "Contributions", value: "234", icon: GitBranch },
          { label: "Achievement Points", value: "1,250", icon: Award },
          { label: "Active Streak", value: "7 days", icon: Activity },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-background border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          {/* Top Row - GitHub Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* GitHub Stats Card */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">GitHub Overview</CardTitle>
                  <a
                    href={`https://github.com/${user?.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    View Profile
                  </a>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Repositories", value: "28", icon: GitBranch },
                    { label: "Stars", value: "142", icon: Star },
                    { label: "Followers", value: "89", icon: Users },
                    { label: "Following", value: "34", icon: Users },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-4 bg-muted/50 rounded-lg">
                      <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold mb-1">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
                <ContributionGraph />
              </CardContent>
            </Card>

            {/* Skills Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Top Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { name: "React", level: 90, color: "bg-blue-500" },
                  { name: "TypeScript", level: 85, color: "bg-blue-600" },
                  { name: "Node.js", level: 80, color: "bg-green-500" },
                  { name: "Next.js", level: 88, color: "bg-black" },
                  { name: "MongoDB", level: 75, color: "bg-green-600" },
                ].map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full ${skill.color}`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Middle Row - Recent Activity & Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      type: "commit",
                      repo: "zemon/frontend",
                      message: "Updated dashboard UI components",
                      time: "2 hours ago",
                      icon: GitCommit,
                    },
                    {
                      type: "star",
                      repo: "awesome-project",
                      message: "Starred the repository",
                      time: "5 hours ago",
                      icon: Star,
                    },
                    {
                      type: "fork",
                      repo: "cool-lib/utils",
                      message: "Forked the repository",
                      time: "1 day ago",
                      icon: GitFork,
                    },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className={`p-2 rounded-full bg-primary/10`}>
                        <activity.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{activity.repo}</p>
                        <p className="text-sm text-muted-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Projects */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold">Recent Projects</CardTitle>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Project Alpha",
                      description: "A modern web application",
                      language: "TypeScript",
                      stars: 25,
                      color: "bg-blue-500",
                    },
                    {
                      name: "Cool Library",
                      description: "Utility functions for React",
                      language: "JavaScript",
                      stars: 18,
                      color: "bg-yellow-500",
                    },
                    {
                      name: "API Service",
                      description: "RESTful API with Node.js",
                      language: "Node.js",
                      stars: 12,
                      color: "bg-green-500",
                    },
                  ].map((project, index) => (
                    <motion.div
                      key={project.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group p-4 rounded-lg border hover:bg-muted/50 transition-all hover:shadow-md"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Star className="w-4 h-4" />
                          <span className="text-sm">{project.stars}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${project.color}`} />
                        <span className="text-sm text-muted-foreground">{project.language}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row - Profile Completion */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold">Profile Completion</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-primary">85%</span>
                  <span className="text-sm text-muted-foreground">Completed</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={85} className="h-2 mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Basic Info", completed: true },
                  { label: "Profile Picture", completed: true },
                  { label: "GitHub Connected", completed: true },
                  { label: "Skills Added", completed: true },
                  { label: "Bio Updated", completed: false },
                  { label: "Portfolio Added", completed: false },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        item.completed ? 'bg-green-500' : 'bg-muted'
                      }`}
                    >
                      {item.completed ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <Clock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <span className={item.completed ? 'font-medium' : 'text-muted-foreground'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <ProjectsList />
        </TabsContent>

        <TabsContent value="activity">
          <ActivityFeed />
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementsList />
        </TabsContent>
      </Tabs>

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