"use client";

import { Star, GitBranch, Users, GitCommit } from "lucide-react";

interface GitHubStatsProps {
  data: {
    repos: number;
    followers: number;
    following: number;
    contributions: number;
    stars: number;
    forks: number;
  } | null;
}

export default function GitHubStats({ data }: GitHubStatsProps) {
  if (!data) return null;

  const stats = [
    { 
      label: "Repositories", 
      value: data.repos, 
      icon: GitBranch, 
      accentColor: "text-blue-500", 
      iconBg: "bg-blue-500/10"
    },
    { 
      label: "Total Stars", 
      value: data.stars, 
      icon: Star, 
      accentColor: "text-amber-500", 
      iconBg: "bg-amber-500/10"
    },
    { 
      label: "Followers", 
      value: data.followers, 
      icon: Users, 
      accentColor: "text-purple-500", 
      iconBg: "bg-purple-500/10"
    },
    { 
      label: "Contributions", 
      value: data.contributions, 
      icon: GitCommit, 
      accentColor: "text-emerald-500", 
      iconBg: "bg-emerald-500/10"
    },
  ];

  return (
    <div className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className="rounded-xl border border-muted/50 bg-card hover:bg-muted/5 p-4 flex flex-col transition-colors shadow-sm hover:shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
              <div className={`p-2 rounded-full ${stat.iconBg} border border-${stat.accentColor.split('-')[1]}-200/30`}>
                <stat.icon className={`w-4 h-4 ${stat.accentColor}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 