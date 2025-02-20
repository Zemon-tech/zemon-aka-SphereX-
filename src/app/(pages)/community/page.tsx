"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Lightbulb, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import PageContainer from "@/components/layout/PageContainer";
import IdeaCard from "@/components/community/IdeaCard";
import ResourceList from "@/components/community/ResourceList";
import AddIdeaModal from "@/components/community/AddIdeaModal";
import ShareResourceModal from "@/components/community/ShareResourceModal";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface Idea {
  _id: string;
  title: string;
  description: string;
  author: {
    _id: string;
    name: string;
  } | null;
  createdAt: string;
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("ideas");
  const [isAddIdeaOpen, setIsAddIdeaOpen] = useState(false);
  const [isShareResourceOpen, setIsShareResourceOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleShareClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to share your ideas and resources.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }
    
    if (activeTab === "ideas") {
      setIsAddIdeaOpen(true);
    } else {
      setIsShareResourceOpen(true);
    }
  };

  const fetchIdeas = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:5002/api/community/ideas');
      setIdeas(response.data);
    } catch (error: any) {
      console.error('Error fetching ideas:', error);
      setError('Failed to load ideas. Please try again later.');
      toast({
        title: "Error",
        description: "Failed to load ideas. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchResources = () => {
    setActiveTab("resources");
  };

  useEffect(() => {
    fetchIdeas();
  }, []);

  const filteredIdeas = ideas.filter(idea =>
    idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    idea.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Button onClick={handleShareClick} className="gap-2">
            <Plus className="w-4 h-4" />
            {activeTab === "ideas" ? "Share Idea" : "Share Resource"}
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="ideas" className="space-y-6" onValueChange={setActiveTab}>
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
                  placeholder={`Search ${activeTab}...`}
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
              {isLoading ? (
                <div className="col-span-full text-center py-8">Loading ideas...</div>
              ) : error ? (
                <div className="col-span-full text-center py-8 text-red-500">{error}</div>
              ) : filteredIdeas.length > 0 ? (
                filteredIdeas.map((idea, index) => (
                  <motion.div
                    key={idea._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <IdeaCard
                      idea={{
                        id: idea._id,
                        title: idea.title,
                        description: idea.description,
                        author: idea.author || null,
                        createdAt: idea.createdAt,
                      }}
                      onDelete={fetchIdeas}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  No ideas found. Be the first to share an idea!
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <ResourceList />
          </TabsContent>
        </Tabs>
      </div>

      <AddIdeaModal
        isOpen={isAddIdeaOpen}
        onClose={() => setIsAddIdeaOpen(false)}
        onIdeaAdded={fetchIdeas}
      />

      <ShareResourceModal
        isOpen={isShareResourceOpen}
        onClose={() => setIsShareResourceOpen(false)}
        onResourceAdded={fetchResources}
      />
    </PageContainer>
  );
} 