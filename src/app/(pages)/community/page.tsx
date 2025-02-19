"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Lightbulb, FileText, Video, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import PageContainer from "@/components/layout/PageContainer";
import IdeaCard from "@/components/community/IdeaCard";
import ResourceList from "@/components/community/ResourceList";
import AddIdeaModal from "@/components/community/AddIdeaModal";
import ShareResourceModal from "@/components/community/ShareResourceModal";
import { Badge } from "@/components/ui/badge";

export default function CommunityPage() {
  const [isAddIdeaOpen, setIsAddIdeaOpen] = useState(false);
  const [isShareResourceOpen, setIsShareResourceOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <PageContainer>
      <div className="py-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Community Hub</h1>
            <p className="text-muted-foreground mt-1">
              Share ideas, learn, and grow together with fellow developers
            </p>
          </div>
          <Button onClick={() => setIsAddIdeaOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Share Idea
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="ideas" className="space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <TabsList>
              <TabsTrigger value="ideas" className="gap-2">
                <Lightbulb className="w-4 h-4" />
                Ideas
              </TabsTrigger>
              <TabsTrigger value="resources" className="gap-2">
                <FileText className="w-4 h-4" />
                Resources
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <TabsContent value="ideas" className="space-y-6">
            {/* Ideas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample ideas - replace with actual data */}
              {Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <IdeaCard
                    idea={{
                      id: index.toString(),
                      title: "Sample Idea Title",
                      description: "This is a sample idea description that shows how the card will look with actual content.",
                      author: {
                        name: "John Doe",
                        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`,
                      },
                      likes: 42,
                      comments: 12,
                      tags: ["React", "TypeScript"],
                      createdAt: new Date().toISOString(),
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Community Resources</h2>
              <Button onClick={() => setIsShareResourceOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Share Resource
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { icon: FileText, label: "Documentation", count: 25 },
                { icon: Video, label: "Video Tutorials", count: 15 },
                { icon: Wrench, label: "Developer Tools", count: 30 },
              ].map((category, index) => (
                <motion.div
                  key={category.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-primary/10">
                      <category.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{category.label}</h3>
                      <p className="text-sm text-muted-foreground">
                        {category.count} resources
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <ResourceList />
          </TabsContent>
        </Tabs>
      </div>

      <AddIdeaModal
        isOpen={isAddIdeaOpen}
        onClose={() => setIsAddIdeaOpen(false)}
      />

      <ShareResourceModal
        isOpen={isShareResourceOpen}
        onClose={() => setIsShareResourceOpen(false)}
      />
    </PageContainer>
  );
} 