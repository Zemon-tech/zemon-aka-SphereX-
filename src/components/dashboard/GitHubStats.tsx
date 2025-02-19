"use client";

import { motion } from "framer-motion";
import { Star, GitFork, GitBranch, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    { label: "Repositories", value: data.repos, icon: GitBranch },
    { label: "Followers", value: data.followers, icon: Users },
    { label: "Stars", value: data.stars, icon: Star },
    { label: "Forks", value: data.forks, icon: GitFork },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-2 gap-4"
    >
      {stats.map((stat, index) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <stat.icon className="w-4 h-4" />
              <span className="text-sm">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  );
} 