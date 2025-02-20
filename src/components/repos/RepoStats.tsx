"use client";

import { Card, CardContent } from "@/components/ui/card";
import { GitBranch, Star, GitFork, Eye, GitPullRequest, AlertCircle, Users } from "lucide-react";

interface RepoStatsProps {
  stats: {
    stars: number;
    forks: number;
    watchers: number;
    issues: number;
    pullRequests: number;
    contributors: number;
  };
}

export default function RepoStats({ stats }: RepoStatsProps) {
  const statItems = [
    { label: "Stars", value: stats.stars, icon: Star, color: "text-yellow-500" },
    { label: "Forks", value: stats.forks, icon: GitFork, color: "text-blue-500" },
    { label: "Watchers", value: stats.watchers, icon: Eye, color: "text-green-500" },
    { label: "Issues", value: stats.issues, icon: AlertCircle, color: "text-red-500" },
    { label: "PRs", value: stats.pullRequests, icon: GitPullRequest, color: "text-purple-500" },
    { label: "Contributors", value: stats.contributors, icon: Users, color: "text-orange-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {statItems.map((item) => (
        <Card key={item.label} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <p className="text-2xl font-bold mt-2">
              {item.value.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 