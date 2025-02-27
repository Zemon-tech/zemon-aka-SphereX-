"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface Contributor {
  login: string;
  avatar_url: string;
  contributions: number;
  pullRequests: number;
  reviews: number;
}

interface ContributorsTabProps {
  contributors: Contributor[];
  totalContributions: number;
}

export default function ContributorsTab({ contributors, totalContributions }: ContributorsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Contributors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {contributors.map((contributor, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={contributor.avatar_url} />
                  <AvatarFallback>{contributor.login[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{contributor.login}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{contributor.contributions} commits</span>
                    <span>{contributor.pullRequests} PRs</span>
                    <span>{contributor.reviews} reviews</span>
                  </div>
                </div>
                <span className="text-sm font-medium">
                  {Math.round((contributor.contributions / totalContributions) * 100)}%
                </span>
              </div>
              <Progress 
                value={(contributor.contributions / totalContributions) * 100} 
                className="h-1"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 