"use client";

import { motion } from "framer-motion";
import { FileText, Video, Wrench, ExternalLink, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const resources = [
  {
    type: "pdf",
    title: "Complete Guide to Modern Web Development",
    description: "Learn the latest web development techniques and best practices",
    icon: FileText,
    downloadUrl: "#",
    category: "Documentation",
    size: "2.5 MB",
  },
  {
    type: "video",
    title: "Building Scalable Applications",
    description: "A comprehensive video course on application architecture",
    icon: Video,
    downloadUrl: "#",
    category: "Tutorial",
    duration: "45 mins",
  },
  {
    type: "tool",
    title: "Developer Productivity Suite",
    description: "A collection of tools to boost your development workflow",
    icon: Wrench,
    downloadUrl: "#",
    category: "Tools",
    platform: "Cross-platform",
  },
  // Add more resources...
];

export default function ResourceList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {resources.map((resource, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="group hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-md bg-primary/10">
                  <resource.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <Badge variant="secondary">
                      {resource.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {resource.size || resource.duration || resource.platform}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0">
                  {resource.type === "tool" ? (
                    <ExternalLink className="w-4 h-4" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
} 