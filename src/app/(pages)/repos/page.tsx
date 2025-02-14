"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, GitBranch, Star, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import SearchAndFilter from "@/components/layout/SearchAndFilter";
import { Button } from "@/components/ui/button";
import ProjectForm from "@/components/projects/ProjectForm";
import { useToast } from "@/components/ui/use-toast";

interface Repository {
  _id: string;
  name: string;
  description: string;
  github_url: string;
  stars: number;
  forks: number;
  branches: number;
  contributors: Array<{
    login: string;
    avatar_url: string;
    contributions: number;
  }>;
  thumbnail_url: string;
}

export default function ReposPage() {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const filterOptions = [
    { label: "All Languages", value: "all" },
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "Go", value: "go" },
    { label: "Rust", value: "rust" },
  ];

  const fetchRepos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/repos');
      const data = await response.json();
      if (data.success) {
        setRepos(data.data.repos);
      }
    } catch (error) {
      console.error('Error fetching repositories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch repositories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const handleSubmitProject = async (formData: FormData) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/repos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          github_url: formData.get('repoUrl'),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Repository added successfully",
        });
        setShowAddForm(false);
        fetchRepos(); // Refresh the list
      } else {
        throw new Error(data.message || 'Failed to add repository');
      }
    } catch (error) {
      console.error("Error adding repository:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add repository",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (repoId: string) => {
    router.push(`/repos/${repoId}`);
  };

  const handleGitHubClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.stopPropagation(); // Prevent card click when clicking GitHub link
  };

  return (
    <PageContainer className="py-6">
      <PageHeader
        title="Open Source Projects"
        description="Explore and contribute to amazing open source projects"
        action={
          <Button className="gap-2" onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4" />
            Add Project
          </Button>
        }
      />

      <SearchAndFilter
        searchPlaceholder="Search repositories..."
        searchValue=""
        onSearchChange={() => {}}
        filterValue="all"
        onFilterChange={() => {}}
        filterOptions={filterOptions}
        extraActions={
          <div className="flex gap-2">
            <select className="px-4 py-2.5 rounded-lg border bg-background">
              <option value="stars">Most Stars</option>
              <option value="forks">Most Forks</option>
              <option value="recent">Recently Added</option>
              <option value="updated">Recently Updated</option>
            </select>
            <Button variant="outline" className="gap-2">
              <GitBranch className="w-4 h-4" />
              Fork Stats
            </Button>
            <Button variant="outline" className="gap-2">
              <Star className="w-4 h-4" />
              Star History
            </Button>
          </div>
        }
      />

      {/* Repositories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {isLoading ? (
          // Loading skeleton
          [...Array(6)].map((_, i) => (
            <div key={i} className="p-6 rounded-lg border bg-card animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-muted rounded"></div>
                <div className="flex-1">
                  <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-4 bg-muted rounded w-full mb-4"></div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-4 bg-muted rounded w-16"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                  <div className="h-4 bg-muted rounded w-16"></div>
                </div>
                <div className="h-3 w-3 bg-muted rounded-full"></div>
              </div>
            </div>
          ))
        ) : repos.length > 0 ? (
          repos.map((repo) => (
            <div 
              key={repo._id} 
              className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleCardClick(repo._id)}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/Z.jpg"
                  alt={repo.name}
                  className="h-10 w-10 rounded"
                />
                <div>
                  <h3 className="font-semibold">{repo.name}</h3>
                  <a
                    href={repo.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary"
                    onClick={(e) => handleGitHubClick(e, repo.github_url)}
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {repo.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitBranch className="w-4 h-4" />
                    {repo.forks}
                  </span>
                  <span>{repo.contributors.length} contributors</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No repositories found
          </div>
        )}
      </div>

      {/* Add Project Form Modal */}
      {showAddForm && (
        <ProjectForm
          onSubmit={handleSubmitProject}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </PageContainer>
  );
}