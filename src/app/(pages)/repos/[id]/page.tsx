"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, GitBranch, Star, Users, GitFork, AlertCircle, GitPullRequest } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import PageContainer from "@/components/layout/PageContainer";
import {
  LineChart,
  PieChart,
  BarChart,
  ResponsiveContainer,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import OverviewTab from "@/components/repos/tabs/OverviewTab";
import ActivityTab from "@/components/repos/tabs/ActivityTab";
import ContributorsTab from "@/components/repos/tabs/ContributorsTab";
import DependenciesTab from "@/components/repos/tabs/DependenciesTab";
import { getRepoDetails } from "@/lib/github";
import RepoStats from "@/components/repos/RepoStats";
import RepoHeader from "@/components/repos/RepoHeader";

interface Repository {
  _id: string;
  name: string;
  description: string;
  github_url: string;
  stars: number;
  forks: number;
  branches: number;
  contributors: Array<{
    login: string;
    avatar_url: string;
    contributions: number;
  }>;
  thumbnail_url: string;
  owner: string;
  readme_url: string;
  likes: string[];
  comments: Array<{
    user: string;
    content: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  openIssues: number;
  pullRequests: number;
  readme?: string;
  languages?: string[];
  lastCommits?: Array<{
    date: string;
    commits: number;
  }>;
  activityData?: Array<{
    date: string;
    commits: number;
    pullRequests: number;
  }>;
  dependencies?: Array<{
    name: string;
    version: string;
    latest: string;
    type: "production" | "development";
    hasVulnerabilities: boolean;
    isOutdated: boolean;
  }>;
}

export default function RepoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [repo, setRepo] = useState<Repository | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [githubData, setGithubData] = useState<any>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch repo data from your API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/repos/${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          setRepo(data.data);
          
          // Extract owner and repo name from github_url
          const githubUrlParts = data.data.github_url.split('/');
          const owner = githubUrlParts[githubUrlParts.length - 2];
          const repoName = githubUrlParts[githubUrlParts.length - 1];
          
          // Fetch GitHub data with error handling
          const githubData = await getRepoDetails(owner, repoName);
          if (githubData) {
            setGithubData(githubData);
          } else {
            toast({
              title: "Warning",
              description: "Some GitHub data might be limited or unavailable",
              variant: "warning",
            });
          }
        } else {
          throw new Error(data.message || 'Failed to fetch repository details');
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to load repository details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchAllData();
    }
  }, [params.id, toast]);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="animate-pulse space-y-4 py-8">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-96 bg-muted rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!repo) {
    return (
      <PageContainer>
        <div className="py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Repository not found</h1>
          <Link href="/repos" className="text-primary hover:underline">
            Back to Repositories
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8 space-y-6">
      {/* Header */}
      <RepoHeader
        name={repo?.name || ''}
        description={repo?.description || ''}
        avatar={repo?.avatar || '/Z.jpg'}
        githubUrl={repo?.github_url || ''}
        isStarred={false}
      />

      {/* Stats */}
      <RepoStats
        stats={{
          stars: githubData?.repoData?.stargazers_count || 0,
          forks: githubData?.repoData?.forks_count || 0,
          watchers: githubData?.repoData?.subscribers_count || 0,
          issues: githubData?.repoData?.open_issues_count || 0,
          pullRequests: githubData?.pullRequests?.length || 0,
          contributors: githubData?.contributors?.length || 0,
        }}
      />

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-card border">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary/10">
            Overview
          </TabsTrigger>
          <TabsTrigger value="activity" className="data-[state=active]:bg-primary/10">
            Activity
          </TabsTrigger>
          <TabsTrigger value="contributors" className="data-[state=active]:bg-primary/10">
            Contributors
          </TabsTrigger>
          <TabsTrigger value="dependencies" className="data-[state=active]:bg-primary/10">
            Dependencies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab
            readme={githubData?.repoData?.readme || ""}
            languages={githubData?.languages || []}
            branches={githubData?.branches || []}
            lastCommits={githubData?.commits || []}
            repoInfo={githubData?.repoInfo || {
              owner: repo?.owner || '',
              name: repo?.name || '',
              defaultBranch: 'main' // fallback
            }}
          />
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <ActivityTab
            activityData={githubData?.activityData || []}
            pullRequests={githubData?.pullRequests || []}
          />
        </TabsContent>

        <TabsContent value="contributors" className="space-y-4">
          <ContributorsTab
            contributors={repo.contributors || []}
            totalContributions={repo.contributors?.reduce((acc, curr) => acc + curr.contributions, 0) || 0}
          />
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-4">
          <DependenciesTab
            dependencies={repo.dependencies || []}
          />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

// Helper component for stats
function StatCard({ title, value, icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
} 