"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ActivityChart from "../charts/ActivityChart";
import { GitPullRequest, GitCommit, GitMerge } from "lucide-react";

interface ActivityTabProps {
  activityData: {
    date: string;
    commits: number;
    pullRequests: number;
  }[];
  pullRequests: {
    title: string;
    author: string;
    status: "open" | "merged" | "closed";
    createdAt: string;
  }[];
}

export default function ActivityTab({ activityData, pullRequests }: ActivityTabProps) {
  return (
    <div className="space-y-6">
      <ActivityChart data={activityData} />

      <Card>
        <CardHeader>
          <CardTitle>Recent Pull Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pullRequests.map((pr, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
                {pr.status === "open" && <GitPullRequest className="w-5 h-5 text-green-500" />}
                {pr.status === "merged" && <GitMerge className="w-5 h-5 text-purple-500" />}
                {pr.status === "closed" && <GitPullRequest className="w-5 h-5 text-red-500" />}
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{pr.title}</p>
                  <p className="text-sm text-muted-foreground">
                    by {pr.author} on {new Date(pr.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  pr.status === "open" ? "bg-green-500/10 text-green-500" :
                  pr.status === "merged" ? "bg-purple-500/10 text-purple-500" :
                  "bg-red-500/10 text-red-500"
                }`}>
                  {pr.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 