"use client";

import { useState } from "react";
import { Star, GitFork, ExternalLink, Code } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

interface GitHubReposProps {
  repos: GitHubRepo[];
  username: string;
  limit?: number;
  showViewAll?: boolean;
}

export default function GitHubRepos({ repos, username, limit = 6, showViewAll = true }: GitHubReposProps) {
  const [visibleRepos, setVisibleRepos] = useState<GitHubRepo[]>(repos.slice(0, limit));
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    if (showAll) {
      setVisibleRepos(repos.slice(0, limit));
    } else {
      setVisibleRepos(repos);
    }
    setShowAll(!showAll);
  };

  const viewAllReposUrl = `https://github.com/${username}?tab=repositories`;

  if (!repos.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center text-muted-foreground">
          <p>No GitHub repositories found for {username}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleRepos.map((repo) => (
          <div key={repo.id}>
            <Card className="h-full hover:border-primary/50 transition-colors hover:shadow-sm">
              <CardContent className="p-4 flex flex-col h-full">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium line-clamp-1">{repo.name}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => window.open(repo.html_url, '_blank')}
                      title="View on GitHub"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                    {repo.description || "No description provided"}
                  </p>
                </div>
                
                <div className="mt-4 pt-3 border-t flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <GitFork className="w-4 h-4 text-blue-500" />
                      {repo.forks_count}
                    </span>
                  </div>
                  
                  {repo.language && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Code className="w-3 h-3" />
                      {repo.language}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      
      {showViewAll && repos.length > limit && (
        <div className="text-center mt-6">
          <Button 
            variant="outline" 
            onClick={toggleShowAll}
            className="mr-2"
          >
            {showAll ? "Show Less" : `View All (${repos.length})`}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.open(viewAllReposUrl, '_blank')}
          >
            View on GitHub
          </Button>
        </div>
      )}
    </div>
  );
} 