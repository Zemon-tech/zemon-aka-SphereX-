"use client";

import { motion } from "framer-motion";
import { Star, GitFork, Eye, GitBranch, Code, MessageCircle, GitPullRequest, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RepoCardProps {
  id: string;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  githubUrl: string;
  updatedAt: string;
  creator: {
    name: string;
    id: string;
  };
  onGitHubClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function RepoCard({
  id,
  name,
  description,
  stars,
  forks,
  language,
  githubUrl,
  updatedAt,
  creator,
  onGitHubClick
}: RepoCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <Link
              href={`/repos/${id}`}
              className="text-lg font-semibold hover:text-primary transition-colors"
            >
              {name}
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              by {creator.name}
            </p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="secondary">{language}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-4 h-4" />
                {stars}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <GitFork className="w-4 h-4" />
                {forks}
              </div>
              <div className="text-sm text-muted-foreground">
                Updated {new Date(updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onGitHubClick}
            >
              <Github className="w-4 h-4" />
            </Button>
            <Link href={`/repos/${id}`}>
              <Button variant="ghost" size="icon">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 