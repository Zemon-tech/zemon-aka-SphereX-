"use client";

import { motion } from "framer-motion";
import { Award, Star, Zap, Target, Trophy, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const achievements = [
  {
    title: "Code Warrior",
    description: "Complete 100 commits",
    progress: 75,
    icon: Award,
    color: "text-yellow-500",
  },
  {
    title: "Project Master",
    description: "Create 10 projects",
    progress: 60,
    icon: Star,
    color: "text-purple-500",
  },
  {
    title: "Super Contributor",
    description: "Contribute to 20 repositories",
    progress: 45,
    icon: Zap,
    color: "text-blue-500",
  },
  {
    title: "Goal Achiever",
    description: "Complete all profile information",
    progress: 100,
    icon: Target,
    color: "text-green-500",
  },
  {
    title: "Team Player",
    description: "Collaborate with 5 developers",
    progress: 80,
    icon: Trophy,
    color: "text-orange-500",
  },
  {
    title: "Streak Master",
    description: "Maintain a 7-day contribution streak",
    progress: 30,
    icon: Flame,
    color: "text-red-500",
  },
];

export default function AchievementsList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {achievements.map((achievement, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {achievement.description}
                  </p>
                  <div className="space-y-2">
                    <Progress value={achievement.progress} />
                    <p className="text-sm text-muted-foreground">
                      {achievement.progress}% Complete
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
} 