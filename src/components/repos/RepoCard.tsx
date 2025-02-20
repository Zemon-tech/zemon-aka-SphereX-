"use client";

import { motion } from "framer-motion";
import { Star, GitFork, Eye, GitBranch, Code, MessageCircle, GitPullRequest } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface RepoCardProps {
  repo: {
    id: string;
    name: string;
    owner: string;
    description: string;
    stars: number;
    forks: number;
    watchers: number;
    language: string;
    topics: string[];
    openIssues: number;
    pullRequests: number;
    lastUpdated: string;
  };
}

export default function RepoCard({ repo }: RepoCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-xl border bg-card p-6 hover:shadow-lg transition-all duration-300"
    >
      <Link href={`/repos/${repo.id}`} className="block">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
              {repo.name}
            </h2>
            <p className="text-sm text-muted-foreground">{repo.owner}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {repo.language}
          </Badge>
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {repo.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Open Issues</span>
              <span className="font-medium">{repo.openIssues}</span>
            </div>
            <Progress value={Math.min((repo.openIssues / 100) * 100, 100)} className="h-1" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Pull Requests</span>
              <span className="font-medium">{repo.pullRequests}</span>
            </div>
            <Progress value={Math.min((repo.pullRequests / 50) * 100, 100)} className="h-1" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {repo.topics.slice(0, 4).map((topic) => (
            <Badge
              key={topic}
              variant="secondary"
              className="bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              {topic}
            </Badge>
          ))}
          {repo.topics.length > 4 && (
            <Badge variant="outline" className="text-muted-foreground">
              +{repo.topics.length - 4} more
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{repo.stars}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitFork className="w-4 h-4" />
              <span>{repo.forks}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{repo.watchers}</span>
            </div>
          </div>
          <time className="text-xs text-muted-foreground">
            Updated {new Date(repo.lastUpdated).toLocaleDateString()}
          </time>
        </div>
      </Link>
    </motion.article>
  );
} 