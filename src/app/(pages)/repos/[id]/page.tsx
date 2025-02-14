"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, GitBranch, Star, Users } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import PageContainer from "@/components/layout/PageContainer";

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
  owner: string;
  readme_url: string;
  likes: string[];
  comments: Array<{
    user: string;
    content: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export default function RepoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [repo, setRepo] = useState<Repository | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRepoDetail = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/repos/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setRepo(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch repository details');
        }
      } catch (error) {
        console.error('Error fetching repository details:', error);
        toast({
          title: "Error",
          description: "Failed to load repository details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchRepoDetail();
    }
  }, [params.id, toast]);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="animate-pulse space-y-4 py-8">
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-96 bg-muted rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!repo) {
    return (
      <PageContainer>
        <div className="py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Repository not found</h1>
          <Link href="/repos" className="text-primary hover:underline">
            Back to Repositories
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-8">
      <Link
        href="/repos"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={20} />
        Back to Repositories
      </Link>

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={"/Z.jpg"}
              alt={repo.name}
              className="w-16 h-16 rounded-lg"
            />
            <div>
              <h1 className="text-3xl font-bold">{repo.name}</h1>
              <p className="text-muted-foreground">
                Added {new Date(repo.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <a
              href={repo.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View on GitHub
            </a>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              {repo.stars} stars
            </div>
            <div className="flex items-center gap-1">
              <GitBranch className="w-4 h-4" />
              {repo.forks} forks
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {repo.contributors.length} contributors
            </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-muted-foreground">{repo.description}</p>
        </div>

        <div className="mt-8 pt-8 border-t">
          <h2 className="text-xl font-semibold mb-6">Contributors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repo.contributors.map((contributor) => (
              <div key={contributor.login} className="flex items-center gap-3 p-4 rounded-lg border">
                <img
                  src={contributor.avatar_url}
                  alt={contributor.login}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="font-medium">{contributor.login}</h3>
                  <p className="text-sm text-muted-foreground">
                    {contributor.contributions} contributions
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add more sections as needed: README, Comments, etc. */}
      </article>
    </PageContainer>
  );
} 