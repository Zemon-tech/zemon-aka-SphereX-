"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, GitBranch, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import SearchAndFilter from "@/components/layout/SearchAndFilter";
import { Button } from "@/components/ui/button";
import ProjectForm from "@/components/projects/ProjectForm";
import { useToast } from "@/components/ui/use-toast";
import RepoCard from "@/components/repos/RepoCard";

interface Repository {
  _id: string;
  name: string;
  description: string;
  github_url: string;
  stars: number;
  forks: number;
  language: string;
  branches: number;
  contributors: Array<{
    login: string;
    avatar_url: string;
    contributions: number;
  }>;
  added_by: {
    _id: string;
    name: string;
  };
  updatedAt: string;
  createdAt: string;
}

export default function ReposPage() {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [searchValue, setSearchValue] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [originalRepos, setOriginalRepos] = useState<Repository[]>([]);

  const filterOptions = [
    { label: "All Languages", value: "all" },
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "Go", value: "go" },
    { label: "Rust", value: "rust" },
  ];

  const fetchRepos = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/repos`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (data.success) {
        // The backend now provides properly transformed data
        setOriginalRepos(data.data.repos);
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
  }, [toast]);

  useEffect(() => {
    fetchRepos();

    // Get current user ID from token with safer parsing
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Split the token and verify we have the payload part
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error('Invalid token format');
        }

        // Add padding to base64 string if needed
        const payload = parts[1];
        const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        const pad = base64.length % 4;
        const paddedPayload = pad ? base64 + '='.repeat(4 - pad) : base64;

        // Parse the token data
        const tokenData = JSON.parse(atob(paddedPayload));
        if (tokenData && tokenData.id) {
          setCurrentUserId(tokenData.id);
        } else {
          console.warn('Token payload does not contain user ID');
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        setCurrentUserId(null);
      }
    }
  }, [fetchRepos]);

  const handleSubmitProject = async (formData: FormData) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      // Log the data being sent
      console.log('Submitting data:', {
        github_url: formData.get('github_url'),
        description: formData.get('description'),
        language: formData.get('language'),
        tags: formData.get('tags')
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/repos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          github_url: formData.get('github_url'),
          description: formData.get('description'),
          language: formData.get('language'),
          tags: formData.get('tags')?.toString().split(',').map(tag => tag.trim()),
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

  const handleAddProjectClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add a project.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }
    
    setShowAddForm(true);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (!value.trim()) {
      setRepos(originalRepos);
      return;
    }
    const searchLower = value.toLowerCase();
    const filtered = originalRepos.filter(repo => 
      repo.name.toLowerCase().includes(searchLower) ||
      (repo.description || '').toLowerCase().includes(searchLower)
    );
    setRepos(filtered);
  };

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    if (value === 'all') {
      setRepos(originalRepos);
    } else {
      const filtered = originalRepos.filter(repo => 
        (repo.language || '').toLowerCase() === value.toLowerCase()
      );
      setRepos(filtered);
    }
  };

  return (
    <PageContainer className="py-6">
      <PageHeader
        title="Open Source Projects"
        description="Explore and contribute to amazing open source projects"
        action={
          <Button className="gap-2" onClick={handleAddProjectClick}>
            <Plus className="w-4 h-4" />
            Add Project
          </Button>
        }
      />

      <SearchAndFilter
        placeholder="Search repositories..."
        value={searchValue}
        onChange={handleSearch}
        filter={filterValue}
        onFilterChange={handleFilterChange}
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
          Array.from({ length: 6 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="p-6 rounded-lg border bg-card animate-pulse">
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
            <RepoCard
              key={repo._id}
              id={repo._id}
              name={repo.name}
              description={repo.description}
              stars={repo.stars}
              forks={repo.forks}
              language={repo.language}
              githubUrl={repo.github_url}
              updatedAt={repo.updatedAt || repo.createdAt}
              creator={{ 
                name: repo.added_by?.name,
                id: repo.added_by?._id
              }}
              currentUserId={currentUserId}
              onDelete={fetchRepos}
              onClick={() => router.push(`/repos/${repo._id}`)}
            />
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