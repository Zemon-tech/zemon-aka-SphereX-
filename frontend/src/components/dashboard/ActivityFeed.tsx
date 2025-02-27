"use client";

import { motion } from "framer-motion";
import { GitCommit, GitPullRequest, Star, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    type: "commit",
    repo: "zemon/frontend",
    message: "Updated dashboard UI components",
    time: "2 hours ago",
    icon: GitCommit,
  },
  {
    type: "pr",
    repo: "open-source/project",
    message: "Fix navigation responsiveness",
    time: "5 hours ago",
    icon: GitPullRequest,
  },
  {
    type: "star",
    repo: "cool-project/app",
    message: "Starred the repository",
    time: "1 day ago",
    icon: Star,
  },
  {
    type: "comment",
    repo: "team/docs",
    message: "Commented on Issue #42",
    time: "2 days ago",
    icon: MessageSquare,
  },
];

export default function ActivityFeed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="p-2 rounded-full bg-primary/10">
              <activity.icon className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{activity.repo}</p>
              <p className="text-sm text-muted-foreground">{activity.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
} 